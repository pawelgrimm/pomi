import React from "react";
import { Tab, Tabs } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useTabsStyles = makeStyles(
  {
    root: {
      marginBottom: "14px",
      minHeight: 0,
    },
  },
  { name: "MuiTabs" }
);

const useTabStyles = makeStyles(
  {
    root: {
      padding: 0,
      paddingBottom: "6px",
      minHeight: 0,
      minWidth: 0,
      textTransform: "none",
      fontSize: "1.1rem",
      fontWeight: "normal",
    },
    textColorPrimary: {
      color: "#3F3E3B",
    },
  },
  { name: "MuiTab" }
);

interface TimerPageTabsProps {
  type: any;
  isInProgress: boolean;
  onChangeTabHandler: (value: any) => void;
}

export const TimerPageTabs: React.FC<TimerPageTabsProps> = (props) => {
  const { type, onChangeTabHandler } = props;
  const tabsClasses = useTabsStyles();
  const tabClasses = useTabStyles();
  return (
    <Tabs
      classes={tabsClasses}
      value={type}
      onChange={(event, value) => onChangeTabHandler(value)}
      indicatorColor="primary"
      textColor="primary"
      variant="fullWidth"
    >
      <Tab label="Session" classes={tabClasses} />
      <Tab label="Break" classes={tabClasses} />
      <Tab label="Long Break" classes={tabClasses} />
    </Tabs>
  );
};
