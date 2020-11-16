import { makeMockConnect, makeMocks } from "./generic";
import { createValidTask } from "../../../../shared/utils/testing-helpers";

export const {
  mockCreate,
  mockSelect,
  mockSelectOne,
  mockNewConnection,
} = makeMocks(createValidTask);

export const mockConnectCreate = jest.fn(
  () => new Promise((resolve) => resolve(createValidTask()))
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
