import React from "react";
import {AppBar, Toolbar, Typography, WithStyles, withStyles} from "@material-ui/core";
import {createStyles, Theme} from "@material-ui/core/styles";

type HeaderProps = WithStyles<typeof styles>;

function Header({classes}: HeaderProps) {
    return (
        <AppBar position="static" className={classes.headerContent}>
            <Toolbar>
                <Typography variant="h1" className={classes.brand}>
                    Pomi
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

const styles = (({ palette, typography, spacing}: Theme) => createStyles({
    headerContent: {
        alignItems: "start",
        backgroundColor: palette.primary.main,
        color: palette.primary.contrastText,
        display: "flex",
        justifyContent: "space-between",
        padding: spacing(1),
    },
    brand: {
        backgroundColor: palette.primary.main,
        color: palette.primary.contrastText,
        fontSize: "2.3rem",
        fontWeight: typography.fontWeightMedium,
        padding: 0,
        margin: 0,
    },
}));

export default withStyles(styles)(Header);
