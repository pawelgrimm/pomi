import Joi from "joi";
import { DbReadySessionModel, SessionModel } from "../types";
import { calculateDuration, calculateEndTimestamp } from "../utils";

const NOTES_LENGTH_LIMIT = 1000;

/*
 * Note: Schemas listed as optional are always optional.
 * Schemas without a presence requirement are required unless presence is set to
 * "required", which is accomplished using the isPartial flag
 */

/**
 * Schema used to convert and hydrate database sessions into client sessions
 */
const sessionSchemaSoft = Joi.object({
  id: Joi.string().uuid({ version: "uuidv4" }).optional(),
  taskId: Joi.string().uuid({ version: "uuidv4" }),
  startTimestamp: Joi.date().iso(),
  endTimestamp: Joi.date().optional().default(calculateEndTimestamp),
  duration: Joi.number().optional().default(calculateDuration),
  notes: Joi.string().trim().optional().max(NOTES_LENGTH_LIMIT),
  type: Joi.string().allow("session", "break", "long-break"),
  isRetroAdded: Joi.boolean().optional().default(false),
});

const sessionSchemaHard = sessionSchemaSoft.or("endTimestamp", "duration");

/**
 * Validate a Session
 * @param session a SessionModel-like object
 * @param options an object containing an optional isPartial key (to validate provided
 *  keys and not require presence of all required keys)
 * @returns the object as a SessionModel
 */
export const validateSession = (
  session: any,
  options: { isPartial?: boolean } = {}
): DbReadySessionModel => {
  return Joi.attempt(
    session,
    (options.isPartial ? sessionSchemaSoft : sessionSchemaHard).options({
      stripUnknown: true,
      presence: options.isPartial ? "optional" : "required",
    })
  ) as DbReadySessionModel;
};

/**
 * Validate and convert a DatabaseSessionModel object into a SessionModel object
 * @param session a SessionModel-like object
 * @param options an object containing an optional isPartial key (to validate provided
 *  keys, not presence of all required keys)
 * @returns the object converted to a DatabaseSessionModel
 */
export const hydrateDatabaseSession = (
  session: any,
  options: { isPartial?: boolean } = {}
): SessionModel => {
  return validateSession(session, options);
};
