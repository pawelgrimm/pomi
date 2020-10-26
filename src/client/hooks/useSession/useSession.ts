import { useCallback, useState } from "react";
import { ClientSessionModel } from "../../../shared/models";

const useSession = () => {
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");

  const startSession = useCallback(
    (currentTime: Date, project: string = "", description: string = "") => {
      setStartTime(currentTime);
      setProject(project);
      setDescription(description);
    },
    []
  );

  const endSession = useCallback(
    (endTime: Date): ClientSessionModel => {
      return {
        startTimestamp: startTime,
        endTimestamp: endTime,
        description,
      };
    },
    [description, startTime]
  );

  return { startSession, endSession };
};

export default useSession;
