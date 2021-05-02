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
export function useSearchField<T extends { title: string }>(
  name: string
): UseSearchFieldReturnType<OptionType<T> | null> {
  type OT = OptionType<T>;

  const [field, meta, helper] = useField<OT | null>(name);
  const { setValue } = helper;

  const onChange: OnChangeFunction<OT> = (event, newValue) => {
    if (newValue === null || typeof newValue === "string") {
      setValue(null);
    } else if (isNewOption(newValue)) {
      setValue({
        inputValue: newValue.inputValue,
      });
    } else {
      setValue(newValue);
    }
  };

  return [{ ...field, onChange }, meta, helper];
}

type UseSearchFieldReturnType<OTN> = [
  Overwrite<
    FieldInputProps<OTN>,
    { onChange: UseAutocompleteProps<OTN, false, false, true>["onChange"] }
  >,
  FieldMetaProps<OTN>,
  FieldHelperProps<OTN>
];

type OnChangeFunction<OT> = UseAutocompleteProps<
  OT | null,
  false,
  false,
  true
>["onChange"];
