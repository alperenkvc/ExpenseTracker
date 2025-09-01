require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/db.js");

const authRoutes = require("./routes/authRoutes.js");
const incomeRoutes = require("./routes/incomeRoutes.js");
const expenseRoutes = require("./routes/expenseRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");

const upload = require("./middleware/uploadMiddleware.js");

const app = express();

//Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

//Database connection
connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

//Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Server test
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});