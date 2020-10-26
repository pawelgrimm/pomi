const mockWorker = {};
const mockDispatch = jest.fn();
const mockSubscribeToWorker = jest.fn();

let ticks = 0;
let setTicks: () => {};
const tickMockClock = () => setTicks();

const createClockWorker = () => {
  return {
    worker: mockWorker,
    dispatch: mockDispatch,
  };
};

const subscribeToWorker = (worker: any, callback: () => {}) => {
  mockSubscribeToWorker();
  setTicks = callback;
};

export {
  createClockWorker as default,
  subscribeToWorker,
  mockWorker,
  mockDispatch,
  mockSubscribeToWorker,
  tickMockClock,
};
