import { Schema } from "joi";
import { GenericObject } from "../types/common.type";

export const validateInput = async <I>(input: I, schema: Schema): Promise<I> => {
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  /** Filter unvalued input */
  input = input ?
    Object.assign({}, ...Object.entries(input).map(([key, value]) => {
      const newValue = value === "" || value === "null" || value === undefined ? null : value;
      return { [key]: newValue };
    }))
    : undefined;

  return await schema.validateAsync(input, options);
};

export const setSelectExclude = (val: string[]): GenericObject => {
  return val ? val.reduce((acc, item) => ({ ...acc, [item]: false }), {}) : {};
};