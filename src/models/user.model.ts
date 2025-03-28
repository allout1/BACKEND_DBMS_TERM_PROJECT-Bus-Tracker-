import mongoose, { Schema } from "mongoose";

export const UserRolesEnum = {
  ADMIN: "admin",
  USER: "user",
  DRIVER: "driver"
};
export const AvailableUserRoles = Object.values(UserRolesEnum);

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
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
      select: false
    },
    socket_id: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export const User = mongoose.model('User',UserSchema);
