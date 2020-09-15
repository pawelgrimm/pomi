//import WebpackWorker from "../components/timekeeper/worker-loader";

export default class MyWorker {
  onmessage: ((this: Worker, ev: MessageEvent) => any) | null;

  constructor() {
    this.onmessage = () => {};
  }

  postMessage(message: any): void {}

  terminate(): void {}

  addEventListener(
    type: "message",
    listener: (this: Worker, ev: MessageEvent) => any
  ): void {}
}
