import { Session } from "../../../models";

const realUseSession = jest.requireActual("../useSession");

let sessionSpy: Session;
let startTime: number;
let endTime: number;

const mockUseSession = () => {
  const { startSession, endSession } = realUseSession.default();
  const mockStartSession = (time: number, ...rest: any[]) => {
    startSession(startTime || time, ...rest);
  };
  const mockSaveSession = (time: number, ...rest: any[]) => {
    sessionSpy = endSession(endTime || time, ...rest);
  };
  return {
    startSession: mockStartSession,
    endSession,
    saveSession: mockSaveSession,
  };
};

const setStartTime = (time: number) => (startTime = time);
const setEndTime = (time: number) => (endTime = time);

export { mockUseSession as default, sessionSpy, setStartTime, setEndTime };
