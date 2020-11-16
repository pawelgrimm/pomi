import { DatabaseConnection, DatabasePoolType } from "../../slonik";
import { mockConnectCreate } from "./session";
import { createValidSession } from "../../../../shared/utils/testing-helpers";

export const makeMockCreate = (generate: () => {}) =>
  jest
    .fn()
    .mockImplementation(() => new Promise((resolve) => resolve(generate())));

export const makeMockSelect = (generate: () => {}) =>
  jest
    .fn()
    .mockImplementation(() => new Promise((resolve) => resolve([generate()])));

export const makeMockSelectOne = (generate: () => {}) =>
  jest
    .fn()
    .mockImplementation(() => new Promise((resolve) => resolve(generate())));

export const makeMockNewConnection = () =>
  jest.fn().mockImplementation(function () {
    // @ts-ignore
    return new this();
  });

export const makeMockConnectCreate = (generate: () => {}) =>
  jest.fn(() => new Promise((resolve) => resolve(generate())));

export const makeMockConnect = (mockCreate: () => {}) =>
  jest.fn(() => {
    return {
      create: mockCreate,
    };
  });

export const makeMocks = (generate: () => {}) => ({
  mockCreate: makeMockCreate(generate),
  mockSelect: makeMockSelect(generate),
  mockSelectOne: makeMockSelectOne(generate),
  mockConnectCreate: makeMockConnectCreate(generate),
  mockNewConnection: makeMockNewConnection(),
});
