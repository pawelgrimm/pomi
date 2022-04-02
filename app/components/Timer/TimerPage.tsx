import { Grid, styled, Paper, Container } from "@mui/material";
import { TimerPane } from "./TimerPane";
import { SessionsListPane } from "./SessionsListPane";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export function TimerPage() {
  return (
    <Container sx={{ py: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5} lg={4}>
          <TimerPane />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <SessionsListPane />
        </Grid>
      </Grid>
    </Container>
  );
}
