/* global artifacts */
const Echoer = artifacts.require('Echoer')

module.exports = async function (deployer) {
  await deployer.deploy(Echoer)
  let block = await web3.eth.getBlock("latest")
  console.log('Echoer (', block.number, ') = ',  Echoer.address)
}
