const xlsx = require("xlsx");
const User = require("../models/User.js");
const Income = require("../models/Income.js");

//Add income source
exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;

        //Validation: Check for missing fields
        if (!source) {
            return res.status(400).json({ error: true, message: "Source field is required" });
        }
        if (!amount) {
            return res.status(400).json({ error: true, message: "Amount field is required" });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: date ? new Date(date) : undefined //Set to default if not provided
        });

        await newIncome.save();
        res.status(200).json(newIncome);
    }catch (err){
        return res.status(500).json({error: true, message: "Internal server error"});
    }
}

//Get all income sources
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try{
        const income = await Income.find({userId}).sort({date: -1});
        res.status(200 ).json(income);
    }catch (err){
        return res.status(500).json({error: true, message: "Server error"});
    }
}

//Delete income source
exports.deleteIncome = async (req, res) => {
    try{
        await Income.findByIdAndDelete(req.params.id);
        res.json({message: "Income deleted successfully."});
    }catch(err){
        return res.status(500).json({error: true, message: "Server error"});
    }
}

//Download excel table of income sources
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try{
        const income = await Income.find({userId}).sort({date: -1});

        //Prepare data for Excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, "income_details.xlsx");
        res.download("income_details.xlsx");
    }catch(err){
        res.status(500).json({error: true, message: "Server error"});
    }
}