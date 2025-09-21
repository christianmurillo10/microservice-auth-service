import Joi from "joi";

export const createSchema = Joi.object({
  name: Joi.string().label("Name").max(100).required(),
});

export const updateSchema = Joi.object({
  name: Joi.string().label("Name").max(100).empty(),
});

export const listSchema = Joi.object({
  filters: Joi.object({
    createdAt: Joi.date().label("Date Created").empty(),
    updatedAt: Joi.date().label("Last Modified").empty(),
    name: Joi.string().label("Name").max(100).empty(),
  }).label("Filters").empty(),
  sorting: Joi.object({
    createdAt: Joi.string().label("Date Created").valid("asc", "desc").empty(),
    updatedAt: Joi.string().label("Last Modified").valid("asc", "desc").empty(),
    name: Joi.string().label("Name").valid("asc", "desc").empty(),
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