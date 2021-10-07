import React, { useState } from "react";
import useProjects from "@application/useProjects";
import { Project, ProjectTask } from "@core/projectAggregate";
import { CreateProjectTaskDTO } from "@core/interfaces/ProjectDTOs";
import { ProjectInput, TaskInput, OptionState } from "./InputFields";

function useTimerState() {
  const [project, setProject] = useState<OptionState<Project>>(null);
  const [task, setTask] = useState<OptionState<ProjectTask>>(null);
  const [isInProgress, setIsInProgress] = useState(false);

  const setProjectOverride = (projectOption: OptionState<Project>) => {
    if (projectOption == null) {
      setTask(null);
    }
    setProject(projectOption);
  };
  return {
    state: { project, task, isInProgress },
    setProject: setProjectOverride,
    setTask,
    setIsInProgress,
  };
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
