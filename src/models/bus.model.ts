import mongoose, { Schema } from "mongoose";
import { Location } from "./location.model";
import { User } from "./user.model";

const BusSchema = new Schema({
  bus_number: {
    type: String,
    required: true,
    trim: true
  },  
  stoppage: {
    type: [
      {
        location: {
          type: Schema.Types.ObjectId,
          ref: "Location",
          required: true,
        },
        time: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
    validate: {
      validator: function (v: any) {
        return Array.isArray(v);
      },
      message: "Stoppage must be an array of objects",
    },
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }

}, { timestamps: true }
);
export const BusModel = mongoose.model("BusModel", BusSchema);