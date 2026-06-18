import express from "express";
import { createOrder, getMyOrders, getOrders, updateOrderStatus } from "../controllers/orderController.js";
import { protect, adminOnly, optionalAuth } from "../middleware/auth.js";

const router = express.Router();
router.post("/", optionalAuth, createOrder);          // public/logged-in
router.get("/my", protect, getMyOrders);              // logged-in customer's orders
router.get("/", protect, adminOnly, getOrders);       // admin — all
router.patch("/:id", protect, adminOnly, updateOrderStatus); // admin
export default router;