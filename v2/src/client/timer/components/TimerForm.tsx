import React, { useState } from "react";
import useProjects from "@application/useProjects";
import { Project, ProjectTask } from "@core/projectAggregate";
import { CreateProjectTaskDTO } from "@core/interfaces/ProjectDTOs";
import { ProjectInput, TaskInput, OptionState, TimerDisplay } from "./index";
import { ActionButton, FlexColumnContainer } from "@components";
import { differenceInSeconds } from "date-fns";

function useTimerState() {
  const [project, setProject] = useState<OptionState<Project>>(null);
  const [task, setTask] = useState<OptionState<ProjectTask>>(null);
  const [isInProgress, setIsInProgress] = useState(false);
  const [startTime, setStartTime] = useState(new Date());

  const setProjectOverride = (projectOption: OptionState<Project>) => {
    if (projectOption == null) {
      setTask(null);
    }
    setProject(projectOption);
  };
  return {
    state: { project, task, isInProgress, startTime },
    setProject: setProjectOverride,
    setTask,
    setIsInProgress,
    setStartTime,
  };
}

function TimerForm() {
  const {
    state,
    setProject,
    setTask,
    setIsInProgress,
    setStartTime,
  } = useTimerState();
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
      <FlexColumnContainer>
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
        <TimerDisplay
          timerStartValue={60 * 30}
          isInProgress={state.isInProgress}
        />
        <ActionButton
          onClick={() => {
            if (!state.isInProgress) {
              // Starting the timer
              setStartTime(new Date());
            }
            if (state.isInProgress) {
              // Stopping the timer
              console.log(
                "Elapsed time",
                differenceInSeconds(new Date(), state.startTime)
              );
            }
            setIsInProgress((prev) => !prev);
          }}
        >
          {state.isInProgress ? "Stop" : "Start"}
        </ActionButton>
      </FlexColumnContainer>
    </>
  );
}

export default TimerForm;
