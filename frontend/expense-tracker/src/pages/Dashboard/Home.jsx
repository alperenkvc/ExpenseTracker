import React, { useEffect, useState } from 'react'
import { useUserAuth } from "../../hooks/useUserAuth"
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import InfoCard from '../../components/Cards/InfoCard';
import { IoMdCard } from "react-icons/io"
import { LuHandCoins, LuWallet, LuWalletMinimal } from 'react-icons/lu';
import { addThousandsSeperator } from '../../utils/helper';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashbaordData = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Something went wrong, please try again.", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashbaordData();
    return () => { };
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeperator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeperator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />

          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandsSeperator(dashboardData?.totalExpense || 0)}
            color="bg-red-500"
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
           <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/transactions")}/>

            <FinanceOverview
              totalBalance={dashboardData?.totalBalance || 0}
              totalIncome={dashboardData?.totalIncome}
              totalExpense={dashboardData?.totalExpense}
            />

            <ExpenseTransactions transactions={dashboardData?.last30DaysExpense?.transactions || []}
            onSeeMore={() => navigate("/expense")}
            />

            <Last30DaysExpenses
              data={dashboardData?.last30DaysExpense?.transactions || []}
            />

            <RecentIncomeWithChart 
              data={dashboardData?.last30DaysIncome?.transactions || []}
              totalIncome={dashboardData?.last30DaysIncome?.totalIncome || 0}
            />

            <RecentIncome 
            transactions={dashboardData?.last30DaysIncome?.transactions || []}
            onSeeMore={() => navigate("/income")}
            />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home
