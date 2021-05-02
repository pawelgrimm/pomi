import React from "react";
import { useSelector } from "react-redux";
import { createFilterOptions } from "@material-ui/lab";
import { RootState } from "../../../app/rootReducer";
import { ProjectModel } from "../../../../shared/types";
import { FilterFunction, SearchField } from "./SearchField";
import { OptionType } from "./OptionType";

const filter = createFilterOptions<ProjectOptionType>();

const filterProjects: FilterFunction<ProjectOptionType> = (options, params) => {
  const filtered = filter(options, params);

  if (params.inputValue !== "") {
    filtered.push({
      inputValue: params.inputValue,
    });
  }

  return filtered;
};

export const ProjectField: React.FC<ProjectFieldProps> = ({ disabled }) => {
  const projects = useSelector(
    (state: RootState) => state.projects.data as Record<string, ExistingOption>
  );

  return (
    <SearchField<ExistingOption>
      name="project"
      label="Project"
      disabled={disabled}
      options={projects}
      filterOptions={filterProjects}
    />
  );
};

interface ProjectFieldProps {
  disabled?: boolean;
}

// TODO: Remove cast to Required<ProjectModel>
type ExistingOption = Required<ProjectModel>;

export type ProjectOptionType = OptionType<ExistingOption>;
