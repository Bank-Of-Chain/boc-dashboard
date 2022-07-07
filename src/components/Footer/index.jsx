import { useIntl } from "umi";
import { GithubOutlined } from "@ant-design/icons";
import { DefaultFooter } from "@ant-design/pro-layout";
export default () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: "app.copyright.produced",
    defaultMessage: "Bank Of Chain",
  });
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${defaultMessage} ${currentYear}`}
      links={[
        {
          key: "BOC Homepage",
          title: "BOC Homepage",
          href: "https://web-v1.bankofchain.io/",
          blankTarget: true,
        },
        {
          key: "BOC Dashboard",
          title: "BOC Dashboard",
          href: "https://dashboard-v1.bankofchain.io/",
          blankTarget: true,
        },
      ]}
    />
  );
};
