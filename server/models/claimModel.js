import mongoose from "mongoose";

const claimSchema = mongoose.Schema(
  {
    found: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Found",
      required: true,
    },
    lost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lost",
      required: true,
    },
    claimerUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // owner of lost item
    },
    founderUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // reporter of found item
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    decisionAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Claim = mongoose.model("Claim", claimSchema);
export default Claim;


