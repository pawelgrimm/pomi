import React, { useCallback, useState } from "react";

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
    (endTime: number) => {
      return {
        startTime,
        endTime,
        project,
        description,
      };
    },
    [description, project, startTime]
  );

  return { startSession, endSession };
};

export default useSession;
