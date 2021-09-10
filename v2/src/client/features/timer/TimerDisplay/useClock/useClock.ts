import { useEffect, useState } from "react";
import ClockWorker from "./clockWorker-script?worker";

let worker: Worker;

// @ts-expect-error
if (!window.clockWorker) {
  // Workaround for Firefox not supporting workers as modules (not a problem in prod due to bundling)
  // @ts-expect-error
  if (process.env.NODE_ENV === "development") {
    // @ts-expect-error
    window.clockWorker = new Worker(
      "/src/client/features/timer/TimerDisplay/useClock/clockWorker-script.js"
    );
  } else {
    // @ts-expect-error
    window.clockWorker = new ClockWorker();
  }
}

console.log("useClock.ts");

const useClock = (interval: number = 1000) => {
  const [ticks, setTicks] = useState(0);

  console.log("useClock");
  useEffect(() => {
    const callback = () => {
      setTicks((prev) => prev++);
      console.log("heard tick", Date.now());
    };
    // @ts-expect-error
    window.clockWorker.addEventListener("message", callback);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      // @ts-expect-error
      window.clockWorker.removeEventListener("message", callback);
    };
  }, []);

  return { ticks };
};

export default useClock;
