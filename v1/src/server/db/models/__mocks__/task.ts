import {
  makeMockConnect,
  makeMocks,
} from "../../../../shared/utils/testing-helpers/mock-helper";
import { v4 as uuid } from "uuid";

const createValidTask = () => ({
  id: uuid(),
  projectId: uuid(),
  isCompleted: false,
  title: "",
  lastModified: new Date("2020-10-25T12:00:00.000Z"),
});

export const {
  mockCreate,
  mockSelect,
  mockSelectOne,
  mockConnectCreate,
  mockNewConnection,
} = makeMocks(createValidTask);

export const Task = jest.fn().mockImplementation(() => {
  return {
    create: mockCreate,
    select: mockSelect,
    selectOne: mockSelectOne,
    newConnection: mockNewConnection,
    connect: makeMockConnect(mockConnectCreate),
  };
});
