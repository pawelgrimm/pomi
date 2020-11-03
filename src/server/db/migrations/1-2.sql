--Create a last-modified update column
CREATE OR REPLACE FUNCTION update_last_modified_column()
    RETURNS trigger
AS
$$
BEGIN
    -- ASSUMES the table has a column named exactly last_modified
    -- Fetch the timestamp of the start of the transaction
    NEW.last_modified = date_trunc('milliseconds', current_timestamp);
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
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       VARCHAR(255) REFERENCES users              NOT NULL,
    title         VARCHAR(255)     DEFAULT ''                NOT NULL,
    is_archived   BOOLEAN          DEFAULT FALSE             NOT NULL,
    last_modified TIMESTAMPTZ      DEFAULT current_timestamp NOT NULL
);

CREATE TRIGGER update_projects_last_modified
    BEFORE INSERT OR UPDATE
    ON projects
    FOR EACH ROW
EXECUTE PROCEDURE update_last_modified_column();

CREATE INDEX projects_user_idx ON projects (user_id);

CLUSTER projects USING projects_user_idx;

CREATE TABLE tasks
(
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       VARCHAR(255) REFERENCES users              NOT NULL,
    project_id    UUID REFERENCES projects                   NOT NULL,
    title         VARCHAR(255)     DEFAULT ''                NOT NULL,
    is_completed  BOOLEAN          DEFAULT FALSE             NOT NULL,
    last_modified TIMESTAMPTZ      DEFAULT current_timestamp NOT NULL
);

CREATE TRIGGER update_tasks_last_modified
    BEFORE INSERT OR UPDATE
    ON tasks
    FOR EACH ROW
EXECUTE PROCEDURE update_last_modified_column();

CREATE INDEX tasks_user_idx ON tasks (user_id);

CLUSTER tasks USING tasks_user_idx;

CREATE TYPE SESSION_TYPE AS ENUM ('session', 'break', 'long_break');

CREATE TABLE sessions
(
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(255) REFERENCES users              NOT NULL,
    task_id         UUID REFERENCES tasks                      NOT NULL,
    start_timestamp TIMESTAMPTZ                                NOT NULL,
    duration        INTERVAL                                   NOT NULL,
    notes           TEXT             DEFAULT ''                NOT NULL,
    type            SESSION_TYPE     DEFAULT 'session'         NOT NULL,
    is_edited       BOOLEAN          DEFAULT FALSE             NOT NULL,
    is_retro_added  BOOLEAN          DEFAULT FALSE             NOT NULL,
    last_modified   TIMESTAMPTZ      DEFAULT current_timestamp NOT NULL
);

CREATE TRIGGER update_sessions_last_modified
    BEFORE INSERT OR UPDATE
    ON sessions
    FOR EACH ROW
EXECUTE PROCEDURE update_last_modified_column();

CREATE INDEX sessions_user_idx ON sessions (user_id);

CLUSTER sessions USING sessions_user_idx;