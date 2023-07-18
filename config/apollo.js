const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2))
const axios = require('axios')
const inquirer = require('inquirer')
const { isEmpty } = require('lodash')

const { env } = argv
let nextEnv = env

const start = async () => {
  if (isEmpty(env)) {
    nextEnv = await chooseEnv()
  }
  const insideUrl = `http://172.31.22.200:8088/configfiles/json/boc-subgraph/${nextEnv}/boc1.application`
  const outsideUrl = `http://apollo-config-public.bankofchain:8088/configfiles/json/boc-subgraph/${nextEnv}/boc1.application`
  const { status, data } = await Promise.any([axios.get(insideUrl), axios.get(outsideUrl)]).catch(error => {
    console.error(`load ${nextEnv} config error`)
    return {
      status: 200,
      data: {
        'boc.networks.eth.vaultAddress': '',
        'boc.networks.eth.pegTokenAddress': '',
        'boc.networks.eth.vaultBufferAddress': '',
        'boc.networks.polygon.vaultAddress': '',
        'boc.networks.polygon.pegTokenAddress': '',
        'boc.networks.polygon.vaultBufferAddress': '',
        'boc.networks.ethi.vaultAddress': '',
        'boc.networks.ethi.pegTokenAddress': '',
        'boc.networks.ethi.vaultBufferAddress': ''
      }
    }
  })
  if (status === 200) {
    const USDI_VAULT_FOR_ETH = data['boc.networks.eth.vaultAddress'] || ''
    const USDI_FOR_ETH = data['boc.networks.eth.pegTokenAddress'] || ''
    const VAULT_BUFFER_FOR_USDI_ETH = data['boc.networks.eth.vaultBufferAddress'] || ''

    const USDI_VAULT_FOR_MATIC = data['boc.networks.polygon.vaultAddress'] || ''
    const USDI_FOR_MATIC = data['boc.networks.polygon.pegTokenAddress'] || ''
    const VAULT_BUFFER_FOR_USDI_MATIC = data['boc.networks.polygon.vaultBufferAddress'] || ''

    const ETHI_VAULT = data['boc.networks.ethi.vaultAddress'] || ''
    const ETHI_FOR_ETH = data['boc.networks.ethi.pegTokenAddress'] || ''
    const VAULT_BUFFER_FOR_ETHI_ETH = data['boc.networks.ethi.vaultBufferAddress'] || ''
    let config = {
      env: nextEnv,
      ETHI_FOR_ETH,
      USDI_FOR_ETH,
      USDI_FOR_MATIC,
      ETHI_VAULT,
      USDI_VAULT_FOR_ETH,
      USDI_VAULT_FOR_MATIC,
      VAULT_BUFFER_FOR_ETHI_ETH,
      VAULT_BUFFER_FOR_USDI_ETH,
      VAULT_BUFFER_FOR_USDI_MATIC,
      API_SERVER: getApiServer(),
      DASHBOARD_ROOT: getDashboardRoot(),
      IMAGE_ROOT: getImageRoot(),
      SUB_GRAPH_URL_FOR_USDI_ETH: getSubgraphForEthUsdi(),
      SUB_GRAPH_URL_FOR_USDI_MATIC: getSubgraphForMaticUsdi(),
      SUB_GRAPH_URL_FOR_ETHI: getSubgraphForEthEthi(),
      RPC_FOR_1: getRpcFor1(),
      RPC_FOR_137: getRpcFor137(),
      RPC_FOR_31337: getRpcFor31337()
    }
    fs.writeFileSync('./config/address.json', JSON.stringify(config, undefined, 2))
    console.log('write json success')
  }
}

const isPrSg = () => {
  return nextEnv === 'pr-sg'
}

const isPr02Sg = () => {
  return nextEnv === 'pr02-sg'
}

const isDevLocal = () => {
  return nextEnv === 'local'
}

const getApiServer = () => {
  if (isDevLocal()) return 'http://localhost:8080'
  if (isPrSg()) return 'https://service.bankofchain.io'
  return `https://service-${nextEnv}.bankofchain.io`
}

const getDashboardRoot = () => {
  if (isDevLocal()) return 'http://localhost:8000'
  if (isPrSg()) return 'https://dashboard.bankofchain.io'
  if (isPr02Sg()) return 'https://dashboard-v2.bankofchain.io'
  return `https://dashboard-${nextEnv}.bankofchain.io`
}

const getImageRoot = () => {
  if (isDevLocal()) return 'http://localhost:3001'
  if (isPrSg()) return 'https://bankofchain.io'
  if (isPr02Sg()) return 'https://v2.bankofchain.io'
  return `https://${nextEnv}.bankofchain.io`
}

const getRpcFor1 = () => {
  if (isDevLocal()) return 'http://localhost:8545'
  if (isPrSg() || isPr02Sg()) return 'https://rpc.ankr.com/eth'
  return `https://rpc-${nextEnv}.bankofchain.io`
}
const getRpcFor137 = () => {
  if (isDevLocal()) return 'http://localhost:8545'
  if (isPrSg() || isPr02Sg()) return 'https://rpc-mainnet.maticvigil.com'
  return `https://rpc-${nextEnv}.bankofchain.io`
}
const getRpcFor31337 = () => {
  if (isDevLocal()) return 'http://localhost:8545'
  if (isPrSg() || isPr02Sg()) return ''
  return `https://rpc-${nextEnv}.bankofchain.io`
}

const getSubgraphForEthUsdi = () => {
  if (isDevLocal()) return 'http://localhost:8000'
  if (isPrSg()) return 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-ethereum'
  if (isPr02Sg()) return 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-ethereum'
  return `https://${nextEnv}-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth`
}

const getSubgraphForMaticUsdi = () => {
  if (isDevLocal()) return 'http://localhost:8000'
  if (isPrSg()) return 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-polygon'
  if (isPr02Sg()) return ''
  return `https://${nextEnv}-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth`
}

const getSubgraphForEthEthi = () => {
  if (isDevLocal()) return 'http://localhost:8000'
  if (isPrSg()) return 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-ethi'
  if (isPr02Sg()) return 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-ethi'
  return `https://${nextEnv}-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-ethi`
}

const chooseEnv = () => {
  const questions = [
    {
      type: 'list',
      name: 'confirm',
      message: 'Select env to deploy:',
      choices: [
        {
          key: 'local',
          name: 'local',
          value: 'local'
        },
        {
          key: 'qa-sg',
          name: 'qa-sg',
          value: 'qa-sg'
        },
        {
          key: 'qa02-sg',
          name: 'qa02-sg',
          value: 'qa02-sg'
        },
        {
          key: 'qa03-sg',
          name: 'qa03-sg',
          value: 'qa03-sg'
        },
        {
          key: 'qa04-sg',
          name: 'qa04-sg',
          value: 'qa04-sg'
        },
        {
          key: 'stage-sg',
          name: 'stage-sg',
          value: 'stage-sg'
        },
        {
          key: 'pr-sg',
          name: 'pr-sg(production)',
          value: 'pr-sg'
        }
      ]
    }
  ]
  return inquirer.prompt(questions).then(rs => rs.confirm)
}

try {
  start().then(() => process.exit(0))
} catch (error) {
  process.exit(2)
}
