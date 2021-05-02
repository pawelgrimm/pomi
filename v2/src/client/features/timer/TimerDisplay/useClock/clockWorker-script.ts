/**
 * This file is passed to a Worker constructor
 */
import Clock from "./Clock";
import { getClockReducer, postCurrentTime } from "./clockWorkerFunctions";

const workerSelf: Worker = self as any;

const clock = new Clock(postCurrentTime.bind(workerSelf));

workerSelf.addEventListener("message", getClockReducer(clock));
