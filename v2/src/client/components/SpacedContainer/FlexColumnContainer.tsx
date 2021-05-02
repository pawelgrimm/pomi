import React, { PropsWithChildren } from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";

type FlexColumnContainerProps = PropsWithChildren<{}> &
  WithStyles<typeof styles>;

function FlexColumnContainer({ children, classes }: FlexColumnContainerProps) {
  return <div className={classes.root}>{React.Children.toArray(children)}</div>;
}

const styles = createStyles({
  root: {
    display: "flex",
    flexDirection: "column",
  },
});

export default withStyles(styles)(FlexColumnContainer);
