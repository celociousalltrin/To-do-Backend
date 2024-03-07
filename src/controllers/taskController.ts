import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/responseHandler";
import { responseMessage } from "../utils/responseMessage";
import { customError } from "../utils/commonFunctions";
import taskModel from "../models/taskModel";
import { record_limit } from "../utils/helper";

export const getUserTask = [
  async (req: Request, res: Response) => {
    try {
      const {
        new_access_token,
        userDetails: { _id },
        query: { skip = 0, limit = record_limit },
      } = req;

      const result = await taskModel
        .find({
          user_id: _id,
          is_deleted: false,
        })
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit));

      return successResponse({
        res,
        response_data: result,
        new_access_token,
      });
    } catch (err: any) {
      console.log("🚀 ~ async ~ err:", err);
      customError(res, err);
    }
  },
];

export const createTask = [
  async (req: Request, res: Response) => {
    try {
      const {
        new_access_token,
        body,
        userDetails: { _id },
      } = req;

      const newTask = new taskModel({
        user_id: _id,
        body,
      });

      await newTask.save();

      return successResponse({
        res,
        responseDetails: responseMessage("OK003"),
        new_access_token,
      });
    } catch (err: any) {
      console.log("🚀 ~ err:", err);
      customError(res, err);
    }
  },
];

export const updateTask = [
  async (req: Request, res: Response) => {
    try {
      const {
        new_access_token,
        params: { id },
      } = req;

      const task = await taskModel.findById(id);

      if (!task) {
        return errorResponse({
          res,
          responseDetails: responseMessage("ER004"),
        });
      }

      if (task.is_deleted) {
        return errorResponse({
          res,
          responseDetails: responseMessage("ER005"),
        });
      }

      await taskModel.findByIdAndUpdate({ id }, { is_completed: true });

      return successResponse({
        res,
        responseDetails: responseMessage("OK004"),
        new_access_token,
      });
    } catch (err: any) {
      console.log("🚀 ~ async ~ err:", err);
      customError(res, err);
    }
  },
];

export const deleteTask = [
  async (req: Request, res: Response) => {
    try {
      const {
        new_access_token,
        params: { id },
      } = req;

      const task = await taskModel.findById(id);

      if (!task) {
        return errorResponse({
          res,
          responseDetails: responseMessage("ER004"),
        });
      }

      if (task.is_deleted) {
        return errorResponse({
          res,
          responseDetails: responseMessage("ER006"),
        });
      }

      await taskModel.findByIdAndUpdate({ id }, { is_deleted: true });

      return successResponse({
        res,
        responseDetails: responseMessage("OK005"),
        new_access_token,
      });
    } catch (err: any) {
      console.log("🚀 ~ async ~ err:", err);
      customError(res, err);
    }
  },
];
