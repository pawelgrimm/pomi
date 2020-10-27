import Joi from "joi";
import { ClientSessionModel, DatabaseSessionModel } from "../models";

/**
 * Schemas listed as optional are always optional.
 * Schemas without a presence requirement are required unless presence is set to
 * "required", which is accomplished using the isPartial flag
 */

const clientSessionSchema = Joi.object({
  startTimestamp: Joi.date().iso(),
  endTimestamp: Joi.date().iso(),
  task: Joi.string().trim(),
  project: Joi.string().trim().optional(),
  notes: Joi.string().trim().optional(),
  retroAdded: Joi.boolean().optional(),
});

export const validateClientSession = (
  session: Partial<ClientSessionModel>,
  options: { isPartial: boolean } = { isPartial: false }
): ClientSessionModel => {
  return Joi.attempt(
    session,
    clientSessionSchema.options({
      stripUnknown: true,
      presence: options.isPartial ? "optional" : "required",
    })
  ) as ClientSessionModel;
};

const databaseSessionSchema = Joi.object({
  start_timestamp: Joi.date().iso(),
  duration: Joi.string().pattern(/^\d+ (milli)?seconds$/),
  task: Joi.string().trim(),
  project: Joi.string().trim().optional(),
  notes: Joi.string().trim().optional(),
  retro_added: Joi.boolean().optional(),
});

export const validateDatabaseSession = (
  session: Partial<DatabaseSessionModel>,
  options: { isPartial: boolean } = { isPartial: false }
): DatabaseSessionModel => {
  return Joi.attempt(
    session,
    databaseSessionSchema.options({
      stripUnknown: true,
      presence: options.isPartial ? "optional" : "required",
    })
  ) as DatabaseSessionModel;
};
