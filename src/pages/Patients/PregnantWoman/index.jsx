import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../api/axios';

const PregnantWomen = () => {
  const [pregnantWomen, setPregnantWomen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deliveryFilter, setDeliveryFilter] = useState('');

  useEffect(() => {
    fetchPregnantWomen();
    fetchStatistics();
  }, [currentPage, deliveryFilter]);

  const fetchPregnantWomen = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, per_page: 10 };
      if (searchTerm) params.search = searchTerm;
      if (deliveryFilter === 'upcoming') {
        params.expected_delivery_from = new Date().toISOString().split('T')[0];
        params.expected_delivery_to = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      }

      const response = await axios.get('/pregnant-women', { params });
      setPregnantWomen(response.data.data.data);
      setTotalPages(response.data.data.last_page);
    } catch (error) {
      console.error('Error fetching pregnant women:', error);
      alert('Failed to fetch pregnant women');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/pregnant-women/statistics');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPregnantWomen();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this pregnant woman record?')) return;

    try {
      await axios.delete(`/pregnant-women/${id}`);
      alert('Record deleted successfully');
      fetchPregnantWomen();
      fetchStatistics();
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Failed to delete record');
    }
  };

  const calculateGestationalAge = (lmp) => {
    const today = new Date();
    const lastPeriod = new Date(lmp);
    const diffTime = Math.abs(today - lastPeriod);
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  const getTrimester = (edd) => {
    const today = new Date();
    const deliveryDate = new Date(edd);
    const weeksToGo = Math.floor((deliveryDate - today) / (1000 * 60 * 60 * 24 * 7));
    
    if (weeksToGo > 26) return 'First';
    if (weeksToGo > 12) return 'Second';
    return 'Third';
  };

  const getTrimesterBadge = (trimester) => {
    const trimesters = {
      'First': 'bg-blue-100 text-blue-800',
      'Second': 'bg-green-100 text-green-800',
      'Third': 'bg-red-100 text-red-800'
    };
    return trimesters[trimester] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pregnant Women Management</h1>
        <Link
          to="/patients/pregnant-women/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add New Record
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Total Pregnant</h3>
          <p className="text-2xl font-bold text-pink-600">{stats.total_pregnant_women || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">First Time Mothers</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.first_time_mothers || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Upcoming Deliveries</h3>
          <p className="text-2xl font-bold text-red-600">{stats.upcoming_deliveries || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Third Trimester</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.third_trimester || 0}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Search by patient name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              Search
            </button>
          </form>

          <select
            value={deliveryFilter}
            onChange={(e) => {
              setDeliveryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Records</option>
            <option value="upcoming">Upcoming Deliveries (30 days)</option>
          </select>
        </div>
      </div>

      {/* Pregnant Women Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading pregnant women records...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      LMP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EDD
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gestational Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trimester
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gravida/Para
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pregnantWomen.map((record) => {
                    const gestationalAge = calculateGestationalAge(record.last_menstrual_period);
                    const trimester = getTrimester(record.expected_delivery_date);
                    
                    return (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {record.patient?.first_name} {record.patient?.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{record.patient?.phone_number}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.last_menstrual_period).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.expected_delivery_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {gestationalAge} weeks
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTrimesterBadge(trimester)}`}>
                            {trimester} Trimester
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          G{record.gravida}P{record.parity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              to={`/patients/pregnant-women/${record.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </Link>
                            <Link
                              to={`/patients/pregnant-women/${record.id}/edit`}
                              className="text-green-600 hover:text-green-900"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(record.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {pregnantWomen.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No pregnant women records found. <Link to="/patients/pregnant-women/create" className="text-green-600 hover:underline">Create the first record</Link>.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PregnantWomen;