declare function setTimeout(cb: () => void, to: number): number;

class Clock {
  interval: number;
  startTime: number;
  count: number;
  timeout?: number;
  callback: () => void;

  constructor(callback: () => void) {
    this.callback = callback;
    this.interval = 0;
    this.count = 0;
    this.startTime = 0;
  }

  start(interval: number) {
    this.interval = interval;
    this.startTime = performance.now();
    this.count = 0;
    this.timeout = setTimeout(this.tick.bind(this), this.interval);
  }

  tick() {
    this.callback();
    this.count++;

    const currentTime = performance.now();
    const expectedInterval = this.count * this.interval;
    const delay = currentTime - this.startTime - expectedInterval;

    this.timeout = setTimeout(this.tick.bind(this), this.interval - delay);
  }

  stop() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}

export default Clock;
