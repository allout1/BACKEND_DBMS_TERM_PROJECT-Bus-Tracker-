import mongoose, { InferSchemaType, Schema } from "mongoose";
import { BusModel } from "./bus.model";

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    }, // [longitude, latitude]
    // required: true,
  },
});

locationSchema.index({ geometry: "2dsphere" });

// Pre-hook to remove location references from BusModel before deleting
locationSchema.pre('findOneAndDelete', async function (next) {
  const doc = await this.model.findOne(this.getFilter());
  if (doc) {
    await BusModel.updateMany(
      { "stoppage.location": doc._id },
      { $pull: { stoppage: { location: doc._id } } }
    );
  }
  next();
});

export const Location= mongoose.model("Location", locationSchema);

export type LocationType = InferSchemaType<typeof locationSchema>;