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
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

type Session = {
  task: string;
  length_mins: number;
  notes: string;
  tags: string[];
};

// const sessions: Session[] = [
//   {
//     task: "Gucci alligator 2",
//     length: "30m",
//     notes: "I did this thing for a while",
//     tags: ["productive", "distracted"],
//   },
//   {
//     task: "I'm baby toast",
//     length: "1h16m",
//     notes: "I did this other thing for a while",
//     tags: ["enjoyed", "distracted"],
//   },
// ];

export function SessionsListPane() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    supabase
      .from<Session>("sessions")
      .select()
      .then(({ data, error }) => {
        if (error) {
          console.log(error);
        }

        if (data != null) {
          setSessions(data);
        }
      });
  }, []);

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

function SessionCard({ task, length_mins, notes, tags }: Session) {
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
            {formatLength(length_mins)}
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

function formatLength(lengthMins: number) {
  const hours = Math.floor(lengthMins / 60);
  const mins = lengthMins % 60;

  const hoursPart = hours ? `${hours}h` : "";
  const minsPart = mins ? `${mins}m` : "";

  return hoursPart + minsPart;
}
