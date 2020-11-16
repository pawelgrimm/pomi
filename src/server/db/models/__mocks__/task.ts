import { makeMockConnect, makeMocks } from "./generic";
import { createValidTask } from "../../../../shared/utils/testing-helpers";

export const {
  mockCreate,
  mockSelect,
  mockSelectOne,
  mockNewConnection,
} = makeMocks(createValidTask);

export const mockConnectCreate = jest.fn(
  (userId: string, task: {}) =>
    new Promise((resolve) => resolve({ ...createValidTask(), ...task }))
);

export const Task = jest.fn().mockImplementation(() => {
  return {
    create: mockCreate,
    select: mockSelect,
    selectOne: mockSelectOne,
    newConnection: mockNewConnection,
    connect: makeMockConnect(mockConnectCreate),
  };
});
