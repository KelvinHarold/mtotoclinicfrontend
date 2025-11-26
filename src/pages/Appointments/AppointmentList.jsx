import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaPlus, FaSearch, FaUser, FaUserMd, FaEdit, FaTrash, FaEye, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import axiosInstance from '../../api/axios';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    patient_id: '',
    requested_doctor_id: '',
    status: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.patient_id) params.append('patient_id', filters.patient_id);
      if (filters.requested_doctor_id) params.append('requested_doctor_id', filters.requested_doctor_id);
      if (filters.status) params.append('status', filters.status);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);

      const response = await axiosInstance.get(`/appointments?${params}`);
      setAppointments(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axiosInstance.delete(`/appointments/${id}`);
        setAppointments(appointments.filter(appt => appt.id !== id));
      } catch (err) {
        setError('Failed to delete appointment');
        console.error('Error deleting appointment:', err);
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await axiosInstance.patch(`/appointments/${id}/status`, {
        status: newStatus
      });
      
      setAppointments(appointments.map(appt => 
        appt.id === id ? response.data.data : appt
      ));
    } catch (err) {
      setError('Failed to update appointment status');
      console.error('Error updating appointment status:', err);
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
      requested_doctor_id: '',
      status: '',
      start_date: '',
      end_date: ''
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FaClock },
      approved: { color: 'bg-green-100 text-green-800', icon: FaCheck },
      rejected: { color: 'bg-red-100 text-red-800', icon: FaTimes },
      completed: { color: 'bg-blue-100 text-blue-800', icon: FaCheck }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="mr-1 w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPatientName = (appointment) => {
    if (appointment.patient) {
      if (appointment.patient.first_name && appointment.patient.last_name) {
        return `${appointment.patient.first_name} ${appointment.patient.last_name}`;
      }
      if (appointment.patient.name) {
        return appointment.patient.name;
      }
    }
    return `Patient #${appointment.patient_id}`;
  };

  const getDoctorName = (appointment) => {
    if (appointment.requested_doctor) {
      if (appointment.requested_doctor.first_name && appointment.requested_doctor.last_name) {
        return `Dr. ${appointment.requested_doctor.first_name} ${appointment.requested_doctor.last_name}`;
      }
      if (appointment.requested_doctor.name) {
        return appointment.requested_doctor.name;
      }
    }
    return 'Any Available Doctor';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading appointments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FaCalendarAlt className="text-3xl text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
            <p className="text-gray-600">Manage patient appointments</p>
          </div>
        </div>
        <Link
          to="/appointments/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
        >
          <FaPlus className="mr-2" />
          New Appointment
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Filter Appointments</h3>
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
            name="requested_doctor_id"
            placeholder="Doctor ID"
            value={filters.requested_doctor_id}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
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
              Appointment Records ({appointments.length})
            </h2>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="p-6 hover:bg-gray-50 transition duration-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {getPatientName(appointment)}
                        </h3>
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          <span className="font-medium">{formatDateTime(appointment.preferred_date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaUserMd className="mr-2 text-gray-400" />
                          <span>{getDoctorName(appointment)}</span>
                        </div>
                      </div>

                      {appointment.reason && (
                        <p className="text-sm text-gray-600 mb-3">
                          <span className="font-medium">Reason:</span> {appointment.reason}
                        </p>
                      )}

                      {appointment.doctor_feedback && (
                        <p className="text-sm text-red-600 mb-3">
                          <span className="font-medium">Doctor Feedback:</span> {appointment.doctor_feedback}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/appointments/${appointment.id}`}
                          className="text-blue-600 hover:text-blue-900 flex items-center px-3 py-1 border border-blue-600 rounded text-sm"
                        >
                          <FaEye className="mr-1" />
                          View
                        </Link>
                        <Link
                          to={`/appointments/${appointment.id}/edit`}
                          className="text-green-600 hover:text-green-900 flex items-center px-3 py-1 border border-green-600 rounded text-sm"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="text-red-600 hover:text-red-900 flex items-center px-3 py-1 border border-red-600 rounded text-sm"
                        >
                          <FaTrash className="mr-1" />
                          Delete
                        </button>
                      </div>
                      
                      {appointment.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, 'approved')}
                            className="text-green-600 hover:text-green-900 flex items-center px-3 py-1 border border-green-600 rounded text-sm"
                          >
                            <FaCheck className="mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, 'rejected')}
                            className="text-red-600 hover:text-red-900 flex items-center px-3 py-1 border border-red-600 rounded text-sm"
                          >
                            <FaTimes className="mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {appointments.length === 0 && (
          <div className="text-center py-12">
            <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No appointments found</p>
            <p className="text-gray-400 text-sm mt-2">
              {Object.values(filters).some(val => val) 
                ? 'Try adjusting your filters' 
                : 'Get started by creating a new appointment'
              }
            </p>
            <Link
              to="/appointments/create"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
            >
              Create First Appointment
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;