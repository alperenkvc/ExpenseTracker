import React, { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import { prepareExpenseLineChartData } from '../../utils/helper';
import CustomLineChart from '../Charts/CustomLineChart';

const ExpenseOverview = ({ transactions, onExpenseIncome }) => {

    const [chartData, setChartData] = useState([]);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const result = prepareExpenseLineChartData(transactions);
        setChartData(result);
    }, [transactions]);

    useEffect(() => {
    console.log('Transactions:', transactions);
}, [transactions]);


    // Handler for Add Expense button
    const handleAddExpense = () => {
        setFeedback('Adding expense...');
        onExpenseIncome();
        setTimeout(() => {
            setFeedback('Expense added!');
            setTimeout(() => setFeedback(''), 1500);
        }, 500); // Simulate async feedback
    };

    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <div>
                    <h5 className='text-lg'>Expense Overview</h5>
                    <p className='text-xs text-gray-400 mt-0.5'>
                        Track your spending trends over time and gain insights where your money goes.
                    </p>
                </div>

                <button className='add-btn' onClick={handleAddExpense}>
                    <LuPlus className='text-lg'/>
                    Add Expense
                </button>
            </div>

            {feedback && (
                <div className="mt-4 text-green-600 text-sm">{feedback}</div>
            )}

            <div className='mt-10'>
                {chartData && chartData.length > 0 ? (
                    <CustomLineChart data={chartData}/>
                ) : (
                    <div className="text-center text-gray-400 py-8">
                        No expense data to display.
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExpenseOverview
