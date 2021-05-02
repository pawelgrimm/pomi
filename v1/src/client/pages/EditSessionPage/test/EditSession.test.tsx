import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { EditSessionPage } from "../EditSessionPage";

describe("EditSessionPage", () => {
  it("renders without error", () => {
    render(<EditSessionPage />);
  });
});
