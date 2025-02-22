import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function MonthlyExpensesChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/transactions"
      );
      const transactions = response.data.data;

      // Group transactions by month
      const monthlyData = transactions.reduce((acc, item) => {
        const month = new Date(item.date).toLocaleString("default", {
          month: "short",
        });

        if (!acc[month]) {
          acc[month] = 0;
        }
        acc[month] += item.amount;

        return acc;
      }, {});

      // Convert object to array for Recharts
      const formattedData = Object.keys(monthlyData).map((month) => ({
        month,
        amount: monthlyData[month],
      }));

      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  return (
    <div className="m-5 p-6 bg-white shadow-md rounded-lg w-96 sm:w-full lg:w-1/2">
      <h2 className="text-xl font-16 mb-4">Monthly expenses bar chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="month" stroke="#8884d8" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#72A0C1" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyExpensesChart;
