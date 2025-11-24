import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSyringe, FaPlus, FaSearch, FaCalendarAlt, FaUser, FaTrash, FaEye, FaEdit } from 'react-icons/fa';
import axiosInstance from '../../api/axios';

const VaccinationList = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    patient_id: '',
    vaccine_name: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchVaccinations();
  }, [filters]);

  const fetchVaccinations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.patient_id) params.append('patient_id', filters.patient_id);
      if (filters.vaccine_name) params.append('vaccine_name', filters.vaccine_name);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);

      const response = await axiosInstance.get(`/vaccinations?${params}`);
      setVaccinations(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch vaccinations');
      console.error('Error fetching vaccinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vaccination record?')) {
      try {
        await axiosInstance.delete(`/vaccinations/${id}`);
        setVaccinations(vaccinations.filter(vacc => vacc.id !== id));
      } catch (err) {
        setError('Failed to delete vaccination record');
        console.error('Error deleting vaccination:', err);
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
      vaccine_name: '',
      start_date: '',
      end_date: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPatientName = (vaccination) => {
    if (vaccination.patient) {
      if (vaccination.patient.first_name && vaccination.patient.last_name) {
        return `${vaccination.patient.first_name} ${vaccination.patient.last_name}`;
      }
      if (vaccination.patient.name) {
        return vaccination.patient.name;
      }
    }
    return `Patient #${vaccination.patient_id}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading vaccinations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FaSyringe className="text-3xl text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Vaccination Records</h1>
            <p className="text-gray-600">Manage all vaccination records</p>
          </div>
        </div>
        <Link
          to="/vaccinations/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
        >
          <FaPlus className="mr-2" />
          New Vaccination
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Filter Vaccinations</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            name="patient_id"
            placeholder="Patient ID"
            value={filters.patient_id}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="vaccine_name"
            placeholder="Vaccine Name"
            value={filters.vaccine_name}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            name="start_date"
            placeholder="Start Date"
            value={filters.start_date}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={clearFilters}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-200"
          >
            Clear Filters
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
              Vaccination Records ({vaccinations.length})
            </h2>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vaccine Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient Information
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vaccinations.map((vaccination) => (
              <tr key={vaccination.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">
                    {vaccination.vaccine_name}
                  </div>
                  <div className="text-sm text-gray-600">{vaccination.dose}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    by {vaccination.doctor ? `Dr. ${vaccination.doctor.first_name} ${vaccination.doctor.last_name}` : `Doctor #${vaccination.doctor_id}`}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {getPatientName(vaccination)}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {vaccination.patient_id}
                    {vaccination.visit_id && ` • Visit: ${vaccination.visit_id}`}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1 text-gray-400" />
                      {formatDate(vaccination.vaccination_date)}
                    </div>
                  </div>
                  {vaccination.next_due_date && (
                    <div className="text-xs text-green-600 mt-1">
                      Next: {formatDate(vaccination.next_due_date)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      to={`/vaccinations/${vaccination.id}`}
                      className="text-blue-600 hover:text-blue-900 flex items-center px-3 py-1 border border-blue-600 rounded"
                    >
                      <FaEye className="mr-1" />
                      View
                    </Link>
                    <Link
                      to={`/vaccinations/${vaccination.id}/edit`}
                      className="text-green-600 hover:text-green-900 flex items-center px-3 py-1 border border-green-600 rounded"
                    >
                      <FaEdit className="mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(vaccination.id)}
                      className="text-red-600 hover:text-red-900 flex items-center px-3 py-1 border border-red-600 rounded"
                    >
                      <FaTrash className="mr-1" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {vaccinations.length === 0 && (
          <div className="text-center py-12">
            <FaSyringe className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No vaccination records found</p>
            <Link
              to="/vaccinations/create"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
            >
              Create First Vaccination
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaccinationList;