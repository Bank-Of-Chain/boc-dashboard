import React from "react";
import PropTypes from "prop-types";

const Address = (props) => {
  const ens = props.address;
  let displayAddress = props.address.substr(0, 6);
  if (ens && ens.indexOf("0x") < 0) {
    displayAddress = ens;
  } else if (props.size === "short") {
    displayAddress += "..." + props.address.substr(-4);
  } else if (props.size === "long") {
    displayAddress = props.address;
  }
  return <span className={props.wrapClassName}>{displayAddress}</span>;
};

Address.propTypes = {
  address: PropTypes.string.isRequired,
  size: PropTypes.string,
  wrapClassName: PropTypes.string,
};

export default Address;
