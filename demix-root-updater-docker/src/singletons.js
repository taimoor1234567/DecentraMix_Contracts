require('dotenv').config()
const ethers = require('ethers')
const { TxManager } = require('tx-manager')
const demixTreesAbi = require('../abi/demixTrees.json')
const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_URL)
const config = require('dewo-token-contracts')
let demixTrees
let provider

const txManager = new TxManager({
  privateKey: process.env.PRIVATE_KEY,
  rpcUrl: process.env.RPC_URL,
  broadcastNodes: process.env.BROADCAST_NODES ? process.env.BROADCAST_NODES.split(',') : undefined,
  config: {
    CONFIRMATIONS: process.env.CONFIRMATION_BLOCKS,
    MAX_GAS_PRICE: process.env.GAS_PRICE,
  },
})

function getProvider() {
  if (!provider) {
    provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
  }
  return provider
}

function getDeMixTrees() {
  if (!demixTrees) {
    demixTrees = new ethers.Contract(process.env.DEMIX_TREES || config.demixTrees.address, demixTreesAbi, getProvider())
  }
  return demixTrees
}

module.exports = {
  redis,
  getDeMixTrees,
  getProvider,
  txManager,
}
