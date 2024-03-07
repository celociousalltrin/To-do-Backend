import { Schema, model, InferSchemaType, Types } from "mongoose";

const taskSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please Provide UserID"],
    },
    title: {
      type: String,
      minlength: [4, "Title must have atleast 4 chatracters, got {VALUE}"],
      maxlength: [12, "Title must not have more than 12 chatracters"],
      required: [true, "Please Provide Title"],
    },
    description: {
      type: String,
      minlength: [
        10,
        "Description must have atleast 10 chatracters, got {VALUE}",
      ],
      maxlength: [50, "Description must not have more than 50 chatracters"],
      required: [true, "Please Provide Description"],
    },
    is_deleted: { type: Boolean, default: false },
    is_completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type taskSchemaTypes = InferSchemaType<typeof taskSchema> & {
  _id: Types.ObjectId;
};

export default model<taskSchemaTypes>("task", taskSchema);
