-- Remove users, tasks, and sessions tables
DROP TABLE IF EXISTS sessions CASCADE;
DROP TYPE IF EXISTS SESSION_TYPE CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Remove functions
DROP FUNCTION IF EXISTS update_last_modified_column CASCADE;
DROP FUNCTION IF EXISTS set_created_column CASCADE;


