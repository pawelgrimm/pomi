/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

const startSpy = jest.fn();
const stopSpy = jest.fn();

let ticks = 0;

const triggerTick = () => {
  ticks += 1;
};

const useClock = (interval: number = 1000) => {
  const [internalTicks, setTicks] = useState(ticks);
  useEffect(() => {
    setTicks(ticks);
  }, [ticks]);
  return { start: startSpy, stop: stopSpy, ticks: internalTicks };
};

export { useClock as default, startSpy, stopSpy, triggerTick };
