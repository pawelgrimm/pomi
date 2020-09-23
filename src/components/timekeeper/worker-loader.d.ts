// import { Action } from "./worker-kit";

declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
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
   * Instantiate a worker and return its dispatch function
   * @param type the type of worker
   * @returns the worker's dispatch function
   */
  export const createWorker = <T extends Worker>(type: new () => T) => {
    const worker = new type();
    createDispatch(worker);
  };

  export default WebpackWorker;
}
