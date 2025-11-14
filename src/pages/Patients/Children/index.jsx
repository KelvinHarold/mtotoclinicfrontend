import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../api/axios';

const Children = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genderFilter, setGenderFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');

  useEffect(() => {
    fetchChildren();
    fetchStatistics();
  }, [currentPage, genderFilter, ageFilter]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, per_page: 10 };
      if (searchTerm) params.search = searchTerm;
      if (genderFilter) params.gender = genderFilter;
      if (ageFilter) {
        switch (ageFilter) {
          case 'newborns':
            params.age_min = 0;
            params.age_max = 1;
            break;
          case 'infants':
            params.age_min = 1;
            params.age_max = 12;
            break;
          case 'toddlers':
            params.age_min = 13;
            params.age_max = 36;
            break;
          default:
            break;
        }
      }

      const response = await axios.get('/children', { params });
      setChildren(response.data.data.data);
      setTotalPages(response.data.data.last_page);
    } catch (error) {
      console.error('Error fetching children:', error);
      alert('Failed to fetch children');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/children/statistics');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchChildren();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this child record?')) return;

    try {
      await axios.delete(`/patients/children/${id}`);
      alert('Child record deleted successfully');
      fetchChildren();
      fetchStatistics();
    } catch (error) {
      console.error('Error deleting child record:', error);
      alert('Failed to delete child record');
    }
  };

  const getDevelopmentalStage = (birthDate) => {
    if (!birthDate) return 'Unknown';
    
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + 
                       (today.getMonth() - birth.getMonth());
    
    if (ageInMonths < 1) return 'Newborn';
    if (ageInMonths <= 12) return 'Infant';
    return 'Toddler';
  };

  const getAgeBadge = (stage) => {
    const stages = {
      'Newborn': 'bg-blue-100 text-blue-800',
      'Infant': 'bg-green-100 text-green-800',
      'Toddler': 'bg-orange-100 text-orange-800'
    };
    return stages[stage] || 'bg-gray-100 text-gray-800';
  };

  const getGenderBadge = (gender) => {
    return gender === 'male' 
      ? 'bg-blue-100 text-blue-800'
      : 'bg-pink-100 text-pink-800';
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Unknown';
    
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + 
                       (today.getMonth() - birth.getMonth());
    
    if (ageInMonths < 12) {
      return `${ageInMonths} month${ageInMonths !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      return `${years} year${years !== 1 ? 's' : ''}${months > 0 ? ` ${months} month${months !== 1 ? 's' : ''}` : ''}`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Children Management</h1>
        <Link
          to="/patients/children/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add New Child
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Total Children</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.total_children || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Male</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.male_children || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Female</h3>
          <p className="text-2xl font-bold text-pink-600">{stats.female_children || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Newborns</h3>
          <p className="text-2xl font-bold text-green-600">{stats.newborns_0_1_month || 0}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Search by child name, parent name, or phone..."
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
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            value={ageFilter}
            onChange={(e) => {
              setAgeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Ages</option>
            <option value="newborns">Newborns (0-1 month)</option>
            <option value="infants">Infants (1-12 months)</option>
            <option value="toddlers">Toddlers (1-3 years)</option>
          </select>
        </div>
      </div>

      {/* Children Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading children records...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Child
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mother
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Birth Weight
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {children.map((child) => {
                    const stage = getDevelopmentalStage(child.patient?.date_of_birth);
                    const age = calculateAge(child.patient?.date_of_birth);
                    
                    return (
                      <tr key={child.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {child.patient?.first_name} {child.patient?.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{child.patient?.phone_number}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {age}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGenderBadge(child.gender)}`}>
                            {child.gender?.charAt(0).toUpperCase() + child.gender?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAgeBadge(stage)}`}>
                            {stage}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {child.mother_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {child.birth_weight ? `${child.birth_weight} kg` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              to={`/patients/children/${child.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </Link>
                            <Link
                              to={`/patients/children/${child.id}/edit`}
                              className="text-green-600 hover:text-green-900"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(child.id)}
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

            {children.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No child records found. <Link to="/patients/children/create" className="text-green-600 hover:underline">Create the first record</Link>.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Children;