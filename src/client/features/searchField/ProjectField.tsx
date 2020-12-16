import React from "react";
import { useSelector } from "react-redux";
import { createFilterOptions } from "@material-ui/lab";
import { RootState } from "../../app/rootReducer";
import { ProjectModel } from "../../../shared/types";
import { FilterFunction, SearchField } from "./SearchField";
import { OptionType } from "./OptionType";

const filter = createFilterOptions<ProjectOptionType>();

const filterProjects: FilterFunction<ProjectOptionType> = (options, params) => {
  const filtered = filter(options, params) as ProjectOptionType[];

  if (params.inputValue !== "") {
    filtered.push({
      inputValue: params.inputValue,
    });
  }

  return filtered;
};

export const ProjectField: React.FC = () => {
  const projects = useSelector(
    (state: RootState) => state.projects.data as Record<string, ExistingOption>
  );

  return (
    <SearchField<ExistingOption>
      name="project"
      label="Project"
      options={projects}
      filterOptions={filterProjects}
    />
  );
};

// TODO: Remove cast to Required<ProjectModel>
type ExistingOption = Required<ProjectModel>;

type ProjectOptionType = OptionType<ExistingOption>;
