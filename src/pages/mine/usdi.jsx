import React, { Suspense } from 'react'
import {useModel} from 'umi'
import numeral from 'numeral';

// === Components === //
import { InfoCircleOutlined } from '@ant-design/icons'
import { GridContent } from '@ant-design/pro-layout'
import { Col, Row, Tooltip, Input } from 'antd'
import ChartCard from '@/components/ChartCard'
import DailyTvl from './components/DailyChart'
import MonthProfit from './components/MonthProfit'

// === Utils === //
import _min from 'lodash/min'
import _max from 'lodash/max'
import map from 'lodash/map'
import {toFixed} from '@/utils/number-format'
import {isProEnv} from "@/services/env-service"
import { USDI_BN_DECIMALS } from "@/constants/usdi"

// === Hooks === //
import usePersonalData from '@/hooks/usePersonalData'

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
}

const Personal = () => {
  const {dataSource, loading} = usePersonalData()
  const {initialState, setInitialState} = useModel('@@initialState')

  const {
    day7Apy,
    day30Apy,
    realizedProfit,
    unrealizedProfit,
    balanceOfUsdi
  } = dataSource

  const introduceData = [{
    title: 'Balance (USDi)',
    tip: 'The balance of USDi',
    content: () => toFixed(balanceOfUsdi, USDI_BN_DECIMALS, 2),
    loading,
  }, {
    title: 'Unrealized profits (USDi)',
    tip: 'Potential profit that has not been effected',
    content: () => toFixed(unrealizedProfit, USDI_BN_DECIMALS, 2),
    loading,
  }, {
    title: 'Realized profits (USDi)',
    tip: 'The profits that have been actualized',
    content: () => toFixed(realizedProfit, USDI_BN_DECIMALS, 2),
    loading,
  }, {
    title: 'APY(last 7 days)',
    tip: 'Yield over the past 1 week',
    content: `${numeral(day7Apy?.apy).format('0,0.00')}%`,
    loading,
  }, {
    title: 'APY(last 30 days)',
    tip: 'Yield over the past 1 month',
    content: `${numeral(day30Apy?.apy).format('0,0.00')}%`,
    loading,
  }]

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
          {map(introduceData, ({ title, tip, loading, content }) => (
            <Col key={title} {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title={title}
                action={
                  <Tooltip title={tip}>
                    <InfoCircleOutlined />
                  </Tooltip>
                }
                loading={loading}
                total={content}
                contentHeight={100}
              />
            </Col>
          ))}
        </Row>
      </Suspense>
      <Suspense fallback={null}>
        <DailyTvl title="Daily USDi" data={dataSource} loading={loading} />
      </Suspense>
      <Suspense fallback={null}>
        <MonthProfit title="Monthly Profit" data={dataSource} loading={loading} />
      </Suspense>
    </GridContent>
  )
}

export default Personal
