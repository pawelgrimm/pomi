import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { createFilterOptions } from "@material-ui/lab";
import { useFormikContext } from "formik";
import { RootState } from "@app/rootReducer";
import { TaskModel } from "@types";
import { FilterFunction, SearchField } from "./SearchField";
import { isExistingOption, isNewOption, OptionType } from "./OptionType";

import { ProjectOptionType } from "./ProjectField";

const filter = createFilterOptions<TaskOptionType>();

const createTaskFilter = (
  project: ProjectOptionType | null
): FilterFunction<TaskOptionType> => {
  return (options, params) => {
    let filtered: TaskOptionType[];

    if (project === null || isNewOption(project)) {
      // We will need to create a new task for a default(null) or new project
      filtered = [];
    } else {
      // If a project is selected, limit tasks to those on the project
      const projectTasks = options.filter((task) => {
        return isExistingOption(task) ? task.projectId === project.id : false;
      });
      filtered = filter(projectTasks, params);
    }

    if (params.inputValue !== "") {
      filtered.push({
        title: params.inputValue,
        isNewOption: true,
      });
    }

    return filtered;
  };
};

export function TaskField({ disabled }: TaskFieldProps) {
  const tasks = useSelector((state: RootState) => state.tasks.data);

  const {
    values: { project },
    setFieldValue,
  } = useFormikContext<{ project: ProjectOptionType }>();

  const filterTasks = createTaskFilter(project);

  useEffect(() => {
    setFieldValue("task", null);
  }, [setFieldValue, project]);

  return (
    <SearchField<TaskModel>
      name="task"
      label="Task"
      disabled={disabled}
      options={tasks}
      filterOptions={filterTasks}
    />
  );
}

interface TaskFieldProps {
  disabled: boolean;
}

export type TaskOptionType = OptionType<TaskModel>;
