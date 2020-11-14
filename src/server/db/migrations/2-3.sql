ALTER TABLE users
    ADD COLUMN default_project UUID;
ALTER TABLE users
    ADD FOREIGN KEY (id, default_project) REFERENCES projects(user_id, id);
ALTER TABLE users
    ADD COLUMN default_task UUID;
ALTER TABLE users
    ADD FOREIGN KEY (id, default_task) REFERENCES tasks(user_id, id);