const { promises: fs } = require("fs");
const { parse, format } = require("date-fns");

const formatTime = (time) => {
  return Number.parseInt(format(parse(time, "kmm", Date.now()), "kkmm"));
};

const main = async () => {
  const reformatted = {};
  const data = await fs.readFile(
    "/Users/pawelgrimm/Dropbox/notes/timelog.json",
    { encoding: "utf8" }
  );
  const { timelog } = JSON.parse(data);
  timelog.forEach(({ date, entries }) => {
    entries.forEach((entry) => {
      const id = parse(
        `${date} ${entry.startTime}`,
        "M/dd/yy kmm",
        Date.now()
      ).valueOf();
      const session = {
        date: date,
        startTime: formatTime(entry.startTime),
        endTime: formatTime(entry.endTime),
        description: entry.description,
        project: entry.project,
      };
      reformatted[id] = session;
    });
  });
  //console.log(reformatted);
  await fs.writeFile(
    "/Users/pawelgrimm/Dropbox/notes/timelog-formatted.json",
    JSON.stringify(reformatted, null, 2),
    { encoding: "utf8" }
  );
};

main();
