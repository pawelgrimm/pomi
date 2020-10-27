--Add users, tasks, and sessions tables

CREATE TABLE users
(
    id        SERIAL PRIMARY KEY,
    username  VARCHAR(30) NOT NULL,
    email     VARCHAR(255) NOT NULL
);

-- CREATE TABLE tasks
-- (
--     id      SERIAL,
--     user_id SERIAL REFERENCES users NOT NULL,
--     title   VARCHAR(255),
--     PRIMARY KEY (id, user_id)
-- );

CREATE TABLE sessions
(
    id              SERIAL PRIMARY KEY,
--    user_id         SERIAL REFERENCES users NOT NULL,
--     task_id         SERIAL                  NOT NULL,
    start_timestamp TIMESTAMPTZ             NOT NULL,
    duration        INTERVAL             NOT NULL,
    project         TEXT,
    task            TEXT,
    notes           TEXT,
    edited          BOOLEAN DEFAULT FALSE,
    retro_added     BOOLEAN DEFAULT FALSE
--     FOREIGN KEY (task_id, user_id) REFERENCES tasks (id, user_id)
);