import React, { useState } from "react";
import { useTransaction } from "../Context/transContext.jsx";
import { Link } from "react-router-dom";
import axios from "axios";

function NewTransaction() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState({
    amount: "",
    description: "",
    date: "",
  });

  const { form, setForm, updateVal } = useTransaction();

  const validateForm = () => {
    const errors = {};
    if (!form.amount || form.amount <= 0) {
      errors.amount = "Please enter a valid amount";
    }
    if (!form.description?.trim()) {
      errors.description = "Description is required";
    }
    if (!form.date) {
      errors.date = "Date is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const apiUrl = "http://localhost:3000";

  function handleInp(e) {
    updateVal(e.target.id, e.target.value);
  }

  async function submitAddedtrans(e) {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stops execution if form validation fails
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await axios.post(`${apiUrl}/api/`, form, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setSuccessMessage("Transaction added successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);

      // Reset the form after successful submission
      setForm({
        amount: "",
        description: "",
        date: "",
        category: "Shopping",
      });
      setFormErrors({});
    } catch (err) {
      setError(
        "Failed to add transaction. Please check your connection and try again."
      );
      console.error("Error adding transaction:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleReset = () => {
    setForm({
      amount: "",
      description: "",
      date: "",
      category: "Shopping",
    });
    setFormErrors({});
    setError("");
    setSuccessMessage("");
  };

  return (
    <div className="new-transaction sm:w-full">
      <div className="bg-gray-100 mx-auto max-w-6xl bg-white py-20 px-5 lg:px-24 sm:py-10 shadow-xl mb-24">
        <div className="heads flex align-center mb-2">
          <h1 className="text-2xl">Add New Transaction</h1>
          <span style={{ color: "#72A0C1" }}>
            <Link to="transactions" className="text-xl ml-10">
              Previous Transactions
            </Link>
          </span>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={submitAddedtrans}>
          <div className="bg-white shadow-md rounded px-6 pt-6 pb-8 mb-4 flex flex-col">
            <div className="-mx-3 md:flex mb-6">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="uppercase tracking-wide text-black text-xs font-bold mb-2"
                  htmlFor="amount"
                >
                  Amount
                </label>
                <input
                  className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                  id="amount"
                  type="number"
                  onChange={handleInp}
                  value={form.amount}
                  disabled={isLoading}
                />
                {formErrors.amount && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {formErrors.amount}
                  </p>
                )}
              </div>

              <div className="md:w-1/2 px-3">
                <label
                  className="uppercase tracking-wide text-black text-xs font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <input
                  className={`w-full bg-gray-200 text-black border rounded py-3 px-4 ${
                    formErrors.description
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  id="description"
                  type="text"
                  onChange={handleInp}
                  value={form.description}
                  disabled={isLoading}
                />
                {formErrors.description && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>
            </div>

            <div className="-mx-3 md:flex mb-2">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="uppercase tracking-wide text-black text-xs font-bold mb-2"
                  htmlFor="date"
                >
                  Date
                </label>
                <input
                  className={`w-full bg-gray-200 text-black border rounded py-3 px-4 ${
                    formErrors.date ? "border-red-500" : "border-gray-200"
                  }`}
                  id="date"
                  type="date"
                  onChange={handleInp}
                  value={form.date}
                  disabled={isLoading}
                />
                {formErrors.date && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {formErrors.date}
                  </p>
                )}
              </div>
            </div>

            <div className="-mx-3 md:flex mb-2">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="uppercase tracking-wide text-black text-xs font-bold mb-2"
                  htmlFor="category"
                >
                  Category
                </label>
                <select
                  className="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                  id="category"
                  onChange={handleInp}
                  value={form.category}
                  disabled={isLoading}
                >
                  <option>Shopping</option>
                  <option>Meal</option>
                  <option>Movie</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="-mx-3 md:flex mt-2">
              <div className="md:w-full px-3">
                <button
                  disabled={isLoading}
                  type="submit"
                  className={`px-6 py-2 rounded-full text-white ${
                    isLoading
                      ? "bg-gray-400"
                      : "bg-pink-900 hover:bg-pink-800 active:bg-pink-950"
                  }`}
                >
                  {isLoading ? "Adding..." : "Add Transaction"}
                </button>
                <button
                  onClick={handleReset}
                  type="button"
                  className="ml-5 md:w-sm bg-pink-900 text-white py-2 px-4 border-b-4 hover:bg-pink-800 rounded-full"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTransaction;
