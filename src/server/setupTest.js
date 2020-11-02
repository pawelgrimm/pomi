const { exec } = require("child_process");

const resetTestDb = async () => {
  return new Promise((resolve, reject) => {
    exec(
      "sh src/server/db/migrations/migrate.sh test 1 && sh src/server/db/migrations/migrate.sh test",
      (error, stdout) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject();
          throw new Error("Database could not be reset");
        }
        resolve();
      }
    );
  });
};

module.exports = { resetTestDb };
