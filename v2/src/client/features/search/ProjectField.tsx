import React from "react";
import { useSelector } from "react-redux";
import { createFilterOptions } from "@material-ui/lab";
import { RootState } from "@app/rootReducer";
import { ProjectModel } from "@types";
import { FilterFunction, SearchField } from "./SearchField";
import { OptionType } from "./OptionType";

const filter = createFilterOptions<ProjectOptionType>();

const filterProjects: FilterFunction<ProjectOptionType> = (options, params) => {
  const filtered = filter(options, params);

  if (params.inputValue !== "") {
    filtered.push({
      title: params.inputValue,
      isNewOption: true,
    });
  }

  return filtered;
};

export function ProjectField({ disabled }: ProjectFieldProps) {
  const projects = useSelector((state: RootState) => state.projects.data);

  return (
    <SearchField<ProjectModel>
      name="project"
      label="Project"
      disabled={disabled}
      options={projects}
      filterOptions={filterProjects}
    />
  );
}

interface ProjectFieldProps {
  disabled: boolean;
}

export type ProjectOptionType = OptionType<ProjectModel>;
