import React, { useState } from "react";
import ProjectInput from "./ProjectInput";
import useProjects from "../../application/useProjects";
import { OptionState } from "./SelectOrCreateOptionInput";
import ProjectTask from "@core/projectAggregate/ProjectTask";
import Project from "@core/projectAggregate/Project";

interface TimerState {
  project: OptionState<Project>;
  task: OptionState<ProjectTask>;
}

function TimerForm() {
  const [state, setState] = useState<TimerState>({ project: null, task: null });
  const projects = useProjects();

  return (
    <>
      <ProjectInput
        projects={projects.getAll()}
        createProject={projects.create}
        handleProjectSelected={(projectSelected) => {
          setState((prevState) => ({ ...prevState, project: projectSelected }));
        }}
      />

      <div>
        <h2>Timer State</h2>
        <p>{JSON.stringify(state, null, "\t")}</p>
      </div>
    </>
  );
}

export default TimerForm;
