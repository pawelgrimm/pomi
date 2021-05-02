import { useCallback, useEffect, useState } from "react";
import createClockWorker, { subscribeToWorker } from "./clockWorker";
import { startClock, stopClock } from "./actions";

const { worker, dispatch } = createClockWorker();

const useClock = (interval: number = 1000) => {
  const start = useCallback(() => dispatch(startClock(interval)), [interval]);
  const stop = useCallback(() => dispatch(stopClock()), []);
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    return subscribeToWorker(worker, () => {
      setTicks((prev) => (prev + 1) % Number.MAX_SAFE_INTEGER);
    });
  }, []);

  return { start, stop, ticks };
};

export default useClock;
