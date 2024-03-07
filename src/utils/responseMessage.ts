import { responseDetailsTypes } from "./utilsTypes";

const responseData = [
  { code: "OK001", message: "User Created Successfully" },
  {
    code: "OK002",
    message: "Logged in successfully",
  },
  {
    code: "OK003",
    message: "Task Created Successfully",
  },
  {
    code: "OK004",
    message: "Task Completed",
  },
  {
    code: "OK005",
    message: "Task Deleted",
  },
  { code: "ER999", message: "Something went wrong" },
  { code: "ER001", message: "Requested Page not found" },
  { code: "ER002", message: "UserName Already Exist" },
  { code: "ER003", message: "Email Already Exist" },
  {
    code: "ER004",
    message: "Your Password is Wrong",
  },
  {
    code: "ER004",
    message: "There is no task found",
  },
  {
    code: "ER005",
    message: "The task you have try to update is deleted",
  },
  {
    code: "ER006",
    message: "The task you have try to delete is already deleted",
  },
  { code: "ER901", message: "Please Autheticate" },
  { code: "ER902", message: "No User Found" },
] as const;

export const responseMessage = (
  code: (typeof responseData)[number]["code"]
): responseDetailsTypes => {
  const info = responseData.find(
    (o) => o.code === code
  ) as responseDetailsTypes;
  return info;
};
