import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { FaPlus, FaTrash, FaUsers, FaMoneyBillWave, FaClipboardList } from "react-icons/fa";
import Swal from "sweetalert2";

export default function DailyReportForm() {
  const [matchName, setMatchName] = useState("");
  const [totalIncome, setTotalIncome] = useState("");
  const [attendances, setAttendances] = useState({
    main_hall_people: 0,
    main_hall_staff: 0,
    vip_hall_people: 0,
    vip_hall_staff: 0,
  });
  const [expenses, setExpenses] = useState([{ title: "", amount: 0 }]);
  const [users, setUsers] = useState([]);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err.response || err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch users",
          confirmButtonColor: "#DC2626",
        });
      }
    };
    fetchUsers();
  }, []);

  // Calculate remaining balance whenever totalIncome or expenses change
  useEffect(() => {
    const totalExp = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
    setRemainingBalance(Number(totalIncome || 0) - totalExp);
  }, [totalIncome, expenses]);

  // Handlers
  const handleAttendanceChange = (e) => {
    const { name, value } = e.target;
    setAttendances((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = field === "amount" ? Number(value) : value;
    setExpenses(newExpenses);
  };

  const addExpense = () => setExpenses([...expenses, { title: "", amount: 0 }]);
  const removeExpense = (index) => setExpenses(expenses.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/daily-reports",
        {
          match_name: matchName,
          total_income: Number(totalIncome),
          attendances,
          expenses,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Daily report recorded successfully!",
        confirmButtonColor: "#2563EB",
      });

      // Reset form
      setMatchName("");
      setTotalIncome("");
      setAttendances({
        main_hall_people: 0,
        main_hall_staff: 0,
        vip_hall_people: 0,
        vip_hall_staff: 0,
      });
      setExpenses([{ title: "", amount: 0 }]);
    } catch (err) {
      console.error(err.response || err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to save daily report",
        confirmButtonColor: "#DC2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <FaClipboardList /> Daily Report Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Match Name & Income */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white shadow-sm rounded-xl p-4">
              <label className="block font-medium mb-2">Match Name</label>
              <input
                type="text"
                value={matchName}
                onChange={(e) => setMatchName(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition"
                placeholder="Enter match name"
                required
              />
            </div>

            <div className="bg-white shadow-sm rounded-xl p-4">
              <label className="block font-medium mb-2">Total Income</label>
              <input
                type="number"
                value={totalIncome}
                onChange={(e) => setTotalIncome(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition"
                placeholder="Enter total income"
                required
              />
            </div>
          </div>

          {/* Attendance */}
          <div className="bg-white shadow-sm rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FaUsers /> Attendances
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: "Main Hall People", name: "main_hall_people" },
                { label: "Main Hall Staff", name: "main_hall_staff" },
                { label: "VIP Hall People", name: "vip_hall_people" },
                { label: "VIP Hall Staff", name: "vip_hall_staff" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block mb-1 font-medium">{field.label}</label>
                  <input
                    type="number"
                    name={field.name}
                    value={attendances[field.name]}
                    onChange={handleAttendanceChange}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition"
                    min={0}
                    placeholder="Enter number"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white shadow-sm rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FaMoneyBillWave /> Expenses
            </h3>
            <div className="space-y-3">
              {expenses.map((exp, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-center md:items-start gap-3"
                >
                  <input
                    type="text"
                    placeholder="Title"
                    value={exp.title}
                    onChange={(e) => handleExpenseChange(index, "title", e.target.value)}
                    className="border border-gray-300 rounded-lg p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-sm transition"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={exp.amount}
                    onChange={(e) => handleExpenseChange(index, "amount", e.target.value)}
                    className="border border-gray-300 rounded-lg p-3 w-32 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-sm transition"
                    min={0}
                  />
                  <button
                    type="button"
                    onClick={() => removeExpense(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 flex items-center gap-2"
                  >
                    <FaTrash /> 
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addExpense}
                className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 flex items-center gap-2"
              >
                <FaPlus /> Add Expense
              </button>
            </div>
          </div>

          {/* Revenue Share */}
          <div className="bg-white shadow-sm rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FaMoneyBillWave /> Revenue Share Preview
            </h3>
            <p className={`mb-4 text-lg font-medium ${remainingBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
              Remaining Balance: <strong>{remainingBalance}</strong>
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {users.map((user) => {
                const amount = ((user.revenue_percentage / 100) * remainingBalance).toFixed(2);
                return (
                  <div
                    key={user.id}
                    className="bg-gray-50 p-3 rounded-lg shadow-sm flex justify-between items-center hover:shadow-md transition"
                  >
                    <span className="font-medium">{user.name} ({user.revenue_percentage}%)</span>
                    <span className={`font-semibold ${amount < 0 ? "text-red-600" : "text-green-600"}`}>
                      {amount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all w-full text-center font-semibold"
          >
            {loading ? "Saving..." : "Submit Daily Report"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
