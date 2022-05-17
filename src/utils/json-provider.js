import * as ethers from 'ethers'
import {
  ETH,
  BSC,
  MATIC
} from '../constants/chain'

export const ethJsonRpcProvider = new ethers.providers.JsonRpcProvider(JSON_RPC[ETH.id])
export const bscJsonRpcProvider = new ethers.providers.JsonRpcProvider(JSON_RPC[BSC.id])
export const maticJsonRpcProvider = new ethers.providers.JsonRpcProvider(JSON_RPC[MATIC.id])

export const getJsonRpcProvider = (chain) => {
  return {
    [ETH.id]: ethJsonRpcProvider,
    [BSC.id]: bscJsonRpcProvider,
    [MATIC.id]: maticJsonRpcProvider
  }[chain]
}
