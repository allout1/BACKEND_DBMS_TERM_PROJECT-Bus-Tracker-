import mongoose, { InferSchemaType, Schema } from "mongoose";

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
export const Location= mongoose.model("Location", locationSchema);

export type LocationType = InferSchemaType<typeof locationSchema>;