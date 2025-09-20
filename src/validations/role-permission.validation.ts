import joi from "joi";

export const createSchema = joi.object({
  permissionId: joi.string().label("Permission").required(),
});

export const listSchema = joi.object({
  filters: joi.object({
    assignedAt: joi.date().label("Date Assigned").empty(),
    roleId: joi.string().label("Role").empty(),
    permissionId: joi.string().label("Permission").empty(),
  }).label("Filters").empty(),
  sorting: joi.object({
    assignedAt: joi.string().label("Date Assigned").valid("asc", "desc").empty(),
    roleId: joi.string().label("Role").valid("asc", "desc").empty(),
    permissionId: joi.string().label("Permission").valid("asc", "desc").empty(),
  }).label("Sorting").empty(),
  page: joi.number().min(1).label("Page").empty(),
  pageSize: joi.number().min(1).label("Page Size").empty(),
});

export const syncSchema = joi.object({
  permissionIds: joi.array()
    .items(joi.string())
    .min(1)
    .label("Permission IDs")
    .required(),
});