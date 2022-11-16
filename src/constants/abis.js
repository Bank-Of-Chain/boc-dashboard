export const VAULT_FACTORY_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_newVault',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_wantToken',
        type: 'address'
      }
    ],
    name: 'CreateNewVault',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8'
      }
    ],
    name: 'Initialized',
    type: 'event'
  },
  {
    stateMutability: 'payable',
    type: 'fallback'
  },
  {
    inputs: [],
    name: 'accessControlProxy',
    outputs: [
      {
        internalType: 'contract IAccessControlProxy',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vaultImpl',
        type: 'address'
      }
    ],
    name: 'addVaultImpl',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_wantToken',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_vaultImpl',
        type: 'address'
      }
    ],
    name: 'createNewVault',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_vaultImpl',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'deleteVaultAddressMapForDebug',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'getStablecoinInvestorByIndex',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTotalVaultAddrList',
    outputs: [
      {
        internalType: 'contract IUniswapV3RiskOnVaultInitialize[]',
        name: '',
        type: 'address[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTwoInvestorlist',
    outputs: [
      {
        internalType: 'address[]',
        name: '_wethInvestorSet',
        type: 'address[]'
      },
      {
        internalType: 'address[]',
        name: '_usdInvestorSet',
        type: 'address[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTwoInvestorlistLen',
    outputs: [
      {
        internalType: 'uint256',
        name: '_wethInvestorSetLen',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_stablecoinInvestorSetLen',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getVaultImplList',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getVaultsLen',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'getWethInvestorByIndex',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_vaultImplList',
        type: 'address[]'
      },
      {
        internalType: 'address',
        name: '_accessControlProxy',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_uniswapV3RiskOnHelper',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_treasury',
        type: 'address'
      }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'totalVaultAddrList',
    outputs: [
      {
        internalType: 'contract IUniswapV3RiskOnVaultInitialize',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'treasury',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'uniswapV3RiskOnHelper',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'vaultAddressMap',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'vaultImpl2Index',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'vaultImplList',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    stateMutability: 'payable',
    type: 'receive'
  }
]

export const UNISWAPV3_RISK_ON_HELPER = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8'
      }
    ],
    name: 'Initialized',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_account',
        type: 'address'
      }
    ],
    name: 'borrowInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: '_totalCollateralBase',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_totalDebtBase',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_availableBorrowsBase',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_currentLiquidationThreshold',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_ltv',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_healthFactor',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_quoteAsset',
        type: 'address'
      }
    ],
    name: 'calcAaveBaseCurrencyValueInAsset',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_baseAsset',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_quoteAsset',
        type: 'address'
      }
    ],
    name: 'calcCanonicalAssetValue',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_asset',
        type: 'address'
      }
    ],
    name: 'getAToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_borrowToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_interestRateMode',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_account',
        type: 'address'
      }
    ],
    name: 'getCurrentBorrow',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_borrowToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_interestRateMode',
        type: 'uint256'
      }
    ],
    name: 'getDebtToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'int24',
        name: '_tick',
        type: 'int24'
      },
      {
        internalType: 'int24',
        name: '_tickSpacing',
        type: 'int24'
      },
      {
        internalType: 'int24',
        name: '_baseThreshold',
        type: 'int24'
      }
    ],
    name: 'getSpecifiedRangesOfTick',
    outputs: [
      {
        internalType: 'int24',
        name: '_tickFloor',
        type: 'int24'
      },
      {
        internalType: 'int24',
        name: '_tickCeil',
        type: 'int24'
      },
      {
        internalType: 'int24',
        name: '_tickLower',
        type: 'int24'
      },
      {
        internalType: 'int24',
        name: '_tickUpper',
        type: 'int24'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_account',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_collateralToken',
        type: 'address'
      }
    ],
    name: 'getTotalCollateralTokenAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '_totalCollateralToken',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_pool',
        type: 'address'
      },
      {
        internalType: 'uint32',
        name: '_twapDuration',
        type: 'uint32'
      }
    ],
    name: 'getTwap',
    outputs: [
      {
        internalType: 'int24',
        name: '',
        type: 'int24'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pool',
    outputs: [
      {
        internalType: 'contract IUniswapV3Pool',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]

export const UNISWAPV3_RISK_ON_VAULT = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8'
      }
    ],
    name: 'Initialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'LendToStrategy',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_basis',
        type: 'uint256'
      }
    ],
    name: 'ProfitFeeBpsChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_redeemAmount',
        type: 'uint256'
      }
    ],
    name: 'Redeem',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_redeemAmount',
        type: 'uint256'
      }
    ],
    name: 'RedeemToVault',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bool',
        name: '_shutdown',
        type: 'bool'
      }
    ],
    name: 'SetEmergencyShutdown',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: '_rewardTokens',
        type: 'address[]'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: '_claimAmounts',
        type: 'uint256[]'
      }
    ],
    name: 'StrategyReported',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_nftId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount0',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount1',
        type: 'uint256'
      }
    ],
    name: 'UniV3NFTCollect',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: '_liquidity',
        type: 'uint128'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount0',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount1',
        type: 'uint256'
      }
    ],
    name: 'UniV3NFTPositionAdded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'UniV3NFTPositionRemoved',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [],
    name: 'UniV3UpdateConfig',
    type: 'event'
  },
  {
    inputs: [],
    name: 'accessControlProxy',
    outputs: [
      {
        internalType: 'contract IAccessControlProxy',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'borrowRebalance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'borrowToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'depositTo3rdPoolTotalAssets',
    outputs: [
      {
        internalType: 'uint256',
        name: '_totalAssets',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'emergencyShutdown',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'estimatedTotalAssets',
    outputs: [
      {
        internalType: 'uint256',
        name: '_totalAssets',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getMintInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: '_baseTokenId',
        type: 'uint256'
      },
      {
        internalType: 'int24',
        name: '_baseTickUpper',
        type: 'int24'
      },
      {
        internalType: 'int24',
        name: '_baseTickLower',
        type: 'int24'
      },
      {
        internalType: 'uint256',
        name: '_limitTokenId',
        type: 'uint256'
      },
      {
        internalType: 'int24',
        name: '_limitTickUpper',
        type: 'int24'
      },
      {
        internalType: 'int24',
        name: '_limitTickLower',
        type: 'int24'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getStatus',
    outputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_wantToken',
        type: 'address'
      },
      {
        internalType: 'int24',
        name: '_baseThreshold',
        type: 'int24'
      },
      {
        internalType: 'int24',
        name: '_limitThreshold',
        type: 'int24'
      },
      {
        internalType: 'int24',
        name: '_minTickMove',
        type: 'int24'
      },
      {
        internalType: 'int24',
        name: '_maxTwapDeviation',
        type: 'int24'
      },
      {
        internalType: 'int24',
        name: '_lastTick',
        type: 'int24'
      },
      {
        internalType: 'int24',
        name: '_tickSpacing',
        type: 'int24'
      },
      {
        internalType: 'uint256',
        name: '_period',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_lastTimestamp',
        type: 'uint256'
      },
      {
        internalType: 'uint32',
        name: '_twapDuration',
        type: 'uint32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getVersion',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [],
    name: 'harvest',
    outputs: [
      {
        internalType: 'address[]',
        name: '_rewardsTokens',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: '_claimAmounts',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lastHarvest',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'lend',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'manageFeeBps',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'netMarketMakingAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pool',
    outputs: [
      {
        internalType: 'contract IUniswapV3Pool',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'profitFeeBps',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'rebalanceByKeeper',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_redeemShares',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_totalShares',
        type: 'uint256'
      }
    ],
    name: 'redeem',
    outputs: [
      {
        internalType: 'uint256',
        name: '_redeemBalance',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_redeemShares',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_totalShares',
        type: 'uint256'
      }
    ],
    name: 'redeemToVaultByKeeper',
    outputs: [
      {
        internalType: 'uint256',
        name: '_redeemBalance',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'int24',
        name: '_baseThreshold',
        type: 'int24'
      }
    ],
    name: 'setBaseThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_active',
        type: 'bool'
      }
    ],
    name: 'setEmergencyShutdown',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'int24',
        name: '_limitThreshold',
        type: 'int24'
      }
    ],
    name: 'setLimitThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_basis',
        type: 'uint256'
      }
    ],
    name: 'setManageFeeBps',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'int24',
        name: '_maxTwapDeviation',
        type: 'int24'
      }
    ],
    name: 'setMaxTwapDeviation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'int24',
        name: '_minTickMove',
        type: 'int24'
      }
    ],
    name: 'setMinTickMove',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_period',
        type: 'uint256'
      }
    ],
    name: 'setPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_basis',
        type: 'uint256'
      }
    ],
    name: 'setProfitFeeBps',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: '_twapDuration',
        type: 'uint32'
      }
    ],
    name: 'setTwapDuration',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'int24',
        name: '_tick',
        type: 'int24'
      }
    ],
    name: 'shouldRebalance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'token0',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [],
    name: 'token1',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [],
    name: 'wantToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]

export const IERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'spender',
        type: 'address'
      },
      {
        name: 'addedValue',
        type: 'uint256'
      }
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address'
      },
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'transferFrom',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      },
      {
        name: '_spender',
        type: 'address'
      }
    ],
    name: 'allowance',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        name: 'spender',
        type: 'address'
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Transfer',
    type: 'event'
  }
]