import Project from "@core/projectAggregate/Project";
import { CreateProjectTaskDTO } from "@core/interfaces/ProjectDTOs";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import React, { useMemo } from "react";
import {
  HandleOptionCallback,
  SelectOrCreateOptionInput,
} from "./SelectOrCreateOptionInput";
import ProjectTask from "@core/projectAggregate/ProjectTask";

interface Props {
  createTask: (
    request: CreateProjectTaskDTO,
    callback: (newTask: ProjectTask) => void
  ) => void;
  project: Project | null;
  handleTaskSelected?: HandleOptionCallback<ProjectTask>;
}

export default function TaskInput({
  createTask,
  project,
  handleTaskSelected = () => {},
}: Props) {
  const tasks = useMemo(() => {
    if (project == null) {
      return [];
    }
    const tasks = project.getTasks();
    return Array.from(tasks);
  }, [project]);

  return (
    <SelectOrCreateOptionInput<ProjectTask, CreateProjectTaskDTO>
      id="task-input"
      label="Task"
      options={tasks}
      defaultOptionValue={new CreateProjectTaskDTO("")}
      createNewOption={createTask}
      getNewOptionDTO={(name) => new CreateProjectTaskDTO(name)}
      getOptionLabel={(option: ProjectTask) => option.name}
      handleOptionSelected={handleTaskSelected}
      disabled={project == null}
    >
      {(dialogValue, setDialogValue) => (
        <>
          <DialogTitle>Create a new Project</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Would you like to create a new Project?
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.name}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  name: event.target.value,
                })
              }
              label="name"
              type="text"
              variant="standard"
            />
          </DialogContent>
        </>
      )}
    </SelectOrCreateOptionInput>
  );
}
