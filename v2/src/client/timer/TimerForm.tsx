import React, { useState } from "react";
import ProjectInput from "./ProjectInput";
import useProjects from "../../application/useProjects";
import { OptionState } from "./SelectOrCreateOptionInput";
import ProjectTask from "@core/projectAggregate/ProjectTask";
import Project from "@core/projectAggregate/Project";
import { CreateProjectTaskDTO } from "@core/interfaces/ProjectDTOs";
import TaskInput from "./TaskInput";

interface TimerState {
  project: OptionState<Project>;
  task: OptionState<ProjectTask>;
}

function TimerForm() {
  const [state, setState] = useState<TimerState>({ project: null, task: null });
  const projects = useProjects();

  const createAndAddTask = (
    request: CreateProjectTaskDTO,
    callback: (newTask: ProjectTask) => void
  ) => {
    if (state.project == null) {
      // This should never happen
      return;
    }
    const newTask = new ProjectTask(request.name);
    state.project.addTask(newTask);
    projects.update(state.project);
    callback(newTask);
  };

  return (
    <>
      <ProjectInput
        projects={projects.getAll()}
        createProject={projects.create}
        handleProjectSelected={(projectSelected) => {
          setState((prevState) => ({ ...prevState, project: projectSelected }));
        }}
      />
      <TaskInput
        project={state.project}
        createTask={createAndAddTask}
        handleTaskSelected={(taskSelected) => {
          setState((prevState) => ({ ...prevState, task: taskSelected }));
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
