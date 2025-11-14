import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from "../../api/axios";


const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await axios.get(`/patients/${id}`);
      setPatient(response.data.data);
    } catch (error) {
      console.error('Error fetching patient:', error);
      alert('Failed to fetch patient details');
      navigate('/patients');
    } finally {
      setLoading(false);
    }
  };

  const getPatientTypeBadge = (type) => {
    const types = {
      pregnant: 'bg-pink-100 text-pink-800',
      breastfeeding: 'bg-blue-100 text-blue-800',
      child: 'bg-green-100 text-green-800'
    };
    return types[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-500">
          Patient not found.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Patient Details</h1>
          <div className="flex space-x-3">
            <Link
              to="/patients"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to List
            </Link>
            <Link
              to={`/patients/${patient.id}/edit`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Edit Patient
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border overflow-hidden">
          {/* Patient Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                <p className="mt-1 text-sm text-gray-900">
                  {patient.first_name} {patient.second_name} {patient.last_name}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Patient Type</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPatientTypeBadge(patient.patient_type)}`}>
                  {patient.patient_type}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                <p className="mt-1 text-sm text-gray-900">{patient.phone_number}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="mt-1 text-sm text-gray-900">
                  {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : 'Not specified'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Age</label>
                <p className="mt-1 text-sm text-gray-900">{patient.age || 'Not specified'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Registered By</label>
                <p className="mt-1 text-sm text-gray-900">
                  {patient.registered_by?.first_name} {patient.registered_by?.last_name}
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Address</h2>
            <p className="text-sm text-gray-900">{patient.address}</p>
          </div>

          {/* Emergency Contact */}
          {(patient.emergency_contact_name || patient.emergency_contact_phone) && (
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {patient.emergency_contact_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Contact Name</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.emergency_contact_name}</p>
                  </div>
                )}
                {patient.emergency_contact_phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Contact Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.emergency_contact_phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Registration Details */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Registration Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Registration Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(patient.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(patient.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;