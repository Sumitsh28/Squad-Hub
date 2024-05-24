import express from "express";
import {
  createBlitz,
  deleteBlitz,
  getBlitz,
  likeUnlikeBlitz,
  replyToBlitz,
  getFeedBlitzs,
  getUserBlitzs,
} from "../controllers/blitzController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedBlitzs);
router.get("/:id", getBlitz);
router.get("/user/:username", getUserBlitzs);
router.post("/create", protectRoute, createBlitz);
router.delete("/:id", protectRoute, deleteBlitz);
router.put("/like/:id", protectRoute, likeUnlikeBlitz);
router.put("/reply/:id", protectRoute, replyToBlitz);

export default router;
