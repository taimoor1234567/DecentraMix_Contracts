/* global artifacts */
require('dotenv').config({ path: '../.env' })
const DeMixToken = artifacts.require('DeMixToken')
const Verifier = artifacts.require('Verifier')
const Hasher = artifacts.require('Hasher')
const ERC20Mock = artifacts.require('ERC20Mock')

module.exports = function (deployer) {
  return deployer.then(async () => {
    const { MERKLE_TREE_HEIGHT} = process.env
    const verifier = await Verifier.deployed()
    const hasher = await Hasher.deployed()
    let token = '0xAd84341756Bf337f5a0164515b1f6F993D194E1f'
    if (token === '') {
      const tokenInstance = await deployer.deploy(ERC20Mock)
      token = tokenInstance.address
    }
    const demix = await deployer.deploy(
      DeMixToken,
      verifier.address,
      hasher.address,
      '100000000000000000000000',
      MERKLE_TREE_HEIGHT,
      token,
    )
    let block = await web3.eth.getBlock("latest")
    console.log('100000USDC (', block.number, ') = ',  demix.address)
  })
}
