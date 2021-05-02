import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import TimerDisplay from "../TimerDisplay";

describe("TimerDisplay", () => {
  it("renders in in-progress mode without error", () => {
    const { getByDisplayValue } = render(
      <TimerDisplay time={370} setTime={() => {}} isInProgress />
    );
    expect(getByDisplayValue("00:06:10")).toBeTruthy();
  });
  it("renders in paused mode without error", () => {
    const { getByDisplayValue } = render(
      <TimerDisplay time={370} setTime={() => {}} isInProgress={false} />
    );
    expect(getByDisplayValue("00:06:10")).toBeTruthy();
  });
});
