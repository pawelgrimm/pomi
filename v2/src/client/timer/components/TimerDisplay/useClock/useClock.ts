import { useEffect, useState } from "react";
import ClockWorker from "./clockWorker-script?worker";

// @ts-expect-error
if (window.clockWorker == null) {
  // Workaround for Firefox not supporting workers as modules (not a problem in prod due to bundling)
  // @ts-expect-error
  if (process.env.NODE_ENV === "development") {
    // @ts-expect-error
    window.clockWorker = new Worker(
      "/src/client/timer/components/TimerDisplay/useClock/clockWorker-script.js"
    );
  } else {
    // @ts-expect-error
    window.clockWorker = new ClockWorker();
  }
}

const useClock = (interval: number = 1000) => {
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const callback = () => {
      setTicks((prev) => prev + 1);
    };
    // @ts-expect-error
    window.clockWorker.addEventListener("message", callback);

    return () => {
      // @ts-expect-error
      window.clockWorker.removeEventListener("message", callback);
    };
  }, []);

  return { ticks };
};

export default useClock;
