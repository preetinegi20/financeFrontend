import React, { useState, createContext, useContext } from "react";
const TransContext = createContext();

export function TransactionProvider({ children }) {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: "",
    category: "Shopping",
  });
  const updateVal = (name, val) => {
    setForm((prev) => ({ ...prev, [name]: val }));
  };
  return (
    <div>
      <TransContext.Provider value={{ form, setForm, updateVal }}>
        {children}
      </TransContext.Provider>
    </div>
  );
}

export function useTransaction() {
  const context = useContext(TransContext);
  if (context === undefined) throw new Error("error while transaction");
  return context;
}
