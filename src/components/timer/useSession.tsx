import React, { useCallback, useState } from "react";

const useSession = () => {
  const [startTime, setStartTime] = useState(0);
  const [description, setDescription] = useState("");

  const startSession = useCallback(
    (currentTime: number, description: string = "") => {
      setStartTime(currentTime);
      setDescription(description);
    },
    []
  );

  const endSession = useCallback(
    (endTime: number) => {
      const duration = startTime - endTime;
      return {
        duration,
        description,
      };
    },
    [description, startTime]
  );

  return { startSession, endSession };
};

export default useSession;
