import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/responseHandler";
import userModel from "../models/userModel";
import { isValid } from "../service/validationService";
import { responseMessage } from "../utils/responseMessage";
import {
  assignRefreshTokeninCookie,
  customError,
  generateAccessToken,
} from "../utils/commonFunctions";
import bcrypt from "bcryptjs";

import { type userSchemaTypes } from "../models/userModel";

export const createuser = [
  async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const { user_name, email } = body;

      const isUsernameExist = await isValid<userSchemaTypes>({
        db: userModel,
        fieldName: "user_name",
        value: user_name,
      });

      if (isUsernameExist) {
        return errorResponse({
          res,
          responseDetails: responseMessage("ER002"),
          status: 422,
        });
      }

      const isEmailExist = await isValid<userSchemaTypes>({
        db: userModel,
        fieldName: "email",
        value: email,
      });

      if (isEmailExist) {
        return errorResponse({
          res,
          responseDetails: responseMessage("ER003"),
          status: 422,
        });
      }

      const createuser = new userModel(body);
      await createuser.save();

      return successResponse({
        res,
        responseDetails: responseMessage("OK001"),
      });
    } catch (err: any) {
      console.log("🚀 ~ err:", err);
      customError(res, err);
    }
  },
];

export const login = [
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const getUser = await userModel.findOne({
        email,
      });

      if (!getUser)
        return errorResponse({
          res,
          responseDetails: responseMessage("ER003"),
          status: 404,
        });

      const hash = bcrypt.compareSync(password, getUser.password as string);
      if (!hash)
        return errorResponse({
          res,
          responseDetails: responseMessage("ER004"),
          status: 404,
        });

      assignRefreshTokeninCookie(res, { user_email: getUser.email });

      return successResponse({
        res,
        response_data: {
          access_token: generateAccessToken({ user_email: getUser.email }),
        },
        responseDetails: responseMessage("OK002"),
        new_access_token: req.new_access_token,
      });
    } catch (err: any) {
      console.log("🚀 ~ async ~ err:", err);
      customError(res, err);
    }
  },
];
