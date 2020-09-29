import React from "react";
import "@testing-library/jest-dom";
import "@testing-library/user-event";
import { fireEvent, render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";
import { secondsToParts } from "../../../utils";
import Timer from "../Timer";

import * as useSession from "../../../hooks/useSession/useSession";
import MockedUseSession from "../../../hooks/useSession/__mocks__/MockedUseSession";
import * as clockWorker from "../../../hooks/useClock/clockWorker";
import MockedClockWorker from "../../../hooks/useClock/__mocks__/MockedClockWorker";
import {
  getDateFromUnixTime,
  getHoursMinutesFromUnixTime,
  secondsToFormattedTime,
} from "../../../utils/time";

const mockedUseSession = (useSession as unknown) as jest.Mocked<
  MockedUseSession
>;
const mockedClockWorker = (clockWorker as unknown) as jest.Mocked<
  MockedClockWorker
>;

jest.mock("../../../hooks/useSession/useSession");
jest.mock("../../../hooks/useClock/clockWorker");

// Helpers
const getButton = (name: string | RegExp) =>
  screen.getByRole("button", { name });
const queryButton = (name: string | RegExp) =>
  screen.queryByRole("button", { name });

describe("Timer - Integration Test", () => {
  it("should complete timer workflow", () => {
    const defaultTime = 15 * 60;

    const startTime = 1601391600000;
    const endTime = 1601391780000;
    mockedUseSession.setStartTime(1601391600000);
    mockedUseSession.setEndTime(1601391780000);

    const ticksElapsed = (endTime - startTime) / 1000;
    const expectedFormattedEndTime = secondsToFormattedTime(
      defaultTime - ticksElapsed
    );

    const expectedSession = {
      project: "test project",
      description: "test description",
      startTime: getHoursMinutesFromUnixTime(startTime),
      endTime: getHoursMinutesFromUnixTime(endTime),
      date: getDateFromUnixTime(startTime),
    };

    render(<Timer defaultTime={defaultTime} />);

    // Type in project and description
    userEvent.type(
      screen.getByRole("textbox", { name: /project/i }),
      expectedSession.project
    );

    // For some reason, this ends up sending "est descriptiont"
    // userEvent.type(
    //   screen.getByLabelText(/description/i),
    //   expectedSession.description
    // );
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: expectedSession.description },
    });

    // Click start timer
    userEvent.click(getButton(/start/i));
    expect(queryButton(/start/i)).not.toBeInTheDocument();

    // Simulate a couple clock ticks
    for (let i = 0; i < ticksElapsed; i++) {
      act(() => {
        mockedClockWorker.tickMockClock();
      });
    }

    expect(screen.getAllByRole("textbox")[2]).toHaveValue(
      expectedFormattedEndTime
    );

    // Click stop timer
    userEvent.click(getButton(/stop/i));
    expect(queryButton(/stop/i)).not.toBeInTheDocument();

    expect(mockedUseSession.sessionSpy).toEqual(expectedSession);
  });
});
