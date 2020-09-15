import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "worker-loader!./worker-script";
//const workerPath = "./worker-script";

const DEBUG = true;

declare function setInterval(cb: () => void, to: number): number;

export enum TimerError {
  MISSING_INTERVAL = "MISSING_INTERVAL",
  INTERVAL_NOT_NUMBER = "INTERVAL_NOT_NUMBER",
}

//export declare function postMessage(message: TimerWorkerMessage): void;

export interface TimerWorkerMessage {
  clock?: number;
  error?: TimerError;
}

/**
 * Write a debug message to the console
 * @param message the message to write
 */
export const postDebugMessage = (message: string): void => {
  if (DEBUG) {
    // tslint:disable-next-line:no-console
    console.log(`[DEBUG]: ${message}`);
  }
};

/**
 * Add a listener to the worker's message event.
 * @param worker the worker to listen to
 * @param cb the function to execute
 */
export function listenToWorker(
  worker: Worker,
  cb: (data: TimerWorkerMessage) => void
): void {
  worker.addEventListener("message", ({ data }) => cb(data));
}

/**
 * Instruct the worker to start the clock with a given update interval
 * @param worker the worker
 * @param interval refresh interval in ms
 */
const startWorker = (worker: Worker, interval: number): void => {
  worker.postMessage({ type: "SET_INTERVAL", payload: interval });
};

/**
 * Instruct the worker to stop running the timer
 * @param worker the worker
 */
const pauseWorker = (worker: Worker): void => {
  worker.postMessage({ type: "PAUSE" });
};

/**
 * Enlist a web worker to report current time at a given interval
 * @param interval the interval in ms
 * @return the current time
 */
export const useTimeKeeper = (
  interval: number = 100
): [number, () => void, () => void] => {
  const worker = useMemo(() => new Worker(), []);
  const [time, setTime] = useState<number>(Date.now());

  const pause = useCallback(() => pauseWorker(worker), [worker]);
  const start = useCallback(() => startWorker(worker, interval), [
    worker,
    interval,
  ]);

  useEffect(() => {
    console.log("useTimeKeeper render");
  });

  useEffect(() => {
    console.log("timekeeper effect ran");
    listenToWorker(worker, ({ clock, error }) => {
      if (error) {
        postDebugMessage(error);
      } else if (clock) {
        setTime(clock);
      }
    });

    return () => worker.terminate();
  }, [worker]);

  // useEffect(() => {
  //   startWorker(worker, interval);
  // }, [interval, worker]);

  return [time, start, pause];
};
