import React, { useState, Suspense, useEffect } from 'react'
import { useRequest, useModel } from 'umi'
import moment from 'moment'

// === Components === //
import { GridContent } from '@ant-design/pro-layout'
import { Table, Card, Tag, Modal, Descriptions, Row, Col, Tooltip, Spin, message } from 'antd'
import Address from './../../../components/Address'
import { Desktop, Tablet, Mobile } from '@/components/Container/Container'

// === Services === //
import { getReports, updateReportStatus } from './../../../services/api-service'

// === Utils === //
import get from 'lodash/get'
import map from 'lodash/map'
import sum from 'lodash/sum'
import noop from 'lodash/noop'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import { toFixed } from './../../../helper/number-format'
import { getDecimals } from './../../../apollo/client'

// === Hooks === //
import useAdminRole from './../../../hooks/useAdminRole'
import useUserProvider from './../../../hooks/useUserProvider'

// === Constants === //
import CHAINS, { CHIANS_NAME } from '@/constants/chain'

// === Services === //
import { getSignatureHeader } from '@/services/signer-service'
import { isProEnv } from '@/services/env-service'

// === Styles === //
import styles from './reports.less'

const usdtDecimals = getDecimals()

const detailsColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '14rem',
    ellipsis: true,
    render: (text, item, index) => {
      return (
        <a title={text} key={index}>
          {text}
        </a>
      )
    },
  },
  {
    title: 'Assets (Before)',
    dataIndex: 'originalAmount',
    key: 'originalAmount',
    render: value => {
      return <span>{toFixed(value, usdtDecimals, 2)}</span>
    },
  },
  {
    title: 'Assets (After)',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    render: value => {
      return <span>{toFixed(value, usdtDecimals, 2)}</span>
    },
  },
  {
    title: 'Change Assets',
    dataIndex: 'amount',
    key: 'amount',
    render: value => {
      return <span>{toFixed(value, usdtDecimals, 2)}</span>
    },
  },
  {
    title: 'APR (Before)',
    dataIndex: 'originalApr',
    key: 'originalApr',
    width: '6rem',
    render: value => {
      return <span>{(100 * value).toFixed(4)}%</span>
    },
  },
  {
    title: 'APR (After)',
    dataIndex: 'newApr',
    key: 'newApr',
    width: '6rem',
    render: value => {
      return <span>{(100 * value).toFixed(4)}%</span>
    },
  },
  {
    title: 'Profit (Before)',
    dataIndex: 'originalGain',
    key: 'originalGain',
    render: value => {
      return <span>{value.toFixed(2)}</span>
    },
  },
  {
    title: 'Profit (After)',
    dataIndex: 'newGain',
    key: 'newGain',
    render: value => {
      return <span>{value.toFixed(2)}</span>
    },
  },
  {
    title: 'Change Profits',
    dataIndex: 'deltaGain',
    key: 'deltaGain',
    render: value => {
      return <span>{value.toFixed(2)}</span>
    },
  },
  {
    title: 'Operate Gas Fee',
    dataIndex: 'operateFee',
    key: 'operateFee',
    render: value => {
      return <span>{value.toFixed(2)}</span>
    },
  },
  {
    title: 'Exchange Loss',
    dataIndex: 'exchangeLoss',
    key: 'exchangeLoss',
    render: value => {
      return <span>{value.toFixed(2)}</span>
    },
  },
  {
    title: 'Allocation Cost',
    dataIndex: 'operateLoss',
    key: 'operateLoss',
    render: value => {
      return <span>{value.toFixed(2)}</span>
    },
  },
  {
    title: 'Harvest Gas Fee',
    dataIndex: 'harvestFee',
    key: 'harvestFee',
    width: '8rem',
    render: value => {
      return <span>{value.toFixed(2)}</span>
    },
  },
]

const Reports = () => {
  const { initialState } = useModel('@@initialState')
  const [showIndex, setShowIndex] = useState(-1)
  const { userProvider } = useUserProvider()

  const [showWarningModal, setShowWarningModal] = useState(false)

  const { data, error, loading, pagination, refresh } = useRequest(
    ({ current, pageSize }) => {
      return getReports({ chainId: initialState.chain }, (current - 1) * pageSize, pageSize)
    },
    {
      paginated: true,
      formatResult: resp => {
        const { content } = resp
        return {
          total: resp.totalElements,
          list: map(content, i => {
            return {
              ...i,
              investStrategies: JSON.parse(i.investStrategies),
              optimizeResult: JSON.parse(i.optimizeResult),
            }
          }),
        }
      },
    },
  )
  const { isAdmin, loading: roleLoading, error: roleError } = useAdminRole(initialState.address)
  /**
   * 驳回调仓报告
   * @param {string} id
   */
  const reportCancel = async id => {
    const signer = userProvider.getSigner()
    const close = message.loading('on submit', 60 * 60)
    const headers = await getSignatureHeader(initialState.address, signer).catch(close)
    updateReportStatus(id, true, headers)
      .then(refresh)
      .catch(noop)
      .finally(close)
  }

  const changeNetwork = async id => {
    const targetNetwork = find(CHAINS, { id })
    console.log('targetNetwork=', targetNetwork)
    if (isEmpty(targetNetwork)) return
    const ethereum = window.ethereum
    const data = [
      {
        chainId: `0x${Number(targetNetwork.id).toString(16)}`,
        chainName: targetNetwork.name,
        nativeCurrency: targetNetwork.nativeCurrency,
        rpcUrls: [targetNetwork.rpcUrl],
        blockExplorerUrls: [targetNetwork.blockExplorer],
      },
    ]
    console.log('data', data)

    let switchTx
    try {
      switchTx = await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: data[0].chainId }],
      })
    } catch (switchError) {
      try {
        switchTx = await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: data,
        })
      } catch (addError) {
        console.log('addError=', addError)
      }
    }

    if (switchTx) {
      console.log(switchTx)
    }
  }

  const hideModal = () => {
    setShowWarningModal(false)
  }

  useEffect(() => {
    const { chain, walletChainId } = initialState
    // 生产环境下
    if (isProEnv(ENV_INDEX)) {
      // 链不一致，必须提示
      if (!isEmpty(chain) && !isEmpty(walletChainId) && !isEqual(chain, walletChainId)) {
        setShowWarningModal(true)
      } else {
        setShowWarningModal(false)
      }
    } else {
      // 非生产环境下
      if (!isEmpty(chain) && !isEmpty(walletChainId) && !isEqual(chain, walletChainId)) {
        // 链如果等于31337
        if (isEqual(walletChainId, '31337')) {
          if (roleError) {
            setShowWarningModal(true)
          } else {
            setShowWarningModal(false)
          }
        } else {
          setShowWarningModal(true)
        }
      } else {
        setShowWarningModal(false)
      }
    }
  }, [initialState, roleError])

  if (loading) {
    return <div>loading...</div>
  }
  if (error) {
    return <div>{error.message}</div>
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      width: '11rem',
      render: (text, item, index) => <a onClick={() => setShowIndex(index)}>Report-{text}</a>,
    },
    {
      title: 'Generate Time',
      dataIndex: 'geneTime',
      key: 'geneTime',
      render: text => moment(text).format('yyyy-MM-DD HH:mm:ss'),
    },
    {
      title: 'Operation Type',
      key: 'mode',
      dataIndex: 'mode',
      render: text => {
        if (text === 1)
          return (
            <span>
              <Tag key={text} color='#2db7f5'>
                DoHardwork
              </Tag>
            </span>
          )
        if (text === 2)
          return (
            <span>
              <Tag key={text} color='#87d068'>
                Allocation
              </Tag>
            </span>
          )
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: text => {
        if (text === 0) return <span key={text}>estimation</span>
        if (text === 1) return <span key={text}>pre-execution estimation</span>
      },
    },
    {
      title: 'Created Time',
      key: 'fetchTime',
      dataIndex: 'fetchTime',
      render: text =>
        moment(text)
          .locale('en')
          .fromNow(),
    },
    {
      width: '11rem',
      render: (text, record, index) => {
        const { id, reject, rejectTime, rejecter, type, geneTime } = record
        let rejectElement = null
        // 如果报告超过1天，则不能进行驳回
        if (moment(geneTime).isBetween(moment().subtract(1, 'days'), moment())) {
          if (isAdmin && type === 0) {
            if (roleLoading) {
              rejectElement = <Spin size='small' />
            } else {
              if (!reject) {
                rejectElement = (
                  <a className={styles.danger} onClick={() => reportCancel(id)}>
                    Reject
                  </a>
                )
              }
            }
          }
        }
        if (reject) {
          rejectElement = (
            <Tooltip
              title={
                <div>
                  <span>
                    Rejecter:
                    <Address size='short' wrapClassName='anticon' address={rejecter || ''} />
                  </span>
                  <br />
                  <span>RejectTime: {moment(rejectTime).format('yyyy-MM-DD HH:mm:ss')}</span>
                </div>
              }
            >
              <a className={styles.disabled}>Rejected</a>
            </Tooltip>
          )
        }
        return (
          <Row>
            <Col md={12}>
              <a onClick={() => setShowIndex(index)}>View</a>
            </Col>
            <Col md={12}>{rejectElement}</Col>
          </Row>
        )
      },
    },
  ]
  const currentReport = get(data.list, showIndex, {})
  const { optimizeResult = {}, investStrategies = {}, isExec, forcedExecuted } = currentReport
  const {
    address,
    name,
    deltaAssets,
    deltaGain,
    exchangeLoss,
    jac,
    newApr,
    newGain,
    operateFee,
    operateLoss,
    originalApr,
    originalGain,
    fun,
    durationDays,
    harvestFee,
    totalAssets,
    newTotalAssets,
  } = optimizeResult

  const displayData = map(address, (strategy, index) => {
    return {
      key: strategy,
      name: name[index],
      deltaGain: deltaGain[index],
      deltaAssets: deltaAssets[index],
      exchangeLoss: exchangeLoss[index],
      jac: jac[index],
      newApr: newApr[index],
      newGain: newGain[index],
      operateFee: operateFee[index],
      operateLoss: operateLoss[index],
      originalApr: originalApr[index],
      originalGain: originalGain[index],
      amount: get(investStrategies, `${strategy}.amount`, '0'),
      totalAmount: get(investStrategies, `${strategy}.totalAmount`, '0'),
      originalAmount: get(investStrategies, `${strategy}.originalAmount`, '0'),
      apy: get(investStrategies, `${strategy}.apy`, 0),
      harvestFee: harvestFee[index],
    }
  })
  return (
    <GridContent>
      <Suspense fallback={null}>
        <Desktop>
          <Card loading={loading} bordered={false} title='Allocation Reports'>
            <Table
              rowKey={record => record.id}
              columns={columns}
              dataSource={data.list}
              pagination={{
                ...pagination,
                showSizeChanger: false,
              }}
            />
          </Card>
        </Desktop>
        <Tablet>
          <Card loading={loading} bordered={false} title='Allocation Reports' size='small'>
            <Table
              rowKey={record => record.id}
              columns={columns}
              size='small'
              dataSource={data.list}
              pagination={{
                ...pagination,
                showSizeChanger: false,
              }}
            />
          </Card>
        </Tablet>
        <Mobile>
          <Card loading={loading} bordered={false} title='Allocation Reports' size='small'>
            <Table
              rowKey={record => record.id}
              columns={columns}
              size='small'
              dataSource={data.list}
              pagination={{
                ...pagination,
                showSizeChanger: false,
              }}
            />
          </Card>
        </Mobile>
      </Suspense>
      <Modal
        title={''}
        style={{ top: 20 }}
        visible={showIndex !== -1}
        footer={null}
        onCancel={() => setShowIndex(-1)}
        width='1200px'
      >
        <Row>
          <Col span={24}>
            <Desktop>
              <Descriptions
                title={<span style={{ color: '#fff' }}>Report Details</span>}
                labelStyle={{ color: '#fff' }}
                contentStyle={{ color: '#fff' }}
              >
                <Descriptions.Item
                  label='Recommendation'
                  contentStyle={{ color: isExec === 1 ? 'green' : 'red', fontWeight: 'bold' }}
                >
                  {isExec === 0 && `Not execute${forcedExecuted ? ' (enforced)' : ''}`}
                  {isExec === 1 && 'Execute'}
                </Descriptions.Item>
                <Descriptions.Item label='Calculation Period'>
                  {durationDays} days
                </Descriptions.Item>
                <Descriptions.Item label='Report Time'>
                  {moment(currentReport.geneTime).format('yyyy-MM-DD HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label='Allocation Profit'>
                  {(-1 * fun).toFixed(6)}
                </Descriptions.Item>
                <Descriptions.Item label='Total Harvest Gas Fee'>
                  {sum(harvestFee).toFixed(6)}
                </Descriptions.Item>
                <br />
                <Descriptions.Item label='Change Profits'>
                  {(sum(newGain) - sum(originalGain)).toFixed(6)}
                </Descriptions.Item>
                <Descriptions.Item label='Profits Before'>
                  {sum(originalGain).toFixed(6)} (APR:
                  {totalAssets === undefined
                    ? 0
                    : ((365 * 100 * sum(originalGain)) / (totalAssets * durationDays)).toFixed(2)}
                  %)
                </Descriptions.Item>
                <Descriptions.Item label='Profits After'>
                  {sum(newGain).toFixed(6)} (APR:
                  {newTotalAssets === undefined || totalAssets === undefined
                    ? 0
                    : (
                        (365 * 100 * sum(newGain)) /
                        ((newTotalAssets ? newTotalAssets : totalAssets - sum(exchangeLoss)) *
                          durationDays)
                      ).toFixed(2)}
                  %)
                </Descriptions.Item>

                <Descriptions.Item label='Allocation Cost'>
                  {sum(operateLoss).toFixed(6)}
                </Descriptions.Item>
                <Descriptions.Item label='Operate Gas Fee'>
                  {sum(operateFee).toFixed(6)}
                </Descriptions.Item>
                <Descriptions.Item label='Exchange Loss'>
                  {sum(exchangeLoss).toFixed(6)}
                </Descriptions.Item>
              </Descriptions>
            </Desktop>
            <Tablet>
              <Descriptions
                size='small'
                title={<span style={{ color: '#fff' }}>Report Details</span>}
                labelStyle={{ color: '#fff', fontSize: '0.3rem' }}
                contentStyle={{ color: '#fff', fontSize: '0.3rem' }}
              >
                <Descriptions.Item
                  label='Recommendation'
                  contentStyle={{ color: isExec === 1 ? 'green' : 'red', fontWeight: 'bold' }}
                >
                  {isExec === 0 && `Not execute${forcedExecuted ? ' (enforced)' : ''}`}
                  {isExec === 1 && 'Execute'}
                </Descriptions.Item>
                <Descriptions.Item label='Calculation Period'>
                  {durationDays} days
                </Descriptions.Item>
                <Descriptions.Item label='Report Time'>
                  {moment(currentReport.geneTime).format('yyyy-MM-DD HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label='Allocation Profit'>
                  {(-1 * fun).toFixed(6)}
                </Descriptions.Item>
                <Descriptions.Item label='Total Harvest Gas Fee'>
                  {sum(harvestFee).toFixed(6)}
                </Descriptions.Item>
                <br />
                <Descriptions.Item label='Change Profits'>
                  {(sum(newGain) - sum(originalGain)).toFixed(6)}
                </Descriptions.Item>
                <Descriptions.Item label='Profits Before'>
                  {sum(originalGain).toFixed(6)} (APR:
                  {totalAssets === undefined
                    ? 0
                    : ((365 * 100 * sum(originalGain)) / (totalAssets * durationDays)).toFixed(2)}
                  %)
                </Descriptions.Item>
                <Descriptions.Item label='Profits After'>
                  {sum(newGain).toFixed(6)} (APR:
                  {newTotalAssets === undefined || totalAssets === undefined
                    ? 0
                    : (
                        (365 * 100 * sum(newGain)) /
                        ((newTotalAssets ? newTotalAssets : totalAssets - sum(exchangeLoss)) *
                          durationDays)
                      ).toFixed(2)}
                  %)
                </Descriptions.Item>

                <Descriptions.Item label='Allocation Cost'>
                  {sum(operateLoss).toFixed(6)}
                </Descriptions.Item>
                <Descriptions.Item label='Operate Gas Fee'>
                  {sum(operateFee).toFixed(6)}
                </Descriptions.Item>
                <Descriptions.Item label='Exchange Loss'>
                  {sum(exchangeLoss).toFixed(6)}
                </Descriptions.Item>
              </Descriptions>
            </Tablet>
            <Mobile>
              <Descriptions
                size='small'
                title={<span style={{ color: '#fff' }}>Report Details</span>}
                labelStyle={{ color: '#fff' }}
                contentStyle={{ color: '#fff' }}
              >
                <Descriptions.Item
                  label='Recommendation'
                  contentStyle={{ color: isExec === 1 ? 'green' : 'red', fontWeight: 'bold' }}
                >
                  {isExec === 0 && `Not execute${forcedExecuted ? ' (enforced)' : ''}`}
                  {isExec === 1 && 'Execute'}
                </Descriptions.Item>
                <Descriptions.Item label='Calculation Period'>
                  {durationDays} days
                </Descriptions.Item>
                <Descriptions.Item label='Report Time'>
                  {moment(currentReport.geneTime).format('yyyy-MM-DD HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label='Allocation Profit'>
                  {(-1 * fun).toFixed(6)}
                </Descriptions.Item>
                <Descriptions.Item label='Total Harvest Gas Fee'>
                  {sum(harvestFee).toFixed(6)}
                </Descriptions.Item>
                <Descriptions.Item label='Change Profits'>
                  {(sum(newGain) - sum(originalGain)).toFixed(6)}
                </Descriptions.Item>
                <Descriptions.Item label='Profits Before'>
                  {sum(originalGain).toFixed(6)} (APR:
                  {totalAssets === undefined
                    ? 0
                    : ((365 * 100 * sum(originalGain)) / (totalAssets * durationDays)).toFixed(2)}
                  %)
                </Descriptions.Item>
                <Descriptions.Item label='Profits After'>
                  {sum(newGain).toFixed(6)} (APR:
                  {newTotalAssets === undefined || totalAssets === undefined
                    ? 0
                    : (
                        (365 * 100 * sum(newGain)) /
                        ((newTotalAssets ? newTotalAssets : totalAssets - sum(exchangeLoss)) *
                          durationDays)
                      ).toFixed(2)}
                  %)
                </Descriptions.Item>

                <Descriptions.Item label='Allocation Cost'>
                  {sum(operateLoss).toFixed(6)}
                </Descriptions.Item>
                <Descriptions.Item label='Operate Gas Fee'>
                  {sum(operateFee).toFixed(6)}
                </Descriptions.Item>
                <Descriptions.Item label='Exchange Loss'>
                  {sum(exchangeLoss).toFixed(6)}
                </Descriptions.Item>
              </Descriptions>
            </Mobile>
          </Col>

          <Col span={24}>
            <Desktop>
              <Table
                bordered
                columns={detailsColumns}
                dataSource={displayData}
                scroll={{ x: 1300, y: 400 }}
                pagination={false}
              />
            </Desktop>
            <Tablet>
              <Table
                bordered
                size='small'
                columns={detailsColumns}
                dataSource={displayData}
                scroll={{ x: 1300, y: 400 }}
                pagination={false}
              />
            </Tablet>
            <Mobile>
              <Table
                bordered
                size='small'
                columns={detailsColumns}
                dataSource={displayData}
                scroll={{ x: 1300, y: 400 }}
                pagination={false}
              />
            </Mobile>
          </Col>
        </Row>
      </Modal>
      <Modal
        title="Set metamask's network to current?"
        visible={showWarningModal}
        onOk={() => changeNetwork(initialState.chain)}
        onCancel={hideModal}
        okText='ok'
        cancelText='close'
      >
        <p>
          Metamask Chain:{' '}
          <span style={{ color: 'red', fontWeight: 'bold' }}>
            {CHIANS_NAME[initialState.walletChainId] || initialState.walletChainId}
          </span>
        </p>
        <p>
          Current Chain:{' '}
          <span style={{ color: 'red', fontWeight: 'bold' }}>
            {CHIANS_NAME[initialState.chain] || initialState.chain}
          </span>
        </p>
        {!isEmpty(roleError) && (
          <p>
            Message：<span style={{ color: 'red', fontWeight: 'bold' }}>Error Vault address!</span>
          </p>
        )}
      </Modal>
    </GridContent>
  )
}

export default Reports
