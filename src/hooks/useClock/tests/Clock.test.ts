import Clock from "../Clock";

describe("Clock", () => {
  it("ticks 3 times", () => {
    const callback = jest.fn();
    const clock = new Clock(callback);
    const numTicks = 3;
    const interval = 100;

    clock.start(interval);

    setTimeout(() => {
      clock.stop();
      expect(callback).toBeCalledTimes(numTicks);
    }, numTicks * interval);
  });

  it("doesn't tick", () => {
    const callback = jest.fn();
    const clock = new Clock(callback);
    const interval = 100;

    clock.start(interval);

    setTimeout(() => {
      clock.stop();
      expect(callback).not.toHaveBeenCalled();
    }, interval / 2);
  });

  it("doesn't break when double-stopped", () => {
    const callback = jest.fn();
    const clock = new Clock(callback);

    clock.stop();

    expect(callback).not.toHaveBeenCalled();
  });
});
