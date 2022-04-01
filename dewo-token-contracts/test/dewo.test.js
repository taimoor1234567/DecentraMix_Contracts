/* global artifacts, web3, contract */
require('chai').use(require('bn-chai')(web3.utils.BN)).use(require('chai-as-promised')).should()
const { takeSnapshot, revertSnapshot } = require('../scripts/ganacheHelper')
const { PermitSigner } = require('../lib/Permit')
const { toBN, BN } = require('web3-utils')

const Dewo = artifacts.require('./DEWOMock.sol')

contract('Dewo', (accounts) => {
  let dewo
  const governance = accounts[3]
  const mining = accounts[4]
  const airdrop = accounts[5]
  let snapshotId
  const owner = accounts[0]
  const ownerPrivateKey = '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'
  const spender = accounts[1]
  // eslint-disable-next-line no-unused-vars
  const spenderPrivateKey = '0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f'
  // eslint-disable-next-line no-unused-vars
  const recipient = accounts[2]
  // eslint-disable-next-line no-unused-vars
  const recipientPrivateKey = '0x0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1'
  const value = toBN(10 ** 18)
  let domain
  let chainId
  const cap = toBN(10000000).mul(toBN(10 ** 18))
  let currentTime
  const thirtyDays = 30 * 24 * 3600
  before(async () => {
    chainId = await web3.eth.net.getId()
    dewo = await Dewo.new(governance, thirtyDays, [
      { to: mining, amount: '0' },
      { to: airdrop, amount: cap.toString() },
    ])
    currentTime = await dewo.blockTimestamp()
    await dewo.transfer(owner, cap.div(toBN(2)), { from: airdrop })
    await dewo.setChainId(chainId)
    await dewo.setFakeTimestamp(currentTime)
    const blockTimestamp = await dewo.blockTimestamp()
    blockTimestamp.should.be.eq.BN(toBN(currentTime))
    domain = {
      name: await dewo.name(),
      version: '1',
      chainId,
      verifyingContract: dewo.address,
    }

    snapshotId = await takeSnapshot()
  })

  describe('#constructor', () => {
    it('transfers ownership to governance', async () => {
      const ownerFromContract = await dewo.governance()
      ownerFromContract.should.be.equal(governance)
      ;(await dewo.allowedTransferee(governance)).should.be.true
      ;(await dewo.allowedTransferee(mining)).should.be.true
      ;(await dewo.allowedTransferee(airdrop)).should.be.true
      ;(await dewo.allowedTransferee(owner)).should.be.false
    })
  })

  describe('pausable', () => {
    it('transfers disabled by default', async () => {
      await dewo.transfer(accounts[1], 1, { from: spender }).should.be.rejectedWith('DEWO: paused')
    })

    it('can only transfer to governance and mining', async () => {
      await dewo.transfer(governance, 1).should.be.fulfilled
      await dewo.transfer(mining, 1).should.be.fulfilled
      await dewo.transfer(accounts[5], 1, { from: mining }).should.be.fulfilled
    })

    it('can transfer after governace decision', async () => {
      await dewo.transfer(mining, 10).should.be.fulfilled
      await dewo.transfer(recipient, 5, { from: mining }).should.be.fulfilled

      await dewo.transfer(accounts[9], 1, { from: recipient }).should.be.rejectedWith('DEWO: paused')
      await dewo
        .changeTransferability(true, { from: governance })
        .should.be.rejectedWith('DEWO: cannot change transferability yet')
      await dewo.setFakeTimestamp(currentTime + thirtyDays + 1)
      await dewo.changeTransferability(true, { from: governance })
      await dewo.transfer(accounts[9], 1, { from: recipient })

      const balance = await dewo.balanceOf(accounts[9])
      balance.should.be.eq.BN(toBN(1))
    })
  })

  describe('#permit', () => {
    it('permitSigner class should work', async () => {
      const args = {
        owner,
        spender,
        value,
        nonce: 0,
        deadline: new BN('123123123123123'),
      }

      const permitSigner = new PermitSigner(domain, args)
      // const message = permitSigner.getPayload()
      // console.log('message', JSON.stringify(message));

      // Generate the signature in place
      const privateKey = '0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c'
      const address = '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b'
      const signature = await permitSigner.getSignature(privateKey)
      const signer = await permitSigner.getSignerAddress(args, signature.hex)
      address.should.be.equal(signer)
    })

    it('calls approve if signature is valid', async () => {
      const chainIdFromContract = await dewo.chainId()
      chainIdFromContract.should.be.eq.BN(new BN(domain.chainId))
      const args = {
        owner,
        spender,
        value,
        nonce: 0,
        deadline: new BN(currentTime + thirtyDays),
      }
      const permitSigner = new PermitSigner(domain, args)
      const signature = await permitSigner.getSignature(ownerPrivateKey)
      const signer = await permitSigner.getSignerAddress(args, signature.hex)
      signer.should.be.equal(owner)

      const allowanceBefore = await dewo.allowance(owner, spender)
      await dewo.permit(
        args.owner,
        args.spender,
        args.value.toString(),
        args.deadline.toString(),
        signature.v,
        signature.r,
        signature.s,
        { from: owner },
      )
      const allowanceAfter = await dewo.allowance(owner, spender)

      allowanceAfter.should.be.eq.BN(toBN(allowanceBefore).add(args.value))
    })
    it('reverts if signature is corrupted', async () => {
      const args = {
        owner,
        spender,
        value,
        nonce: 0,
        deadline: new BN(currentTime + thirtyDays),
      }
      const permitSigner = new PermitSigner(domain, args)
      const signature = await permitSigner.getSignature(ownerPrivateKey)
      signature.r = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      const allowanceBefore = await dewo.allowance(owner, spender)
      await dewo
        .permit(
          args.owner,
          args.spender,
          args.value.toString(),
          args.deadline.toString(),
          signature.v,
          signature.r,
          signature.s,
          { from: owner },
        )
        .should.be.rejectedWith('ECDSA: invalid signature')
      const allowanceAfter = await dewo.allowance(owner, spender)

      allowanceAfter.should.be.eq.BN(allowanceBefore)
    })
    it('reverts if signature is expired', async () => {
      const args = {
        owner,
        spender,
        value,
        nonce: 0,
        deadline: new BN('1593388800'), // 06/29/2020 @ 12:00am (UTC)
      }
      const permitSigner = new PermitSigner(domain, args)
      const signature = await permitSigner.getSignature(ownerPrivateKey)
      const allowanceBefore = await dewo.allowance(owner, spender)
      await dewo
        .permit(
          args.owner,
          args.spender,
          args.value.toString(),
          args.deadline.toString(),
          signature.v,
          signature.r,
          signature.s,
          { from: owner },
        )
        .should.be.rejectedWith('ERC20Permit: expired deadline')
      const allowanceAfter = await dewo.allowance(owner, spender)

      allowanceAfter.should.be.eq.BN(BN(allowanceBefore))
    })
  })

  afterEach(async () => {
    await revertSnapshot(snapshotId.result)
    // eslint-disable-next-line require-atomic-updates
    snapshotId = await takeSnapshot()
  })
})
