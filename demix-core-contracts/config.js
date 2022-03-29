require('dotenv').config()
    // All networks that DecentraWorld apps are supporting
    // Testnet(97), BSC(56), CRO(25), FTM(250), MATIC(137), ETH(1), AVAX(43114)
module.exports = {
  deployments: {
    netId97: {
      bnb: {
        instanceAddress: {
          '0.1': '',
          '1': '',
          '10': '',
          '100': ''
        },
        symbol: 'BNB',
        decimals: 18
      }
    },
    netId56: {
      bnb: {
        instanceAddress: {
          '0.1': '',
          '1': '',
          '10': '',
          '100': ''
        },
        symbol: 'BNB',
        decimals: 18
      },
      dewo: {
        instanceAddress: {
          '1': '',
          '1': '',
          '1': '',
          '1': ''
        },
        tokenAddress: '',
        symbol: 'DEWO',
        decimals: 18
      },
      busd: {
        instanceAddress: {
          '100': '',
          '1000': '',
          '10000': '',
          '100000': ''
        },
        tokenAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        symbol: 'BUSD',
        decimals: 18
      },
      btcb: {
        instanceAddress: {
          '0.01': '',
          '0.1': '',
          '0.5': '',
          '1': ''
        },
        tokenAddress: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
        symbol: 'BTCB',
        decimals: 18
      }
    },
    netId25: {
      cro: {
        instanceAddress: {
          '200': '',
          '2000': '',
          '20000': '',
          '200000': ''
        },
        symbol: 'CRO',
        decimals: 18
      },
      dewo: {
        instanceAddress: {
          '1': '',
          '1': '',
          '1': '',
          '1': ''
        },
        tokenAddress: '',
        symbol: 'DEWO',
        decimals: 18
      },
      usdc: {
        instanceAddress: {
          '100': '',
          '1000': '',
          '10000': '',
          '100000': ''
        },
        tokenAddress: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
        symbol: 'USDC',
        decimals: 18
      }
    },
    netId250: {
      ftm: {
        instanceAddress: {
          '100': '',
          '1000': '',
          '10000': '',
          '50000': ''
        },
        symbol: 'FTM',
        decimals: 18
      },
      dewo: {
        instanceAddress: {
          '1': '',
          '1': '',
          '1': '',
          '1': ''
        },
        tokenAddress: '',
        symbol: 'DEWO',
        decimals: 18
      },
      fusd: {
        instanceAddress: {
          '100': '',
          '1000': '',
          '10000': '',
          '100000': ''
        },
        tokenAddress: '0xAd84341756Bf337f5a0164515b1f6F993D194E1f',
        symbol: 'USDC',
        decimals: 18
      }
    },
    netId137: {
      matic: {
        instanceAddress: {
          '100': '',
          '1000': '',
          '10000': '',
          '50000': ''
        },
        symbol: 'MATIC',
        decimals: 18
      },
      dewo: {
        instanceAddress: {
          '1': '',
          '1': '',
          '1': '',
          '1': ''
        },
        tokenAddress: '',
        symbol: 'DEWO',
        decimals: 18
      },
      usdc: {
        instanceAddress: {
          '100': '',
          '1000': '',
          '10000': '',
          '100000': ''
        },
        tokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        symbol: 'USDC',
        decimals: 6
      }
    },
    netId43114: {
      avax: {
        instanceAddress: {
          '1': '',
          '10': '',
          '100': '',
          '1000': ''
        },
        symbol: 'AVAX',
        decimals: 18
      },
      dewo: {
        instanceAddress: {
          '1': '',
          '1': '',
          '1': '',
          '1': ''
        },
        tokenAddress: '',
        symbol: 'DEWO',
        decimals: 18
      },
      usdc: {
        instanceAddress: {
          '100': '',
          '1000': '',
          '10000': '',
          '100000': ''
        },
        tokenAddress: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
        symbol: 'USDC',
        decimals: 6
      }
    },
    netId1: {
      eth: {
        instanceAddress: {
          '0.1': '',
          '1': '',
          '10': '',
          '30': ''
        },
        symbol: 'ETH',
        decimals: 18
      },
      dewo: {
        instanceAddress: {
          '1': '',
          '1': '',
          '1': '',
          '1': ''
        },
        tokenAddress: '',
        symbol: 'DEWO',
        decimals: 18
      },
      usdc: {
        instanceAddress: {
          '100': '',
          '1000': '',
          '10000': '',
          '100000': ''
        },
        tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC',
        decimals: 6
      }
    },
  }
}
