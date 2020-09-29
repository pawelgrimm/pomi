import { Session } from "../../../models";

type MockedUseSession = {
  default: () => {};
  sessionSpy: Session;
  setStartTime: (startTime: number) => void;
  setEndTime: (endTime: number) => void;
};

export default MockedUseSession;
