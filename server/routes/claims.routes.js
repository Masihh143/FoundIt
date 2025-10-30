import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getMyClaims, decideClaim } from "../controllers/claims.controller.js";

const router = express.Router();

// Founder routes
router.get("/my", isAuth, getMyClaims);
router.post("/:id/decision", isAuth, decideClaim);

export default router;


