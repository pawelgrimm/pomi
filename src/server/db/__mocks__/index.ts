import { Task } from "../models/task";
import { Project } from "../models/project";
import { Session } from "../models/session";
import { User } from "../models/user";

jest.mock("../models/task");
jest.mock("../models/project");
jest.mock("../models/session");
jest.mock("../models/user");

// @ts-ignore
export const Tasks = new Task();
// @ts-ignore
export const Projects = new Project();
// @ts-ignore
export const Sessions = new Session();
// @ts-ignore
export const Users = new User();

export const mockTransaction = jest.fn();

const mockTransactionFunction = jest.fn(
  (callback: (transaction: any) => {}) => {
    return callback(mockTransaction);
  }
);

export const mockConnection = {
  transaction: mockTransactionFunction,
};

export const mockConnectFunction = jest.fn((callback: () => {}) => {
  // @ts-ignore
  return callback(mockConnection);
});

export const pool = {
  connect: mockConnectFunction,
  close: () => {},
};

export const close = () => {};
