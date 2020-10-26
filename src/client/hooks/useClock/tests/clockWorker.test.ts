import { subscribeToWorker } from "../clockWorker";

// @ts-ignore
let spyListener: ({ data }) => {};

const spyAddEventListener = jest.fn();

const mockAddEventListener = (type: any, listener: () => {}) => {
  spyAddEventListener(type, listener);
  spyListener = listener;
};

const mockRemoveEventListener = jest.fn();
const callback = jest.fn();

const worker = {
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
};

test("should call correct functions on subscribe", () => {
  // @ts-ignore
  const unsubscribe = subscribeToWorker(worker, callback);
  expect(spyAddEventListener).toHaveBeenCalledWith("message", spyListener);

  const data = { data: "someValue" };
  spyListener(data);
  expect(callback).toHaveBeenCalledWith(data.data);

  unsubscribe();
  expect(mockRemoveEventListener).toHaveBeenCalledWith("message", spyListener);
});
