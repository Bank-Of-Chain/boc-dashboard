import React from "react";
import { render } from "@testing-library/react";
import ChartCard from "../../../components/ChartCard/index";

test("ChartCard Component Render", () => {
  const { asFragment } = render(<ChartCard loading />);
  expect(asFragment()).toMatchSnapshot();
});
