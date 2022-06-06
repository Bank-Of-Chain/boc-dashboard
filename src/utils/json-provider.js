import * as ethers from 'ethers'
import {
  ETH,
  BSC,
  MATIC
} from '../constants/chain'

export const ethJsonRpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL[ETH.id])
export const bscJsonRpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL[BSC.id])
export const maticJsonRpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL[MATIC.id])

export const getJsonRpcProvider = (chain) => {
  return {
    [ETH.id]: ethJsonRpcProvider,
    [BSC.id]: bscJsonRpcProvider,
    [MATIC.id]: maticJsonRpcProvider
  }[chain]
}
