import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  TextField,
  Typography,
} from "@mui/material";

type Session = {
  task: string;
  length: string;
  notes: string;
  tags: string[];
};

const sessions: Session[] = [
  {
    task: "Gucci alligator 2",
    length: "30m",
    notes: "I did this thing for a while",
    tags: ["productive", "distracted"],
  },
  {
    task: "I'm baby toast",
    length: "1h16m",
    notes: "I did this other thing for a while",
    tags: ["enjoyed", "distracted"],
  },
];

export function SessionsListPane() {
  return (
    <Card>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5">Sessions</Typography>
        {sessions.map((s) => (
          <SessionCard key={s.task} {...s} />
        ))}
      </CardContent>
    </Card>
  );
}

function SessionCard({ task, length, notes, tags }: Session) {
  return (
    <Card>
      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" component="p">
            {task}
          </Typography>
          <Typography variant="overline" color="text.secondary">
            {length}
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" mb={2} mt={1}>
          {notes}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
          {tags.map((t: string) => (
            <Chip key={t} label={t} size="small" />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
