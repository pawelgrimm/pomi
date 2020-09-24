export const mockDispatch = jest.fn();

export const mockWorker = {};

const createClockWorker = () => {
  return {
    worker: mockWorker,
    dispatch: mockDispatch,
  };
};

let ticks = 0;
let setTicks: () => {};

export const tickMockClock = () => setTicks();

export const mockSubscribeToWorker = jest.fn();

export const subscribeToWorker = (worker: any, callback: () => {}) => {
  mockSubscribeToWorker();
  setTicks = callback;
};

export default createClockWorker;
