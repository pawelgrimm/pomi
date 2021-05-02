declare function setInterval(cb: Function, to: number): number;

console.log("hello from a webworker");

let currentInterval: number;

const setupInterval = (timeout: number): void => {
  let counter = 0;
  if (currentInterval) {
    clearInterval(currentInterval);
  }
  currentInterval = setInterval(() => {
    console.log(`Worker is running w/ interval ${timeout} [${counter++}]`);
    postMessage("beep");
  }, timeout);
};

setupInterval(1000);

// eslint-disable-next-line no-restricted-globals
addEventListener("message", (message: MessageEvent) => {
  console.log(`Setting up new interval`, message.data);
  setupInterval(message.data);
});

export {};
