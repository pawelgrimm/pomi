import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { createFilterOptions } from "@material-ui/lab";
import { useFormikContext } from "formik";
import { RootState } from "../../app/rootReducer";
import { TaskModel } from "../../../shared/types";
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
      filtered = filter(projectTasks, params) as TaskOptionType[];
    }

    if (params.inputValue !== "") {
      filtered.push({
        inputValue: params.inputValue,
      });
    }

    return filtered;
  };
};

export const TaskField: React.FC = () => {
  const tasks = useSelector(
    (state: RootState) => state.tasks.data as Record<string, ExistingOption>
  );

  const {
    values: { project },
    setFieldValue,
  } = useFormikContext<{ project: ProjectOptionType }>();

  const filterTasks = createTaskFilter(project);

  useEffect(() => {
    setFieldValue("task", null);
  }, [setFieldValue, project]);

  return (
    <SearchField<ExistingOption>
      name="task"
      label="Task"
      options={tasks}
      filterOptions={filterTasks}
    />
  );
};

// TODO: Remove cast to Required<TaskModel>
type ExistingOption = Required<TaskModel>;

type TaskOptionType = OptionType<ExistingOption>;
