import React from 'react'
import { render } from '@testing-library/react'
import LineChartContent from '@/pages/home/components/LineChartContent'

test('LineChartContent Component Render', () => {
  const { asFragment } = render(
    <LineChartContent loading={false} calDateRange={() => {}} onCalDateRangeClick={() => {}} apyEchartOpt={{}} tvlEchartOpt={{}} />
  )
  expect(asFragment()).toMatchSnapshot()
})
