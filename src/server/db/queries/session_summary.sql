SELECT to_char(s.start_timestamp AT TIME ZONE 'America/New_York', 'MM/DD/YY') date,
       to_char(s.start_timestamp AT TIME ZONE 'America/New_York', 'HH24:MI')  start_time,
       to_char(s.end_timestamp - s.start_timestamp, 'HH24:MI') duration,
       s.description                                                          session_desc,
       s.id                                                                   session_id,
       t.id                                                                   task_id,
       title                                                                  task_name,
       username
FROM sessions s
         INNER JOIN tasks t ON t.id = s.task_id AND t.user_id = s.user_id
         INNER JOIN users u ON t.user_id = u.id;