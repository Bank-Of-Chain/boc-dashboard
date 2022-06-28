import { Suspense, useState, useEffect } from 'react'
import { Col, Row, Card, Image, Descriptions, Spin } from 'antd'
import { GridContent } from '@ant-design/pro-layout'
import ReportTable from './components/ReportTable'
import { history, useModel } from 'umi'
import { LeftOutlined } from '@ant-design/icons'
import { LineEchart } from '@/components/echarts'
import multipleLine from '@/components/echarts/options/line/multipleLine'

// === Constants === //
import { USDI_STRATEGIES_MAP, ETHI_STRATEGIES_MAP } from '@/constants/strategies'
import { VAULT_TYPE, TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'
import { ETHI_DISPLAY_DECIMALS } from '@/constants/ethi'

// === Components === //
import CoinSuperPosition from '@/components/CoinSuperPosition'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

// === Utils === //
import { isEmpty, map, noop, reduce, compact } from 'lodash'
import { toFixed } from '@/utils/number-format'

import moment from 'moment'
import _union from 'lodash/union'
import _find from 'lodash/find'
import BN from 'bignumber.js'
import { get, isNil, keyBy, sum } from 'lodash'
import { formatToUTC0 } from '@/utils/date'

// === Services === //
import {
  getStrategyApysOffChain,
  getBaseApyByPage,
  getStrategyDetails,
  getStrategyEstimateApys,
} from '@/services/api-service'

// === Styles === //
import styles from './style.less'

const Strategy = props => {
  const { id, ori = false } = props?.location?.query
  const [loading, setLoading] = useState(false)
  const [strategy, setStrategy] = useState({})
  // 用于存放所有的apy数据，取代上面的apys和offchainApys
  const [apyArray, setApyArray] = useState([])
  const { initialState } = useModel('@@initialState')
  const deviceType = useDeviceType()
  const unit = {
    [VAULT_TYPE.USDi]: 'USD',
    [VAULT_TYPE.ETHi]: 'ETH',
  }[initialState.vault]

  // boc-service fixed the number to 6
  const decimals = BN(1e18)

  const strategiesMap = {
    [VAULT_TYPE.USDi]: USDI_STRATEGIES_MAP,
    [VAULT_TYPE.ETHi]: ETHI_STRATEGIES_MAP,
  }[initialState.vault]

  const displayDecimals = {
    [VAULT_TYPE.USDi]: TOKEN_DISPLAY_DECIMALS,
    [VAULT_TYPE.ETHi]: ETHI_DISPLAY_DECIMALS,
  }[initialState.vault]

  useEffect(() => {
    setLoading(true)
    getStrategyDetails(initialState.chain, initialState.vaultAddress, 0, 100)
      .then(resp => {
        const strategy = _find(resp.content, item => item.strategyAddress === id)
        setStrategy(strategy)
      })
      .catch(noop)
      .finally(() => {
        setLoading(false)
      })
    // eslint-disable-next-line
  }, [id])

  useEffect(() => {
    if (isEmpty(strategy?.strategyName)) return
    Promise.all([
      getBaseApyByPage(
        {
          chainId: initialState.chain,
          vaultAddress: initialState.vaultAddress,
          strategyName: strategy?.strategyName,
          sort: 'fetch_block desc',
        },
        0,
        100,
      ).catch(() => {}),
      getStrategyApysOffChain(
        {
          chainId: initialState.chain,
          strategyName: strategy?.strategyName,
          sort: 'fetch_time desc',
        },
        0,
        100,
      ).catch(() => {}),
      getStrategyEstimateApys(
        initialState.chain,
        initialState.vaultAddress,
        strategy?.strategyName,
      ).catch(() => {}),
    ]).then(([apys = { content: [] }, offChainApys, unRealizeApys]) => {
      const startMoment = moment()
        .utcOffset(0)
        .subtract(66, 'day')
        .startOf('day')
      const calcArray = reduce(
        // 往前推66天，往后预估7天
        new Array(66 + 7),
        rs => {
          const currentMoment = startMoment.subtract(-1, 'day')
          rs.push(currentMoment.format('yyyy-MM-DD'))
          return rs
        },
        [],
      )

      // 因为weeklyApy只展示到昨天的，所以需要将昨天的点，作为unrealize线的第一个点，这样weeklyapy和unrealize的线才是连贯的
      let unRealizeApyItems = unRealizeApys?.content
      if (
        apys.content.length > 0 &&
        unRealizeApyItems.length > 0 &&
        moment(apys.content[0].fetchTimestamp * 1000).isBefore(
          unRealizeApyItems[unRealizeApyItems.length - 1].timestamp * 1000,
        )
      ) {
        const firstItem = {
          apy: apys.content[0].lpApy,
          timestamp: apys.content[0].fetchTimestamp,
        }
        unRealizeApyItems = [firstItem, ...unRealizeApyItems]
      }
      const offChainApyMap = keyBy(
        map(offChainApys.content, i => {
          return {
            value: 100 * i.apy,
            apy: (i.apy * 100).toFixed(2),
            date: formatToUTC0(i.fetchTime, 'yyyy-MM-DD'),
          }
        }),
        'date',
      )
      const extentApyMap = keyBy(
        map(apys.content, i => {
          return {
            officialApy: (i.factorialOfficialApy * 100).toFixed(2),
            realizedApy: (i.realizedApy.value * 100).toFixed(2),
            expectedApy: (i.expectedApy * 100).toFixed(2),
            date: formatToUTC0(i.fetchTimestamp * 1000, 'yyyy-MM-DD'),
          }
        }),
        'date',
      )

      const nextApyArray = map(calcArray, i => {
        const offChainApyItem = get(offChainApyMap, `${i}.apy`, null)
        const { officialApy, realizedApy, expectedApy } = get(extentApyMap, i, {
          officialApy: null,
          realizedApy: null,
          expectedApy: null,
        })
        return {
          date: i,
          realizedApy,
          expectedApy,
          officialApy,
          official_daily_apy: isNil(offChainApyItem) ? null : offChainApyItem,
        }
      })
      console.log('nextApyArray=', nextApyArray)
      setApyArray(nextApyArray.slice(-67))
    })
  }, [strategy, strategy?.strategyName])

  const estimateArray = map(apyArray, 'un_realize_apy')
  const lengndData = ['Official APY', 'Expected APY']
  const data = [
    {
      seriesName: 'Official APY',
      seriesData: map(apyArray, 'officialApy'),
    },
    {
      seriesName: 'Expected APY',
      seriesData: map(apyArray, 'expectedApy'),
    },
  ]
  if (ori) {
    lengndData.push('Official Origin Apy')
    data.push({
      seriesName: 'Official Origin Apy',
      seriesData: map(apyArray, 'official_daily_apy'),
    })
  }
  // TODO: 由于后端接口暂时未上，所以前端选择性的展示unrealize apy
  if (!isEmpty(compact(estimateArray))) {
    lengndData.push('Estimated Weekly APY')
    data.push({
      seriesName: 'Estimated Weekly APY',
      seriesData: estimateArray,
    })
  }
  let obj = {
    legend: {
      data: lengndData,
      textStyle: { color: '#fff' },
    },
    xAxisData: map(apyArray, 'date'),
    data,
  }
  const option = multipleLine(obj)
  option.color = [
    '#A68EFE',
    '#2ec7c9',
    '#ffb980',
    '#d87a80',
    '#e5cf0d',
    '#97b552',
    '#95706d',
    '#8d98b3',
    '#dc69aa',
    '#07a2a4',
  ]
  option.series.forEach((serie, index) => {
    serie.connectNulls = true
    serie.z = option.series.length - index
    if (serie.name === 'Expected APY') {
      serie.lineStyle = {
        width: 5,
        type: 'dotted',
      }
    }
  })
  option.xAxis.data = option.xAxis.data.map(item => `${item} (UTC)`)
  option.xAxis.axisLabel = {
    formatter: value => value.replace(' (UTC)', ''),
  }
  option.xAxis.axisTick = {
    alignWithLabel: true,
  }
  option.yAxis.splitLine = {
    lineStyle: {
      color: 'black',
    },
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size='large' />
      </div>
    )
  }
  if (!initialState.chain || isEmpty(strategy)) return null

  const { underlyingTokens, totalAssetBaseCurrent } = strategy

  const smallSizeProps = {
    cardProps: {
      size: 'small',
    },
    descriptionProps: {
      size: 'small',
    },
  }
  const infoResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {},
    [DEVICE_TYPE.Tablet]: smallSizeProps,
    [DEVICE_TYPE.Mobile]: smallSizeProps,
  }[deviceType]

  const chartStyle = {
    padding: '0 24px',
    height: 400,
  }
  const chartResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      chartStyle,
    },
    [DEVICE_TYPE.Tablet]: {
      cardProps: {
        size: 'small',
      },
      chartStyle,
    },
    [DEVICE_TYPE.Mobile]: {
      cardProps: {
        size: 'small',
      },
      chartStyle: {
        ...chartStyle,
        height: 280,
      },
    },
  }[deviceType]

  return (
    <GridContent>
      <Suspense fallback={null}>
        <Card
          title={<LeftOutlined onClick={() => history.push('/')} />}
          bordered={false}
          {...infoResponsiveConfig.cardProps}
        >
          <Row justify='space-around'>
            <Col xl={8} lg={8} md={8} sm={22} xs={22} style={{ margin: '0 auto 16px' }}>
              <Image
                preview={false}
                width={200}
                style={{ backgroundColor: '#fff', borderRadius: '50%' }}
                src={`${IMAGE_ROOT}/images/amms/${
                  strategiesMap[initialState.chain][strategy?.protocol]
                }.png`}
                fallback={`${IMAGE_ROOT}/default.png`}
              />
            </Col>
            <Col xl={10} lg={10} md={10} sm={22} xs={22}>
              <Descriptions
                column={1}
                title={<span style={{ color: '#fff' }}>Base Info</span>}
                style={{
                  marginBottom: 32,
                }}
                labelStyle={{ color: '#fff' }}
                contentStyle={{ color: '#fff' }}
                {...infoResponsiveConfig.descriptionProps}
              >
                <Descriptions.Item label='Name'>
                  <a
                    target={'_blank'}
                    rel='noreferrer'
                    href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${
                      strategy.strategyAddress
                    }`}
                  >
                    {strategy.strategyName}
                  </a>
                </Descriptions.Item>
                <Descriptions.Item label='Underlying Token'>
                  {!isEmpty(underlyingTokens) && (
                    <CoinSuperPosition array={underlyingTokens.split(',')} />
                  )}
                </Descriptions.Item>
                <Descriptions.Item label='Asset Value'>
                  {toFixed(totalAssetBaseCurrent, decimals, displayDecimals) + ` ${unit}`}
                </Descriptions.Item>
                <Descriptions.Item label='Status'>Active</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <Card
          loading={loading}
          title='Apy (%)'
          className={styles.offlineCard}
          bordered={false}
          style={{
            marginTop: 32,
          }}
          {...chartResponsiveConfig.cardProps}
        >
          <div style={chartResponsiveConfig.chartStyle}>
            <LineEchart option={option} style={{ height: '100%', width: '100%' }} />
          </div>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <ReportTable strategyName={strategy?.strategyName} loading={loading} />
      </Suspense>
    </GridContent>
  )
}

export default Strategy
