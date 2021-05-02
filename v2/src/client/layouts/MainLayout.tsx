import React, { PropsWithChildren } from "react";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core/styles";
import Header from "@components/Header";

type MainLayoutProps = PropsWithChildren<{}> & WithStyles<typeof styles>;

function MainLayout({ children, classes }: MainLayoutProps) {
  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.mainContent}>{children}</div>
    </div>
  );
}

const styles = ({ spacing }: Theme) =>
  createStyles({
    root: {
      background: "#16161a",
      display: "flex",
      minHeight: "100vh",
      flexDirection: "column",
      margin: "0 auto",
      padding: "0",
      maxWidth: "360px",
    },

    mainContent: {
      flex: 1,
      padding: spacing(2, 3),
    },
  });

export default withStyles(styles)(MainLayout);
