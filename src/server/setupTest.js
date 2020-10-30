const { exec } = require("child_process");

exec("sh src/server/db/migrations/migrate.sh test 1");
exec("sh src/server/db/migrations/migrate.sh test");
