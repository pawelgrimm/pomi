const { exec } = require("child_process");

const resetTestDb = async () => {
  return new Promise((resolve, reject) => {
    exec(
      "sh src/server/db/migrations/migrate.sh test 1 && sh src/server/db/migrations/migrate.sh test",
      (error, stdout) => {
        if (error) {
          console.error(`\nDatabase could not be reset: ${error}`);
          reject();
          throw new Error("Database could not be reset");
        }
        console.log("\nDatabase was reset.");
        resolve();
      }
    );
  });
};

module.exports = resetTestDb;
