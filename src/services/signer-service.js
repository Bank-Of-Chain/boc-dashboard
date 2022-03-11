import random from "lodash/random"
import * as ethers from 'ethers'

const {
  utils
} = ethers
export async function getSignatureHeader(account, signer) {
  const timestamp = Date.now();
  const nonce = random(0, 100000000);
  const messageHash = utils.id(timestamp + account + nonce);
  const messageHashBytes = utils.arrayify(messageHash);
  const signature = await signer.signMessage(messageHashBytes);
  return {
    timestamp,
    nonce,
    account,
    signature
  };
}
