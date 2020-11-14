--Remove users, tasks, and sessions tables
DROP TABLE IF EXISTS sessions;
DROP TYPE IF EXISTS SESSION_TYPE;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;

DROP FUNCTION IF EXISTS update_last_modified_column CASCADE;


