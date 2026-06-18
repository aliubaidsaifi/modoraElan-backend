import express from "express";
import { getAddresses, addAddress, deleteAddress, setDefaultAddress, getCustomers } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
router.get("/", protect, adminOnly, getCustomers);        // admin: customer list
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);
router.delete("/addresses/:id", protect, deleteAddress);
router.patch("/addresses/:id/default", protect, setDefaultAddress);
export default router;