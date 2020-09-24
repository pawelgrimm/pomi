import { createAction } from "@reduxjs/toolkit";
import "@testing-library/jest-dom";

import "jsdom-worker";
interface Action {
  type: string;
  payload?: any;
  error?: boolean;
  meta?: any;
}

// @ts-ignore
const createDispatch = (worker: Worker) => {
  return (action: Action) => {
    worker.postMessage(action);
  };
};

const createWorker = () => {
  const worker = new Worker("../hooks/useClock/clockWorker-script");
  const dispatch = createDispatch(worker);
  return { worker, dispatch };
};

export { createAction, createWorker };
export type { Action };
