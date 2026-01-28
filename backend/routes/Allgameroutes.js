import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getgamedetails, launchGame, transferBalance } from "../controllers/Allgamecontroller.js";

const router = express.Router();

router.post("/get/game", authMiddleware, launchGame);
router.get("/balance/transfer", authMiddleware, transferBalance);
router.post("/get/all-game", authMiddleware, getgamedetails);

export default router;