import { useCallback, useState } from "react";
import { format } from "date-fns";
import { Session } from "../../models";

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
    (endTime: number): Session => {
      return {
        date: format(new Date(startTime), "MM/dd/yy"),
        startTime: Number.parseInt(format(new Date(startTime), "kkmm")),
        endTime: Number.parseInt(format(new Date(endTime), "kkmm")),
        project,
        description,
      };
    },
    [description, project, startTime]
  );

  return { startSession, getSession: endSession };
};

export default useSession;
