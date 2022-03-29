/* global artifacts */
require('dotenv').config({ path: '../.env' })
const DeMixFactory = artifacts.require('DeMixFactory')
const Verifier = artifacts.require('Verifier')
const hasherContract = artifacts.require('Hasher')


module.exports = function(deployer, network, accounts) {
  return deployer.then(async () => {
    const { MERKLE_TREE_HEIGHT, ETH_AMOUNT } = process.env
    const verifier = await Verifier.deployed()
    const hasherInstance = await hasherContract.deployed()
    await DeMixFactory.link(hasherContract, hasherInstance.address)
    const demix = await deployer.deploy(DeMixFactory, verifier.address, ETH_AMOUNT, MERKLE_TREE_HEIGHT, accounts[0])
    console.log('DeMixFactory\'s address ', demix.address)
  })
}
