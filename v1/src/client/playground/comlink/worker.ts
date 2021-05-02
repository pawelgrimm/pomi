// import * as Comlink from "comlink";
// declare function setInterval(cb: () => void, to: number): number;
// // eslint-disable-next-line no-restricted-globals
// const workerSelf: Worker = self as any;
//
// const DEBUG = true;
//
// class TimerWorker {
//   currentIntervalId: number | undefined;
//
//   startNewTimer(): void {
//     this.currentIntervalId = setInterval(() => {
//       this.postCurrentTime();
//     }, 1000);
//   }
//
//   postDebugMessage(message: string): void {
//     if (DEBUG) {
//       // tslint:disable-next-line:no-console
//       console.log(`[DEBUG]: ${message}`);
//     }
//   }
//
//   postCurrentTime() {
//     workerSelf.postMessage(Date.now());
//   }
//
//   clearTimer() {
//     if (this.currentIntervalId) {
//       clearInterval(this.currentIntervalId);
//     }
//   }
// }
//
// Comlink.expose(TimerWorker);
//
// export default TimerWorker;

export {};
