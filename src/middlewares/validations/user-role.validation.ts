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
      userId: joi.string().label("User").required(),
      roleId: joi.string().label("Role").required(),
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
      userId: joi.string().label("User").empty(),
      roleId: joi.string().label("Role").empty(),
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
        assignedAt: joi.date().label("Date Assigned").empty(),
        userId: joi.string().label("User").empty(),
        roleId: joi.string().label("Role").empty(),
      }).label("Filters").empty(),
      sorting: joi.object({
        assignedAt: joi.string().label("Date Assigned").valid("asc", "desc").empty(),
        userId: joi.string().label("User").valid("asc", "desc").empty(),
        roleId: joi.string().label("Role").valid("asc", "desc").empty(),
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