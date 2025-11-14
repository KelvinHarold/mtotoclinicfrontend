import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';

const PregnantWomanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    try {
      const response = await axios.get(`/pregnant-women/${id}`);
      setRecord(response.data.data);
    } catch (error) {
      console.error('Error fetching record:', error);
      alert('Failed to fetch record details');
      navigate('/patients/pregnant-women');
    } finally {
      setLoading(false);
    }
  };

  const calculateGestationalAge = (lmp) => {
    const today = new Date();
    const lastPeriod = new Date(lmp);
    const diffTime = Math.abs(today - lastPeriod);
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  const getTrimester = (edd) => {
    const today = new Date();
    const deliveryDate = new Date(edd);
    const weeksToGo = Math.floor((deliveryDate - today) / (1000 * 60 * 60 * 24 * 7));
    
    if (weeksToGo > 26) return 'First';
    if (weeksToGo > 12) return 'Second';
    return 'Third';
  };

  const getTrimesterBadge = (trimester) => {
    const trimesters = {
      'First': 'bg-blue-100 text-blue-800',
      'Second': 'bg-green-100 text-green-800',
      'Third': 'bg-red-100 text-red-800'
    };
    return trimesters[trimester] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading record details...</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-500">
          Record not found.
        </div>
      </div>
    );
  }

  const gestationalAge = calculateGestationalAge(record.last_menstrual_period);
  const trimester = getTrimester(record.expected_delivery_date);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Pregnant Woman Details</h1>
          <div className="flex space-x-3">
            <Link
              to="/patients/pregnant-women"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to List
            </Link>
            <Link
              to={`/patients/pregnant-women/${record.id}/edit`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Edit Record
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border overflow-hidden">
          {/* Patient Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Patient Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Patient Name</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.patient?.first_name} {record.patient?.last_name}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                <p className="mt-1 text-sm text-gray-900">{record.patient?.phone_number}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Address</label>
                <p className="mt-1 text-sm text-gray-900">{record.patient?.address}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Registered By</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.patient?.registered_by?.first_name} {record.patient?.registered_by?.last_name}
                </p>
              </div>
            </div>
          </div>

          {/* Pregnancy Details */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pregnancy Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Menstrual Period</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(record.last_menstrual_period).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Expected Delivery Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(record.expected_delivery_date).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Gestational Age</label>
                <p className="mt-1 text-sm text-gray-900">{gestationalAge} weeks</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Trimester</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTrimesterBadge(trimester)}`}>
                  {trimester} Trimester
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Gravida (Number of pregnancies)</label>
                <p className="mt-1 text-sm text-gray-900">{record.gravida}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Parity (Number of live births)</label>
                <p className="mt-1 text-sm text-gray-900">{record.parity}</p>
              </div>
            </div>
          </div>

          {/* Husband/Partner Information */}
          {(record.husband_name || record.husband_phone) && (
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Husband/Partner Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {record.husband_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{record.husband_name}</p>
                  </div>
                )}
                {record.husband_phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{record.husband_phone}</p>
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
                  {new Date(record.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(record.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PregnantWomanDetails;