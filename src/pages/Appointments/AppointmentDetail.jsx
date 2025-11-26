import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaArrowLeft, FaUser, FaUserMd, FaEdit, FaTrash, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import axiosInstance from '../../api/axios';

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/appointments/${id}`);
      setAppointment(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch appointment details');
      console.error('Error fetching appointment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      try {
        await axiosInstance.delete(`/appointments/${id}`);
        navigate('/appointments');
      } catch (err) {
        setError('Failed to delete appointment');
        console.error('Error deleting appointment:', err);
      }
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await axiosInstance.patch(`/appointments/${id}/status`, {
        status: newStatus
      });
      setAppointment(response.data.data);
    } catch (err) {
      setError('Failed to update appointment status');
      console.error('Error updating appointment status:', err);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <IconComponent className="mr-1 w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPatientName = () => {
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

  const getDoctorName = () => {
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
          <span className="ml-2">Loading appointment details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link
          to="/appointments"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Appointments
        </Link>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Appointment Not Found</h2>
          <p className="text-gray-600">The appointment you're looking for doesn't exist.</p>
          <Link
            to="/appointments"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Appointments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/appointments"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to Appointments
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              <FaCalendarAlt className="inline mr-2 mb-1" />
              Appointment Details
            </h1>
            <p className="text-gray-600 mt-2">Appointment Record Information</p>
          </div>
          
          <div className="flex space-x-3">
            <Link
              to={`/appointments/${appointment.id}/edit`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
            >
              <FaEdit className="mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
            >
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Appointment #{appointment.id}</h2>
              <p className="text-blue-100">Scheduled for {formatDateTime(appointment.preferred_date)}</p>
            </div>
            <div className="text-right">
              {getStatusBadge(appointment.status)}
              <p className="text-sm text-blue-200 mt-1">
                Created: {formatDate(appointment.created_at)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient and Doctor Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                People Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 flex items-center">
                    <FaUser className="mr-2" />
                    Patient
                  </label>
                  <p className="mt-1 text-lg text-gray-900 font-semibold">
                    {getPatientName()}
                  </p>
                  <p className="text-sm text-gray-500">Patient ID: {appointment.patient_id}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 flex items-center">
                    <FaUserMd className="mr-2" />
                    Requested Doctor
                  </label>
                  <p className="mt-1 text-md text-gray-900 font-semibold">
                    {getDoctorName()}
                  </p>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Appointment Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    Preferred Date & Time
                  </label>
                  <p className="mt-1 text-md text-gray-900 font-semibold">
                    {formatDateTime(appointment.preferred_date)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(appointment.status)}
                  </div>
                </div>

                {appointment.reason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Reason</label>
                    <p className="mt-1 text-sm text-gray-700 bg-gray-50 rounded p-3">
                      {appointment.reason}
                    </p>
                  </div>
                )}

                {appointment.doctor_feedback && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Doctor Feedback</label>
                    <p className="mt-1 text-sm text-gray-700 bg-red-50 rounded p-3">
                      {appointment.doctor_feedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Update Actions */}
          {appointment.status === 'pending' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleStatusUpdate('approved')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
                >
                  <FaCheck className="mr-2" />
                  Approve Appointment
                </button>
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
                >
                  <FaTimes className="mr-2" />
                  Reject Appointment
                </button>
              </div>
            </div>
          )}

          {/* Record Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Record Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-sm font-medium text-gray-600">Created At</label>
                <p className="mt-1 text-gray-900">
                  {new Date(appointment.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Last Updated</label>
                <p className="mt-1 text-gray-900">
                  {new Date(appointment.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;