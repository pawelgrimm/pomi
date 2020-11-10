// import { DatabaseSessionModel } from "../../../shared/types";
// import { getDurationWithUnits } from "../../../shared/utils";
// import { DatabasePoolType, sql } from "slonik";
//
// const RETURN_COLS = `
//   id,
//   user_id,
//   task_id,
//   start_timestamp,
//   extract('epoch' from duration) * 1000.0   duration,
//   note,
//   type,
//   is_retro_added`;
//
// const bindSessionQueries = (pool: DatabasePoolType) => {
//   return {
//     create: (session: DatabaseSessionModel) => {
//       const {
//         user_id,
//         task_id,
//         start_timestamp,
//         duration,
//         notes,
//         type,
//         retro_added,
//       } = session;
//       return pool.any(
//         sql`
//             INSERT INTO sessions(user_id,
//                                  task_id,
//                                  start_timestamp,
//                                  duration,
//                                  notes,
//                                  type,
//                                  is_retro_added)
//             VALUES ($1, $2, $3, $4, $5, $6, $7)
//             RETURNING id;
//             `,
//         [
//           user_id,
//           task_id,
//           start_timestamp.toISOString(),
//           getDurationWithUnits(duration),
//           notes || null,
//           type,
//           retro_added || null,
//         ]
//       );
//     },
//
//     // TODO: take time zone as a param
//     selectAll: () =>
//       pool.any(
//         sql`
//             SELECT ${RETURN_COLS}
//             FROM sessions;
//             `
//       ),
//
//     selectAllToday: () =>
//       pool.any(
//         sql`
//             SELECT ${RETURN_COLS}
//             FROM sessions
//             WHERE start_timestamp > current_date;
//             `
//       ),
//
//     selectOneById: (id: string) =>
//       pool.maybeOne(
//         sql`
//             SELECT ${RETURN_COLS}
//             FROM sessions
//             WHERE id = $1;
//             `,
//         [id]
//       ),
//
//     update: (id: string, session: Partial<DatabaseSessionModel>) => {
//       const {
//         user_id,
//         task_id,
//         start_timestamp,
//         duration,
//         notes,
//         type,
//         retro_added,
//       } = session;
//       return pool
//         .query(
//           sql`
//             UPDATE sessions
//             SET user_id         = coalesce($1, user_id),
//                 task_id         = coalesce($2, task_id),
//                 start_timestamp = coalesce($3, start_timestamp),
//                 duration        = coalesce($4, duration),
//                 notes           = coalesce($5, notes),
//                 type            = coalesce($6, type),
//                 is_retro_added     = coalesce($7, is_retro_added)
//             WHERE id = $8;
//             `,
//           [
//             user_id || null,
//             task_id || null,
//             start_timestamp?.toISOString() || null,
//             duration || null,
//             notes || null,
//             type || null,
//             retro_added || null,
//             id,
//           ]
//         )
//         .then(() => true);
//     },
//   };
// };
//
// export { bindSessionQueries };
export {};
