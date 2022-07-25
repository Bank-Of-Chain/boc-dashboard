import { useMediaQuery } from "react-responsive";

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  return isDesktop ? children : null;
};
const Tablet = ({ children }) => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  return isTablet ? children : null;
};
const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return isMobile ? children : null;
};
const Default = ({ children }) => {
  const isNotMobile = useMediaQuery({ minWidth: 768 });
  return isNotMobile ? children : null;
};

const DEVICE_TYPE = {
  Desktop: "Desktop",
  Tablet: "Tablet",
  Mobile: "Mobile",
};

const useDeviceType = () => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

  if (isDesktop) {
    return DEVICE_TYPE.Desktop;
  }

  if (isTablet) {
    return DEVICE_TYPE.Tablet;
  }

  return DEVICE_TYPE.Mobile;
};

export { Desktop, Tablet, Mobile, Default, useDeviceType, DEVICE_TYPE };
