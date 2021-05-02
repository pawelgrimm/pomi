import { createAction } from "@reduxjs/toolkit";

interface Action {
  type: string;
  payload?: any;
  error?: boolean;
  meta?: any;
}

/**
 * Creates a dispatch function by wrapping a worker's postMessage function
 * @param worker a specified worker
 * @return a dispatch function for the worker
 */
const createDispatch = (worker: Worker) => {
  return (action: Action) => {
    worker.postMessage(action);
  };
};

/**
 * Instantiate a worker and its dispatch function
 * @param type the type of worker to instantiate
 * @returns the worker and its dispatch function
 */
const createWorker = <T extends Worker>(type: new () => T) => {
  // eslint-disable-next-line new-cap
  const worker = new type();
  const dispatch = createDispatch(worker);
  return { worker, dispatch };
};

export { createAction, createWorker };
export type { Action };
