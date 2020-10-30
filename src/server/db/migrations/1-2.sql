--Create a last-modified update column
CREATE OR REPLACE FUNCTION update_last_modified_column()
    RETURNS trigger
AS
$$
BEGIN
    -- ASSUMES the table has a column named exactly last_modified
    -- Fetch the timestamp of the start of the transaction
    NEW.last_modified = current_timestamp;
    RETURN NEW;
END;
$$ language plpgsql;

--Add users, tasks, and sessions tables
CREATE TABLE users
(
    id           VARCHAR(255) PRIMARY KEY,
    display_name VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL
);

CREATE TABLE projects
(
    id            SERIAL PRIMARY KEY,
    user_id       VARCHAR(255) REFERENCES users         NOT NULL,
    title         VARCHAR(255),
    last_modified TIMESTAMPTZ DEFAULT current_timestamp NOT NULL
);

CREATE TRIGGER update_projects_last_modified
    BEFORE INSERT OR UPDATE
    ON projects
    FOR EACH ROW
EXECUTE PROCEDURE update_last_modified_column();

CREATE INDEX projects_user_id_idx ON projects (user_id);

CREATE TABLE tasks
(
    id            SERIAL PRIMARY KEY,
    user_id       VARCHAR(255) REFERENCES users         NOT NULL,
    project_id    SERIAL REFERENCES projects            NOT NULL,
    title         VARCHAR(255),
    completed     BOOLEAN     DEFAULT FALSE,
    last_modified TIMESTAMPTZ DEFAULT current_timestamp NOT NULL
);

CREATE TRIGGER update_tasks_last_modified
    BEFORE INSERT OR UPDATE
    ON tasks
    FOR EACH ROW
EXECUTE PROCEDURE update_last_modified_column();

CREATE INDEX tasks_user_id_idx ON tasks (user_id);

CREATE TYPE SESSION_TYPE AS ENUM ('session', 'break', 'long_break');

CREATE TABLE sessions
(
    id              SERIAL PRIMARY KEY,
    user_id         VARCHAR(255) REFERENCES users NOT NULL,
    task_id         SERIAL REFERENCES tasks       NOT NULL,
    start_timestamp TIMESTAMPTZ                   NOT NULL,
    duration        INTERVAL                      NOT NULL,
    notes           TEXT,
    type            SESSION_TYPE DEFAULT 'session',
    edited          BOOLEAN      DEFAULT FALSE,
    retro_added     BOOLEAN      DEFAULT FALSE,
    last_modified   TIMESTAMPTZ                   NOT NULL
);

CREATE TRIGGER update_sessions_last_modified
    BEFORE INSERT OR UPDATE
    ON sessions
    FOR EACH ROW
EXECUTE PROCEDURE update_last_modified_column();

CREATE INDEX sessions_user_id_idx ON sessions (user_id);