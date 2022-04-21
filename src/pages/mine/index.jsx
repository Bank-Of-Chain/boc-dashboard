import React, {Suspense, useEffect, useState} from 'react'
import {useModel} from 'umi'
import numeral from 'numeral';

// === Components === //
import {InfoCircleOutlined} from '@ant-design/icons'
import {GridContent} from '@ant-design/pro-layout'
import {Col, Row, Tooltip, Result, Card, Input, Modal} from 'antd'
import ChartCard from '@/components/ChartCard'
import {BarEchart, LineEchart} from '@/components/echarts'
import { Desktop, Tablet, Mobile } from '@/components/Container/Container'

// === Utils === //
import moment from 'moment'
import isEqual from 'lodash/isEqual'
import find from 'lodash/find'
import _min from 'lodash/min'
import _max from 'lodash/max'
import isUndefined from 'lodash/isUndefined'
import isEmpty from 'lodash/isEmpty'
import { findIndex, reverse } from 'lodash'
import {toFixed} from '@/utils/number-format'
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'
import {isProEnv} from "@/services/env-service"
import * as ethers from "ethers"
import { USDI_BN_DECIMALS } from "@/constants/usdi"

// === Constants === //
import CHAINS, { CHIANS_NAME } from '@/constants/chain'

// === Hooks === //
import useAdminRole from '@/hooks/useAdminRole'
import usePersonalData from '@/hooks/usePersonalData'

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
}

const Personal = () => {
  const [showWarningModal, setShowWarningModal] = useState(false)
  const {dataSource, loading} = usePersonalData()
  const {initialState, setInitialState} = useModel('@@initialState')
  const { error: roleError } = useAdminRole(initialState.address)

  const {
    day7Apy,
    day30Apy,
    tvls = [],
    monthProfits = [],
    realizedProfit,
    unrealizedProfit,
    balanceOfUsdi
  } = dataSource

  useEffect(() => {
    const { chain, walletChainId } = initialState
    // 加载异常，一定弹窗
    if (roleError) {
        setShowWarningModal(true)
        return
    }
    // 链id不相同，如果是开发环境，且walletChainId=31337，则不展示
    if (!isEmpty(chain) && !isEmpty(walletChainId) && !isEqual(chain, walletChainId)) {
      if (!isProEnv(ENV_INDEX) && isEqual(walletChainId, '31337')) {
        setShowWarningModal(false)
        return
      }
      setShowWarningModal(true)
    }
  }, [initialState, roleError])

  const monthOffset = moment().utcOffset(0).month() + 1
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const array = months.slice(monthOffset)
  const array1 = months.splice(0, monthOffset)
  const nextMonths = [...array, ...array1]

  const option = {
    textStyle: {
      color: '#fff',
    },
    color: ['#5470c6'],
    tooltip: {},
    xAxis: {
      data: nextMonths,
      axisLine: {onZero: true},
      splitLine: {show: false},
      splitArea: {show: false},
      axisTick:{
        alignWithLabel: true
      },
    },
    yAxis: {},
    grid: {},
    series: [
      {
        name: 'Total',
        type: 'bar',
        stack: 'one',
        data: monthProfits,
      },
    ],
  }
  // 参考 https://github.com/PiggyFinance/dashboard/issues/166
  const reverseArray = reverse([...tvls])
  const continuousIndex = findIndex(reverseArray, (item, index) => {
    if (index <= 2) return false
    if (index === reverseArray.length) return true
    return Math.abs(item.balance - reverseArray[index - 1].balance) > item.balance * 0.005
  })
  const startPercent = continuousIndex === -1 ?  0 : (100.5 - (100 * continuousIndex / tvls.length))
  const option1 = getLineEchartOpt(
    tvls,
    'balance',
    'USDi',
    true,
    {
      format: 'MM-DD',
      dataZoom: [{
        start: startPercent,
        end: 100
      }],
      xAxis: {
        axisTick:{
          alignWithLabel: true
        },
      }
    },
  )
  const changeNetwork = async id => {
    const targetNetwork = find(CHAINS, { id })
    console.log('targetNetwork=', targetNetwork)
    if (isEmpty(targetNetwork)) return
    const ethereum = window.ethereum
    const data = [
      {
        chainId: `0x${Number(targetNetwork.id).toString(16)}`,
        chainName: targetNetwork.name,
        nativeCurrency: targetNetwork.nativeCurrency,
        rpcUrls: [targetNetwork.rpcUrl],
        blockExplorerUrls: [targetNetwork.blockExplorer],
      },
    ]
    console.log('data', data)

    let switchTx
    try {
      switchTx = await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: data[0].chainId }],
      })
    } catch (switchError) {
      try {
        switchTx = await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: data,
        })
      } catch (addError) {
        console.log('addError=', addError)
      }
    }

    if (switchTx) {
      console.log(switchTx)
    }
  }
  const hideModal = () => {
    setShowWarningModal(false)
  }
  if (isEmpty(initialState.address)) {
    return (
      <Result
        status='500'
        title={isUndefined(window.ethereum) ? '' : 'No Connect!'}
        subTitle={
          isUndefined(window.ethereum) ? 'Please install Metamask first.' : 'Please connect metamask first.'
        }
      />
    )
  }
  return (
    <GridContent>
      <Suspense fallback={null}>
        <Row gutter={[24, 24]} style={{ display: isProEnv(ENV_INDEX) ? 'none' : '' }}>
          <Col>
            <Input
              value={initialState.address}
              placeholder='请输入用户地址'
              onChange={e => setInitialState({...initialState, address: e.target.value})}
            />
            <a
              onClick={() => setInitialState({...initialState, address: '0x2346c6b1024e97c50370c783a66d80f577fe991d'})}>eth/bsc:
              0x2346c6b1024e97c50370c783a66d80f577fe991d</a>
            <br/>
            <a
              onClick={() => setInitialState({...initialState, address: '0x375d80da4271f5dcdf821802f981a765a0f11763'})}>matic:
              0x375d80da4271f5dcdf821802f981a765a0f11763</a>
            <br/>
            <a
              onClick={() => setInitialState({...initialState, address: '0x6b4b48ccdb446a109ae07d8b027ce521b5e2f1ff'})}>晓天地址:
              0x6b4b48ccdb446a109ae07d8b027ce521b5e2f1ff</a>
            <br/>
            <a onClick={() => setInitialState({ ...initialState, address: '0xee3db241031c4aa79feca628f7a00aaa603901a6', })}>
              ND 测试用户：0xee3db241031c4aa79feca628f7a00aaa603901a6
            </a>
            <br />
            <p>该输入框为测试使用，发布前需要删除</p>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title='Balance (USDi)'
              action={
                <Tooltip title='The balance of USDi'>
                  <InfoCircleOutlined/>
                </Tooltip>
              }
              loading={loading}
              total={() => toFixed(balanceOfUsdi, USDI_BN_DECIMALS, 2)}
              contentHeight={100}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={loading}
              title='APY(last 7 days)'
              action={
                <Tooltip title={`Yield over the past 1 week`}>
                  <InfoCircleOutlined/>
                </Tooltip>
              }
              total={`${numeral(day7Apy?.apy).format('0,0.00')}%`}
              contentHeight={70}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={loading}
              title='APY(last 30 days)'
              action={
                <Tooltip title={`Yield over the past 1 month`}>
                  <InfoCircleOutlined/>
                </Tooltip>
              }
              total={`${numeral(day30Apy?.apy).format('0,0.00')}%`}
              contentHeight={70}
            />
          </Col>

          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title='Unrealized profits (USDi)'
              action={
                <Tooltip title='Potential profit that has not been effected'>
                  <InfoCircleOutlined/>
                </Tooltip>
              }
              loading={loading}
              total={() => toFixed(unrealizedProfit, USDI_BN_DECIMALS, 2)}
              contentHeight={100}
            />
          </Col>

          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title='Realized profits (USDi)'
              action={
                <Tooltip title='The profits that have been actualized'>
                  <InfoCircleOutlined/>
                </Tooltip>
              }
              loading={loading}
              total={() => toFixed(realizedProfit, USDI_BN_DECIMALS, 2)}
              contentHeight={100}
            />
          </Col>

          {/* <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title='Deposit Percent'
              action={
                <Tooltip title='Deposit Percent'>
                  <InfoCircleOutlined />
                </Tooltip>
              }
              loading={loading}
              total={() => depositedPercent.toFixed(2) + '%'}
              contentHeight={100}
            />
          </Col> */}
        </Row>
      </Suspense>
      <Suspense fallback={null}>
        <Desktop>
          <Card
            loading={loading}
            bordered={false}
            bodyStyle={{height: '452px'}}
            style={{marginTop: 24}}
            title='Daily USDi'
          >
            <LineEchart option={option1} style={{height: '100%'}}/>
          </Card>
        </Desktop>
        <Tablet>
          <Card
            loading={loading}
            bordered={false}
            size="small"
            bodyStyle={{height: '402px'}}
            style={{marginTop: 24}}
            title='Daily USDi'
          >
            <LineEchart option={option1} style={{height: '100%'}}/>
          </Card>
        </Tablet>
        <Mobile>
          <Card
            loading={loading}
            bordered={false}
            size="small"
            bodyStyle={{height: '302px'}}
            style={{marginTop: 24}}
            title='Daily USDi'
          >
            <LineEchart option={option1} style={{height: '100%'}}/>
          </Card>
        </Mobile>

      </Suspense>
      <Suspense fallback={null}>
        <Desktop>
          <Card
            loading={loading}
            bordered={false}
            bodyStyle={{paddingLeft: 0, paddingRight: 0, height: '452px'}}
            style={{marginTop: 24}}
            title='Monthly Profit'
          >
            <BarEchart option={option} style={{height: '100%', width: '100%'}}/>
          </Card>
        </Desktop>
        <Tablet>
          <Card
            loading={loading}
            bordered={false}
            size="small"
            bodyStyle={{paddingLeft: 0, paddingRight: 0, height: '402px'}}
            style={{marginTop: 24}}
            title='Monthly Profit'
          >
            <BarEchart option={option} style={{height: '100%', width: '100%'}}/>
          </Card>
        </Tablet>
        <Mobile>
          <Card
            loading={loading}
            bordered={false}
            size="small"
            bodyStyle={{paddingLeft: 0, paddingRight: 0, height: '302px'}}
            style={{marginTop: 24}}
            title='Monthly Profit'
          >
            <BarEchart option={option} style={{height: '100%', width: '100%'}}/>
          </Card>
        </Mobile>
      </Suspense>
      <Modal
        title="Set metamask's network to current?"
        visible={showWarningModal}
        onOk={() => changeNetwork(initialState.chain)}
        onCancel={hideModal}
        okText='ok'
        cancelText='close'
      >
        <p>
           Metamask Chain:{' '}
          <span style={{ color: 'red', fontWeight: 'bold' }}>{CHIANS_NAME[initialState.walletChainId] || initialState.walletChainId}</span>
        </p>
        <p>
          Current Chain:{' '}
          <span style={{ color: 'red', fontWeight: 'bold' }}>{CHIANS_NAME[initialState.chain] || initialState.chain}</span>
        </p>
        {!isEmpty(roleError) && (
          <p>
            Message：<span style={{ color: 'red', fontWeight: 'bold' }}>Error Vault address!</span>
          </p>
        )}
      </Modal>
    </GridContent>
  )
}

export default Personal
