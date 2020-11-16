import { makeMockConnect, makeMocks } from "./generic";
import {
  createValidProject,
  createValidTask,
} from "../../../../shared/utils/testing-helpers";

export const {
  mockCreate,
  mockSelect,
  mockSelectOne,
  mockNewConnection,
} = makeMocks(createValidProject);

export const mockConnectCreate = jest.fn(
  (userId, project) =>
    new Promise((resolve) => resolve({ ...createValidTask(), ...project }))
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
