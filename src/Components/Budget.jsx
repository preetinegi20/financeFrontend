import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_BASE_URL = "http://localhost:3000"; // Adjust this to match your backend URL

const BudgetManager = () => {
  const [budgets, setBudgets] = useState({
    Shopping: { limit: 0, spent: 0 },
    Meal: { limit: 0, spent: 0 },
    Movie: { limit: 0, spent: 0 },
    Other: { limit: 0, spent: 0 },
  });
  const [month, setMonth] = useState(new Date().toISOString().substring(0, 7));
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchBudget();
  }, [month]);

  const fetchBudget = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/budgets/${month}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch budget");
      }

      if (data.data && data.data.budgets) {
        setBudgets(data.data.budgets);
      } else if (data.budgets) {
        setBudgets(data.budgets);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage({
        type: "error",
        text: "Error fetching budget data. Please check your connection.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const budgetLimits = {};
      Object.entries(budgets).forEach(([category, values]) => {
        budgetLimits[category] = values.limit;
      });

      const response = await fetch(`${API_BASE_URL}/api/budgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          month,
          budgets: budgetLimits,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to update budget");
      }

      setMessage({
        type: "success",
        text: data.message || "Budget updated successfully",
      });

      fetchBudget();
    } catch (error) {
      console.error("Submit error:", error);
      setMessage({
        type: "error",
        text: "Error updating budget. Please check your connection.",
      });
    }
  };

  const handleBudgetChange = (category, value) => {
    setBudgets((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        limit: Number(value) || 0,
        spent: prev[category]?.spent || 0,
      },
    }));
  };

  const calculateProgress = (spent, limit) => {
    if (limit === 0) return 0;
    return Math.min((spent / limit) * 100, 100);
  };

  const chartData = Object.entries(budgets).map(
    ([category, { limit, spent }]) => ({
      category,
      Budgeted: limit,
      Spent: spent,
    })
  );
  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-lg w-full my-10 lg:w-1/2">
      <h2 className="text-2xl font-bold mb-6">Budget Management</h2>

      <div className="mb-4">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full max-w-xs p-2 border rounded"
        />
      </div>

      {message.text && (
        <div
          className={`p-4 mb-4 rounded ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(budgets).map(([category, { limit, spent }]) => (
          <div key={category} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-medium">{category}</label>
              <span className="text-sm text-gray-500">
                Spent: ${(spent || 0).toFixed(2)}
              </span>
            </div>

            <input
              type="number"
              min="0"
              value={limit || 0}
              onChange={(e) => handleBudgetChange(category, e.target.value)}
              className="w-full p-2 border rounded"
              placeholder={`Set ${category} budget`}
            />

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  calculateProgress(spent, limit) >= 100
                    ? "bg-red-600"
                    : "bg-blue-600"
                }`}
                style={{
                  width: `${calculateProgress(spent || 0, limit || 0)}%`,
                }}
              />
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Save Budget
        </button>
      </form>
      <div className="mt-10">
        <h3 className="text-lg font-bold mb-4">Budget vs. Actual Spending</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Budgeted" fill="#4CAF50" />
            <Bar dataKey="Spent" fill="#FF5733" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetManager;
