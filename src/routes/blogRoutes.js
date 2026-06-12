import express from "express";
import { getPosts, getPost } from "../controllers/blogController.js";

const router = express.Router();
router.get("/", getPosts);
router.get("/:id", getPost);
export default router;
