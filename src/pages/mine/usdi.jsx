import React, { Suspense } from 'react'

// === Components === //
import { InfoCircleOutlined } from '@ant-design/icons'
import { GridContent } from '@ant-design/pro-layout'
import { Col, Row, Tooltip, Input } from 'antd'
import ChartCard from '@/components/ChartCard'
import ChainChange from '@/components/ChainChange'
import DailyTvl from './components/DailyChart'
import MonthProfit from './components/MonthProfit'

// === Constants === //
import { TOKEN_TYPE } from '@/constants'
import { USDI_BN_DECIMALS } from '@/constants/usdi'
import { TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'

// === Utils === //
import { useModel } from 'umi'
import numeral from 'numeral'
import map from 'lodash/map'
import { toFixed } from '@/utils/number-format'

// === Services === //
import { isProEnv } from '@/services/env-service'
import usePersonalData from '@/hooks/usePersonalData'

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
    {value && <span className={styles.number}>{value}</span>}
  </div>
)

const Personal = () => {
  const { dataSource, loading } = usePersonalData(TOKEN_TYPE.usdi)
  const { initialState, setInitialState } = useModel('@@initialState')

  const { day7Apy, day30Apy, profit, balanceOfToken, latestProfit } = dataSource

  const introduceData = [
    {
      title: 'Balance',
      tip: 'The balance of USDi.',
      content: numeral(toFixed(balanceOfToken, USDI_BN_DECIMALS, TOKEN_DISPLAY_DECIMALS)).format('0.[0000]a'),
      loading,
      unit: 'USDi'
    },
    {
      title: 'Profits',
      tip: 'Total profits from BoC.',
      content: numeral(toFixed(profit, USDI_BN_DECIMALS, TOKEN_DISPLAY_DECIMALS)).format('0,0.00'),
      estimateContent: `+${numeral(latestProfit?.profit).format('0,0.00')} ${latestProfit?.tokenType}`,
      loading,
      unit: latestProfit?.tokenType
    },
    {
      title: 'APY (last 7 days)',
      tip: 'Yield over the past week.',
      content: numeral(day7Apy?.apy).format('0,0.00'),
      loading,
      unit: '%'
    },
    {
      title: 'APY (last 30 days)',
      tip: 'Yield over the past month.',
      content: numeral(day30Apy?.apy).format('0,0.00'),
      loading,
      unit: '%'
    }
  ]

  return (
    <GridContent>
      <ChainChange />
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
          {map(introduceData, ({ title, tip, loading, content, unit, estimateContent }) => (
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
              USDi variation curve
              <Tooltip title="Curve of daily change in the total USDi held by the user.">
                <InfoCircleOutlined style={{ marginLeft: 8 }} />
              </Tooltip>
            </span>
          }
          data={dataSource}
          loading={loading}
        />
      </Suspense>
      <Suspense fallback={null}>
        <MonthProfit title="Profits" />
      </Suspense>
    </GridContent>
  )
}

export default Personal
