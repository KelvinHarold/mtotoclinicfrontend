import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaFlask, FaUser, FaStethoscope, FaCalendar } from 'react-icons/fa';
import api from '../../api/axios';

const LabTestShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [labTest, setLabTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLabTest();
  }, [id]);

  const fetchLabTest = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/lab-tests/${id}`);
      if (response.data.success) {
        setLabTest(response.data.data);
      } else {
        setError('Lab test not found');
      }
    } catch (err) {
      setError('Failed to fetch lab test details');
      console.error('Error fetching lab test:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPatientName = () => {
    if (labTest.patient) {
      return `${labTest.patient.first_name} ${labTest.patient.last_name}`;
    }
    return `Patient #${labTest.patient_id}`;
  };

  const getDoctorName = () => {
    if (labTest.doctor) {
      return labTest.doctor.name;
    }
    return `Doctor #${labTest.doctor_id}`;
  };

  const getTestDate = () => {
    return new Date(labTest.test_date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading lab test details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link
          to="/lab-tests"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to Lab Tests
        </Link>
      </div>
    );
  }

  if (!labTest) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Lab Test Not Found</h2>
          <Link
            to="/lab-tests"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
          >
            <FaArrowLeft className="mr-2" />
            Back to Lab Tests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            to="/lab-tests"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2 transition duration-200"
          >
            <FaArrowLeft className="mr-2" />
            Back to List
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            <FaFlask className="inline mr-2 mb-1" />
            Lab Test Details
          </h1>
        </div>
        <Link
          to={`/lab-tests/${labTest.id}/edit`}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
        >
          <FaEdit className="mr-2" />
          Edit
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-xl font-semibold">{labTest.test_name}</h2>
          <p className="text-blue-100">Test ID: #{labTest.id}</p>
        </div>

        <div className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaUser className="mr-2 text-blue-600" />
                Patient Information
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-600">Patient Name</label>
                  <p className="text-gray-900">{getPatientName()}</p>
                </div>
                {labTest.patient && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                      <p className="text-gray-900">
                        {labTest.patient.date_of_birth 
                          ? new Date(labTest.patient.date_of_birth).toLocaleDateString()
                          : 'Not specified'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Gender</label>
                      <p className="text-gray-900 capitalize">{labTest.patient.gender || 'Not specified'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaStethoscope className="mr-2 text-green-600" />
                Doctor Information
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-600">Requesting Doctor</label>
                  <p className="text-gray-900">{getDoctorName()}</p>
                </div>
                {labTest.doctor && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{labTest.doctor.email}</p>
                    </div>
                    {labTest.doctor.specialization && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Specialization</label>
                        <p className="text-gray-900">{labTest.doctor.specialization}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Test Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <FaCalendar className="mr-2 text-purple-600" />
              Test Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Test Name</label>
                <p className="text-gray-900 font-medium">{labTest.test_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Test Date</label>
                <p className="text-gray-900">{getTestDate()}</p>
              </div>
              {labTest.visit && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Visit</label>
                  <p className="text-gray-900">
                    {labTest.visit.visit_number || `Visit #${labTest.visit.id}`}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    labTest.lab_result
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                  }`}
                >
                  {labTest.lab_result ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Test Notes */}
          {labTest.test_notes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Test Notes</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{labTest.test_notes}</p>
            </div>
          )}

          {/* Lab Result Section */}
          {labTest.lab_result && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Lab Result</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-green-700">Result</label>
                  <p className="text-green-900 font-medium">{labTest.lab_result.result}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-green-700">Result Date</label>
                  <p className="text-green-900">
                    {new Date(labTest.lab_result.result_date).toLocaleDateString()}
                  </p>
                </div>
                {labTest.lab_result.notes && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-green-700">Result Notes</label>
                    <p className="text-green-900 whitespace-pre-wrap">{labTest.lab_result.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabTestShow;