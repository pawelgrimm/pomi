import React from "react";
import styles from "./ProjectSearch.module.scss";
import { Card } from "../index";

const ProjectSearch: React.FC = () => {
  return (
    <Card>
      <input
        className={styles.root}
        type="text"
        placeholder="Enter a project"
      />
    </Card>
  );
};

export default ProjectSearch;
