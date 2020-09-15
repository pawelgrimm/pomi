// eslint-disable-next-line no-restricted-globals
const workerSelf: Worker = self as any;

// @ts-ignore
const DEBUG = false;
declare function setInterval(cb: () => void, to: number): number;

enum TimerError {
  MISSING_INTERVAL = "MISSING_INTERVAL",
  INTERVAL_NOT_NUMBER = "INTERVAL_NOT_NUMBER",
  INVALID_ACTION = "INVALID ACTION",
}

enum TimerAction {
  SET_INTERVAL = "SET_INTERVAL",
  PAUSE = "PAUSE",
  RESUME = "RESUME",
}

/**
 * Write a debug message to the console
 * @param message the message to write
 */
const postDebugMessage = (message: string): void => {
  if (DEBUG) {
    // tslint:disable-next-line:no-console
    console.log(`[DEBUG]: ${message}`);
  }
};

/**
 * Start a new timer for the given interval. Clears previous timer if one exists.
 * @param interval the length of the new interval in milliseconds
 * @param currentIntervalId the ID of the previous timer
 * @return the new interval ID
 */
const startNewTimer = (interval: number): void => {
  clearTimer();

  currentIntervalId = setInterval(() => {
    postDebugMessage(`Posting current time: ${Date.now()}`);
    postCurrentTime();
  }, interval);
};

const clearTimer = () => {
  if (currentIntervalId) {
    clearInterval(currentIntervalId);
  }
};

/**
 * Send a message to the main thread with the current time
 */
const postCurrentTime = () => {
  workerSelf.postMessage({ clock: Date.now() });
};

let currentIntervalId: number | undefined;

/**
 * Add an onmessage listener to set a new timer
 */
// eslint-disable-next-line no-restricted-globals
workerSelf.addEventListener("message", ({ data: action }) => {
  postDebugMessage(
    `Action ${action.type} requested${
      action.payload ? "with payload: " + action.payload : ""
    }`
  );
  switch (action.type) {
    case "PAUSE": {
      clearTimer();
      break;
    }
    case "SET_INTERVAL": {
      const interval = action.payload;

      if (typeof interval !== "number") {
        workerSelf.postMessage({ error: TimerError.INTERVAL_NOT_NUMBER });
      }
      startNewTimer(interval);
      break;
    }
    default: {
      postMessage({ error: TimerError.INVALID_ACTION });
    }
  }
});

postDebugMessage("New worker created");

export {};
