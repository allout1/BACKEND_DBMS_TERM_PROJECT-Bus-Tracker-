import mongoose, { Schema } from "mongoose";

export const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
};
export const AvailableUserRoles = Object.values(UserRolesEnum);

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: AvailableUserRoles,
      default: UserRolesEnum.USER,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    }
  },
  { timestamps: true }
);
