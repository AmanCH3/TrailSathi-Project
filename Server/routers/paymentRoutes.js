const express = require("express");
const router = express.Router();
const { initiateEsewaPayment, verifyEsewaPayment, getTransactionHistory, getAllTransactionHistory } = require("../controllers/paymentController");
const { protect, authorize } = require('./../middlewares/authMiddleware');


router.post("/initiate", protect, initiateEsewaPayment);
router.get("/history", protect, getTransactionHistory);
router.get("/verify", verifyEsewaPayment);
router.get("/all-history", protect, authorize('admin'), getAllTransactionHistory);

module.exports = router;