import { Card, Table, Tooltip, Radio  } from 'antd'
import React, { useState } from 'react'
import { useModel } from 'umi'
import { MoreOutlined } from '@ant-design/icons'

// === Components === //
import { Desktop, Tablet, Mobile } from '@/components/Container/Container'

// === Utils === //
import moment from 'moment'
import { toFixed } from './../../../../helper/number-format'
import { getDecimals } from './../../../../apollo/client'

const mockData = [
  {
    "__typename": "ImportantEvent",
    "id": "0x95f88699e29774e930d4bdd2d13a231d8591b1933a94e98440a2803e63af5a83",
    "method": "Transfer",
    "from": "0xee3db241031c4aa79feca628f7a00aaa603901a6",
    "to": "0x008586b7f6768edc269d9e5cd276316d33cece6d",
    "shares": "98862255665",
    "value": "100000000000",
    "timestamp": "1648121512"
  },
  {
    "__typename": "ImportantEvent",
    "id": "0x75d0cf99c35d8a296c01f311a9234131253cb8b7938f89783f46ec6eb8f110ba",
    "method": "Transfer",
    "from": "0x6b4b48ccdb446a109ae07d8b027ce521b5e2f1ff",
    "to": "0x008586b7f6768edc269d9e5cd276316d33cece6d",
    "shares": "89042188631",
    "value": "89910570000",
    "timestamp": "1647073150"
  },
  {
    "__typename": "ImportantEvent",
    "id": "0xe0d37d5b77ac7296e6bb86b8a530f8555dfe41be566759d1603c6112818bd0af",
    "method": "Mint",
    "to": "0x91370264b403c3ea0993cd2e1f59da4d34e7af0d",
    "address": "0x008586b7f6768edc269d9e5cd276316d33cece6d",
    "shares": "1981507057",
    "value": "1998886840",
    "timestamp": "1646559646"
  },
  {
    "__typename": "ImportantEvent",
    "id": "0x84fcade45ec29fbd931f4cca6f0bd5eb961b85842975b1c6fad567c9a5352ffc",
    "method": "Mint",
    "to": "0x2346c6b1024e97c50370c783a66d80f577fe991d",
    "address": "0x008586b7f6768edc269d9e5cd276316d33cece6d",
    "shares": "3979602824",
    "value": "4000000000",
    "timestamp": "1644990626"
  },
  {
    "__typename": "ImportantEvent",
    "id": "0x7982a774130ff1bf8c47f062ab8a9c2aa36db513a894e58782f4ce5e4b16561f",
    "method": "Burn",
    "from": "0x2346c6b1024e97c50370c783a66d80f577fe991d",
    "address": "0x008586b7f6768edc269d9e5cd276316d33cece6d",
    "shares": "3950000000",
    "value": "3968765748",
    "timestamp": "1644990459"
  },
  {
    "__typename": "ImportantEvent",
    "id": "0xc1b5dbac290984c1d5b82d378147695b5c43951d7bf5543e58bca654d52e4a35",
    "method": "Burn",
    "from": "0xfe9da13dfc08060ac786881b78e9a6100496cff4",
    "address": "0x008586b7f6768edc269d9e5cd276316d33cece6d",
    "shares": "1096240525",
    "value": "1100000000",
    "timestamp": "1644501711"
  },
  {
    "__typename": "ImportantEvent",
    "id": "0x3a26fa0b6eded1364e7de313c3073df93625ac746ec45cbd3a6979d8fd63c06e",
    "method": "Rebase",
    "from": "0x579a09bbfeafb4d23d9fa36c08fae754f1e612b7",
    "address": "0x008586b7f6768edc269d9e5cd276316d33cece6d",
    "shares": "1498798106",
    "value": "1500000000",
    "timestamp": "1643474498"
  },
  {
    "__typename": "ImportantEvent",
    "id": "0x8614bc5ca2100c927137f0f295f8547e919e3fdacadbe684218bfd6bfa35f178",
    "method": "Rebase",
    "from": "0x6b4b48ccdb446a109ae07d8b027ce521b5e2f1ff",
    "address": "0x008586b7f6768edc269d9e5cd276316d33cece6d",
    "shares": "8990045471",
    "value": "8997254633",
    "timestamp": "1643432207"
  },
  {
    "__typename": "ImportantEvent",
    "id": "0x40b8b23a8e2750aecb88a033a2426968755b953a69c02a817a192278dc651675",
    "method": "Mint",
    "to": "0x2346c6b1024e97c50370c783a66d80f577fe991d",
    "address": "0x008586b7f6768edc269d9e5cd276316d33cece6d",
    "shares": "50000000",
    "value": "50033946",
    "timestamp": "1643285403"
  },
  {
    "__typename": "ImportantEvent",
    "id": "0x7137fd3b73d1b6a2b549301f11998e2a19161afe72e112a16021d27d3492ff48",
    "method": "Transfer",
    "from": "0x579a09bbfeafb4d23d9fa36c08fae754f1e612b7",
    "to": "0x008586b7f6768edc269d9e5cd276316d33cece6d",
    "shares": "1001942845",
    "value": "1000000000",
    "timestamp": "1641223934"
  },
  {
    "__typename": "ImportantEvent",
    "id": "0x49befc7d42119885898546b5d9596264abcc3b8d3de2c14ee2e38b401776ce54",
    "method": "Mint",
    "to": "0x6b4b48ccdb446a109ae07d8b027ce521b5e2f1ff",
    "address": "0x008586b7f6768edc269d9e5cd276316d33cece6d",
    "shares": "1001942811",
    "value": "1000000000",
    "timestamp": "1641208682"
  },
  {
    "__typename": "ImportantEvent",
    "id": "0xc40d962fcb4d233dff6f764e7ea4fdd44bea73c4119e1138370adb63c4245b8b",
    "method": "Mint",
    "to": "0x2346c6b1024e97c50370c783a66d80f577fe991d",
    "address": "0x008586b7f6768edc269d9e5cd276316d33cece6d",
    "shares": "4000000000",
    "value": "4000000000",
    "timestamp": "1641200901"
  }
]

const TransationsTable = ({ loading, visitData, dropdownGroup }) => {
  const { initialState } = useModel('@@initialState')
  const [filter, setFilter] = useState("All")
  const columns = [
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: "10rem",
      render: text => (
        <Tooltip title={`${moment(1000 * text).utcOffset(0).format('yyyy-MM-DD HH:mm:ss')} (UTC)`}>
          {moment(1000 * text)
            .utcOffset(0)
            .locale('en')
            .fromNow()}
        </Tooltip>
      ),
    },
    {
      title: 'Contract',
      key: 'contract',
      width: "10rem",
      ellipsis: {
        showTitle: false,
      },
      render: (text, item) => {
        return {
          Mint: 'Value Core',
          Burn: 'Value Core',
          Rebase: 'Value Core',
          Transfer: 'USDi'
        }[item.method]
      }
        // <a
        //   target={'_blank'}
        //   href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${text}`}
        //   title={text}
        //   rel='noreferrer'
        // >
        //   {text}
        // </a>
    },
    {
      title: 'Transaction Type',
      key: 'tramsaction',
      render: (text, item) => {
        const fns = {
          Mint: (item) => {
            return (
              <>
                ❇️<strong>{item.method}</strong> {toFixed(item.value, getDecimals(), 2)} USDi to <strong>{item.to}</strong>
              </>
            )
          },
          Burn: (item) => {
            return (
              <>
                🌹 <strong>{item.method}</strong> {toFixed(item.value, getDecimals(), 2)} USDi
              </>
            )
          },
          Rebase: (item) => {
            return (
              <>
                🉑 <strong>{item.method}</strong> {toFixed(item.value, getDecimals(), 2)} raw yield
              </>
            )
          },
          Transfer: (item) => {
            return (
              <>
                🔆 <strong>{item.method}</strong> {toFixed(item.shares, getDecimals(), 2)} USDi from <strong>{item.from}</strong> to <strong>{item.to}</strong>
              </>
            )
          },
        }
        return fns[item.method](item)
      },
    },
    // {
    //   title: 'Shares',
    //   render: (text, item) => `${toFixed(item.shares, getDecimals(), 2)}`,
    // },
    // {
    //   title: 'Shares Value (USDT)',
    //   width: '10rem',
    //   render: (text, item) => `${toFixed(item.value, getDecimals(), 2)}`,
    // },
    {
      title: 'Tx Address',
      dataIndex: 'id',
      key: 'id',
      width: '6.5rem',
      width: "10rem",
      ellipsis: {
        showTitle: false,
      },
      align: 'center',
      render: text => (
        <a
          target="_blank"
          rel="noreferrer"
          href={`${CHAIN_BROWSER_URL[initialState.chain]}/tx/${text}`}
        >
          <img width={21} src="./images/link.png" alt="link" />
        </a>
      ),
    },
  ]

  const handleChange = (e) => {
    setFilter(e.target.value)
  }

  const dataSource = mockData.filter((item) => {
    if (filter === 'All') {
      return true
    }
    return item.method === filter
  })

  return (
    <div>
      <Desktop>
        <Card
          loading={loading}
          bordered={false}
          title='Recent Activity'
          extra={
            <Radio.Group onChange={handleChange} defaultValue="All" buttonStyle="solid">
              <Radio.Button value="All">All</Radio.Button>
              <Radio.Button value="Transfer">Transfer</Radio.Button>
              <Radio.Button value="Mint">Mint</Radio.Button>
              <Radio.Button value="Burn">Burn</Radio.Button>
              <Radio.Button value="Rebase">Rebase</Radio.Button>
            </Radio.Group>
          }
          style={{
            height: '100%',
            marginTop: 32,
          }}
        >
          <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={dataSource}
            pagination={{
              style: {
                marginBottom: 0,
              },
              pageSize: 10,
            }}
          />
        </Card>
      </Desktop>
      <Tablet>
        <Card
          loading={loading}
          bordered={false}
          size='small'
          title='Transactions'
          extra={dropdownGroup}
          style={{
            height: '100%',
            marginTop: 32,
          }}
        >
          <Table
            rowKey={record => record.id}
            size='small'
            rowClassName='tablet-font-size'
            scroll={{ x: 900 }}
            columns={columns}
            dataSource={dataSource}
            pagination={{
              style: {
                marginBottom: 0,
              },
              pageSize: 10,
            }}
          />
        </Card>
      </Tablet>
      <Mobile>
        <Card
          loading={loading}
          bordered={false}
          title='Transactions'
          size='small'
          extra={dropdownGroup}
          style={{
            height: '100%',
            marginTop: 32,
          }}
        >
          <Table
            compact
            rowKey={record => record.id}
            size='small'
            rowClassName='mobile-font-size'
            scroll={{ x: 900 }}
            columns={columns}
            dataSource={dataSource}
            pagination={{
              style: {
                marginBottom: 0,
              },
              pageSize: 10,
            }}
          />
        </Card>
      </Mobile>
    </div>
  )
}

export default TransationsTable
