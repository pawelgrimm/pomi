import { makeMockConnect, makeMocks } from "./generic";
import { createValidProject } from "../../../../shared/utils/testing-helpers";

export const {
  mockCreate,
  mockSelect,
  mockSelectOne,
  mockNewConnection,
} = makeMocks(createValidProject);

export const mockConnectCreate = jest.fn(
  () => new Promise((resolve) => resolve(createValidProject()))
);
export const Project = jest.fn().mockImplementation(() => {
  return {
    create: mockCreate,
    select: mockSelect,
    selectOne: mockSelectOne,
    newConnection: mockNewConnection,
    connect: makeMockConnect(mockConnectCreate),
  };
});
