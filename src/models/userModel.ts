import { Schema, model, InferSchemaType, Types } from "mongoose";
import { generateEnnumErrorMessage } from "../utils/commonFunctions";

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      minlength: [4, "First Name must have atleast 4 chatracters, got {VALUE}"],
      maxlength: [12, "First Name must not have more than 12 chatracters"],
      required: [true, "Please Provide First Name"],
    },
    last_name: {
      type: String,
      minlength: [1, "Last Name must have atleast 1 chatracters"],
      maxlength: [12, "Last name must not have more than 12 chatracters"],
      required: [true, "Please Provide Last Name"],
    },
    user_name: {
      type: String,
      minlength: [3, "User name must have atleast 3 chatracters"],
      maxlength: [9, "User name must not have more than 9 chatracters"],
      unique: true,
      required: [true, "Please Provide User Name"],
    },
    email: {
      type: String,
      match: [
        /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        "Please Provide a valid Email",
      ],
      unique: true,
      required: [true, "Please Provide Email"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: generateEnnumErrorMessage,
      },
      required: [true, "Please Provide gender"],
    },
    password: {
      type: String,
      required: function () {
        return !(this as { is_external_authenticated_user: Boolean })
          .is_external_authenticated_user;
      },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export type userSchemaTypes = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};

export default model<userSchemaTypes>("User", userSchema);
