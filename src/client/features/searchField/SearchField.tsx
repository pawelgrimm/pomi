import React from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete, FilterOptionsState } from "@material-ui/lab";
import { useSearchField } from "./useSearchField";
import { isExistingOption, OptionType } from "./OptionType";

/**
 * A component for selecting an option from a list or adding a new one. Requires a Formik context.
 * @param props
 */
export const SearchField = <T extends { title: string }>(
  props: SearchFieldProps<OptionType<T>>
): JSX.Element => {
  const { options, label, name, filterOptions } = props;
  const [field, meta] = useSearchField<T>(name);

  type OT = OptionType<T>;

  return (
    <Autocomplete
      value={field.value}
      onChange={field.onChange}
      filterOptions={filterOptions}
      options={Object.values(options as Record<string, OT>)}
      getOptionLabel={(option) =>
        isExistingOption(option) ? option.title : `* ${option.inputValue}`
      }
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      autoComplete
      freeSolo
      renderInput={(params) => (
        <TextField
          label={label}
          id={name}
          name={name}
          error={meta.touched && !!meta.error}
          helperText={meta.touched && meta.error}
          variant="filled"
          fullWidth
          {...params}
        />
      )}
      renderOption={(option) =>
        isExistingOption(option)
          ? option.title
          : `New ${name} "${option.inputValue}"`
      }
    />
  );
};

export interface SearchFieldProps<OT> {
  options: Record<string, OT>;
  label: string;
  name: string;
  filterOptions: FilterFunction<OT>;
}

export type FilterFunction<OT> = (
  options: OT[],
  state: FilterOptionsState<OT>
) => OT[];
