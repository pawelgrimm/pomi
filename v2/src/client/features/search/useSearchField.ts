import {
  FieldHelperProps,
  FieldInputProps,
  FieldMetaProps,
  useField,
} from "formik";
import { UseAutocompleteProps } from "@material-ui/lab";
import { Overwrite } from "utility-types";
import { isNewOption, OptionType } from "./OptionType";

/**
 * A wrapper around Formik's useField that patches the onChange function
 * @param name
 */
export function useSearchField<T extends {}>(
  name: string
): UseSearchFieldReturnType<OptionType<T>> {
  const [field, meta, helper] = useField<ExtendedOptionType<OptionType<T>>>(
    name
  );
  const { setValue } = helper;

  const onChange: OnChangeFunction<OptionType<T>> = (event, newValue) => {
    if (newValue === null || typeof newValue === "string") {
      setValue(null);
    } else if (isNewOption(newValue)) {
      setValue({
        title: newValue.title,
        isNewOption: true,
      });
    } else {
      setValue(newValue);
    }
  };

  return [{ ...field, onChange }, meta, helper];
}

export type ExtendedOptionType<OT> = OT | null;

type UseSearchFieldReturnType<OT> = [
  Overwrite<
    FieldInputProps<ExtendedOptionType<OT>>,
    { onChange: UseAutocompleteProps<OT, false, false, true>["onChange"] }
  >,
  FieldMetaProps<ExtendedOptionType<OT>>,
  FieldHelperProps<ExtendedOptionType<OT>>
];

type OnChangeFunction<OT> = UseAutocompleteProps<
  OT | null,
  false,
  false,
  true
>["onChange"];
