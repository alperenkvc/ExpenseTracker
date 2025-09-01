const xlsx = require("xlsx");
const User = require("../models/User.js");
const Expense = require("../models/Expense.js");

//Add expense source
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        //Validation: Check for missing fields
        if (!category) {
            return res.status(400).json({ error: true, message: "Category field is required" });
        }
        if (!amount) {
            return res.status(400).json({ error: true, message: "Amount field is required" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: date ? new Date(date) : undefined //Set to default if not provided
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    }catch (err){
        return res.status(500).json({error: true, message: "Internal server error"});
    }
}

//Get all expense sources
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try{
        const expense = await Expense.find({userId}).sort({date: -1});
        res.status(200 ).json(expense);
    }catch (err){
        return res.status(500).json({error: true, message: "Server error"});
    }
}

//Delete expense source
exports.deleteExpense = async (req, res) => {
    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.json({message: "Expense deleted successfully."});
    }catch(err){
        return res.status(500).json({error: true, message: "Server error"});
    }
}

//Download excel table of expense sources
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try{
        const expense = await Expense.find({userId}).sort({date: -1});

        //Prepare data for Excel
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, "expense_details.xlsx");
        res.download("expense_details.xlsx");
    }catch(err){
        res.status(500).json({error: true, message: "Server error"});
    }
}