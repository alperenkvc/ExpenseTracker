import React, { useState, useEffect } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance.js';
import { toast } from 'react-hot-toast';
import DeleteAlert from '../../components/DeleteAlert.jsx';
import Modal from "../../components/Modal.jsx"
import moment from "moment"
import { LuArrowRight, LuTrash2 } from 'react-icons/lu'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Transactions = () => {
  useUserAuth();

  const [transactions, setTransactions] = useState([]);
  const [balanceData, setBalanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  });

  // Get all transactions for the last 30 days
  const fetchTransactions = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_TRANSACTIONS}`);

      if (response.data) {
        setTransactions(response.data.transactions);
        setBalanceData(response.data.balanceData);
      }
    } catch (error) {
      console.error("Something went wrong, please try again:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  // Delete transaction (income or expense)
  const deleteTransaction = async (transactionId, type) => {
    try {
      if (type === "income") {
        await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(transactionId));
      } else {
        await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(transactionId));
      }

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Transaction deleted successfully!");
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error.response?.data?.message || error.message);
      toast.error("Failed to delete transaction");
    }
  }

  // Custom tooltip for the balance chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white shadow-md rounded-lg p-3 border border-gray-300'>
          <p className='text-sm font-semibold text-gray-800 mb-1'>
            {moment(label).format("MMM DD, YYYY")}
          </p>
          <p className='text-sm text-gray-600'>
            Balance: <span className='text-sm font-medium text-gray-900'>${payload[0].value?.toFixed(2)}</span>
          </p>
        </div>
      )
    }
    return null;
  }

  useEffect(() => {
    fetchTransactions();
    return () => { }
  }, [])

  return (
    <DashboardLayout activeMenu="Transactions">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          {/* Balance Chart */}
          <div className='card'>
            <div className='flex items-center justify-between mb-6'>
              <h5 className='text-lg'>Balance Over Time (Last 30 Days)</h5>
            </div>
            
            <div className='bg-white rounded-lg p-4'>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={balanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: "#555" }}
                    tickFormatter={(value) => moment(value).format("MMM DD")}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: "#555" }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#875cf5" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#875cf5" }}
                    activeDot={{ r: 6, fill: "#875cf5" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transactions List */}
          <div className='card'>
            <div className='flex items-center justify-between mb-6'>
              <h5 className='text-lg'>Recent Transactions (Last 30 Days)</h5>
            </div>

            <div className='space-y-4'>
              {loading ? (
                <div className='text-center py-8'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
                  <p className='text-gray-500 mt-2'>Loading transactions...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className='text-center py-8'>
                  <p className='text-gray-500'>No transactions found in the last 30 days</p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className='flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow group'
                  >
                    <div className='flex items-center space-x-4'>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                        transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.icon ? (
                          transaction.icon.startsWith('http') ? (
                            <img src={transaction.icon} alt={transaction.type === 'income' ? transaction.source : transaction.category} className='w-6 h-6' />
                          ) : (
                            transaction.icon
                          )
                        ) : (
                          transaction.type === 'income' ? '💰' : '💸'
                        )}
                      </div>
                      
                      <div>
                        <h6 className='font-medium text-gray-900'>
                          {transaction.type === 'income' ? transaction.source : transaction.category}
                        </h6>
                        <p className='text-sm text-gray-500'>
                          {moment(transaction.date).format("MMM DD, YYYY")}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center space-x-3'>
                      <span className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                      </span>
                      
                      <button
                        onClick={() => setOpenDeleteAlert({
                          show: true,
                          data: { id: transaction._id, type: transaction.type }
                        })}
                        className='opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:bg-red-50 rounded-full'
                        title="Delete transaction"
                      >
                        <LuTrash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Transaction"
        >
          <DeleteAlert
            content="Are you sure you want to delete this transaction?"
            onDelete={() => deleteTransaction(openDeleteAlert.data.id, openDeleteAlert.data.type)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Transactions
