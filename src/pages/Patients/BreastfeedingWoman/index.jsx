import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../api/axios';

const BreastfeedingWomen = () => {
  const [breastfeedingWomen, setBreastfeedingWomen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [babyAgeFilter, setBabyAgeFilter] = useState('');

  useEffect(() => {
    fetchBreastfeedingWomen();
    fetchStatistics();
  }, [currentPage, babyAgeFilter]);

  const fetchBreastfeedingWomen = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, per_page: 10 };
      if (searchTerm) params.search = searchTerm;
      if (babyAgeFilter === 'newborns') {
        params.baby_age_min = 0;
        params.baby_age_max = 1;
      } else if (babyAgeFilter === 'infants') {
        params.baby_age_min = 1;
        params.baby_age_max = 12;
      } else if (babyAgeFilter === 'toddlers') {
        params.baby_age_min = 13;
        params.baby_age_max = 24;
      }

      const response = await axios.get('/breastfeeding-women', { params });
      setBreastfeedingWomen(response.data.data.data);
      setTotalPages(response.data.data.last_page);
    } catch (error) {
      console.error('Error fetching breastfeeding women:', error);
      alert('Failed to fetch breastfeeding women');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/breastfeeding-women/statistics');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBreastfeedingWomen();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this breastfeeding woman record?')) return;

    try {
      await axios.delete(`/breastfeeding-women/${id}`);
      alert('Record deleted successfully');
      fetchBreastfeedingWomen();
      fetchStatistics();
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Failed to delete record');
    }
  };

  const getBabyAgeCategory = (babyAgeMonths) => {
    if (babyAgeMonths < 1) return 'Newborn';
    if (babyAgeMonths <= 12) return 'Infant';
    return 'Toddler';
  };

  const getBabyAgeBadge = (category) => {
    const categories = {
      'Newborn': 'bg-blue-100 text-blue-800',
      'Infant': 'bg-green-100 text-green-800',
      'Toddler': 'bg-orange-100 text-orange-800'
    };
    return categories[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Breastfeeding Women Management</h1>
        <Link
          to="/patients/breastfeeding-women/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add New Record
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Total Breastfeeding</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.total_breastfeeding_women || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Newborns (0-1m)</h3>
          <p className="text-2xl font-bold text-green-600">{stats.newborns_0_1_month || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Infants (1-12m)</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.infants_1_12_months || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Recent Deliveries</h3>
          <p className="text-2xl font-bold text-red-600">{stats.recent_deliveries || 0}</p>
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
            value={babyAgeFilter}
            onChange={(e) => {
              setBabyAgeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Babies</option>
            <option value="newborns">Newborns (0-1 month)</option>
            <option value="infants">Infants (1-12 months)</option>
            <option value="toddlers">Toddlers (13-24 months)</option>
          </select>
        </div>
      </div>

      {/* Breastfeeding Women Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading breastfeeding women records...</p>
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
                      Delivery Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Baby Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Baby Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {breastfeedingWomen.map((record) => {
                    const category = getBabyAgeCategory(record.baby_age_months);
                    
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
                          {new Date(record.delivery_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.baby_name || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.baby_age_months} months
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBabyAgeBadge(category)}`}>
                            {category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              to={`/patients/breastfeeding-women/${record.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </Link>
                            <Link
                              to={`/patients/breastfeeding-women/${record.id}/edit`}
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

            {breastfeedingWomen.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No breastfeeding women records found. <Link to="/patients/breastfeeding-women/create" className="text-green-600 hover:underline">Create the first record</Link>.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BreastfeedingWomen;