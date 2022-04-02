import {
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
} from "@mui/material";

export function TimerPane() {
  return (
    <Card>
      <CardHeader title="Timer" />
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Task" />
        <TextField label="Project" />
        <Button color="primary" variant="contained">
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}
