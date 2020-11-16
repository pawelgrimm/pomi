import { makeMockConnect, makeMocks } from "./generic";
import { createValidSession } from "../../../../shared/utils/testing-helpers";

export const {
  mockCreate,
  mockSelect,
  mockSelectOne,
  mockNewConnection,
} = makeMocks(createValidSession);

export const mockConnectCreate = jest.fn(
  () => new Promise((resolve) => resolve(createValidSession()))
);

export const Session = jest.fn().mockImplementation(() => {
  return {
    create: mockCreate,
    select: mockSelect,
    selectOne: mockSelectOne,
    newConnection: mockNewConnection,
    connect: makeMockConnect(mockConnectCreate),
  };
});
