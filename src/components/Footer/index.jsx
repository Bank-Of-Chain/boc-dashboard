import React from "react";
import { useIntl } from "umi";
import { DefaultFooter } from "@ant-design/pro-layout";

const Footer = () => {
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
          href: "https://bankofchain.io/",
          blankTarget: true,
        },
        {
          key: "BOC Dashboard",
          title: "BOC Dashboard",
          href: "https://dashboard.bankofchain.io/",
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
