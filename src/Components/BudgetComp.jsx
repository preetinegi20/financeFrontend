import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const BudgetComparisonChart = ({ budgets = {} }) => {
  console.log("Budgets data:", budgets);

  if (!budgets || Object.keys(budgets).length === 0) {
    return (
      <p className="text-center text-gray-500">No budget data available</p>
    );
  }

  const chartData = Object.entries(budgets).map(
    ([category, { limit, spent }]) => ({
      name: category,
      Budget: Number(limit) || 0,
      Spent: spent || 0,
    })
  );

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Budget vs Actual Spending</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Budget" fill="#8884d8" />
          <Bar dataKey="Spent" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetComparisonChart;
