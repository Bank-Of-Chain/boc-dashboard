import * as ethers from "ethers";
import { ETH, MATIC } from "../constants/chain";

export const ethJsonRpcProvider = new ethers.providers.JsonRpcProvider(
  RPC_URL[ETH.id]
);
export const maticJsonRpcProvider = new ethers.providers.JsonRpcProvider(
  RPC_URL[MATIC.id]
);

export const getJsonRpcProvider = (chain) => {
  return {
    [ETH.id]: ethJsonRpcProvider,
    [MATIC.id]: maticJsonRpcProvider,
  }[chain];
};
