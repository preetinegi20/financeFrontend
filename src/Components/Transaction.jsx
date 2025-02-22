import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Transaction() {
  const apiUrl =
    import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3000";

  //array of forms
  const [addedTrans, setAddedTrans] = useState([]);

  //individual form
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: "",
    category: "",
  });

  const [editId, setEditId] = useState(null);
  useEffect(() => {
    fetchTransactions();
  }, []);

  //FETCH DATA FROM DB------------->>>>>>>>>>>>>>>>>
  async function fetchTransactions() {
    try {
      const response = await axios.get(`${apiUrl}/api/transactions`);
      const dateFomatting = response.data.data.map((item) => ({
        ...item,
        date: item.date ? item.date.split("T")[0] : "",
      }));
      dateFomatting.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAddedTrans(dateFomatting);
    } catch (err) {
      console.log("err: ", err);
    }
  }

  //EDIT---------------->>>>>>>>>>>>>>
  function editHandler(item) {
    setEditId(item._id);
    setFormData({
      amount: item.amount,
      description: item.description,
      date: item.date ? item.date.split("T")[0] : "", // Ensure correct format
      category: item.category,
    });
  }

  function inpHandler(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
  useEffect(() => {
    if (editId) {
      handleUpdate();
    }
  }, [editId]);
  const handleUpdate = async () => {
    try {
      await axios.put(`${apiUrl}/api/transactions/${editId}`, formData);
      fetchTransactions();
      // setAddedTrans();
    } catch (err) {
      console.error("Error updating transaction:", err);
    }
  };

  //DELETE----------->>>>>>>>.
  const deleteForm = async (item) => {
    if (!item || !item._id) {
      console.error("Invalid ID for deletion:", item);
      return;
    }
    try {
      await axios.delete(`${apiUrl}/api/transactions/${item._id}`); //only for deleting from the DB
      setAddedTrans(addedTrans.filter((t) => t._id !== item._id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  return (
    <div className="transaction-inputs sm:w-full">
      <div className="bg-gray-100 mx-auto max-w-6xl bg-white py-20 px-12 lg:p-24 shadow-xl mb-24">
        <div className="heads flex align-center mb-10">
          <h1 className="text-2xl">Transactions</h1>
          <span style={{ color: "#72A0C1" }}>
            <Link to="/" className="text-xl ml-10">
              Add New Transactions
            </Link>
          </span>
        </div>
        {addedTrans.map((item) => (
          <form
            key={item._id}
            onSubmit={(e) => e.preventDefault()}
            className="mb-10 pb-5 border-gray-200 border-b-2"
          >
            <div className="-mx-3 md:flex mb-6">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                  Amount
                </label>
                <input
                  className={`appearance-none block w-full bg-transparent text-gray-700 border ${
                    editId === item._id ? "border-gray-300 " : "outline-none"
                  } rounded py-3 px-4`}
                  id="amount"
                  name="amount"
                  type="number"
                  readOnly={editId !== item._id}
                  value={editId === item._id ? formData.amount : item.amount}
                  onChange={inpHandler}
                />
              </div>
              <div className="md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                  Description
                </label>
                <input
                  className={`appearance-none block w-full bg-transparent text-gray-700 border ${
                    editId === item._id ? "border-gray-300 " : "outline-none"
                  } rounded py-3 px-4`}
                  id="description"
                  name="description"
                  type="text"
                  readOnly={editId !== item._id}
                  value={
                    editId === item._id
                      ? formData.description
                      : item.description
                  }
                  onChange={inpHandler}
                />
              </div>
            </div>
            <div className="-mx-3 md:flex mb-2">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                  Date
                </label>
                <input
                  className={`appearance-none block w-full bg-transparent text-gray-700 border ${
                    editId === item._id ? "border-gray-300 " : "outline-none"
                  } rounded py-3 px-4`}
                  id="date"
                  name="date"
                  type="date"
                  readOnly={editId !== item._id}
                  value={editId === item._id ? formData.date : item.date}
                  onChange={inpHandler}
                />
              </div>
              <div className="md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    className={`appearance-none block w-full bg-transparent text-gray-700 border ${
                      editId === item._id ? "border-gray-300 " : "outline-none"
                    } rounded py-3 px-4`}
                    id="category"
                    name="category"
                    readOnly={editId !== item._id}
                    value={
                      editId === item._id ? formData.category : item.category
                    }
                    onChange={inpHandler}
                  >
                    <option>Shopping</option>
                    <option>Meal</option>
                    <option>Movie</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="-mx-3 md:flex mt-2">
              <div className="md:w-full px-3 mt-9">
                <button
                  onClick={() => editHandler(item)}
                  type="submit"
                  style={{ background: "#7CB9E8" }}
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium disabled:pointer-events-none h-8 rounded-md px-3 text-xs flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="lucide lucide-pen h-4 w-4"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => {
                    deleteForm(item);
                  }}
                  type="submit"
                  style={{ background: "red" }}
                  className="ml-5 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium disabled:pointer-events-none h-8 rounded-md px-3 text-xs flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="lucide lucide-trash2 h-4 w-4"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" x2="10" y1="11" y2="17"></line>
                    <line x1="14" x2="14" y1="11" y2="17"></line>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}

export default Transaction;
