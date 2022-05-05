import { Suspense, useEffect, useState } from 'react'
import { Col, Row, Card, Button, Tabs, Tooltip } from 'antd'
import { GridContent } from '@ant-design/pro-layout'
import classNames from 'classnames'
import IntroduceRow from './components/IntroduceRow'
import StrategyTable from './components/StrategyTable'
import TransationsTable from './components/TransationsTable'
import TopSearch from './components/TopSearch'
import ProportionSales from './components/ProportionSales'
import { useModel } from 'umi'
import _min from 'lodash/min'
import _max from 'lodash/max'
import numeral from 'numeral'

// === Services === //
import useDashboardData from '@/hooks/useDashboardData'
import { getValutAPYList, getUsdiTotalSupplyList, clearAPICache } from '@/services/api-service'

// === Utils === //
import { isEmpty, isNil } from 'lodash';
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'
import { APY_DURATION } from '@/constants/api'
import { toFixed } from '@/utils/number-format';
import { USDI_BN_DECIMALS } from '@/constants/usdi'
import { map, reverse } from 'lodash'
import { appendDate } from "@/utils/array-append"

// === Styles === //
import styles from './style.less'

import { LineEchart } from '@/components/echarts'

const { TabPane } = Tabs

const Analysis = () => {
  const [calDateRange, setCalDateRange] = useState(31)
  const [tvlEchartOpt, setTvlEchartOpt] = useState({})
  const [apyEchartOpt, setApyEchartOpt] = useState({});
  const deviceType = useDeviceType()

  const { initialState } = useModel('@@initialState')

  const { dataSource = {}, loading } = useDashboardData()

  useEffect(() => {
    if (!initialState.chain) {
      return
    }
    const params = {
      xAxis: {
        axisTick: {
          alignWithLabel: true,
        },
      }
    }
    if (calDateRange > 7) {
      params.format = 'MM-DD'
    }
    getValutAPYList({
      chainId: initialState.chain,
      duration: APY_DURATION.monthly,
      limit: calDateRange
    }).then(data => {
      const items = appendDate(data.content, 'apy', calDateRange)
      const result = map(reverse(items), ({date, apy}) => ({
        date,
        apy: isNil(apy) ? null : `${numeral(apy).format('0,0.00')}`
      }))
      setApyEchartOpt(getLineEchartOpt(result, 'apy', 'Trailing 30-day APY(%)', false, params))
    }).catch((e) => {
      console.error(e)
    })
    getUsdiTotalSupplyList({
      chainId: initialState.chain,
      limit: calDateRange
    }).then(data => {
      const items = appendDate(data.content, 'totalSupply', calDateRange)
      const result = map(reverse(items), ({date, totalSupply}) => ({
        date,
        totalSupply: toFixed(totalSupply, USDI_BN_DECIMALS, 2),
      }))
      setTvlEchartOpt(getLineEchartOpt(result, 'totalSupply', 'USDi', false, params))
    }).catch((e) => {
      console.error(e)
    })
  }, [calDateRange, initialState.chain])

  useEffect(() => {
    return () => {
      clearAPICache()
    }
  }, [])

  if (isEmpty(initialState.chain)) return null

  const chartResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      chartWrapperClassName: styles.chartDiv
    },
    [DEVICE_TYPE.Tablet]: {
      buttonProps: {
        size: 'small',
        style: { fontSize: '0.5rem' }
      },
      chartWrapperClassName: styles.chartDivMobile
    },
    [DEVICE_TYPE.Mobile]: {
      buttonProps: {
        size: 'small',
        style: { fontSize: '0.5rem' }
      },
      chartWrapperClassName: styles.chartDivMobile,
      tabClassName: styles.tabMobile
    }
  }[deviceType]

  const protocolResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {},
    [DEVICE_TYPE.Tablet]: {
      cardProps: {
        size: 'small'
      }
    },
    [DEVICE_TYPE.Mobile]: {
      cardProps: {
        size: 'small'
      }
    }
  }[deviceType]

  return (
    <GridContent>
      <Suspense fallback={null}>
        <IntroduceRow loading={loading} visitData={dataSource} />
      </Suspense>
      <Suspense fallback={null}>
        <Card
          loading={loading}
          bordered={false}
          bodyStyle={{ padding: 0 }}
          style={{ marginTop: 24 }}
        >
          <div className={styles.vaultKeyCard}>
            <Tabs
              animated
              size='small'
              className={classNames(chartResponsiveConfig.tabClassName)}
              tabBarExtraContent={
                <div>
                  <Tooltip title='last 7 days'>
                    <Button
                      ghost
                      type={calDateRange === 7 ? 'primary' : ''}
                      onClick={() => setCalDateRange(7)}
                      {...chartResponsiveConfig.buttonProps}
                    >
                      WEEK
                    </Button>
                  </Tooltip>
                  <Tooltip title='last 30 days'>
                    <Button
                      ghost
                      type={calDateRange === 31 ? 'primary' : ''}
                      onClick={() => setCalDateRange(31)}
                      {...chartResponsiveConfig.buttonProps}
                    >
                      MONTH
                    </Button>
                  </Tooltip>
                  <Tooltip title='last 365 days'>
                    <Button
                      ghost
                      type={calDateRange === 365 ? 'primary' : ''}
                      onClick={() => setCalDateRange(365)}
                      {...chartResponsiveConfig.buttonProps}
                    >
                      YEAR
                    </Button>
                  </Tooltip>
                </div>
              }
            >
              <TabPane tab="APY" key="apy">
                <div className={chartResponsiveConfig.chartWrapperClassName}>
                  <LineEchart option={apyEchartOpt} style={{height: '100%', width: '100%'}}/>
                </div>
              </TabPane>
              <TabPane tab='Total Supply' key='totalSupply'>
                <div className={chartResponsiveConfig.chartWrapperClassName}>
                  <LineEchart option={tvlEchartOpt} style={{ height: '100%', width: '100%' }} />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <Card
          loading={loading}
          className={styles.salesCard}
          bordered={false}
          title='Vault Protocol Allocations'
          style={{
            height: '100%',
            marginTop: 24,
          }}
          {...protocolResponsiveConfig.cardProps}
        >
          <Row
            gutter={24}
            style={{
              marginTop: 24,
            }}
          >
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionSales loading={loading} visitData={dataSource.vault || {}} />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <TopSearch loading={loading} visitData={dataSource.vault || {}} />
              </Suspense>
            </Col>
          </Row>
        </Card>
      </Suspense>

      <Suspense fallback={null}>
        <StrategyTable loading={loading} />
      </Suspense>
      <Suspense fallback={null}>
        <TransationsTable loading={loading} />
      </Suspense>
    </GridContent>
  )
}

export default Analysis
