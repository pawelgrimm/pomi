import React, { useState } from "react";
import ProjectInput from "./ProjectInput";
import useProjects from "../../application/useProjects";
import { OptionState } from "./SelectOrCreateOptionInput";
import ProjectTask from "@core/projectAggregate/ProjectTask";
import Project from "@core/projectAggregate/Project";
import { CreateProjectTaskDTO } from "@core/interfaces/ProjectDTOs";
import TaskInput from "./TaskInput";

function useTimerState() {
  const [project, setProject] = useState<OptionState<Project>>(null);
  const [task, setTask] = useState<OptionState<ProjectTask>>(null);

  const setProjectOverride = (projectOption: OptionState<Project>) => {
    if (projectOption == null) {
      setTask(null);
    }
    setProject(projectOption);
  };
  return { state: { project, task }, setProject: setProjectOverride, setTask };
}

function TimerForm() {
  const { state, setProject, setTask } = useTimerState();
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
        value={state.project}
        setValue={setProject}
        projects={projects.getAll()}
        createProject={projects.create}
      />
      <TaskInput
        value={state.task}
        setValue={setTask}
        project={state.project}
        createTask={createAndAddTask}
      />

      <div>
        <h2>Timer State</h2>
        <p>{JSON.stringify(state, null, "\t")}</p>
      </div>
    </>
  );
}

export default TimerForm;
