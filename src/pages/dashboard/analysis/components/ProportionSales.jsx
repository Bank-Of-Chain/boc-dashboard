import { Card } from 'antd'
import numeral from 'numeral'
import { Donut } from '@ant-design/charts'
import React from 'react'

// === Utils === //
import { sumBy, mapValues, groupBy, values } from 'lodash'
// === Styles === //
import styles from '../style.less'

const ProportionSales = ({ loading, visitData }) => {
  const { strategies } = visitData
  const groupData = groupBy(strategies, 'protocol.id')
  const tableData = values(
    mapValues(groupData, (o, key) => {
      const amount = sumBy(o, 'debt.amount')
      return { name: key, amount }
    }),
  )
  console.log('tableData=', tableData)
  return (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title='Funding Ratio'
      style={{
        height: '100%',
      }}
    >
      <div>
        <Donut
          forceFit
          height={340}
          radius={0.9}
          angleField='amount'
          colorField='name'
          data={tableData}
          legend={{
            visible: false,
          }}
          label={{
            visible: true,
            type: 'spider',
            formatter: (text, item) => {
              // eslint-disable-next-line no-underscore-dangle
              return `${item._origin.x}: ${numeral(item._origin.y).format('0,0')}`
            },
          }}
          statistic={{
            totalLabel: 'TVL',
          }}
        />
      </div>
    </Card>
  )
}

export default ProportionSales
