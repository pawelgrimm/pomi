export interface NewOption {
  inputValue: string;
}

export type OptionType<T> = T | NewOption;

export function isNewOption(option: any): option is NewOption {
  return (option as NewOption).inputValue !== undefined;
}

export function isExistingOption<T>(option: OptionType<T>): option is T {
  return !isNewOption(option);
}
