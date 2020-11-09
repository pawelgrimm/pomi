import Joi from "joi";
import { ClientSessionModel, DatabaseSessionModel } from "../types";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";

const NOTES_LENGTH_LIMIT = 1000;

/*
 * Note: Schemas listed as optional are always optional.
 * Schemas without a presence requirement are required unless presence is set to
 * "required", which is accomplished using the isPartial flag
 */

/**
 * Calculate the duration (in milliseconds) of a session
 * @param parent a clone of the object being validated
 * @returns the duration in the format "n milliseconds", or undefined if
 *  parent does not contain a start and end timestamp
 */
const calculateDuration = (parent: any): number | undefined => {
  const { start_timestamp, end_timestamp } = parent;
  if (start_timestamp && end_timestamp) {
    return differenceInMilliseconds(end_timestamp, start_timestamp);
  }
  return undefined;
};

/**
 * Schema used to convert client sessions into database sessions
 */
const databaseSessionSchema = Joi.object({
  id: Joi.number().optional(),
  user_id: Joi.string().max(255).label("userId"),
  task_id: Joi.number().label("taskId"),
  start_timestamp: Joi.date().iso().label("startTimestamp"),
  duration: Joi.number().optional().default(calculateDuration),
  // end_timestamp must be after duration so that the calculation
  // occurs before end_timestamp is stripped
  end_timestamp: Joi.date().iso().strip().label("endTimestamp"),
  notes: Joi.string().trim().max(NOTES_LENGTH_LIMIT).optional(),
  type: Joi.string().allow("session", "break", "long-break"),
  retro_added: Joi.boolean().optional().default(false).label("retroAdded"),
})
  .rename("userId", "user_id")
  .rename("taskId", "task_id")
  .rename("startTimestamp", "start_timestamp")
  .rename("endTimestamp", "end_timestamp")
  .rename("retroAdded", "retro_added");

/**
 * Validate and convert a ClientSessionModel-like object into a DatabaseSessionModel
 * @param session a ClientSessionModel-like object
 * @param options an object containing an optional isPartial key (to validate provided
 *  keys, not presence of all required keys)
 * @returns the object converted to a DatabaseSessionModel
 */
export const validateClientSession = (
  session: any,
  options: { isPartial?: boolean } = {}
): DatabaseSessionModel => {
  return Joi.attempt(
    session,
    databaseSessionSchema.options({
      stripUnknown: true,
      presence: options.isPartial ? "optional" : "required",
    })
  ) as DatabaseSessionModel;
};

/**
 * Calculate the end timestamp of a session
 * @param parent a clone of the object being validated
 * @returns the end timestamp as a Date object, or undefined if
 *  parent does not contain a start timestamp and duration
 */
const calculateEndTimestamp = (parent: any): Date | undefined => {
  const { startTimestamp, duration } = parent;
  if (startTimestamp && duration) {
    return addMilliseconds(startTimestamp, Number(duration));
  }
  return undefined;
};

/**
 * Schema used to convert and hydrate database sessions into client sessions
 */
const clientSessionSchema = Joi.object({
  id: Joi.number().optional(),
  userId: Joi.string().label("user_id"),
  taskId: Joi.number().label("task_id"),
  startTimestamp: Joi.date().label("start_timestamp"),
  endTimestamp: Joi.date().optional().default(calculateEndTimestamp),
  // duration must be after end_timestamp so that the calculation
  // occurs before duration is stripped
  duration: Joi.number().strip(),
  notes: Joi.string().trim().optional(),
  type: Joi.string().allow("session", "break", "long-break"),
  retroAdded: Joi.boolean().optional().label("retro_added"),
})
  .rename("user_id", "userId")
  .rename("task_id", "taskId")
  .rename("start_timestamp", "startTimestamp")
  .rename("retro_added", "retroAdded");

/**
 * Validate and convert a DatabaseSessionModel object into a ClientSessionModel object
 * @param session a ClientSessionModel-like object
 * @param options an object containing an optional isPartial key (to validate provided
 *  keys, not presence of all required keys)
 * @returns the object converted to a DatabaseSessionModel
 */
export const hydrateDatabaseSession = (
  session: any,
  options: { isPartial?: boolean } = {}
): ClientSessionModel => {
  return Joi.attempt(
    session,
    clientSessionSchema.options({
      stripUnknown: true,
      presence: options.isPartial ? "optional" : "required",
    })
  ) as ClientSessionModel;
};
