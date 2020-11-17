import {
  makeMockConnect,
  makeMocks,
} from "../../../../shared/utils/testing-helpers/mock-helper";
import { v4 as uuid } from "uuid";
import { UserModel } from "../../../../shared/types";

const createValidUser = (): UserModel => ({
  id: uuid(),
  email: "test@exmaple.com",
  displayName: "test user",
  defaultProject: uuid(),
});

export const {
  mockCreate,
  mockSelect,
  mockConnectCreate,
  mockNewConnection,
} = makeMocks(createValidUser);

export const User = jest.fn().mockImplementation(() => {
  return {
    create: mockCreate,
    select: mockSelect,
    newConnection: mockNewConnection,
    connect: makeMockConnect(mockConnectCreate),
  };
});
