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
  props: SearchFieldProps<T>
): JSX.Element => {
  const { name, label, disabled, options, filterOptions } = props;
  const [field, meta] = useSearchField<T>(name);

  return (
    <Autocomplete
      id={name}
      value={field.value}
      disabled={disabled}
      onChange={field.onChange}
      filterOptions={filterOptions}
      options={Object.values(options)}
      getOptionLabel={(option) =>
        isExistingOption(option) ? option.title : `* ${option.title}`
      }
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      autoComplete
      fullWidth
      renderInput={(params) => (
        <TextField
          label={label}
          name={name}
          error={meta.touched && meta.error !== undefined}
          helperText={meta.touched && meta.error}
          variant="filled"
          {...params}
        />
      )}
      renderOption={(option) =>
        isExistingOption(option)
          ? option.title
          : `New ${name} "${option.title}"`
      }
    />
  );
};

export interface SearchFieldProps<OT> {
  label: string;
  name: string;
  disabled?: boolean;
  options: Record<string, OT>;
  filterOptions: FilterFunction<OptionType<OT>>;
}

export type FilterFunction<OT> = (
  options: OT[],
  state: FilterOptionsState<OT>
) => OT[];
