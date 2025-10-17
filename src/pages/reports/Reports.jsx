import React, { useEffect, useState } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import {
  FaChevronDown,
  FaChevronUp,
  FaUsers,
  FaMoneyBillWave,
  FaReceipt,
  FaTrash,
} from "react-icons/fa";
import Layout from "../../components/Layout";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchReports = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8000/api/daily-reports?page=${page}&per_page=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReports(res.data.data);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
    } catch (err) {
      console.error(err.response || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= lastPage) {
      fetchReports(page);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/daily-reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Report deleted successfully!");
      fetchReports(currentPage); // Refresh current page
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete report.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <BeatLoader color="#2563eb" size={15} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <FaReceipt /> Daily Reports
        </h2>

        {reports.length === 0 ? (
          <p className="text-gray-500 text-center">No reports found.</p>
        ) : (
          <>
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-all"
                >
                  {/* Summary */}
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpand(report.id)}
                  >
                    <div>
                      <h3 className="font-semibold text-lg">
                        {report.match_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Total Income:{" "}
                        <span className="font-medium text-green-600">
                          {report.total_income.toLocaleString()} TZS
                        </span>{" "}
                        | Remaining:{" "}
                        <span
                          className={
                            report.remaining_balance < 0
                              ? "text-red-600 font-semibold"
                              : "text-green-600 font-semibold"
                          }
                        >
                          {report.remaining_balance.toLocaleString()} TZS
                        </span>{" "}
                        | Date:{" "}
                        {new Date(report.report_date).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(report.id);
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Delete report"
                      >
                        <FaTrash />
                      </button>

                      {/* Expand/Collapse */}
                      <div className="text-blue-500">
                        {expanded === report.id ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expanded === report.id && (
                    <div className="mt-4 space-y-4">
                      {/* Attendance */}
                      <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-100">
                        <h4 className="font-semibold mb-4 flex items-center gap-2 text-blue-700 text-lg">
                          <FaUsers /> Attendance
                        </h4>
                        {report.attendances ? (
                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div className="p-2 bg-white rounded-lg shadow flex justify-between">
                              <span>Main Hall People</span>
                              <span>
                                {report.attendances.main_hall_people || 0}
                              </span>
                            </div>
                            <div className="p-2 bg-white rounded-lg shadow flex justify-between">
                              <span>Main Hall Staff</span>
                              <span>
                                {report.attendances.main_hall_staff || 0}
                              </span>
                            </div>
                            <div className="p-2 bg-white rounded-lg shadow flex justify-between">
                              <span>VIP Hall People</span>
                              <span>
                                {report.attendances.vip_hall_people || 0}
                              </span>
                            </div>
                            <div className="p-2 bg-white rounded-lg shadow flex justify-between">
                              <span>VIP Hall Staff</span>
                              <span>
                                {report.attendances.vip_hall_staff || 0}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500">No attendance data.</p>
                        )}
                      </div>

                      {/* Expenses */}
                      <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-100">
                        <h4 className="font-semibold mb-4 flex items-center gap-2 text-red-700 text-lg">
                          <FaMoneyBillWave /> Expenses
                        </h4>
                        {report.expenses?.length > 0 ? (
                          <div className="space-y-2">
                            {report.expenses.map((exp, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-white rounded-lg shadow flex justify-between hover:shadow-md transition"
                              >
                                <span className="font-medium text-gray-800">
                                  {exp.title}
                                </span>
                                <span className="text-red-600 font-semibold">
                                  {exp.amount.toLocaleString()} TZS
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center">
                            No expenses recorded.
                          </p>
                        )}
                      </div>

                      {/* Revenue Share */}
                      <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-100">
                        <h4 className="font-semibold mb-4 flex items-center gap-2 text-green-700 text-lg">
                          <FaMoneyBillWave /> Revenue Share
                        </h4>
                        {report.revenue_shares?.length > 0 ? (
                          <div className="grid md:grid-cols-2 gap-4">
                            {report.revenue_shares.map((share, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-white rounded-lg shadow flex justify-between items-center hover:shadow-md transition"
                              >
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {share.user?.name || `User ${share.user_id}`}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {share.percentage}% of remaining balance
                                  </p>
                                </div>
                                <div
                                  className={
                                    share.amount < 0
                                      ? "text-red-600 font-semibold"
                                      : "text-green-600 font-semibold"
                                  }
                                >
                                  {share.amount.toLocaleString()} TZS
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center">
                            No revenue shares available
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {lastPage}
              </span>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                disabled={currentPage === lastPage}
                onClick={() => goToPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
