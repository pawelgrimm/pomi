import React from "react";
import styles from "./ProjectSearch.module.scss";
import { Card } from "../index";

const ProjectSearch: React.FC = () => {
  return (
    <Card flex="column">
      <input
        className={styles.input}
        type="text"
        placeholder="Enter a project"
      />
    </Card>
  );
};

export default ProjectSearch;
