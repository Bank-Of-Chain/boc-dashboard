import {Card, Table, Image, Button} from 'antd'
import React from 'react'
import styles from '../style.less'
import { history, useModel } from 'umi'
import { map, reduce } from 'lodash'
import { Link } from 'umi';

// === Constants === //
import STRATEGIES_MAP from './../../../../constants/strategies'

// === Components === //
import CoinSuperPosition from './CoinSuperPosition/index'

// === Utils === //
import { toFixed } from './../../../../helper/number-format'
import { getDecimals } from './../../../../apollo/client'
import BN from 'bignumber.js'
import {MoreOutlined} from "@ant-design/icons";

const StrategyTable = ({ loading, searchData, dropdownGroup }) => {
  const { initialState } = useModel('@@initialState')
  if (!initialState.chain) return null
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
            src={`${IMAGE_ROOT}/images/${STRATEGIES_MAP[initialState.chain][item.protocol.id]}.webp`}
            placeholder={item.protocol.id}
            alt={STRATEGIES_MAP[initialState.chain][item.protocol.id]}
            fallback={`${IMAGE_ROOT}/images/default.webp`}
          />
          <a
            target={'_blank'}
            rel='noreferrer'
            href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${item.id}`}
            className={styles.text}
          >
            {text}
          </a>
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
      title: 'Asset (USDT)',
      dataIndex: 'debt',
      key: 'debt',
      render: text => <span>{toFixed(text, getDecimals(), 2)}</span>,
    },
    {
      title: 'Week Profit(USDT)',
      dataIndex: 'reports',
      key: 'reports',
      render: value =>
        `${toFixed(
          reduce(
            value,
            (rs, o) => {
              return rs.plus(o.profit)
            },
            BN(0),
          ).toString(),
          getDecimals(),
          2,
        )}`,
    },
    {
      title: 'Detail',
      dataIndex: 'id',
      key: 'id',
      render: text => (
        <Button type="dashed" icon={<MoreOutlined />} size={'Default'}
                target={'_blank'}
                href={`/#/strategy/${text}?chain=${initialState.chain}`}
                rel='noreferrer'
        />
      )
    },
  ]
  return (
    <Card
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
          pageSize: 10,
        }}
      />
    </Card>
  )
}

export default StrategyTable
