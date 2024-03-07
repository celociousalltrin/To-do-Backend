import { Response } from "express";
import {
  type responseDetailsTypes,
  successResponseTypes,
  errorResponseTypes,
} from "./utilsTypes";

export const notFoundResponse = function (
  res: Response,
  message?: responseDetailsTypes
) {
  var data = {
    status: "ERROR",
    message,
  };
  return res.status(404).json(data);
};

export const successResponse = async ({
  res,
  responseDetails,
  response_data,
  status = 200,
  new_access_token,
}: successResponseTypes) => {
  const responseFormat = {
    status: "SUCCESS",
    new_access_token,
    response_data,
    message: (responseDetails as responseDetailsTypes)?.message,
    code: (responseDetails as responseDetailsTypes)?.code,
  };
  return await res.status(status).json(responseFormat);
};

export const errorResponse = async ({
  res,
  responseDetails,
  status = 420,
}: errorResponseTypes) => {
  const responseFormat = {
    status: "ERROR",
    message: (responseDetails as responseDetailsTypes)?.message,
    code: (responseDetails as responseDetailsTypes)?.code,
  };
  return await res.status(status).json(responseFormat);
};
