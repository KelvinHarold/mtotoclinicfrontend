import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStethoscope, FaPlus, FaSearch, FaUser, FaCalendarAlt, FaEdit, FaTrash, FaEye, FaUserMd } from 'react-icons/fa';
import axiosInstance from '../../api/axios';

const MedicalAdviceList = () => {
  const [medicalAdvice, setMedicalAdvice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    patient_id: '',
    doctor_id: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMedicalAdvice();
  }, [filters]);

  const fetchMedicalAdvice = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.patient_id) params.append('patient_id', filters.patient_id);
      if (filters.doctor_id) params.append('doctor_id', filters.doctor_id);

      const response = await axiosInstance.get(`/medical-advice?${params}`);
      setMedicalAdvice(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch medical advice records');
      console.error('Error fetching medical advice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/medical-advice/search/query?q=${searchTerm}`);
      setMedicalAdvice(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to search medical advice');
      console.error('Error searching medical advice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medical advice record?')) {
      try {
        await axiosInstance.delete(`/medical-advice/${id}`);
        setMedicalAdvice(medicalAdvice.filter(advice => advice.id !== id));
      } catch (err) {
        setError('Failed to delete medical advice record');
        console.error('Error deleting medical advice:', err);
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      patient_id: '',
      doctor_id: ''
    });
    setSearchTerm('');
    fetchMedicalAdvice();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPatientName = (advice) => {
    if (advice.patient) {
      if (advice.patient.first_name && advice.patient.last_name) {
        return `${advice.patient.first_name} ${advice.patient.last_name}`;
      }
      if (advice.patient.name) {
        return advice.patient.name;
      }
    }
    return `Patient #${advice.patient_id}`;
  };

  const getDoctorName = (advice) => {
    if (advice.doctor) {
      if (advice.doctor.first_name && advice.doctor.last_name) {
        return `Dr. ${advice.doctor.first_name} ${advice.doctor.last_name}`;
      }
      if (advice.doctor.name) {
        return advice.doctor.name;
      }
    }
    return `Doctor #${advice.doctor_id}`;
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading medical advice records...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FaStethoscope className="text-3xl text-green-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Medical Advice</h1>
            <p className="text-gray-600">Manage patient medical advice records</p>
          </div>
        </div>
        <Link
          to="/medical-advice/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
        >
          <FaPlus className="mr-2" />
          New Advice
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <div className="flex">
              <input
                type="text"
                placeholder="Search medical advice content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSearch}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r flex items-center"
              >
                <FaSearch />
              </button>
            </div>
          </div>
          <input
            type="text"
            name="patient_id"
            placeholder="Patient ID"
            value={filters.patient_id}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={clearFilters}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Medical Advice Records ({medicalAdvice.length})
            </h2>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {medicalAdvice.map((advice) => (
            <div key={advice.id} className="p-6 hover:bg-gray-50 transition duration-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {getPatientName(advice)}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {truncateText(advice.advice_given)}
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <FaUserMd className="mr-1" />
                          {getDoctorName(advice)}
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {formatDate(advice.created_at)}
                        </div>
                        {advice.visit_id && (
                          <div className="flex items-center">
                            <FaUser className="mr-1" />
                            Visit #{advice.visit_id}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Link
                        to={`/medical-advice/${advice.id}`}
                        className="text-blue-600 hover:text-blue-900 flex items-center px-3 py-1 border border-blue-600 rounded text-sm"
                      >
                        <FaEye className="mr-1" />
                        View
                      </Link>
                      <Link
                        to={`/medical-advice/${advice.id}/edit`}
                        className="text-green-600 hover:text-green-900 flex items-center px-3 py-1 border border-green-600 rounded text-sm"
                      >
                        <FaEdit className="mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(advice.id)}
                        className="text-red-600 hover:text-red-900 flex items-center px-3 py-1 border border-red-600 rounded text-sm"
                      >
                        <FaTrash className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {medicalAdvice.length === 0 && (
          <div className="text-center py-12">
            <FaStethoscope className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No medical advice records found</p>
            <p className="text-gray-400 text-sm mt-2">
              {Object.values(filters).some(val => val) || searchTerm 
                ? 'Try adjusting your filters or search terms' 
                : 'Get started by creating a new medical advice record'
              }
            </p>
            <Link
              to="/medical-advice/create"
              className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-200"
            >
              Create First Advice
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalAdviceList;