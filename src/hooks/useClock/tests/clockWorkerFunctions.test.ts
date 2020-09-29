import Clock from "../Clock";
import {
  getClockReducer,
  HasPostMessage,
  postCurrentTime,
} from "../clockWorkerFunctions";
import { startClock, stopClock } from "../actions";

jest.mock("../Clock");
const start = jest.fn();
const stop = jest.fn();

let clock: Clock;

describe("Clock Reducer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    Clock.mockImplementation(() => ({ start, stop }));
    clock = new Clock(() => {});
  });

  it("should startClock", () => {
    const interval = 100;
    const clockReducer = getClockReducer(clock);
    clockReducer({ data: startClock(100) });
    expect(start).toHaveBeenCalledWith(interval);
  });

  it("should stopClock", () => {
    const clockReducer = getClockReducer(clock);
    clockReducer({ data: stopClock() });
    expect(stop).toHaveBeenCalled();
  });
});

test("Post Current Time", () => {
  const postMessage = jest.fn();
  const workerMock: HasPostMessage = { postMessage };
  postCurrentTime.bind(workerMock)();
});
