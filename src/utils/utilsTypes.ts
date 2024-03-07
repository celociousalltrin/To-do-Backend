import { Response } from "express";

export type responseDetailsTypes = { code: string; message: string };

export type successResponseTypes = {
  res: Response;
  responseDetails?: responseDetailsTypes;
  response_data?: unknown;
  status?: number;
  new_access_token?: string;
};

export type errorResponseTypes = Omit<
  successResponseTypes,
  "response_data" | "new_access_token"
>;

export type tokenGenertionDataTypes = {
  user_email: string;
};
