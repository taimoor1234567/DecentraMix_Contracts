/* global artifacts */
const DeMixProxyLight = artifacts.require('DeMixProxyLight')

module.exports = async function (deployer) {
  await deployer.deploy(DeMixProxyLight)
  let block = await web3.eth.getBlock("latest")
  console.log('DeMixProxyLight (', block.number, ') = ',  DeMixProxyLight.address)
}
