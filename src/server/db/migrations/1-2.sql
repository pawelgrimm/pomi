--Add users, tasks, and sessions tables

CREATE TABLE users
(
    id           VARCHAR(255) PRIMARY KEY,
    display_name VARCHAR(255)  NOT NULL,
    email        VARCHAR(255) NOT NULL
);

CREATE TABLE projects
(
    id      SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users NOT NULL,
    title   VARCHAR(255)
);

CREATE INDEX projects_user_id_idx ON projects (user_id);

CREATE TABLE tasks
(
    id         SERIAL PRIMARY KEY,
    user_id    VARCHAR(255) REFERENCES users NOT NULL,
    project_id SERIAL REFERENCES projects    NOT NULL,
    title      VARCHAR(255),
    completed  BOOLEAN DEFAULT FALSE
);

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
    retro_added     BOOLEAN      DEFAULT FALSE
);

CREATE INDEX sessions_user_id_idx ON sessions (user_id);