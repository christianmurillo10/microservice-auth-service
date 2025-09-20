import joi from "joi";

export const createSchema = joi.object({
  name: joi.string().label("Name").max(100).required(),
});

export const updateSchema = joi.object({
  name: joi.string().label("Name").max(100).empty(),
});

export const listSchema = joi.object({
  filters: joi.object({
    createdAt: joi.date().label("Date Created").empty(),
    updatedAt: joi.date().label("Last Modified").empty(),
    name: joi.string().label("Name").max(100).empty(),
  }).label("Filters").empty(),
  sorting: joi.object({
    createdAt: joi.string().label("Date Created").valid("asc", "desc").empty(),
    updatedAt: joi.string().label("Last Modified").valid("asc", "desc").empty(),
    name: joi.string().label("Name").valid("asc", "desc").empty(),
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