import React from 'react'

// === Components === //
import { Empty } from 'antd'
import { PieEchart } from '@/components/echarts'

// === Utils === //
import numeral from 'numeral'
import BN from 'bignumber.js'
import { useModel } from 'umi'
import { toFixed } from '@/utils/number-format'
import { reduce, mapValues, groupBy, values, filter, isEmpty, map } from 'lodash'

// === Styles === //
import styles from '../style.less'

const ProportionSales = ({ strategyMap, tokenDecimals, displayDecimals, visitData = {}, unit }) => {
  const { strategies = [], totalValueInVault = '0' } = visitData
  const { initialState } = useModel('@@initialState')
  const suffix = ` (${unit})`

  if (!initialState.chain) return null

  const total = reduce(
    strategies,
    (rs, o) => {
      return rs.plus(o.totalValue)
    },
    BN(0)
  )
  const tvl = BN(totalValueInVault).plus(total)
  const groupData = groupBy(
    filter(strategies, i => i.totalValue > 0),
    'protocol'
  )
  const vaultDisplayValue = toFixed(tvl, tokenDecimals, displayDecimals)
  if ((isEmpty(groupData) && vaultDisplayValue <= 0) || isNaN(vaultDisplayValue)) return <Empty style={{ marginTop: '4rem' }} />

  const tableData = [
    ...values(
      mapValues(groupData, (o, key) => {
        const amount = reduce(
          o,
          (rs, ob) => {
            return rs.plus(ob.totalValue)
          },
          BN(0)
        )
        return {
          Protocol: `${strategyMap[initialState.chain][key]}${suffix}`,
          amount: toFixed(amount, tokenDecimals, displayDecimals)
        }
      })
    ),
    {
      Protocol: `Vault${suffix}`,
      amount: toFixed(totalValueInVault, tokenDecimals, displayDecimals)
    }
  ]

  var option = {
    tooltip: {
      trigger: 'item'
    },
    grid: {
      top: 'top'
    },
    legend: {
      bottom: '0%',
      left: 'center',
      icon: 'circle',
      itemWidth: 10,
      textStyle: {
        rich: {
          a: {
            fontSize: 12,
            verticalAlign: 'top',
            align: 'center',
            color: '#F2F3F4',
            padding: [10, 0, 0, 0],
            lineHeight: 16
          },
          b: {
            fontSize: 10,
            align: 'left',
            color: '#FFF',
            padding: [16, 0, 0, 0],
            lineHeight: 12
          }
        }
      },
      formatter: name => {
        let data = tableData
        let total = 0
        let target
        for (let i = 0, l = data.length; i < l; i++) {
          total += 1 * data[i].amount
          if (data[i].Protocol == name) {
            target = 1 * data[i].amount
          }
        }
        let arr = ['{a|' + name + '}', '{b|' + ((target / total) * 100).toFixed(2) + '%}']
        return arr.join('\n')
      }
    },
    color: ['#A68EFE', '#2ec7c9', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa', '#07a2a4'],
    title: {
      text: numeral(toFixed(tvl, tokenDecimals, displayDecimals)).format('0.[0000]a'),
      left: 'center',
      top: '40%',
      textStyle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 700,
        align: 'center'
      }
    },
    graphic: {
      type: 'text',
      left: 'center',
      top: '35%',
      style: {
        text: `TVL${suffix}`,
        textAlign: 'center',
        fill: '#A0A0A0',
        fontSize: 12,
        fontWeight: 400
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['35%', '60%'],
        center: ['50%', '40%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: map(tableData, item => {
          return {
            name: item.Protocol,
            value: item.amount
          }
        })
      }
    ]
  }

  return (
    <div className={styles.chartWrapper}>
      <PieEchart option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}

export default ProportionSales
