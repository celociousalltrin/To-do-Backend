import { validTypes } from "./types";

export const isValid = async <T>({
  db,
  fieldName,
  value,
  length = 1,
}: validTypes<T>) => {
  const exists = await db.find({
    [fieldName]: value,
  });

  return exists.length >= length;
};
