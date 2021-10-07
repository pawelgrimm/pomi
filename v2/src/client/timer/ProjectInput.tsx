import useProjects from "../../application/useProjects";
import Project from "@core/projectAggregate/Project";
import { CreateProjectTaskDTO } from "@core/interfaces/ProjectDTOs";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import React from "react";
import {
  HandleOptionCallback,
  OptionState,
  SelectOrCreateOptionInput,
} from "./SelectOrCreateOptionInput";

interface Props {
  value: OptionState<Project>;
  setValue: HandleOptionCallback<Project>;
  createProject: ReturnType<typeof useProjects>["create"];
  projects: Project[];
}

export default function ProjectInput({
  value,
  setValue,
  createProject,
  projects,
}: Props) {
  return (
    <SelectOrCreateOptionInput<Project, CreateProjectTaskDTO>
      id="project-input"
      label="Project"
      value={value}
      setValue={setValue}
      options={projects}
      defaultOptionValue={new CreateProjectTaskDTO("")}
      createNewOption={createProject}
      getNewOptionDTO={(name) => new CreateProjectTaskDTO(name)}
      getOptionLabel={(option: Project) => option.name}
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
