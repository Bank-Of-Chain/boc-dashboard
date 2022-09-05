import React from 'react'
import { Menu, Button } from 'antd'
import { render } from '@testing-library/react'
import HeaderDropdown from '@/components/HeaderDropdown/index'

test('HeaderDropdown Component Render', () => {
  const menuHeaderDropdown = (
    <Menu selectedKeys={['center']}>
      <Menu.Item key="center">User Center</Menu.Item>
      <Menu.Item key="settings">Account Setting</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  )
  const { asFragment } = render(
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <Button>hover menu</Button>
    </HeaderDropdown>
  )
  expect(asFragment()).toMatchSnapshot()
})
