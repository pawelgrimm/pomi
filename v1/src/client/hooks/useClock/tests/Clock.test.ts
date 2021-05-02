import Clock from "../Clock";

const FUDGE = 0.01;

describe("Clock", () => {
  it("ticks 3 times", (done) => {
    const callback = jest.fn();
    const clock = new Clock(callback);
    const numTicks = 3;
    const interval = 100;

    clock.start(interval);

    setTimeout(() => {
      clock.stop();
      expect(callback).toBeCalledTimes(numTicks);
      done();
    }, numTicks * (1 + FUDGE) * interval);
  });

  it("doesn't tick", (done) => {
    const callback = jest.fn();
    const clock = new Clock(callback);
    const interval = 100;

    clock.start(interval);

    setTimeout(() => {
      clock.stop();
      expect(callback).not.toHaveBeenCalled();
      done();
    }, interval / 2);
  });

  it("doesn't break when double-stopped", () => {
    const callback = jest.fn();
    const clock = new Clock(callback);

    clock.stop();

    expect(callback).not.toHaveBeenCalled();
  });
});
