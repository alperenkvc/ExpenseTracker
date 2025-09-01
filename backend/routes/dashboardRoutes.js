const express = require("express");
const {protect} = require("../middleware/authMiddleware.js");
const {getDashboardData, getAllTransactions} = require("../controllers/dashboardController.js");

const router = express.Router();

router.get("/", protect, getDashboardData);
router.get("/transactions", protect, getAllTransactions);

module.exports = router;