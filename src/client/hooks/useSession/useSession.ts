import { useCallback, useState } from "react";
import { SessionParams } from "../../models";

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
    (endTime: Date): SessionParams => {
      return {
        startDate: startTime,
        endDate: endTime,
        project,
        description,
      };
    },
    [description, project, startTime]
  );

  return { startSession, endSession };
};

export default useSession;
