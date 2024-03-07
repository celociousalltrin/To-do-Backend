import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { errorResponse } from "./responseHandler";
import { responseMessage } from "./responseMessage";
import { Request, Response } from "express";
import { responseDetailsTypes, tokenGenertionDataTypes } from "./utilsTypes";

export const customError = (res: Response, err: Record<string, any>) => {
  if (err instanceof CustomErrorGenerator) {
    return errorResponse({
      res,
      responseDetails: err.responseDetails,
      status: err.status,
    });
  }
  const msg = err?.message?.split(":")[2];
  switch (err?.name) {
    case "ValidationError":
      if (msg) {
        return errorResponse({
          res,
          responseDetails: { code: "ME001", message: msg as string },
        });
      } else {
        return errorResponse({
          res,
          responseDetails: responseMessage("ER999"),
        });
      }
    case "MongoServerError":
      if (err?.code === 11000) {
        return errorResponse({
          res,
          responseDetails: {
            code: "ME002",
            message: err?.keyValue
              ? `${Object.keys(err?.keyValue)[0]} is already taken`
              : "Mongo Something went Wrong",
          },
        });
      } else {
        return errorResponse({
          res,
          responseDetails: responseMessage("ER999"),
        });
      }
    default:
      return errorResponse({ res, responseDetails: responseMessage("ER999") });
  }
};

//Class based Cusom Error For Service Layer to mainatain SST(Single Source of Truth) for
// error,Error is always in the Controller Layer
export class CustomErrorGenerator {
  constructor(
    public responseDetails: responseDetailsTypes,
    public status: number = 420
  ) {
    this.responseDetails = responseDetails;
    this.status = status;
  }
}

export const generateEnnumErrorMessage = (props: Record<string, any>) => {
  const y = props.enumValues.join(", ");
  return `${props.value} is not a valid value for ${props.path}. Allowed values are ${y}`;
};

export const dataHashing = (data: string) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(data, salt);
  return hash;
};

export const generateAccessToken = (
  data: tokenGenertionDataTypes,
  expiresIn = "15m"
) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn,
  });
};

const generateRefreshToken = (
  data: tokenGenertionDataTypes,
  expiresIn: string
) => {
  return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn,
  });
};

export const assignRefreshTokeninCookie = (
  res: Response,
  data: tokenGenertionDataTypes,
  expiresIn = "12h"
) => {
  //Cookie expire time needs to set in milliseconds
  res.cookie("refresh_token", generateRefreshToken(data, expiresIn), {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 12 * 60 * 60 * 1000,
  });
};

export const tokenVerification = (
  err: jwt.VerifyErrors | null,
  decoded: string | jwt.JwtPayload | undefined,
  tokenType: string,
  req: Request
) => {
  switch (err?.name) {
    case "JsonWebTokenError":
      return err?.name;
    case "TokenExpiredError":
      if (tokenType === "accessToken") {
        req.new_access_token = generateAccessToken({
          user_email: (decoded as { user_email: string })?.user_email,
        });
      } else {
        return { refresh_token_expired: true };
      }
      return { is_expired: true };
    default:
      return decoded;
  }
};

const otpLength = (len: number) => {
  return parseInt("1" + "0".repeat(len));
};

export const OtpGenerator = (length = 4) => {
  return Math.floor(Math.random() * otpLength(length))
    .toString()
    .padStart(4, "0");
};

export const getFrontEndAppURL = (environment: string) => {
  if (environment === "development") {
    return "http://127.0.0.1:5174";
  } else {
    return process.env.REACT_APP_URL as string;
  }
};

export const getBackEndAppURL = (environment: string) => {
  if (environment === "development") {
    return "http://localhost:5555/api";
  } else {
    return process.env.EXPRESS_APP_URL as string;
  }
};

export const dateInMilliseconds = (number: number, format = "minutes") => {
  switch (format) {
    case "seconds":
      return number * 1000;
    case "minutes":
      return number * 60 * 1000;
    case "hours":
      return number * 60 * 60 * 1000;
    case "days":
      return number * 24 * 60 * 60 * 1000;
    case "weeks":
      return number * 7 * 24 * 60 * 60 * 1000;
    case "months":
      return number * 30 * 24 * 60 * 60 * 1000;
    case "years":
      return number * 365 * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
};
