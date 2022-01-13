import {
  request
} from 'umi'
export const fetchData = async () => {
  const postBody = {
    "query": `{
      calAPYs(where: {
      strategyAddress: \ "0x4717eaa5da97f11bda3a3f021a20fd8cb72eab64\"
      timestamp_gt: 1640855520
    }) {
      assetsBefore
      assetsDelta
      timeDelta
      timestamp
    }
    }`,
    "variables": null
  }
  const url = 'https://api.thegraph.com/subgraphs/name/naruduo/mysubgraph'
  return await request(url, {
    data: postBody,
    method: 'post'
  });
}
export const getVaultDetails = async () => {
  // TODO: 待实现
  const url = '/api/vault-1';
  return await request(url);
}

export const getVaultDailyData = async () => {
  // TODO: 待实现
  const url = '/api/vault-2';
  return await request(url);
}

export const getVaultHourlyData = async () => {
  // TODO: 待实现
  const url = '/api/vault-3';
  return await request(url);
}

export const getProtocols = async () => {
  // TODO: 待实现
  const url = '/api/protocol-3';
  return await request(url);
}

export const getStrategyById = async () => {
  // TODO: 待实现
  const url = '/api/strategy-3';
  return await request(url);
}
