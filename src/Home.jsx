import React from "react";
import NewTransaction from "./Components/NewTransaction";
import MonthlyExpensesChart from "../src/Components/BarChart";
import CategoryWisePieChart from "../src/Components/PieChart";
import BudgetManager from "../src/Components/Budget";
function Home() {
  return (
    <div>
      <NewTransaction />
      <div className="flex flex-wrap justify-center">
        <MonthlyExpensesChart />
        <CategoryWisePieChart />
        <BudgetManager />
      </div>
    </div>
  );
}

export default Home;
