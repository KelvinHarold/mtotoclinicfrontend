import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowLeft, FaFlask, FaUser, FaStethoscope, FaCalendarAlt } from 'react-icons/fa';
import api from '../../api/axios';

const LabResultShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [labResult, setLabResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    fetchLabResult();
  }, [id]);

  const fetchLabResult = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/lab-results/${id}`);
      if (response.data.success) {
        setLabResult(response.data.data);
      } else {
        setError('Lab result not found');
      }
    } catch (err) {
      setError('Failed to fetch lab result');
      console.error('Error fetching lab result:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/lab-results/${id}`);
      navigate('/lab-results');
    } catch (err) {
      setError('Failed to delete lab result');
      console.error('Error deleting lab result:', err);
    }
  };

  const getPatientName = () => {
    if (labResult?.lab_test?.patient) {
      return `${labResult.lab_test.patient.first_name} ${labResult.lab_test.patient.last_name}`;
    }
    return 'Unknown Patient';
  };

  const getDoctorName = (doctor) => {
    if (doctor) {
      return `${doctor.first_name} ${doctor.second_name ? doctor.second_name + ' ' : ''}${doctor.last_name}`;
    }
    return 'Unknown Doctor';
  };

  const getTestDate = () => {
    if (labResult?.lab_test?.test_date) {
      return new Date(labResult.lab_test.test_date).toLocaleDateString();
    }
    return 'Unknown Date';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading lab result...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link
          to="/lab-results"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Lab Results
        </Link>
      </div>
    );
  }

  if (!labResult) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Lab Result Not Found</h2>
          <Link
            to="/lab-results"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" />
            Back to Lab Results
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/lab-results"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to List
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            <FaFlask className="inline mr-2 mb-1" />
            Lab Result Details
          </h1>
          <div className="flex space-x-2">
            <Link
              to={`/lab-results/${labResult.id}/edit`}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
            >
              <FaEdit className="mr-2" />
              Edit
            </Link>
            <button
              onClick={() => setDeleteDialog(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
            >
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Info */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <FaUser className="text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Patient</p>
                <p className="font-medium text-gray-900">{getPatientName()}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaFlask className="text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Test</p>
                <p className="font-medium text-gray-900">{labResult.lab_test?.test_name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Test Date</p>
                <p className="font-medium text-gray-900">{getTestDate()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Result Details */}
        <div className="p-6 space-y-6">
          {/* Result */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Test Result</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{labResult.result}</p>
            </div>
          </div>

          {/* Interpretation */}
          {labResult.interpretation && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Interpretation</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{labResult.interpretation}</p>
              </div>
            </div>
          )}

          {/* Doctor Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Reporting Doctor</h3>
            <div className="flex items-center bg-gray-50 rounded-lg p-4">
              <FaStethoscope className="text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900">
                  {getDoctorName(labResult.doctor)}
                </p>
                {labResult.doctor?.department && (
                  <p className="text-sm text-gray-600">{labResult.doctor.department}</p>
                )}
                {labResult.doctor?.email && (
                  <p className="text-sm text-gray-600">{labResult.doctor.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Test Notes */}
          {labResult.lab_test?.test_notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Test Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{labResult.lab_test.test_notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="text-sm text-gray-500">
            Created on {new Date(labResult.created_at).toLocaleDateString()} at{' '}
            {new Date(labResult.created_at).toLocaleTimeString()}
            {labResult.updated_at !== labResult.created_at && (
              <span>
                {' • '}Updated on {new Date(labResult.updated_at).toLocaleDateString()} at{' '}
                {new Date(labResult.updated_at).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this lab result? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-200 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabResultShow;