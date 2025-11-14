import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';

const BreastfeedingWomanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    try {
      const response = await axios.get(`/breastfeeding-women/${id}`);
      setRecord(response.data.data);
    } catch (error) {
      console.error('Error fetching record:', error);
      alert('Failed to fetch record details');
      navigate('/patients/breastfeeding-women');
    } finally {
      setLoading(false);
    }
  };

  const getBabyAgeCategory = (babyAgeMonths) => {
    if (babyAgeMonths < 1) return 'Newborn';
    if (babyAgeMonths <= 12) return 'Infant';
    return 'Toddler';
  };

  const getBabyAgeBadge = (category) => {
    const categories = {
      'Newborn': 'bg-blue-100 text-blue-800',
      'Infant': 'bg-green-100 text-green-800',
      'Toddler': 'bg-orange-100 text-orange-800'
    };
    return categories[category] || 'bg-gray-100 text-gray-800';
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

  const category = getBabyAgeCategory(record.baby_age_months);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Breastfeeding Woman Details</h1>
          <div className="flex space-x-3">
            <Link
              to="/patients/breastfeeding-women"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to List
            </Link>
            <Link
              to={`/patients/breastfeeding-women/${record.id}/edit`}
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

          {/* Breastfeeding Details */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Breastfeeding Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Delivery Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(record.delivery_date).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Baby Name</label>
                <p className="mt-1 text-sm text-gray-900">{record.baby_name || 'Not specified'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Baby Age</label>
                <p className="mt-1 text-sm text-gray-900">{record.baby_age_months} months</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Category</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBabyAgeBadge(category)}`}>
                  {category}
                </span>
              </div>
            </div>
          </div>

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

export default BreastfeedingWomanDetails;