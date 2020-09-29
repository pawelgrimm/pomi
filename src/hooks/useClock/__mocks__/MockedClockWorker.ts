import Mock = jest.Mock;

type MockedClockWorker = {
  default: () => { dispatch: Mock; worker: {} };
  subscribeToWorker: (worker: any, callback: () => {}) => void;
  mockWorker: {};
  mockDispatch: Mock;
  mockSubscribeToWorker: Mock;
  tickMockClock: () => {};
};

export default MockedClockWorker;
