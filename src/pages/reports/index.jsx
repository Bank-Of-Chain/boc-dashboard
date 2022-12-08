import React, { useState, Suspense, useEffect } from 'react'

// === Components === //
import Address from '@/components/Address'
import { GridContent } from '@ant-design/pro-layout'
import { FallOutlined, RiseOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'
import { Table, Card, Tag, Modal, Descriptions, Row, Col, Tooltip, Spin, message, Divider, Switch, Space } from 'antd'
import VaultChange from '@/components/VaultChange'

// === Services === //
import { getReports, updateReportStatus } from '@/services/api-service'

// === Utils === //
import moment from 'moment'
import get from 'lodash/get'
import map from 'lodash/map'
import sum from 'lodash/sum'
import BN from 'bignumber.js'
import noop from 'lodash/noop'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import { useRequest, useModel } from 'umi'
import { toFixed } from '@/utils/number-format'
import { changeNetwork } from '@/utils/network'
import { BigNumber } from 'ethers'
import { isArray } from 'lodash'

// === Hooks === //
import useAdminRole from '@/hooks/useAdminRole'
import useWallet from '@/hooks/useWallet'

// === Constants === //
import { CHIANS_NAME } from '@/constants/chain'
import { ETHI_DISPLAY_DECIMALS } from '@/constants/ethi'
import { VAULT_TYPE, TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'

// === Services === //
import { isProEnv } from '@/services/env-service'
import { getSignatureHeader } from '@/services/signer-service'

// === Styles === //
import styles from './style.less'

const fixedDecimals = BN(1e18)

const Reports = () => {
  const { initialState } = useModel('@@initialState')
  const [showIndex, setShowIndex] = useState(-1)
  const { userProvider, getWalletName } = useWallet()
  const [isRedUp, setIsRedUp] = useState(true)
  const deviceType = useDeviceType()

  const styleMap = {
    [isRedUp]: styles.danger,
    [!isRedUp]: styles.success
  }

  const displayDecimals = {
    [VAULT_TYPE.USDi]: TOKEN_DISPLAY_DECIMALS,
    [VAULT_TYPE.ETHi]: ETHI_DISPLAY_DECIMALS
  }[initialState.vault]

  const [showWarningModal, setShowWarningModal] = useState(false)

  const { data, error, run, loading, pagination, refresh } = useRequest(
    ({ current, pageSize }) => {
      return getReports(
        {
          chainId: initialState.chain,
          vaultAddress: initialState.vaultAddress
        },
        (current - 1) * pageSize,
        pageSize
      ).catch(() => [])
    },
    {
      manual: true,
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
              loss: JSON.parse(i.loss)
            }
          })
        }
      }
    }
  )

  useEffect(() => {
    run({
      ...pagination,
      current: 1
    })
  }, [initialState.vault])

  const { isAdmin, loading: roleLoading, error: roleError } = useAdminRole(initialState.address)

  /**
   * Reject allocation report
   * @param {string} id
   */
  const reportCancel = async id => {
    const signer = userProvider.getSigner()
    const close = message.loading('on submit', 60 * 60)
    const headers = await getSignatureHeader(initialState.address, signer).catch(close)
    updateReportStatus(initialState.chain, initialState.vaultAddress, id, true, headers).then(refresh).catch(noop).finally(close)
  }

  const hideModal = () => {
    setShowWarningModal(false)
  }

  const iconRender = flag => {
    return flag ? <RiseOutlined /> : <FallOutlined />
  }

  useEffect(() => {
    const { chain, walletChainId } = initialState
    // Do not show in fork chain
    if (!isEmpty(chain) && !isEmpty(walletChainId) && !isEqual(chain, walletChainId)) {
      if (!isProEnv(ENV_INDEX) && isEqual(walletChainId, '31337')) {
        setShowWarningModal(false)
        return
      }
      setShowWarningModal(true)
    } else {
      setShowWarningModal(false)
    }
  }, [initialState])

  useEffect(() => {
    // Show modal when load role error
    if (roleError) {
      setShowWarningModal(true)
    }
  }, [roleError])

  if (!data) {
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
      render: (text, item, index) => <a onClick={() => setShowIndex(index)}>Report-{text}</a>
    },
    {
      title: 'Generate Time',
      dataIndex: 'geneTime',
      key: 'geneTime',
      render: text => moment(text).format('yyyy-MM-DD HH:mm:ss')
    },
    {
      title: 'Operation Type',
      key: 'mode',
      dataIndex: 'mode',
      render: text => {
        if (text === 1)
          return (
            <span>
              <Tag key={text} color="#2db7f5">
                DoHardwork
              </Tag>
            </span>
          )
        if (text === 2)
          return (
            <span>
              <Tag key={text} color="#87d068">
                Allocation
              </Tag>
            </span>
          )
      }
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: text => {
        if (text === 0) return <span key={text}>estimation</span>
        if (text === 1) return <span key={text}>pre-execution estimation</span>
        if (text === 2) return <span key={text}>executed</span>
      }
    },
    {
      title: 'Created Time',
      key: 'fetchTime',
      dataIndex: 'fetchTime',
      render: text => moment(text).locale('en').fromNow()
    },
    {
      title: 'Operation',
      width: '10rem',
      render: (text, record, index) => {
        const { id, isReject, rejectTime, rejecter, type, geneTime } = record
        let rejectElement = null
        // Cannot reject report passed 1 day
        if (moment(geneTime).isBetween(moment().subtract(1, 'days'), moment())) {
          if (isAdmin && type === 0) {
            if (roleLoading) {
              rejectElement = <Spin size="small" />
            } else {
              if (!isReject) {
                rejectElement = (
                  <a className={styles.danger} onClick={() => reportCancel(id)}>
                    Reject
                  </a>
                )
              }
            }
          }
        }
        if (isReject) {
          rejectElement = (
            <Tooltip
              title={
                <div>
                  <span>
                    Rejecter:
                    <Address size="short" wrapClassName="anticon" address={rejecter || ''} />
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
              <a style={{ marginRight: '1rem' }} onClick={() => setShowIndex(index)}>
                View
              </a>
            </Col>
            <Col md={12}>{rejectElement}</Col>
          </Row>
        )
      }
    }
  ]
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
      }
    },
    {
      title: 'Assets (Before)',
      dataIndex: 'originalAmount',
      key: 'originalAmount',
      render: value => {
        return <span>{toFixed(value, fixedDecimals, displayDecimals)}</span>
      }
    },
    {
      title: 'Assets (After)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: value => {
        return <span>{toFixed(value, fixedDecimals, displayDecimals)}</span>
      }
    },
    {
      title: 'Change Assets',
      dataIndex: 'amount',
      key: 'amount',
      render: value => {
        return <span>{toFixed(value, fixedDecimals, displayDecimals)}</span>
      }
    },
    {
      title: 'APR (Before)',
      dataIndex: 'originalApr',
      key: 'originalApr',
      width: '6rem',
      render: value => {
        return <span>{(100 * value).toFixed(4)}%</span>
      }
    },
    {
      title: 'APR (After)',
      dataIndex: 'newApr',
      key: 'newApr',
      width: '6rem',
      render: value => {
        return <span>{(100 * value).toFixed(4)}%</span>
      }
    },
    {
      title: 'Profit (Before)',
      dataIndex: 'originalGain',
      key: 'originalGain',
      render: value => {
        return <span>{value.toFixed(displayDecimals)}</span>
      }
    },
    {
      title: 'Profit (After)',
      dataIndex: 'newGain',
      key: 'newGain',
      render: value => {
        return <span>{value.toFixed(displayDecimals)}</span>
      }
    },
    {
      title: 'Change Profits',
      dataIndex: 'deltaGain',
      key: 'deltaGain',
      render: value => {
        return <span>{value.toFixed(displayDecimals)}</span>
      }
    },
    {
      title: 'Operate Gas Fee',
      dataIndex: 'operateFee',
      key: 'operateFee',
      render: value => {
        return <span>{value.toFixed(displayDecimals)}</span>
      }
    },
    {
      title: 'Exchange Loss',
      dataIndex: 'exchangeLoss',
      key: 'exchangeLoss',
      render: value => {
        return <span>{value.toFixed(displayDecimals)}</span>
      }
    },
    {
      title: 'Allocation Cost',
      dataIndex: 'operateLoss',
      key: 'operateLoss',
      render: value => {
        return <span>{value.toFixed(displayDecimals)}</span>
      }
    },
    {
      title: 'Harvest Gas Fee (Before)',
      dataIndex: 'originalHarvestFee',
      key: 'originalHarvestFee',
      render: value => {
        return <span>{value.toFixed(displayDecimals)}</span>
      }
    },
    {
      title: 'Harvest Gas Fee (After)',
      dataIndex: 'harvestFee',
      key: 'harvestFee',
      render: value => {
        return <span>{value.toFixed(displayDecimals)}</span>
      }
    }
  ]
  const currentReport = get(data.list, showIndex, {})
  console.log('currentReport=', currentReport)
  const { optimizeResult = {}, investStrategies = {}, loss = {}, isExec, forcedExecuted } = currentReport
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
    totalDeltaGain = 0,
    durationDays,
    originalHarvestFee = [],
    harvestFee,
    totalAssets,
    newTotalAssets
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
      originalHarvestFee: originalHarvestFee[index] || 0
    }
  })
  const aprBefore = totalAssets === undefined ? 0 : ((365 * 100 * sum(originalGain)) / (totalAssets * durationDays)).toFixed(2)
  const aprAfter =
    newTotalAssets === undefined || totalAssets === undefined
      ? 0
      : ((365 * 100 * sum(newGain)) / ((newTotalAssets ? newTotalAssets : totalAssets - sum(exchangeLoss)) * durationDays)).toFixed(2)
  const aprVariation = (aprAfter - aprBefore).toFixed(2)

  const sumOriginalHarvestFee = sum(originalHarvestFee)
  const sumHarvestFee = sum(harvestFee)
  const sumHarvestFeeVariation = sumHarvestFee - sumOriginalHarvestFee

  const sumOriginalGain = sum(originalGain)
  const sumNewGain = sum(newGain)
  const sumGainVariation = sumNewGain - sumOriginalGain

  const tvlChangeColumns = [
    {
      title: 'Vaule Assets Before',
      dataIndex: 'assetsBefore',
      key: 'assetsBefore',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, displayDecimals)}</span>
      }
    },
    {
      title: 'Vaule Assets After',
      dataIndex: 'assetsAfter',
      key: 'assetsAfter',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, displayDecimals)}</span>
      }
    },
    {
      title: 'Total Loss',
      dataIndex: 'totalLoss',
      key: 'totalLoss',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, displayDecimals)}</span>
      }
    },
    {
      title: 'Total Gas Fees',
      dataIndex: 'totalGasFee',
      key: 'totalGasFee',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, 6)}</span>
      }
    }
  ]

  const tvlChangeData = [
    {
      assetsBefore: get(loss, 'vaultAssetsBefore', '0'),
      assetsAfter: get(loss, 'vaultAssetsAfter', '0'),
      totalLoss: get(loss, 'totalLoss', '0'),
      totalGasFee: get(loss, 'totalGasFees', '0')
    }
  ]

  const redeemChangeColumns = [
    {
      title: 'Redeem Strategy',
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
      }
    },
    {
      title: `Before（${loss?.currency}）`,
      dataIndex: 'before',
      key: 'before',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, displayDecimals)}</span>
      }
    },
    {
      title: `After（${loss?.currency}）`,
      dataIndex: 'after',
      key: 'after',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, displayDecimals)}</span>
      }
    },
    {
      title: `Redeem Assets Value（${loss?.currency}）`,
      dataIndex: 'redeemValue',
      key: 'redeemValue',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, displayDecimals)}</span>
      }
    },
    {
      title: `Loss（${loss?.currency}）`,
      dataIndex: 'loss',
      key: 'loss',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, displayDecimals)}</span>
      }
    },
    {
      title: 'Gas Fees(ETH)',
      dataIndex: 'gasFees',
      key: 'gasFees',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, displayDecimals)}</span>
      }
    },
    {
      title: 'Gas Used',
      dataIndex: 'gasUsed',
      key: 'gasUsed'
    },
    {
      title: 'Gas Price(Gwei)',
      dataIndex: 'gasPrice',
      key: 'gasPrice',
      render: value => {
        const decimals = BigNumber.from(10).pow(9)
        return <span title={toFixed(value, decimals)}>{toFixed(value, decimals, 6)}</span>
      }
    },
    {
      title: 'Txn Hash',
      dataIndex: 'txnHash',
      key: 'txnHash',
      width: '14rem',
      ellipsis: true,
      render: text => (
        <a target="_blank" rel="noreferrer" href={`${CHAIN_BROWSER_URL[initialState.chain]}/tx/${text}`}>
          {text}
        </a>
      )
    }
  ]

  const redeemChangeData = get(loss, 'redeem.info', [])

  const swapChangeColumns = [
    {
      title: 'Path',
      dataIndex: 'fromTokenName',
      key: 'fromTokenName',
      render: (text, item) => {
        return (
          <Space>
            <a target="_blank" rel="noreferrer" href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${item.fromToken}`}>
              {item.fromTokenName}
            </a>
            <ArrowRightOutlined />
            <a target="_blank" rel="noreferrer" href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${item.toToken}`}>
              {item.toTokenName}
            </a>
          </Space>
        )
      }
    },
    {
      title: 'From Amount',
      dataIndex: 'fromAmount',
      key: 'fromAmount',
      render: (value, item) => {
        const decimals = BigNumber.from(10).pow(item.fromTokenDecimal)
        return <span title={toFixed(value, decimals)}>{toFixed(value, decimals, displayDecimals)}</span>
      }
    },
    {
      title: `From Token Price（${loss?.currency}）`,
      dataIndex: 'fromTokenPriceRate',
      key: 'fromTokenPriceRate',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, 6)}</span>
      }
    },
    {
      title: 'To Amount',
      dataIndex: 'toAmount',
      key: 'toAmount',
      render: (value, item) => {
        const decimals = BigNumber.from(10).pow(item.toTokenDecimal)
        return <span title={toFixed(value, decimals)}>{toFixed(value, decimals, displayDecimals)}</span>
      }
    },
    {
      title: `To Token Price（${loss?.currency}）`,
      dataIndex: 'toTokenPriceRate',
      key: 'toTokenPriceRate',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, 6)}</span>
      }
    },
    {
      title: `Loss（${loss?.currency}）`,
      dataIndex: 'loss',
      key: 'loss',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, displayDecimals)}</span>
      }
    },
    {
      title: 'Gas Fees(ETH)',
      dataIndex: 'gasFees',
      key: 'gasFees',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, 6)}</span>
      }
    },
    {
      title: 'Gas Used',
      dataIndex: 'gasUsed',
      key: 'gasUsed'
    },
    {
      title: 'Gas Price(Gwei)',
      dataIndex: 'gasPrice',
      key: 'gasPrice',
      render: value => {
        const decimals = BigNumber.from(10).pow(9)
        return <span title={toFixed(value, decimals)}>{toFixed(value, decimals, 6)}</span>
      }
    },
    {
      title: 'Path',
      dataIndex: 'exchangeName',
      key: 'exchangeName',
      render: value => {
        if (isArray(value)) return value.join(' ')
        return value
      }
    },
    {
      title: 'Txn Hash',
      dataIndex: 'txnHash',
      key: 'txnHash',
      width: '14rem',
      ellipsis: true,
      render: text => (
        <a target="_blank" rel="noreferrer" href={`${CHAIN_BROWSER_URL[initialState.chain]}/tx/${text}`}>
          {text}
        </a>
      )
    }
  ]

  const swapChangeData = get(loss, 'exchange.info', [])

  const lendChangeColumns = [
    {
      title: 'Lend Strategy',
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
      }
    },
    {
      title: `Before（${loss?.currency}）`,
      dataIndex: 'before',
      key: 'before',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, displayDecimals)}</span>
      }
    },
    {
      title: `After（${loss?.currency}）`,
      dataIndex: 'after',
      key: 'after',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, displayDecimals)}</span>
      }
    },
    {
      title: `Lend Assets Value（${loss?.currency}）`,
      dataIndex: 'lendValue',
      key: 'lendValue',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, displayDecimals)}</span>
      }
    },
    {
      title: `Loss（${loss?.currency}）`,
      dataIndex: 'loss',
      key: 'loss',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, displayDecimals)}</span>
      }
    },
    {
      title: 'Gas Fees（ETH）',
      dataIndex: 'gasFees',
      key: 'gasFees',
      render: value => {
        return <span title={toFixed(value, fixedDecimals)}>{toFixed(value, fixedDecimals, 6)}</span>
      }
    },
    {
      title: 'Gas Used',
      dataIndex: 'gasUsed',
      key: 'gasUsed'
    },
    {
      title: 'Gas Price(Gwei)',
      dataIndex: 'gasPrice',
      key: 'gasPrice',
      render: value => {
        const decimals = BigNumber.from(10).pow(9)
        return <span title={toFixed(value, decimals)}>{toFixed(value, decimals, 6)}</span>
      }
    },
    {
      title: 'Txn Hash',
      dataIndex: 'txnHash',
      key: 'txnHash',
      width: '14rem',
      ellipsis: true,
      render: text => (
        <a target="_blank" rel="noreferrer" href={`${CHAIN_BROWSER_URL[initialState.chain]}/tx/${text}`}>
          {text}
        </a>
      )
    }
  ]

  const lendChangeData = get(loss, 'lend.info', [])

  const smallConfig = {
    cardProps: {
      size: 'small'
    },
    tableProps: {
      size: 'small'
    }
  }
  const listResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {},
    [DEVICE_TYPE.Tablet]: smallConfig,
    [DEVICE_TYPE.Mobile]: smallConfig
  }[deviceType]

  const detailHeaderResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      firstDescProps: {},
      lastDescProps: {
        column: 4
      }
    },
    [DEVICE_TYPE.Tablet]: {
      firstDescProps: {
        size: 'small',
        style: {
          fontSize: '0.7rem'
        }
      },
      lastDescProps: {}
    },
    [DEVICE_TYPE.Mobile]: {
      firstDescProps: {
        size: 'small',
        style: {
          fontSize: '0.7rem'
        }
      },
      lastDescProps: {}
    }
  }[deviceType]

  const detailTableResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {},
    [DEVICE_TYPE.Tablet]: smallConfig,
    [DEVICE_TYPE.Mobile]: smallConfig
  }[deviceType]

  return (
    <GridContent>
      <Suspense fallback={null}>
        <VaultChange />
      </Suspense>
      {/* <Suspense fallback={null}>{initialState.vault === 'usdi' && <ChainChange shouldChangeChain />}</Suspense> */}
      <Suspense fallback={null}>
        <Card bordered={false} {...listResponsiveConfig.cardProps}>
          <div className={styles.title}>Allocation Reports</div>
          <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={data.list}
            loading={loading}
            pagination={{
              ...pagination,
              showSizeChanger: false
            }}
            {...listResponsiveConfig.tableProps}
          />
        </Card>
      </Suspense>
      <Modal
        title={''}
        style={{ top: 20 }}
        bodyStyle={{ background: '#323338' }}
        visible={showIndex !== -1}
        footer={null}
        onCancel={() => setShowIndex(-1)}
        width="1200px"
      >
        <Row>
          <Col span={24}>
            <Descriptions
              title={
                <span style={{ color: '#fff' }}>
                  Report Details
                  <Switch
                    style={{ float: 'right', marginRight: '50px' }}
                    checkedChildren="红升绿降"
                    unCheckedChildren="绿升红降"
                    onChange={setIsRedUp}
                  />
                </span>
              }
              size={detailHeaderResponsiveConfig.firstDescProps.size}
              labelStyle={{
                color: '#fff',
                ...detailHeaderResponsiveConfig.firstDescProps.style
              }}
              contentStyle={{
                color: '#fff',
                ...detailHeaderResponsiveConfig.firstDescProps.style
              }}
            >
              <Descriptions.Item
                label="Recommendation"
                contentStyle={{
                  color: isExec === 1 ? 'green' : 'red',
                  fontWeight: 'bold'
                }}
              >
                {isExec === 0 && `Not execute${forcedExecuted ? ' (enforced)' : ''}`}
                {isExec === 1 && 'Execute'}
              </Descriptions.Item>
              <Descriptions.Item label="Calculation Period">{durationDays} days</Descriptions.Item>
              <Descriptions.Item label="Report Time">{moment(currentReport.geneTime).format('yyyy-MM-DD HH:mm:ss')}</Descriptions.Item>
            </Descriptions>
            <Divider orientation="left" plain>
              Before and after
            </Divider>
            <Descriptions>
              <Descriptions.Item label="APR">
                <span className={styleMap[aprVariation > 0]}>
                  {aprVariation}% {aprVariation !== 0 && iconRender(aprVariation > 0)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="APR Before">
                <span className={styleMap[false]}>{aprBefore}%</span>
              </Descriptions.Item>
              <Descriptions.Item label="APR After">
                <span className={styleMap[true]}>{aprAfter}%</span>
              </Descriptions.Item>
              <Descriptions.Item label="Profits">
                <span className={styleMap[sumGainVariation > 0]}>
                  {sumGainVariation.toFixed(6)} {sumGainVariation !== 0 && iconRender(sumGainVariation > 0)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Profits Before">
                <span className={styleMap[false]}>{sumOriginalGain.toFixed(6)}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Profits After">
                <span className={styleMap[true]}>{sumNewGain.toFixed(6)}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Harvest Fee">
                <span className={styleMap[sumHarvestFeeVariation > 0]}>
                  {sumHarvestFeeVariation.toFixed(6)} {sumHarvestFeeVariation !== 0 && iconRender(sumHarvestFeeVariation > 0)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Harvest Fee Before">
                <span className={styleMap[false]}>{sumOriginalHarvestFee.toFixed(6)}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Harvest Fee After">
                <span className={styleMap[true]}>{sumHarvestFee.toFixed(6)}</span>
              </Descriptions.Item>
            </Descriptions>
            <Divider orientation="left" plain>
              Profit
            </Divider>
            <Descriptions {...detailHeaderResponsiveConfig.lastDescProps}>
              <Descriptions.Item label="Allocation Profit">{totalDeltaGain.toFixed(6)}</Descriptions.Item>
              <Descriptions.Item label="Allocation Cost">{sum(operateLoss).toFixed(6)}</Descriptions.Item>
              <Descriptions.Item label="Operate Gas Fee">{sum(operateFee).toFixed(6)}</Descriptions.Item>
              <Descriptions.Item label="Exchange Loss">{sum(exchangeLoss).toFixed(6)}</Descriptions.Item>
            </Descriptions>
          </Col>

          <Col span={24}>
            <Divider orientation="left" plain>
              Details
            </Divider>
            <Table
              columns={detailsColumns}
              dataSource={displayData}
              scroll={{ x: 1600, y: 400 }}
              pagination={false}
              {...detailTableResponsiveConfig.tableProps}
            />
          </Col>
          {!isEmpty(loss) && (
            <>
              <Col span={24}>
                <Divider orientation="left" plain>
                  Total loss
                </Divider>
                <Table
                  columns={tvlChangeColumns}
                  dataSource={tvlChangeData}
                  // scroll={{ x: 1400, y: 400 }}
                  pagination={false}
                  {...detailTableResponsiveConfig.tableProps}
                />
              </Col>
              <Col span={24}>
                <Divider orientation="left" plain>
                  Redeem loss
                </Divider>
                <Descriptions {...detailHeaderResponsiveConfig.lastDescProps}>
                  <Descriptions.Item label="Total loss">
                    <span title={toFixed(get(loss, 'redeem.loss', '0'), fixedDecimals)}>
                      {toFixed(get(loss, 'redeem.loss', '0'), fixedDecimals, displayDecimals)}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Gas Fee">
                    <span title={toFixed(get(loss, 'redeem.gasFees', '0'), fixedDecimals)}>
                      {toFixed(get(loss, 'redeem.gasFees', '0'), fixedDecimals, displayDecimals)} ETH
                    </span>
                  </Descriptions.Item>
                </Descriptions>
                <Table
                  columns={redeemChangeColumns}
                  dataSource={redeemChangeData}
                  scroll={{ x: 1600, y: 400 }}
                  pagination={false}
                  {...detailTableResponsiveConfig.tableProps}
                />
              </Col>
              <Col span={24}>
                <Divider orientation="left" plain>
                  Swap loss
                </Divider>
                <Descriptions {...detailHeaderResponsiveConfig.lastDescProps}>
                  <Descriptions.Item label="Total loss">
                    <span title={toFixed(get(loss, 'exchange.loss', '0'), fixedDecimals)}>
                      {toFixed(get(loss, 'exchange.loss', '0'), fixedDecimals, displayDecimals)}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Gas Fee">
                    <span title={toFixed(get(loss, 'exchange.gasFees', '0'), fixedDecimals)}>
                      {toFixed(get(loss, 'exchange.gasFees', '0'), fixedDecimals, displayDecimals)} ETH
                    </span>
                  </Descriptions.Item>
                </Descriptions>
                <Table
                  columns={swapChangeColumns}
                  dataSource={swapChangeData}
                  scroll={{ x: 1600, y: 400 }}
                  pagination={false}
                  {...detailTableResponsiveConfig.tableProps}
                />
              </Col>
              <Col span={24}>
                <Divider orientation="left" plain>
                  Lend loss
                </Divider>
                <Descriptions {...detailHeaderResponsiveConfig.lastDescProps}>
                  <Descriptions.Item label="Total loss">
                    <span title={toFixed(get(loss, 'lend.loss', '0'), fixedDecimals)}>
                      {toFixed(get(loss, 'lend.loss', '0'), fixedDecimals, displayDecimals)}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Gas Fee">
                    <span title={toFixed(get(loss, 'lend.gasFees', '0'), fixedDecimals)}>
                      {toFixed(get(loss, 'lend.gasFees', '0'), fixedDecimals, displayDecimals)} ETH
                    </span>
                  </Descriptions.Item>
                </Descriptions>
                <Table
                  columns={lendChangeColumns}
                  dataSource={lendChangeData}
                  scroll={{ x: 1600, y: 400 }}
                  pagination={false}
                  {...detailTableResponsiveConfig.tableProps}
                />
              </Col>
            </>
          )}
        </Row>
      </Modal>
      <Modal
        title="Set wallet's network to current?"
        visible={showWarningModal}
        onOk={() => changeNetwork(initialState.chain, userProvider, getWalletName())}
        onCancel={hideModal}
        okText="ok"
        cancelText="close"
      >
        <p>
          Wallet Chain:{' '}
          <span style={{ color: 'red', fontWeight: 'bold' }}>{CHIANS_NAME[initialState.walletChainId] || initialState.walletChainId}</span>
        </p>
        <p>
          Current Chain: <span style={{ color: 'red', fontWeight: 'bold' }}>{CHIANS_NAME[initialState.chain] || initialState.chain}</span>
        </p>
        {!isEmpty(roleError) && (
          <p>
            Message：
            <span style={{ color: 'red', fontWeight: 'bold' }}>Error Vault address!</span>
          </p>
        )}
      </Modal>
    </GridContent>
  )
}

export default Reports
