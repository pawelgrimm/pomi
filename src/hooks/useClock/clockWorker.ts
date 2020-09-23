// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "worker-loader!./clockWorker-script";
import { Action, createWorker } from "./workerKit/workerKit";

const createClockWorker = () => createWorker(Worker);

/**
 * Add a listener to the worker's message event.
 * @param worker the worker to listen to
 * @param callback the function to execute
 */
export const subscribeToWorker = (
  worker: Worker,
  callback: (data: Action) => void
): (() => void) => {
  const listener = ({ data }: { data: Action }) => callback(data);
  worker.addEventListener("message", listener);
  return () => {
    worker.removeEventListener("message", listener);
  };
};

export default createClockWorker;
