import { useIntl } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';
export default () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: 'Bank Of Chain',
  });
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${defaultMessage} ${currentYear}`}
      links={[
        {
          key: 'BOC Dashboard',
          title: 'BOC Dashboard',
          href: 'https://bankofchain.io/dashboard',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/ant-design/ant-design-pro',
          blankTarget: true,
        },
        {
          key: 'BOC Vault',
          title: 'BOC Vault',
          href: 'https://bankofchain.io/',
          blankTarget: true,
        },
      ]}
    />
  );
};
