import { useCallback, useState } from "react";
import { SessionParams } from "../../models";

const useSession = () => {
  const [startTime, setStartTime] = useState(0);
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");

  const startSession = useCallback(
    (currentTime: number, project: string = "", description: string = "") => {
      setStartTime(currentTime);
      setProject(project);
      setDescription(description);
    },
    []
  );

  const endSession = useCallback(
    (endTime: number): SessionParams => {
      return {
        startTimestamp: startTime,
        endTimestamp: endTime,
        project,
        description,
      };
    },
    [description, project, startTime]
  );

  // const saveSession = useCallback(
  //   (endTime: number = Date.now()): void => {
  //     const newSession = endSession(endTime);
  //     const newId = getEpochTime(newSession.date, newSession.startTime);
  //     const savedSessions = JSON.parse(
  //       window.localStorage.getItem("sessions") || "{}"
  //     );
  //     savedSessions[newId] = newSession;
  //     window.localStorage.setItem("sessions", JSON.stringify(savedSessions));
  //     alert(JSON.stringify({ [newId]: newSession }, null, 5));
  //   },
  //   [endSession]
  // );

  return { startSession, endSession };
  // saveSession };
};

export default useSession;
