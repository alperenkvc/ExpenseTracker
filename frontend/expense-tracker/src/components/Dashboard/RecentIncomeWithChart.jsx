import React, {useState, useEffect } from 'react'
import CustomPieChart from '../Charts/CustomPieChart'

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4F39F6"]

const RecentIncomeWithChart = ({data, totalIncome}) => {

    const [chartData, setChartData] = useState([]);

    const prepareChartData = () => {
        const totalsBySource = (data || []).reduce((acc, item) => {
            const source = item?.source || "Unknown";
            const amount = Number(item?.amount) || 0;
            acc[source] = (acc[source] || 0) + amount;
            return acc;
        }, {});

        const dataArr = Object.entries(totalsBySource).map(([name, amount]) => ({
            name,
            amount
        }));

        setChartData(dataArr);
    }

    useEffect(() => {
        prepareChartData();

        return () => {}
    }, [data]);

  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Last 30 Days Income</h5>
      </div>

      {(() => {
        const derivedTotal = (data || []).reduce((sum, item) => sum + (Number(item?.amount) || 0), 0);
        const displayedTotal = Number(totalIncome) > 0 ? Number(totalIncome) : derivedTotal;

        return (
          <CustomPieChart 
            data={chartData}
            label={displayedTotal}
            totalAmount={`$${displayedTotal}`}
            showTextAnchor
            colors={COLORS}
          />
        )
      })()}
    </div>
  )
}

export default RecentIncomeWithChart
