import React from 'react'
import PropTypes from 'prop-types'

// === Components === //
import { Card, Table, Space, Tooltip, Divider } from 'antd'
import { HourglassOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

// === Utils === //
import BN from 'bignumber.js'
import { BigNumber } from 'ethers'
import { useModel, useRequest } from 'umi'
import { formatToUTC0 } from '@/utils/date'
import { toFixed, formatApyLabel } from '@/utils/number-format'
import { groupBy, isEmpty, isNil, keyBy, map, reduce } from 'lodash'

// === Services === //
import { getStrategyApyDetails } from '@/services/api-service'

// === Constants === //
import { TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'

import styles from './style.less'

const dateFormat = 'MMM DD'

const comp = <HourglassOutlined style={{ color: '#a68efe' }} />

const feeApyStatusMap = {
  0: 'Unrealized',
  1: 'Realized'
}

const StrategyApyTable = ({ vault, strategyName, strategyAddress, unit, displayDecimals = TOKEN_DISPLAY_DECIMALS, dropdownGroup }) => {
  const deviceType = useDeviceType()
  const { initialState } = useModel('@@initialState')
  const { data: dataSource = [], loading } = useRequest(
    () => getStrategyApyDetails(initialState.chain, initialState.vaultAddress, strategyAddress, 0, 100),
    {
      formatResult: resp => {
        return map(resp, i => {
          const { dailyProfit, weeklyProfit, dailyApy, weeklyApy, detail = [], officialDetail = [] } = i
          const profit = new BN(dailyProfit)
          const wProfit = new BN(weeklyProfit)

          const officialApyJsx = (
            <div>
              {map(officialDetail, (i, index) => (
                <span key={index} style={{ display: 'block' }}>
                  {i.feeName}:&nbsp;
                  {formatApyLabel((100 * i.feeApy).toFixed(2))}%
                </span>
              ))}
            </div>
          )
          const dailyOfficialApyJsx = (
            <div>
              {map(groupBy(detail, 'feeApyStatus'), (groupArray, groupIndex) => {
                return [
                  <span key={`group-${groupIndex}`} style={{ display: 'block' }}>
                    <Divider orientation="left" orientationMargin="0" style={{ color: '#313036', margin: '0.25rem 0' }}>
                      {feeApyStatusMap[groupIndex]}
                    </Divider>
                  </span>,
                  ...map(groupArray, (i, index) => (
                    <span key={index} style={{ display: 'block' }}>
                      {i.feeName}:&nbsp;
                      {toFixed(i.feeValue, BigNumber.from(10).pow(18), vault === 'ethi' ? 6 : displayDecimals)}
                      &nbsp;{unit}({formatApyLabel((100 * i.feeApy).toFixed(2))}%)
                    </span>
                  ))
                ]
              })}
            </div>
          )
          return {
            id: i.id,
            date: formatToUTC0(i.scheduleTimestamp * 1000, dateFormat),
            assets: toFixed(i.dailyWeightAsset, BigNumber.from(10).pow(18), displayDecimals),
            profit: (
              <div title={toFixed(profit, BigNumber.from(10).pow(18))}>
                {toFixed(profit, BigNumber.from(10).pow(18), vault === 'ethi' ? 6 : displayDecimals)}
                {i.dailyUnrealizedProfit !== '0' && comp}
              </div>
            ),
            officialApy: isNil(i.dailyOfficialApy) ? (
              'N/A'
            ) : isEmpty(officialDetail) ? (
              `${toFixed(new BN(i.dailyOfficialApy).multipliedBy(100), 1, 2)}%`
            ) : (
              <Tooltip title={officialApyJsx}>{`${formatApyLabel(toFixed(new BN(i.dailyOfficialApy).multipliedBy(100), 1, 2))}%`}</Tooltip>
            ),
            verifyApy:
              i.dailyWeightAsset === '0' ? (
                'N/A'
              ) : isEmpty(detail) ? (
                <div>
                  {`${formatApyLabel(toFixed(new BN(dailyApy).multipliedBy(100), 1, 2))}%`}
                  {i.dailyUnrealizedApy > 0 && comp}
                </div>
              ) : (
                <Tooltip title={dailyOfficialApyJsx}>
                  <div>
                    {`${formatApyLabel(toFixed(new BN(dailyApy).multipliedBy(100), 1, 2))}%`}
                    {i.dailyUnrealizedApy > 0 && comp}
                  </div>
                </Tooltip>
              ),
            weeklyAssets: toFixed(i.weeklyWeightAsset, BigNumber.from(10).pow(18), displayDecimals),
            weeklyProfit: (
              <div title={toFixed(wProfit, BigNumber.from(10).pow(18))}>
                {toFixed(wProfit, BigNumber.from(10).pow(18), vault === 'ethi' ? 6 : displayDecimals)}
                {i.weeklyUnrealizedProfit !== '0' && comp}
              </div>
            ),
            weeklyApy: isNil(i.weeklyOfficialApy) ? 'N/A' : `${formatApyLabel(toFixed(new BN(i.weeklyOfficialApy).multipliedBy(100), 1, 2))}%`,
            weeklyVerifyApy:
              i.weeklyWeightAsset === '0' ? (
                'N/A'
              ) : (
                <div>
                  {`${formatApyLabel(toFixed(new BN(weeklyApy).multipliedBy(100), 1, 2))}%`}
                  {i.weeklyUnrealizedApy > 0 && comp}
                </div>
              ),
            dailyAssetChanged: isEmpty(i.dailyAssetChanged)
              ? 'N/A'
              : toFixed(i.dailyAssetChanged, BigNumber.from(10).pow(18), vault === 'ethi' ? 6 : displayDecimals),
            weeklyAssetChanged: isEmpty(i.weeklyAssetChanged)
              ? 'N/A'
              : toFixed(i.weeklyAssetChanged, BigNumber.from(10).pow(18), vault === 'ethi' ? 6 : displayDecimals)
          }
        })
      }
    }
  )
  if (isEmpty(dataSource)) return <span />

  const columns1 = [
    {
      title: '',
      dataIndex: 'name',
      key: 'name'
    },
    ...map(dataSource, item => {
      const title = item.date
      return {
        title: title,
        dataIndex: title,
        key: title
      }
    }),
    {
      title: 'Weekly',
      dataIndex: 'weekly',
      key: 'weekly'
    }
  ]

  const array = [`Weighted Assets (${unit})`, `Profits (${unit})`, 'Official APY', 'BoC Verified APY', 'Valuation Changed']
  const dataSource1 = map(array, (i, index) => {
    const obj = map(keyBy(dataSource, 'date'), (j, key) => {
      let value = ''
      let weekly = ''
      let nextName = ''
      if (i === array[0]) {
        value = j.assets
        weekly = j.weeklyAssets
        nextName = (
          <Space>
            {i}
            <Tooltip title="Assets deposited daily/weekly into the strategy.">
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
        )
      } else if (i === array[1]) {
        value = j.profit
        weekly = j.weeklyProfit
        nextName = (
          <Space>
            {i}
            <Tooltip title="Daily/Weekly strategy profit.">
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
        )
      } else if (i === array[2]) {
        value = j.officialApy
        weekly = j.weeklyApy
        nextName = (
          <Space>
            {i}
            <Tooltip title="Official third-party pools APY, obtained through raw data statistics provided on chain.">
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
        )
      } else if (i === array[3]) {
        value = j.verifyApy
        weekly = j.weeklyVerifyApy
        nextName = (
          <Space>
            {i}
            <Tooltip title="APY verified by the BoC strategy, calculated by using the corresponding profits and weighted assets.">
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
        )
      } else if (i === array[4]) {
        value = j.dailyAssetChanged
        weekly = j.weeklyAssetChanged
        nextName = (
          <Space>
            {i}
            <Tooltip title="Valuation changed daily/weekly in the strategy.">
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
        )
      }
      return {
        [key]: value,
        weekly,
        name: nextName
      }
    })
    return {
      ...reduce(
        obj,
        (rs, i) => {
          rs = {
            ...rs,
            ...i
          }
          return rs
        },
        {
          id: index
        }
      )
    }
  })

  const smallCardConfig = {
    cardProps: {
      size: 'small'
    },
    tableProps: {
      size: 'small',
      rowClassName: 'tablet-font-size',
      scroll: { x: 900 }
    }
  }
  const responsiveConfig = {
    [DEVICE_TYPE.Desktop]: {},
    [DEVICE_TYPE.Tablet]: {
      ...smallCardConfig,
      tableProps: {
        size: 'small',
        rowClassName: 'tablet-font-size',
        scroll: { x: 900 }
      }
    },
    [DEVICE_TYPE.Mobile]: {
      ...smallCardConfig,
      tableProps: {
        size: 'small',
        rowClassName: 'mobile-font-size',
        scroll: { x: 900 }
      }
    }
  }[deviceType]

  return (
    <Card
      loading={loading}
      bordered={false}
      extra={dropdownGroup}
      style={{
        height: '100%',
        marginTop: 32
      }}
      {...responsiveConfig.cardProps}
    >
      <div className={styles.cardTitle}>{strategyName} APY Details</div>
      <Table
        rowKey={record => record.id}
        columns={columns1}
        dataSource={dataSource1}
        loading={loading}
        pagination={false}
        {...responsiveConfig.tableProps}
      />
      <div className={styles.tip}>
        <div>Warning:</div>
        <div className={styles.right}>
          Official APY calculation is also affected by the price of reward token, reward rate and any changes in principal within{' '}
          <span style={{ color: '#a68efe', fontWeight: 'bold' }}>24</span> hours, therefore statistical data could be inaccurate at times.
        </div>
      </div>
    </Card>
  )
}

StrategyApyTable.propTypes = {
  vault: PropTypes.string,
  strategyName: PropTypes.string.isRequired,
  strategyAddress: PropTypes.string.isRequired,
  unit: PropTypes.string,
  displayDecimals: PropTypes.number,
  dropdownGroup: PropTypes.array
}

export default StrategyApyTable
