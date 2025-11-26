import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStethoscope, FaArrowLeft, FaUser, FaUserMd, FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import axiosInstance from '../../api/axios';

const MedicalAdviceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicalAdvice, setMedicalAdvice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedicalAdvice();
  }, [id]);

  const fetchMedicalAdvice = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/medical-advice/${id}`);
      setMedicalAdvice(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch medical advice details');
      console.error('Error fetching medical advice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this medical advice record? This action cannot be undone.')) {
      try {
        await axiosInstance.delete(`/medical-advice/${id}`);
        navigate('/medical-advice');
      } catch (err) {
        setError('Failed to delete medical advice record');
        console.error('Error deleting medical advice:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPatientName = () => {
    if (medicalAdvice.patient) {
      if (medicalAdvice.patient.first_name && medicalAdvice.patient.last_name) {
        return `${medicalAdvice.patient.first_name} ${medicalAdvice.patient.last_name}`;
      }
      if (medicalAdvice.patient.name) {
        return medicalAdvice.patient.name;
      }
    }
    return `Patient #${medicalAdvice.patient_id}`;
  };

  const getDoctorName = () => {
    if (medicalAdvice.doctor) {
      if (medicalAdvice.doctor.first_name && medicalAdvice.doctor.last_name) {
        return `Dr. ${medicalAdvice.doctor.first_name} ${medicalAdvice.doctor.last_name}`;
      }
      if (medicalAdvice.doctor.name) {
        return medicalAdvice.doctor.name;
      }
    }
    return `Doctor #${medicalAdvice.doctor_id}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2">Loading medical advice details...</span>
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
          to="/medical-advice"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Medical Advice
        </Link>
      </div>
    );
  }

  if (!medicalAdvice) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <FaStethoscope className="text-4xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Medical Advice Not Found</h2>
          <p className="text-gray-600">The medical advice record you're looking for doesn't exist.</p>
          <Link
            to="/medical-advice"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Medical Advice
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/medical-advice"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to Medical Advice
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              <FaStethoscope className="inline mr-2 mb-1" />
              Medical Advice
            </h1>
            <p className="text-gray-600 mt-2">Medical Advice Record Details</p>
          </div>
          
          <div className="flex space-x-3">
            <Link
              to={`/medical-advice/${medicalAdvice.id}/edit`}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
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
        <div className="bg-green-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Medical Advice Record</h2>
              <p className="text-green-100">For {getPatientName()}</p>
            </div>
            <div className="text-right">
              <p className="text-green-100">Record # {medicalAdvice.id}</p>
              <p className="text-sm text-green-200">
                Created: {formatDate(medicalAdvice.created_at)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Medical Advice
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {medicalAdvice.advice_given}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 flex items-center">
                    <FaUser className="mr-2" />
                    Patient
                  </label>
                  <p className="mt-1 text-md text-gray-900 font-semibold">
                    {getPatientName()}
                  </p>
                  <p className="text-sm text-gray-500">Patient ID: {medicalAdvice.patient_id}</p>
                </div>
                
                {medicalAdvice.visit_id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Associated Visit</label>
                    <p className="mt-1 text-sm text-gray-900">
                      Visit #{medicalAdvice.visit_id}
                      {medicalAdvice.visit && medicalAdvice.visit.visit_date && (
                        <span className="text-gray-500 ml-2">
                          ({formatDate(medicalAdvice.visit.visit_date)})
                        </span>
                      )}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 flex items-center">
                    <FaUserMd className="mr-2" />
                    Provided By
                  </label>
                  <p className="mt-1 text-md text-gray-900 font-semibold">
                    {getDoctorName()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Record Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-sm font-medium text-gray-600">Created At</label>
                <p className="mt-1 text-gray-900">
                  {new Date(medicalAdvice.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Last Updated</label>
                <p className="mt-1 text-gray-900">
                  {new Date(medicalAdvice.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalAdviceDetail;