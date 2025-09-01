const Income = require("../models/Income.js");
const User = require("../models/User.js");
const Expense = require("../models/Expense.js");
const { isValidObjectId, Types } = require("mongoose");

//Dashboard data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        //Fetch total income & expenses
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        console.log("totalIncome", { totalIncome, userId: isValidObjectId(userId) });

        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        console.log("totalExpense", { totalExpense, userId: isValidObjectId(userId) });

        //Get income transactions in the last 30 days
        const last30DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        //Get total income for the last 30 days
        const incomeLast30Days = last30DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        //Get expense transactions in the last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        //Get total expense for the last 30 days
        const expenseLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        // Fetch last 5 transactions (income & expense)
        const incomeTxns = (await Income.find({ userId }).sort({ date: -1 }).limit(5))
            .map(txn => ({ ...txn.toObject(), type: "income" }));

        const expenseTxns = (await Expense.find({ userId }).sort({ date: -1 }).limit(5))
            .map(txn => ({ ...txn.toObject(), type: "expense" }));

        const lastTransactions = [...incomeTxns, ...expenseTxns].sort((a, b) => b.date - a.date);


        //Final response
        res.json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpense: {
                total: expenseLast30Days,
                transactions: last30DaysExpenseTransactions
            },
            last30DaysIncome: {
                total: incomeLast30Days,
                transactions: last30DaysIncomeTransactions
            },
            recentTransactions: lastTransactions
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}

//Get all transactions (income & expense) for the last 30 days
exports.getAllTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        //Get income transactions in the last 30 days
        const incomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        //Get expense transactions in the last 30 days
        const expenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        // Combine and format transactions
        const incomeTxns = incomeTransactions.map(txn => ({ 
            ...txn.toObject(), 
            type: "income",
            transactionId: txn._id
        }));

        const expenseTxns = expenseTransactions.map(txn => ({ 
            ...txn.toObject(), 
            type: "expense",
            transactionId: txn._id
        }));

        const allTransactions = [...incomeTxns, ...expenseTxns].sort((a, b) => b.date - a.date);

        // Calculate balance over time for chart
        const balanceData = [];
        
        // Get total balance before the 30-day period
        const totalIncomeBefore = await Income.aggregate([
            { $match: { 
                userId: userObjectId,
                date: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            }},
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const totalExpenseBefore = await Expense.aggregate([
            { $match: { 
                userId: userObjectId,
                date: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            }},
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const balanceBefore30Days = (totalIncomeBefore[0]?.total || 0) - (totalExpenseBefore[0]?.total || 0);
        let runningBalance = balanceBefore30Days;
        
        // Sort by date ascending for balance calculation
        const sortedTransactions = [...allTransactions].sort((a, b) => a.date - b.date);
        
        // Add initial balance point if there are transactions
        if (sortedTransactions.length > 0) {
            balanceData.push({
                date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                balance: runningBalance
            });
        }
        
        sortedTransactions.forEach(transaction => {
            if (transaction.type === "income") {
                runningBalance += transaction.amount;
            } else {
                runningBalance -= transaction.amount;
            }
            
            balanceData.push({
                date: transaction.date,
                balance: runningBalance
            });
        });

        res.json({
            transactions: allTransactions,
            balanceData: balanceData
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}