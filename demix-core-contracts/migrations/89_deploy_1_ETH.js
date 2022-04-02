/* global artifacts */
require('dotenv').config({ path: '../.env' })
const DeMixFactory = artifacts.require('DeMixFactory')
const Verifier = artifacts.require('Verifier')
const Hasher = artifacts.require('Hasher')

module.exports = function (deployer) {
  return deployer.then(async () => {
    const { MERKLE_TREE_HEIGHT} = process.env
    const verifier = await Verifier.deployed()
    const hasher = await Hasher.deployed()
    const demix = await deployer.deploy(
      DeMixFactory,
      verifier.address,
      hasher.address,
      '1000000000000000000',
      MERKLE_TREE_HEIGHT,
    )
    let block = await web3.eth.getBlock("latest")
    console.log('1ETH (', block.number, ') = ',  demix.address)
  })
}
