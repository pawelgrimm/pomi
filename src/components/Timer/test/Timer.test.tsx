import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, act } from "@testing-library/react";
import Timer from "../Timer";

describe("Timer", () => {
  it("renders without errors", () => {
    render(<Timer />);
  });
});
