--Remove users, tasks, and sessions tables
DROP TABLE sessions;
DROP TYPE SESSION_TYPE;
DROP TABLE tasks;
DROP TABLE projects;
DROP TABLE users;

DROP FUNCTION IF EXISTS update_last_modified_column CASCADE;

