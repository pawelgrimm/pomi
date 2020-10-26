import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import ActionButton from "../ActionButton";

describe("ActionButton", () => {
  it("renders without error", () => {
    render(<ActionButton />);
  });
});
