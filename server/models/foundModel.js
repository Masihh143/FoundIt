import mongoose from "mongoose";

const foundSchema = mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, "Please provide the name of the found item"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    location: {
      type: String,
      required: [true, "Please mention where it was found"],
    },
    dateFound: {
      type: Date,
      required: [true, "Please provide the date the item was found"],
    },
    image: {
      type: String, // Optional — for image URLs
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The user who reported the found item
      required: true,
    },
    status: {
      type: String,
      enum: ["unclaimed", "returned"],
      default: "unclaimed",
    },
    matchedLost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lost",
    },
    returnedTo: {
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

const Found = mongoose.model("Found", foundSchema);
export default Found;
