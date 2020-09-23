import { startClock, stopClock, emitTick } from "./actions";
import Clock from "./Clock";

// eslint-disable-next-line no-restricted-globals
const workerSelf: Worker = self as any;

/**
 * Send a message to the main thread with the current time
 */
const postCurrentTime = (): void => {
  workerSelf.postMessage(emitTick());
};

const clock = new Clock(postCurrentTime);

// @ts-ignore
workerSelf.addEventListener("message", ({ data: action }) => {
  switch (action.type) {
    case startClock.toString():
      clock.start(action.payload);
      break;
    case stopClock.toString():
      clock.stop();
      break;
  }
});
