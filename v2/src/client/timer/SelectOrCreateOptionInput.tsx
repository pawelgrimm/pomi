import React from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import Project from "@core/projectAggregate/Project";
import { CreateProjectDTO } from "@core/interfaces/ProjectDTOs";
import useProjects from "../../application/useProjects";

const filter = createFilterOptions<ProjectOptionType>();

interface NewOption {
  title: string;
  inputValue: string;
}

type ProjectOptionType = Project | NewOption;

function isNewOption(option: ProjectOptionType | null): option is NewOption {
  return option == null
    ? false
    : Object.prototype.hasOwnProperty.call(option, "inputValue");
}

interface SelectOrCreateOptionsInputProps {
  options: ProjectOptionType[];
  defaultProjectValue: CreateProjectDTO;
}

export function SelectOrCreateOptionInput({
  options,
  defaultProjectValue,
}: SelectOrCreateOptionsInputProps) {
  const [value, setValue] = React.useState<ProjectOptionType | null>(null);
  const [open, toggleOpen] = React.useState(false);

  const handleClose = () => {
    setDialogValue(defaultProjectValue);
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState(defaultProjectValue);

  const projects = useProjects();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    projects.create(dialogValue, (newProject) => {
      setValue(newProject);
      handleClose();
    });
  };

  return (
    <React.Fragment>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue(new CreateProjectDTO(newValue));
            });
          } else if (isNewOption(newValue)) {
            toggleOpen(true);
            setDialogValue(new CreateProjectDTO(newValue.inputValue));
          } else {
            setValue(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              title: `Create new "${params.inputValue}" Project`,
            });
          }

          return filtered;
        }}
        id="project-input"
        options={options}
        getOptionLabel={(option) => {
          // e.g value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          if (isNewOption(option)) {
            return option.title;
          }
          return option.name;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        // renderOption={(props, option) => <li {...props}>{option.title}</li>}
        freeSolo
        renderInput={(params) => <TextField {...params} label="Project" />}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
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
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

export default function SelectOrCreateOptionInputContainer() {
  const projects = useProjects();
  const options = projects.getAll();

  return (
    <>
      <SelectOrCreateOptionInput
        options={options}
        defaultProjectValue={new CreateProjectDTO("")}
      />
    </>
  );
}
