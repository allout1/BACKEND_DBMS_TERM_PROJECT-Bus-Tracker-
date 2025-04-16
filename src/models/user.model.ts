import mongoose, { Schema } from "mongoose";
import { BusModel } from "./bus.model";

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
      required: [true, "Password is required"]
    },
    socket_id: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Pre-hook to remove driver references from BusModel before deleting
UserSchema.pre('findOneAndDelete', async function (next) {
  const doc = await this.model.findOne(this.getFilter());
  if (doc) {
    await BusModel.updateMany(
      { driver: doc._id },
      { $unset: { driver: "" } } // simulate SET NULL
    );
  }
  next();
});

export const User = mongoose.model('User',UserSchema);
