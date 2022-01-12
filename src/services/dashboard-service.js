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
