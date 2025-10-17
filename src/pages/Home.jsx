import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import { FaUsers, FaMoneyBillWave, FaBuilding } from "react-icons/fa";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BeatLoader } from "react-spinners";

export default function Home() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [officeTotal, setOfficeTotal] = useState(0);
  const [expensesData, setExpensesData] = useState([]);
  const [officeData, setOfficeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Users
        const usersRes = await axios.get("http://localhost:8000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalUsers(usersRes.data.length);

        // Daily Expenses
        const expensesRes = await axios.get(
          "http://localhost:8000/api/daily-expenses",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTotalExpenses(expensesRes.data.total_expenses || 0);
        setExpensesData(expensesRes.data.daily || []);

        // Office Earnings
        const officeRes = await axios.get(
          "http://localhost:8000/api/office-daily",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOfficeTotal(officeRes.data.total_office_amount || 0);
        setOfficeData(officeRes.data.daily || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <BeatLoader color="#2563eb" size={15} />
        </div>
      </Layout>
    );
  }

  // Merge expenses & office data into one dataset
  const mergedData = [];
  const allDates = Array.from(
    new Set([...expensesData.map(d => d.date), ...officeData.map(d => d.date)])
  ).sort((a, b) => new Date(a) - new Date(b));

  allDates.forEach(date => {
    const expense = expensesData.find(d => d.date === date)?.amount || 0;
    const office = officeData.find(d => d.date === date)?.amount || 0;
    mergedData.push({ 
      date, 
      expenses: expense, 
      office,
      // Format date for better display
      formattedDate: new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    });
  });

  return (
    <Layout>
      <div className="p-6 space-y-6">
       <h1 className="text-4xl font-bold mb-6">
  <span className="text-black">Business Summary</span>
</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Total Users"
            value={totalUsers}
            icon={<FaUsers className="text-blue-600" />}
            bgColor="bg-white"
          />

          <Card
            title="Total Expenses"
            value={`Tsh ${totalExpenses.toLocaleString()}`}
            icon={<FaMoneyBillWave className="text-green-600" />}
            bgColor="bg-white"
          />

          <Card
            title="Total Collected by Office"
            value={`Tsh ${officeTotal.toLocaleString()}`}
            icon={<FaBuilding className="text-purple-600" />}
            bgColor="bg-white"
          />
        </div>

        {/* Combined Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Daily Financial Overview
          </h2>
          <p className="text-gray-600 mb-6">
            Comparison between Daily Expenses and Office Collections
          </p>
          
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={mergedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="formattedDate"
                tick={{ fill: '#666' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#666' }}
                tickLine={false}
                tickFormatter={(value) => `Tsh ${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `$${Number(value).toLocaleString()}`,
                  name === 'expenses' ? 'Expenses' : 'Office Collections'
                ]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                formatter={(value) => (
                  <span style={{ color: '#666', fontWeight: '500' }}>
                    {value === 'expenses' ? 'Expenses' : 'Office Collections'}
                  </span>
                )}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4, fill: "#ef4444", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#ef4444" }}
              />
              <Line
                type="monotone"
                dataKey="office"
                name="Office Collections"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: "#10b981", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}