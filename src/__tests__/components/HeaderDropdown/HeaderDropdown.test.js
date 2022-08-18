import React from 'react'
import { render } from '@testing-library/react'
import HeaderDropdown from '@/components/HeaderDropdown/index'

test('HeaderDropdown Component Render', () => {
  const { asFragment } = render(
    <HeaderDropdown>
      <span>123</span>
    </HeaderDropdown>
  )
  expect(asFragment()).toMatchSnapshot()
})
