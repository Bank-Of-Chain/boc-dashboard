import React, { Suspense } from 'react'
import { useModel } from 'umi'

// === Components === //
import { InfoCircleOutlined } from '@ant-design/icons'
import { GridContent } from '@ant-design/pro-layout'
import { Col, Row, Tooltip, Input } from 'antd'
import ChartCard from '@/components/ChartCard'
import DailyTvl from './components/DailyChart'
import MonthProfit from './components/MonthProfit'

// === Utils === //
import map from 'lodash/map'
import numeral from 'numeral'
import isString from 'lodash/isString'
import { toFixed } from '@/utils/number-format'
import { isProEnv } from '@/services/env-service'

// === Constants === //
import { TOKEN_TYPE } from '@/constants'
import { ETHI_BN_DECIMALS, ETHI_DISPLAY_DECIMALS } from '@/constants/ethi'

// === Hooks === //
import usePersonalData from '@/hooks/usePersonalData'
import useEthPrice from '@/hooks/useEthPrice'

// === Styles === //
import styles from './style.less'

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8
}

const Field = ({ label, value, ...rest }) => (
  <div className={styles.field} {...rest}>
    <span className={styles.label}>{label}</span>
    <span className={styles.number}>{value}</span>
  </div>
)

const Personal = () => {
  const { dataSource, loading } = usePersonalData(TOKEN_TYPE.ethi)
  const { loading: priceLoading, value: usdPrice } = useEthPrice()
  const { initialState, setInitialState } = useModel('@@initialState')

  const { day7Apy, day30Apy, profit, balanceOfToken, latestProfit } = dataSource

  const renderEstimate = value => {
    if (!value || priceLoading) {
      return null
    }
    let displayValue = value
    let sign = ''
    if (isString(value)) {
      const isNegative = value.indexOf('-') === 0
      sign = isNegative ? '-' : ''
      displayValue = isNegative ? value.substring(1) : displayValue
    }
    return usdPrice ? `≈${sign}$${toFixed(usdPrice.mul(displayValue), ETHI_BN_DECIMALS, 2)}` : ''
  }

  const introduceData = [
    {
      title: 'Balance',
      tip: 'The balance of ETHi.',
      content: numeral(toFixed(balanceOfToken, ETHI_BN_DECIMALS, ETHI_DISPLAY_DECIMALS)).format('0.[0000]a'),
      estimateContent: renderEstimate(balanceOfToken),
      loading,
      unit: 'ETHi'
    },
    {
      title: 'Profits',
      tip: 'Total profits from BoC that are withdrawable and cumulative.',
      content: numeral(toFixed(profit, ETHI_BN_DECIMALS)).format('0,0.[0000]'),
      estimateContent: (
        <div>
          {`+${numeral(latestProfit?.profit).format('0,0.[000000]')} ${latestProfit?.tokenType}`}&nbsp;&nbsp;
          <Tooltip arrowPointAtCenter title={'Profits obtained each time after rebase.'}>
            <InfoCircleOutlined style={{ fontSize: 14 }} />
          </Tooltip>
        </div>
      ),
      loading,
      unit: latestProfit?.tokenType
    },
    {
      title: 'APY (last 7 days)',
      tip: 'Yield over the past week.',
      content: numeral(day7Apy?.apy).format('0,0.00'),
      loading,
      isAPY: true,
      unit: '%'
    },
    {
      title: 'APY (last 30 days)',
      tip: 'Yield over the past month.',
      content: numeral(day30Apy?.apy).format('0,0.00'),
      loading,
      isAPY: true,
      unit: '%'
    }
  ]

  return (
    <GridContent>
      <Suspense fallback={null}>
        <Row gutter={[24, 24]} style={{ display: isProEnv(ENV_INDEX) ? 'none' : '' }}>
          <Col>
            <Input
              value={initialState.address}
              placeholder="Enter account address"
              onChange={e => setInitialState({ ...initialState, address: e.target.value })}
            />
            <a
              onClick={() =>
                setInitialState({
                  ...initialState,
                  address: '0x2346c6b1024e97c50370c783a66d80f577fe991d'
                })
              }
            >
              eth: 0x2346c6b1024e97c50370c783a66d80f577fe991d
            </a>
            <br />
            <a
              onClick={() =>
                setInitialState({
                  ...initialState,
                  address: '0x375d80da4271f5dcdf821802f981a765a0f11763'
                })
              }
            >
              matic: 0x375d80da4271f5dcdf821802f981a765a0f11763
            </a>
            <br />
            <a
              onClick={() =>
                setInitialState({
                  ...initialState,
                  address: '0x6b4b48ccdb446a109ae07d8b027ce521b5e2f1ff'
                })
              }
            >
              Xiaotian: 0x6b4b48ccdb446a109ae07d8b027ce521b5e2f1ff
            </a>
            <br />
            <a
              onClick={() =>
                setInitialState({
                  ...initialState,
                  address: '0xee3db241031c4aa79feca628f7a00aaa603901a6'
                })
              }
            >
              ND Test Account: 0xee3db241031c4aa79feca628f7a00aaa603901a6
            </a>
            <br />
            <p>This is test input, should be deleted before up to production.</p>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          {map(introduceData, ({ title, tip, loading, content, estimateContent, unit }) => (
            <Col key={title} {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title={title}
                action={
                  <Tooltip title={tip}>
                    <InfoCircleOutlined style={{ fontSize: 22 }} />
                  </Tooltip>
                }
                loading={loading}
                total={content}
                unit={unit}
                footer={<Field style={{ height: '1rem' }} value={estimateContent} />}
              />
            </Col>
          ))}
        </Row>
      </Suspense>
      <Suspense fallback={null}>
        <DailyTvl
          title={
            <span>
              ETHi variation curve
              <Tooltip title="Curve of daily change in the total ETHi held by the user.">
                <InfoCircleOutlined style={{ marginLeft: 8 }} />
              </Tooltip>
            </span>
          }
          token="ETHi"
          data={dataSource}
          loading={loading}
        />
      </Suspense>
      <Suspense fallback={null}>
        <MonthProfit title="Profits" isEthi />
      </Suspense>
    </GridContent>
  )
}

export default Personal
