import Joi from "joi";

export const createSchema = Joi.object({
  action: Joi.string().label("Action").max(100).required(),
  resource: Joi.string().label("Resource").max(100).required(),
});

export const updateSchema = Joi.object({
  action: Joi.string().label("Action").max(100).empty(),
  resource: Joi.string().label("Resource").max(100).empty(),
});

export const listSchema = Joi.object({
  filters: Joi.object({
    createdAt: Joi.date().label("Date Created").empty(),
    updatedAt: Joi.date().label("Last Modified").empty(),
    action: Joi.string().label("Action").max(100).empty(),
    resource: Joi.string().label("Resource").max(100).empty(),
  }).label("Filters").empty(),
  sorting: Joi.object({
    createdAt: Joi.string().label("Date Created").valid("asc", "desc").empty(),
    updatedAt: Joi.string().label("Last Modified").valid("asc", "desc").empty(),
    action: Joi.string().label("Action").valid("asc", "desc").empty(),
    resource: Joi.string().label("Resource").valid("asc", "desc").empty(),
  }).label("Sorting").empty(),
  page: Joi.number().min(1).label("Page").empty(),
  pageSize: Joi.number().min(1).label("Page Size").empty(),
});

export const deleteByIdsSchema = Joi.object({
  ids: Joi.array()
    .items(Joi.string())
    .min(1)
    .label("IDs")
    .required(),
});