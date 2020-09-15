import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import App from "../App";

test("renders learn react link", () => {
  const { getByText } = render(<App />);

  expect(getByText("Pomi")).toBeInTheDocument();
});
