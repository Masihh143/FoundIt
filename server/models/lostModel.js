import mongoose from "mongoose";

const lostSchema = mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, "Please provide the name of the lost item"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    location: {
      type: String,
      required: [true, "Please mention where it was lost"],
    },
    dateLost: {
      type: Date,
      required: [true, "Please provide the date the item was lost"],
    },
    image: {
      type: String, // Optional — can store image URL if you allow uploads
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to the user who reported it
      required: true,
    },
    status: {
      type: String,
      enum: ["lost", "found"],
      default: "lost",
    },
    matchedFound: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Found",
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Lost = mongoose.model("Lost", lostSchema);
export default Lost;
