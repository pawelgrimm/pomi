import { createAction } from "./workerKit/workerKit";

const startClock = createAction<number>("useClock-worker/start");

const stopClock = createAction("useClock-worker/stop");

const emitTick = createAction("useClock-worker/tick");

export { startClock, stopClock, emitTick };
