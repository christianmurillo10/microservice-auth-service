import joi from "joi";

export const createSchema = joi.object({
  action: joi.string().label("Action").max(100).required(),
  resource: joi.string().label("Resource").max(100).required(),
});

export const updateSchema = joi.object({
  action: joi.string().label("Action").max(100).empty(),
  resource: joi.string().label("Resource").max(100).empty(),
});

export const listSchema = joi.object({
  filters: joi.object({
    createdAt: joi.date().label("Date Created").empty(),
    updatedAt: joi.date().label("Last Modified").empty(),
    action: joi.string().label("Action").max(100).empty(),
    resource: joi.string().label("Resource").max(100).empty(),
  }).label("Filters").empty(),
  sorting: joi.object({
    createdAt: joi.string().label("Date Created").valid("asc", "desc").empty(),
    updatedAt: joi.string().label("Last Modified").valid("asc", "desc").empty(),
    action: joi.string().label("Action").valid("asc", "desc").empty(),
    resource: joi.string().label("Resource").valid("asc", "desc").empty(),
  }).label("Sorting").empty(),
  page: joi.number().min(1).label("Page").empty(),
  pageSize: joi.number().min(1).label("Page Size").empty(),
});

export const deleteByIdsSchema = joi.object({
  ids: joi.array()
    .items(joi.string())
    .min(1)
    .label("IDs")
    .required(),
});