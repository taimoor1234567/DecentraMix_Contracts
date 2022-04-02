/* global artifacts */
const Multicall = artifacts.require('Multicall')

module.exports = async function (deployer) {
  await deployer.deploy(Multicall)
  let block = await web3.eth.getBlock("latest")
  console.log('Multicall (', block.number, ') = ',  Multicall.address)
}
