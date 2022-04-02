/* global artifacts */
const Hasher = artifacts.require('Hasher')

module.exports = async function (deployer) {
  await deployer.deploy(Hasher)
  let block = await web3.eth.getBlock("latest")
  console.log('Hasher (', block.number, ') = ',  Hasher.address)
}
