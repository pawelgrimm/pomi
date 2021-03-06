declare type Listener = (this: Worker, ev: MessageEvent) => any;

export default class MyWorker {
  onmessage: ((this: Worker, ev: MessageEvent) => any) | null;

  constructor() {
    this.onmessage = () => {};
  }

  postCurrentTime(): void {}

  terminate(): void {}

  addEventListener(type: "message", listener: Listener): void {}

  removeEventListener(type: "message", listener: Listener): void {}
}
