import Joi from "joi";

export const createSchema = Joi.object({
  roleId: Joi.string().label("Role").required(),
});

export const listSchema = Joi.object({
  filters: Joi.object({
    assignedAt: Joi.date().label("Date Assigned").empty(),
    userId: Joi.string().label("User").empty(),
    roleId: Joi.string().label("Role").empty(),
  }).label("Filters").empty(),
  sorting: Joi.object({
    assignedAt: Joi.string().label("Date Assigned").valid("asc", "desc").empty(),
    userId: Joi.string().label("User").valid("asc", "desc").empty(),
    roleId: Joi.string().label("Role").valid("asc", "desc").empty(),
  }).label("Sorting").empty(),
  page: Joi.number().min(1).label("Page").empty(),
  pageSize: Joi.number().min(1).label("Page Size").empty(),
});

export const syncSchema = Joi.object({
  permissionIds: Joi.array()
    .items(Joi.string())
    .min(1)
    .label("Role IDs")
    .required(),
});