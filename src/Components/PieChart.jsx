import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

function CategoryWisePieChart() {
  const apiUrl = "http://localhost:3000";
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      const response = await axios.get(`${apiUrl}/api/transactions`);
      const transactions = response.data.data;

      // Group transactions by category
      const categoryData = transactions.reduce((acc, txn) => {
        const { category, amount } = txn;
        if (acc[category]) {
          acc[category] += amount;
        } else {
          acc[category] = amount;
        }
        return acc;
      }, {});

      // Convert object into an array
      const formattedData = Object.keys(categoryData).map((cat) => ({
        name: cat,
        value: categoryData[cat],
      }));

      setPieData(formattedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  // Define some colors for the pie slices
  const COLORS = ["#72A0C1", "#F7B801", "#D72638", "#1B9AAA", "#A2D729"];

  return (
    <div className=" m-5 p-6 bg-white shadow-md rounded-lg w-4/5 sm:w-full lg:w-1/3">
      <h2 className="text-xl font-bold mb-4">Category-wise Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryWisePieChart;
