import useProjects from "../../application/useProjects";
import Project from "@core/projectAggregate/Project";
import { CreateProjectDTO } from "@core/interfaces/ProjectDTOs";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { SelectOrCreateOptionInput } from "./SelectOrCreateOptionInput";

export default function ProjectInput() {
  const projects = useProjects();
  const options = projects.getAll();

  return (
    <SelectOrCreateOptionInput<Project, CreateProjectDTO>
      id="project-input"
      label="Project"
      options={options}
      defaultOptionValue={new CreateProjectDTO("")}
      createNewOption={projects.create}
      getNewOptionDTO={(name) => new CreateProjectDTO(name)}
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
