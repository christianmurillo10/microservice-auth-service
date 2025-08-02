import { Request, Response, NextFunction } from "express";
import joi from "joi";
import _ from "lodash";
import { validateInput } from "../../shared/helpers/common.helper";
import { MESSAGE_INVALID_BODY } from "../../shared/constants/message.constant";
import BadRequestException from "../../shared/exceptions/bad-request.exception";

export const create = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (_.isEmpty(req.body)) {
      throw new BadRequestException([MESSAGE_INVALID_BODY]);
    };

    const schema = joi.object({
      action: joi.string().label("Action").max(100).required(),
      resource: joi.string().label("Resource").max(100).required(),
      organizationId: joi.string().label("Organization").required(),
    });
    req.body = await validateInput(req.body, schema);
    next();
  } catch (error) {
    next(error);
  };
};

export const update = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (_.isEmpty(req.body)) {
      throw new BadRequestException([MESSAGE_INVALID_BODY]);
    };

    const schema = joi.object({
      action: joi.string().label("Action").max(100).empty(),
      resource: joi.string().label("Resource").max(100).empty(),
      organizationId: joi.string().label("Organization").empty(),
    });
    req.body = await validateInput(req.body, schema);
    next();
  } catch (error) {
    next(error);
  };
};

export const list = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    req.query?.filters ? req.query.filters = JSON.parse(<string>req.query.filters) : undefined;
    req.query?.sorting ? req.query.sorting = JSON.parse(<string>req.query.sorting) : undefined;

    const schema = joi.object({
      filters: joi.object({
        createdAt: joi.date().label("Date Created").empty(),
        updatedAt: joi.date().label("Last Modified").empty(),
        action: joi.string().label("Action").max(100).empty(),
        resource: joi.string().label("Resource").max(100).empty(),
        organizationId: joi.string().label("Organization").empty(),
      }).label("Filters").empty(),
      sorting: joi.object({
        createdAt: joi.string().label("Date Created").valid("asc", "desc").empty(),
        updatedAt: joi.string().label("Last Modified").valid("asc", "desc").empty(),
        action: joi.string().label("Action").valid("asc", "desc").empty(),
        resource: joi.string().label("Resource").valid("asc", "desc").empty(),
        organizationId: joi.string().label("Organization").valid("asc", "desc").empty(),
      }).label("Sorting").empty(),
      page: joi.number().min(1).label("Page").empty(),
      pageSize: joi.number().min(1).label("Page Size").empty(),
    });
    const stringifyQuery = JSON.stringify(await validateInput(req.query, schema));
    req.query = JSON.parse(stringifyQuery);
    next();
  } catch (error) {
    next(error);
  };
};

export const deleteByIds = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (_.isEmpty(req.body)) {
      throw new BadRequestException([MESSAGE_INVALID_BODY]);
    };

    const schema = joi.object({
      ids: joi.array()
        .items(joi.string())
        .min(1)
        .label("IDs")
        .required(),
    });
    req.body = await validateInput(req.body, schema);
    next();
  } catch (error) {
    next(error);
  };
};