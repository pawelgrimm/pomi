import ClockWorker from "./clockWorker-script?worker";
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
  worker: ReturnType<typeof createClockWorker>["worker"],
  callback: (data: Action) => void
): (() => void) => {
  const listener = ({ data }: { data: Action }) => callback(data);
  worker.addEventListener("message", listener);
  return () => {
    worker.removeEventListener("message", listener);
  };
};

export default createClockWorker;
