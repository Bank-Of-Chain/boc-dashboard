import { message } from "antd";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import CHAINS from "@/constants/chain";
import { WALLETS } from "@/constants/wallet";

export const changeNetwork = async (
  id,
  userProvider,
  walletName,
  params = {}
) => {
  console.log("changeNetwork=");
  const { resolveWhenUnsupport } = params;
  const targetNetwork = find(CHAINS, { id });
  console.log("targetNetwork=", targetNetwork);
  if (isEmpty(targetNetwork)) return;
  if (!userProvider) {
    return;
  }

  const supportSwitch = [WALLETS.MetaMask.info.symbol];
  if (!supportSwitch.includes(walletName)) {
    if (resolveWhenUnsupport) {
      return;
    }
    message.warning("Switch networks in your wallet, then reconnect");
    return Promise.reject();
  }

  const data = [
    {
      chainId: `0x${Number(targetNetwork.id).toString(16)}`,
      chainName: targetNetwork.name,
      nativeCurrency: targetNetwork.nativeCurrency,
      rpcUrls: [targetNetwork.rpcUrl],
      blockExplorerUrls: [targetNetwork.blockExplorer],
    },
  ];
  console.log("data", data);

  let switchTx;
  try {
    switchTx = await userProvider.send("wallet_switchEthereumChain", [
      { chainId: data[0].chainId },
    ]);
  } catch (switchError) {
    console.log("switchError=", switchTx, switchError);
    if (switchError.code === 4001) {
      return Promise.reject();
    }
    try {
      switchTx = await userProvider.send("wallet_addEthereumChain", data);
    } catch (addError) {
      console.log("addError=", addError);
      return Promise.reject();
    }
  }

  if (switchTx) {
    console.log(switchTx);
  }
};
