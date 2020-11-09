ALTER TABLE users
    ADD COLUMN default_project UUID REFERENCES projects;
ALTER TABLE users
    ADD COLUMN default_task UUID REFERENCES tasks;