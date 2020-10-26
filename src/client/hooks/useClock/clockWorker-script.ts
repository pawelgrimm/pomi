/**
 * This file is passed to a Worker constructor
 */
import Clock from "./Clock";
import { getClockReducer, postCurrentTime } from "./clockWorkerFunctions";

// eslint-disable-next-line no-restricted-globals
const workerSelf: Worker = self as any;

const clock = new Clock(postCurrentTime.bind(workerSelf));

// @ts-ignore
workerSelf.addEventListener("message", getClockReducer(clock));
