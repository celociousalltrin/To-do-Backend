import { Model } from "mongoose";

export type validTypes<T> = {
  [fieldName: string]: any;
  db: Model<T>;
  value: string | number;
  length?: number;
};
