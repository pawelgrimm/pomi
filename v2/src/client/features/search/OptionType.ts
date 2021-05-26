export interface NewOption {
  title: string;
  isNewOption: true;
}

export type OptionType<T> = T | NewOption;

export function isNewOption(option: any): option is NewOption {
  return (option as NewOption).isNewOption;
}

export function isExistingOption<T>(option: OptionType<T>): option is T {
  return !isNewOption(option);
}
