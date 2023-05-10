import React from 'react'
import { render } from '@testing-library/react'
import ChartCard from '@/components/ChartCard/index'

test('ChartCard Component Render', () => {
  const { asFragment } = render(<ChartCard loading={false} title={'test text'} />)
  expect(asFragment()).toMatchSnapshot()
})
