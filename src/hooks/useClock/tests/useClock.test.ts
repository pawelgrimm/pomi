// @ts-nocheck
import { renderHook, act } from "@testing-library/react-hooks";
import {
  mockSubscribeToWorker,
  tickMockClock,
  mockDispatch,
} from "../clockWorker";

// eslint-disable-next-line import/first
import useClock from "../useClock";
import { startClock, stopClock } from "../actions";

jest.mock("../clockWorker");

beforeEach(() => {
  jest.clearAllMocks();
});

test("testing mocks", () => {
  const interval = 500;
  const { result } = renderHook(() => useClock(interval));
  expect(result.current.ticks).toBe(0);
  expect(mockSubscribeToWorker).toHaveBeenCalled();
  act(() => result.current.start());
  act(() => tickMockClock());
  expect(result.current.ticks).toBe(1);
});

test("should subscribe to worker", () => {
  renderHook(() => useClock());
  expect(mockSubscribeToWorker).toHaveBeenCalled();
});

test("should count ticks from worker", () => {
  const { result } = renderHook(() => useClock());
  expect(result.current.ticks).toBe(0);
  act(() => result.current.start());
  act(() => tickMockClock());
  expect(result.current.ticks).toBe(1);
  act(() => tickMockClock());
  expect(result.current.ticks).toBe(2);
});

test("should call dispatch correctly", () => {
  const interval = 365;
  const { result } = renderHook(() => useClock(interval));
  act(() => result.current.start());
  expect(mockDispatch).toHaveBeenCalledWith(startClock(interval));
  act(() => result.current.stop());
  expect(mockDispatch).toHaveBeenCalledWith(stopClock());
});
