import { Card, Table, Image } from 'antd'
import React from 'react'
import styles from '../style.less'
import { history, useModel } from 'umi'
import { map, sumBy } from 'lodash'

// === Constants === //
import STRATEGIES_MAP from './../../../../constants/strategies'

// === Components === //
import CoinSuperPosition from './CoinSuperPosition/index'

// === Utils === //
import { toFixed } from './../../../../helper/number-format'
import { getDecimals } from './../../../../apollo/client'

const StrategyTable = ({ loading, searchData, dropdownGroup }) => {
  const { initialState } = useModel('@@initialState')
  if(!initialState.chain) return null
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 350,
      render: (text, item) => (
        <div className={styles.tableCell}>
          <Image
            preview={false}
            width={30}
            src={`./images/${STRATEGIES_MAP[initialState.chain][item.protocol.id]}.webp`}
            placeholder={item.protocol.id}
            alt={STRATEGIES_MAP[initialState.chain][item.protocol.id]}
            fallback={'./images/default.webp'}
          />
          <a className={styles.text}>{text}</a>
        </div>
      ),
    },
    {
      title: 'Wants',
      dataIndex: 'underlyingTokens',
      key: 'underlyingTokens',
      render: text => <CoinSuperPosition array={map(text, 'token.id')} />,
    },
    {
      title: 'Deposited',
      dataIndex: 'depositedAssets',
      key: 'depositedAssets',
      render: text => <a>{toFixed(text, getDecimals(), 2)}</a>,
    },
    {
      title: 'Profit(week)',
      dataIndex: 'reports',
      key: 'reports',
      render: value =>
        `${toFixed(
          sumBy(value, o => BigInt(o.profit)).toString(),
          getDecimals(),
          2,
        )}`,
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: text => <a onClick={() => history.push(`/strategy/${text}`)}>Details</a>,
    },
  ]
  return <Card
  loading={loading}
  bordered={false}
  title='Strategies'
  extra={dropdownGroup}
  style={{
    height: '100%',
    marginTop: 32,
  }}
>
  <Table
    rowKey={record => record.id}
    size='small'
    columns={columns}
    dataSource={searchData}
    pagination={{
      style: {
        marginBottom: 0,
      },
      pageSize: 100,
    }}
  />
</Card>
}

export default StrategyTable
