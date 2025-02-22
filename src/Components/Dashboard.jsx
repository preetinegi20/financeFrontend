import React, { useEffect, useState } from "react";
import axios from "axios";
function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/transactions"
      );
      const transactionsData = response.data.data;

      const total = transactionsData.reduce(
        (sum, item) => sum + item.amount,
        0
      );
      setTotalExpenses(total);

      const categories = transactionsData.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
      }, {});
      setCategoryBreakdown(categories);

      const sortedTransactions = transactionsData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setRecentTransactions(sortedTransactions);

      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Expenses</h2>
          <p className="text-2xl font-bold mt-2">
            ₹{totalExpenses.toLocaleString()}
          </p>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Top Spending Category</h2>
          <p className="text-xl mt-2">
            {Object.keys(categoryBreakdown).length > 0
              ? Object.keys(categoryBreakdown).reduce((a, b) =>
                  categoryBreakdown[a] > categoryBreakdown[b] ? a : b
                )
              : "No Data"}
          </p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Transactions</h2>
          <p className="text-2xl font-bold mt-2">{transactions.length}</p>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <ul>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between p-2 border-b last:border-none"
                >
                  <span>{item.description}</span>
                  <span className="font-bold">₹{item.amount}</span>
                  <span className="text-gray-500">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </li>
              ))
            ) : (
              <p>No recent transactions</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
