import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Header from "../Header";

describe("Header", () => {
  it("renders brand element", () => {
    const { getByText } = render(<Header />);
    expect(getByText("Pomi")).toBeTruthy();
  });
});
