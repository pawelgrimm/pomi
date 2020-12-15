import {
  makeMockConnect,
  makeMocks,
} from "../../../../shared/utils/testing-helpers/mock-helper";
import { v4 as uuid } from "uuid";
import { UserModel } from "../../../../shared/types";

const createValidUser = (id: string = uuid()): UserModel => {
  return {
    id,
    firebaseId: id,
    email: "test@exmaple.com",
    displayName: "test user",
    defaultProject: uuid(),
  };
};

export const {
  mockCreate,
  mockSelect,
  mockConnectCreate,
  mockNewConnection,
} = makeMocks(createValidUser);

export const mockGetByFirebaseId = jest.fn(
  (firebaseId?: string) =>
    new Promise((resolve) => resolve(createValidUser(firebaseId)))
);

export const User = jest.fn().mockImplementation(() => {
  return {
    create: mockCreate,
    selectOne: mockSelect,
    newConnection: mockNewConnection,
    connect: makeMockConnect(mockConnectCreate),
    getByFirebaseId: mockGetByFirebaseId,
  };
});
