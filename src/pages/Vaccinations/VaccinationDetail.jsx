import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaSyringe, FaArrowLeft, FaCalendarAlt, FaUser, FaUserMd, FaEdit, FaTrash } from 'react-icons/fa';
import axiosInstance from '../../api/axios';

const VaccinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vaccination, setVaccination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVaccination();
  }, [id]);

  const fetchVaccination = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/vaccinations/${id}`);
      setVaccination(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch vaccination details');
      console.error('Error fetching vaccination:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this vaccination record? This action cannot be undone.')) {
      try {
        await axiosInstance.delete(`/vaccinations/${id}`);
        navigate('/vaccinations');
      } catch (err) {
        setError('Failed to delete vaccination record');
        console.error('Error deleting vaccination:', err);
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

  const getDoctorName = () => {
    if (vaccination.doctor) {
      if (vaccination.doctor.first_name && vaccination.doctor.last_name) {
        return `Dr. ${vaccination.doctor.first_name} ${vaccination.doctor.last_name}`;
      }
      if (vaccination.doctor.name) {
        return vaccination.doctor.name;
      }
    }
    return `Doctor #${vaccination.doctor_id}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading vaccination details...</span>
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
          to="/vaccinations"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Vaccinations
        </Link>
      </div>
    );
  }

  if (!vaccination) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <FaSyringe className="text-4xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Vaccination Not Found</h2>
          <p className="text-gray-600">The vaccination record you're looking for doesn't exist.</p>
          <Link
            to="/vaccinations"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Vaccinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/vaccinations"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to Vaccinations
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              <FaSyringe className="inline mr-2 mb-1" />
              {vaccination.vaccine_name} - {vaccination.dose}
            </h1>
            <p className="text-gray-600 mt-2">Vaccination Record Details</p>
          </div>
          
          <div className="flex space-x-3">
            <Link
              to={`/vaccinations/${vaccination.id}/edit`}
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
        <div className="bg-blue-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{vaccination.vaccine_name}</h2>
              <p className="text-blue-100">{vaccination.dose}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100">Record # {vaccination.id}</p>
              <p className="text-sm text-blue-200">
                Created: {new Date(vaccination.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Vaccination Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Vaccine Name</label>
                  <p className="mt-1 text-lg text-gray-900 font-semibold">{vaccination.vaccine_name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Dose</label>
                  <p className="mt-1 text-md text-gray-900 font-medium">{vaccination.dose}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      Vaccination Date
                    </label>
                    <p className="mt-1 text-md text-gray-900 font-semibold">
                      {formatDate(vaccination.vaccination_date)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Next Due Date</label>
                    <p className="mt-1 text-md text-gray-900">
                      {vaccination.next_due_date ? (
                        <span className="font-semibold text-green-600">
                          {formatDate(vaccination.next_due_date)}
                        </span>
                      ) : (
                        <span className="text-gray-500 italic">Not scheduled</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

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
                  <p className="mt-1 text-md text-gray-900 font-semibold">
                    {getPatientName()}
                  </p>
                  <p className="text-sm text-gray-500">Patient ID: {vaccination.patient_id}</p>
                </div>
                
                {vaccination.visit_id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Associated Visit</label>
                    <p className="mt-1 text-sm text-gray-900">
                      Visit #{vaccination.visit_id}
                      {vaccination.visit && vaccination.visit.visit_date && (
                        <span className="text-gray-500 ml-2">
                          ({new Date(vaccination.visit.visit_date).toLocaleDateString()})
                        </span>
                      )}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 flex items-center">
                    <FaUserMd className="mr-2" />
                    Administered By
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
                  {new Date(vaccination.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Last Updated</label>
                <p className="mt-1 text-gray-900">
                  {new Date(vaccination.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationDetail;