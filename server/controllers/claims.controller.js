import Claim from "../models/claimModel.js";
import Found from "../models/foundModel.js";
import Lost from "../models/lostModel.js";

// GET /api/claims/my - founder's pending claims
export const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ founderUser: req.userId, status: "pending" })
      .populate({ path: "found", select: "itemName image location dateFound" })
      .populate({ path: "lost", select: "itemName image location dateLost" })
      .populate({ path: "claimerUser", select: "name email" });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/claims/:id/decision { decision: 'accept' | 'reject' }
export const decideClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision } = req.body;

    const claim = await Claim.findById(id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    if (claim.founderUser.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to decide this claim" });
    }

    if (!["accept", "reject"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision" });
    }

    if (decision === "reject") {
      claim.status = "rejected";
      claim.decisionAt = new Date();
      await claim.save();
      return res.json({ message: "Claim rejected", claim });
    }

    // Accept flow: close both found and lost
    const foundItem = await Found.findById(claim.found);
    const lostItem = await Lost.findById(claim.lost);

    if (!foundItem || !lostItem) {
      return res.status(404).json({ message: "Linked items not found" });
    }

    foundItem.status = "returned";
    foundItem.matchedLost = lostItem._id;
    foundItem.returnedTo = claim.claimerUser;
    foundItem.resolvedAt = new Date();

    lostItem.status = "found";
    lostItem.matchedFound = foundItem._id;
    lostItem.resolvedBy = claim.founderUser;
    lostItem.resolvedAt = new Date();

    await foundItem.save();
    await lostItem.save();

    claim.status = "accepted";
    claim.decisionAt = new Date();
    await claim.save();

    res.json({ message: "Claim accepted and items updated", claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


