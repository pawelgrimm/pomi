import React, { useCallback, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";

interface NewOption {
  title: string;
  inputValue: string;
}

type OptionType<T> = T | NewOption;

function isNewOption<T>(option: OptionType<T> | null): option is NewOption {
  return option == null
    ? false
    : Object.prototype.hasOwnProperty.call(option, "inputValue");
}

type childrenRenderFunction<TDefault> = (
  dialogOption: TDefault,
  setDialogOption: (newValue: TDefault) => void
) => JSX.Element;

interface SelectOrCreateOptionsInputProps<TOption, TDefault> {
  id: string;
  label: string;
  value: OptionState<TOption>;
  setValue: (newValue: OptionState<TOption>) => void;
  options: Array<OptionType<TOption>>;
  defaultOptionValue: TDefault;
  createNewOption: (
    request: TDefault,
    callback: (newOption: TOption) => void
  ) => void;
  getNewOptionDTO: (name: string) => TDefault;
  getOptionLabel: (option: TOption) => string;
  disabled?: boolean;
  children: childrenRenderFunction<TDefault>;
}

export type OptionState<T> = T | null;

export type HandleOptionCallback<TOption> = (
  option: OptionState<TOption>
) => void;

export function SelectOrCreateOptionInput<TOption, TDefault>({
  id,
  label,
  value,
  setValue,
  options,
  defaultOptionValue,
  createNewOption,
  getNewOptionDTO,
  getOptionLabel,
  disabled = false,
  children,
}: SelectOrCreateOptionsInputProps<TOption, TDefault>) {
  const [open, toggleOpen] = useState(false);

  const handleClose = () => {
    setDialogValue(defaultOptionValue);
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState(defaultOptionValue);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createNewOption(dialogValue, (newProject) => {
      setValue(newProject);
      handleClose();
    });
  };

  const filter = createFilterOptions<OptionType<TOption>>();

  return (
    <React.Fragment>
      <Autocomplete
        disabled={disabled}
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            // We end up here after blurring when an existing option is selected,
            // but at that point, we've already called setValue the way we wanted
          } else if (isNewOption<TOption>(newValue)) {
            toggleOpen(true);
            setDialogValue(getNewOptionDTO(newValue.inputValue));
          } else {
            setValue(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              title: `Create new "${params.inputValue}" ${label}`,
            });
          }

          return filtered;
        }}
        id={id}
        options={options}
        getOptionLabel={(option) => {
          // e.g value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          if (isNewOption(option)) {
            return option.title;
          }
          return getOptionLabel(option);
        }}
        selectOnFocus
        blurOnSelect={false}
        handleHomeEndKeys
        freeSolo
        autoHighlight
        autoSelect
        renderInput={(params) => <TextField {...params} label={label} />}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          {children(dialogValue, setDialogValue)}
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
