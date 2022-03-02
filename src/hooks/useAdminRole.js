import {
  useState,
  useEffect,
} from "react";

import {
  useModel
} from 'umi';

// === Utils === //
import * as ethers from "ethers";
import isEmpty from 'lodash/isEmpty';

// === Hooks === //
import useUserProvider from './useUserProvider'

const {
  Contract
} = ethers

const MIX_ABI = [{
  "inputs": [],
  "name": "accessControlProxy",
  "outputs": [{
    "internalType": "contract IAccessControlProxy",
    "name": "",
    "type": "address"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "isVaultOrGov",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "view",
  "type": "function"
}]
const useAdminRole = (address) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    userProvider,
  } = useUserProvider()

  const {
    initialState
  } = useModel('@@initialState');

  const roleFetch = async (userAddress) => {
    const vaultAddress = VAULT_ADDRESS[initialState.chain]
    if (isEmpty(vaultAddress)) return
    setLoading(true)
    const vaultContract = new Contract(vaultAddress, MIX_ABI, userProvider)
    vaultContract
      .accessControlProxy()
      .then(accessControlProxy => {
        const accessControlProxyContract = new ethers.Contract(accessControlProxy, MIX_ABI, userProvider)
        return accessControlProxyContract
          .isVaultOrGov(userAddress)
          .then(setIsAdmin)
          .catch((error) => {
            console.log('inner error=', error)
            setIsAdmin(false)
          })
      })
      .catch((error) => {
        console.log('outer error=', error)
        setIsAdmin(false)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (isEmpty(initialState.chain) || isEmpty(address)) return
    setLoading(true)
    //TODO: 此处地址待修改
    roleFetch('0xc791B4A9B10b1bDb5FBE2614d389f0FE92105279').then(setIsAdmin).finally(() => setLoading(false))
  }, [address, initialState.chain]);

  return {
    isAdmin,
    loading
  };
};

export default useAdminRole;
