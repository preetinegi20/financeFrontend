import "../src/index.css";
import React from "react";
import Transaction from "./Components/Transaction";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import BudgetManager from "../src/Components/Budget";
function App() {
  return (
    <div>
      <h1 className=" p-6 text-3xl sm:ml-3">Personal Finance Visualizer</h1>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/transactions" element={<Transaction />}></Route>
          <Route
            path="/budgets"
            element={<BudgetManager></BudgetManager>}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
