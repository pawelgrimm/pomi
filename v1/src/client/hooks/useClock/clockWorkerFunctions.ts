/**
 * Contains all the functions called by clockWorker-script
 */
import { startClock, stopClock, emitTick } from "./actions";
import Clock from "./Clock";
import { Action } from "./workerKit/workerKit";

export interface HasPostMessage {
  postMessage(action: Action): void;
}

/**
 * Sends a message to the main thread with the current time
 */
export function postCurrentTime(this: HasPostMessage): void {
  this.postMessage(emitTick());
}

/**
 * Wraps a clock reducer around a specific Clock instance
 * @param clock a Clock instance
 */
export const getClockReducer = (clock: Clock) => {
  return ({ data: action }: { data: Action }) => {
    switch (action.type) {
      case startClock.toString():
        clock.start(action.payload);
        break;
      case stopClock.toString():
        clock.stop();
        break;
    }
  };
};
