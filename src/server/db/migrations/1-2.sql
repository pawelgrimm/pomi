-- Update the last_modified column
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

-- Update the created column
CREATE OR REPLACE FUNCTION set_created_column()
    RETURNS trigger
AS
$$
BEGIN
    -- ASSUMES the table has a column named exactly created
    -- Fetch the timestamp of the start of the transaction
    NEW.created = date_trunc('milliseconds', current_timestamp);
    RETURN NEW;
END;
$$ language plpgsql;

-- Add users, tasks, and sessions tables

-- Create users table
CREATE TABLE users
(
    id           VARCHAR(255) PRIMARY KEY,
    display_name VARCHAR(255)                          NOT NULL,
    email        VARCHAR(255)                          NOT NULL,
    created      TIMESTAMPTZ DEFAULT current_timestamp NOT NULL
);

CREATE TRIGGER set_users_created
    BEFORE INSERT
    ON users
    FOR EACH ROW
EXECUTE PROCEDURE set_created_column();

CREATE TABLE projects
(
    id            UUID UNIQUE  DEFAULT gen_random_uuid(),
    user_id       VARCHAR(255) REFERENCES users          NOT NULL,
    title         VARCHAR(255) DEFAULT ''                NOT NULL,
    is_archived   BOOLEAN      DEFAULT FALSE             NOT NULL,
    created       TIMESTAMPTZ  DEFAULT current_timestamp NOT NULL,
    last_modified TIMESTAMPTZ  DEFAULT current_timestamp NOT NULL,
    PRIMARY KEY (id, user_id)
);

CREATE TRIGGER set_projects_created
    BEFORE INSERT
    ON projects
    FOR EACH ROW
EXECUTE PROCEDURE set_created_column();

CREATE TRIGGER update_projects_last_modified
    BEFORE INSERT OR UPDATE
    ON projects
    FOR EACH ROW
EXECUTE PROCEDURE update_last_modified_column();

CREATE INDEX projects_user_idx ON projects (user_id);

CLUSTER projects USING projects_user_idx;

-- Create tasks table
CREATE TABLE tasks
(
    id            UUID UNIQUE  DEFAULT gen_random_uuid(),
    user_id       VARCHAR(255) REFERENCES users          NOT NULL,
    project_id    UUID                                   NOT NULL,
    title         VARCHAR(255) DEFAULT ''                NOT NULL,
    is_completed  BOOLEAN      DEFAULT FALSE             NOT NULL,
    created       TIMESTAMPTZ  DEFAULT current_timestamp NOT NULL,
    last_modified TIMESTAMPTZ  DEFAULT current_timestamp NOT NULL,
    PRIMARY KEY (id, user_id),
    FOREIGN KEY (project_id, user_id) REFERENCES projects (id, user_id)
);

CREATE TRIGGER set_tasks_created
    BEFORE INSERT
    ON tasks
    FOR EACH ROW
EXECUTE PROCEDURE set_created_column();

CREATE TRIGGER update_tasks_last_modified
    BEFORE INSERT OR UPDATE
    ON tasks
    FOR EACH ROW
EXECUTE PROCEDURE update_last_modified_column();

CREATE INDEX tasks_user_idx ON tasks (user_id);

CLUSTER tasks USING tasks_user_idx;

-- Create sessions table
CREATE TYPE SESSION_TYPE AS ENUM ('session', 'break', 'long_break');

CREATE TABLE sessions
(
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(255) REFERENCES users              NOT NULL,
    task_id         UUID                                       NOT NULL,
    start_timestamp TIMESTAMPTZ                                NOT NULL,
    duration        INTERVAL                                   NOT NULL,
    notes           TEXT             DEFAULT ''                NOT NULL,
    type            SESSION_TYPE     DEFAULT 'session'         NOT NULL,
    is_edited       BOOLEAN          DEFAULT FALSE             NOT NULL,
    is_retro_added  BOOLEAN          DEFAULT FALSE             NOT NULL,
    created         TIMESTAMPTZ      DEFAULT current_timestamp NOT NULL,
    last_modified   TIMESTAMPTZ      DEFAULT current_timestamp NOT NULL,
    FOREIGN KEY (task_id, user_id) REFERENCES tasks (id, user_id)
);

CREATE TRIGGER set_sessions_created
    BEFORE INSERT
    ON sessions
    FOR EACH ROW
EXECUTE PROCEDURE set_created_column();

CREATE TRIGGER update_sessions_last_modified
    BEFORE INSERT OR UPDATE
    ON sessions
    FOR EACH ROW
EXECUTE PROCEDURE update_last_modified_column();

CREATE INDEX sessions_user_idx ON sessions (user_id);

CLUSTER sessions USING sessions_user_idx;

-- Add default_task to the users table
ALTER TABLE users
    ADD COLUMN default_project UUID;
ALTER TABLE users
    ADD FOREIGN KEY (id, default_project) REFERENCES projects (user_id, id);