> Provided by [dumi](https://d.umijs.org/zh-CN/guide/advanced#umi-%E9%A1%B9%E7%9B%AE%E9%9B%86%E6%88%90%E6%A8%A1%E5%BC%8F)

# Business Components

Here is a list of all the components used in Pro that are not suitable as component libraries but are really needed in the business. So we prepare this document to guide you whether you need to use this component or not.

## Footer

This component comes with some Pro configuration, and you generally need to change its information.

```tsx
/**
 * background: '#f0f2f5'
 */
import React from "react";
import Footer from "@/components/Footer";

export default () => <Footer />;
```

## HeaderDropdown

HeaderDropdown is package of antd Dropdown, add some adaption in mobile.

```tsx
/**
 * background: '#f0f2f5'
 */
import { Button, Menu } from "antd";
import React from "react";
import HeaderDropdown from "@/components/HeaderDropdown";

export default () => {
  const menuHeaderDropdown = (
    <Menu selectedKeys={[]}>
      <Menu.Item key="center">User Center</Menu.Item>
      <Menu.Item key="settings">Account Setting</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <Button>hover menu</Button>
    </HeaderDropdown>
  );
};
```

## RightContent

RightContent is the combination of the above components, add plugins `SelectLang`.

```tsx | pure
<Space>
  <HeaderSearch
    placeholder="Search in site"
    defaultValue="umi ui"
    options={[
      {
        label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>,
        value: "umi ui",
      },
      {
        label: <a href="next.ant.design">Ant Design</a>,
        value: "Ant Design",
      },
      {
        label: <a href="https://protable.ant.design/">Pro Table</a>,
        value: "Pro Table",
      },
      {
        label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
        value: "Pro Layout",
      },
    ]}
  />
  <Tooltip title="Documentation">
    <span
      className={styles.action}
      onClick={() => {
        window.location.href = "https://pro.ant.design/docs/getting-started";
      }}
    >
      <QuestionCircleOutlined />
    </span>
  </Tooltip>
  <Avatar />
  {REACT_APP_ENV && (
    <span>
      <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
    </span>
  )}
  <SelectLang className={styles.action} />
</Space>
```
