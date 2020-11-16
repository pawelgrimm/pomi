import {
  makeMockConnect,
  makeMocks,
  makeMockUpdate,
} from "../../../../shared/utils/testing-helpers/mock-helper";
import { SessionModel } from "../../../../shared/types";
import { v4 as uuid } from "uuid";

const createValidSession = (): Required<SessionModel> => ({
  id: uuid(),
  taskId: uuid(),
  startTimestamp: new Date("2020-10-23T19:59:29.853Z"),
  duration: 500000,
  notes: "",
  type: "session",
  isRetroAdded: false,
  lastModified: new Date("2020-10-25T12:00:00.000Z"),
});

export const {
  mockCreate,
  mockSelect,
  mockSelectOne,
  mockNewConnection,
  mockConnectCreate,
  mockConnectUpdate,
} = makeMocks(createValidSession);

export const mockUpdate = makeMockUpdate(createValidSession);

export const Session = jest.fn().mockImplementation(() => {
  return {
    create: mockCreate,
    select: mockSelect,
    selectOne: mockSelectOne,
    newConnection: mockNewConnection,
    connect: makeMockConnect(mockConnectCreate, mockConnectUpdate),
  };
});
