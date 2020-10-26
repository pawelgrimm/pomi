// eslint-disable-next-line import/no-webpack-loader-syntax
import ClockWorker from "worker-loader!./clockWorker-script";
import { Action, createWorker } from "./workerKit/workerKit";

/**
 * Instantiates a ClockWorker
 */
const createClockWorker = () => createWorker(ClockWorker);

/**
 * Add a listener to the worker's message event.
 * @param worker the worker to listen to
 * @param callback the function to execute
 */
export const subscribeToWorker = (
  worker: ClockWorker,
  callback: (data: Action) => void
): (() => void) => {
  const listener = ({ data }: { data: Action }) => callback(data);
  worker.addEventListener("message", listener);
  return () => {
    worker.removeEventListener("message", listener);
  };
};

export default createClockWorker;
