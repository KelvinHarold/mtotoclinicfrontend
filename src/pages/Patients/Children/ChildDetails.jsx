import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';

const ChildDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    try {
      const response = await axios.get(`/children/${id}`);
      setRecord(response.data.data);
    } catch (error) {
      console.error('Error fetching child record:', error);
      alert('Failed to fetch child details');
      navigate('/patients/children');
    } finally {
      setLoading(false);
    }
  };

  const getDevelopmentalStage = (birthDate) => {
    if (!birthDate) return 'Unknown';
    
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + 
                       (today.getMonth() - birth.getMonth());
    
    if (ageInMonths < 1) return 'Newborn';
    if (ageInMonths < 3) return 'Infant (0-3 months)';
    if (ageInMonths < 6) return 'Infant (3-6 months)';
    if (ageInMonths < 9) return 'Infant (6-9 months)';
    if (ageInMonths < 12) return 'Infant (9-12 months)';
    if (ageInMonths < 18) return 'Toddler (12-18 months)';
    if (ageInMonths < 24) return 'Toddler (18-24 months)';
    if (ageInMonths < 36) return 'Toddler (2-3 years)';
    return 'Preschooler (3+ years)';
  };

  const getAgeBadge = (stage) => {
    const stages = {
      'Newborn': 'bg-blue-100 text-blue-800',
      'Infant (0-3 months)': 'bg-green-100 text-green-800',
      'Infant (3-6 months)': 'bg-green-100 text-green-800',
      'Infant (6-9 months)': 'bg-green-100 text-green-800',
      'Infant (9-12 months)': 'bg-green-100 text-green-800',
      'Toddler (12-18 months)': 'bg-orange-100 text-orange-800',
      'Toddler (18-24 months)': 'bg-orange-100 text-orange-800',
      'Toddler (2-3 years)': 'bg-orange-100 text-orange-800',
      'Preschooler (3+ years)': 'bg-purple-100 text-purple-800'
    };
    return stages[stage] || 'bg-gray-100 text-gray-800';
  };

  const getGenderBadge = (gender) => {
    return gender === 'male' 
      ? 'bg-blue-100 text-blue-800'
      : 'bg-pink-100 text-pink-800';
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Unknown';
    
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + 
                       (today.getMonth() - birth.getMonth());
    const ageInYears = Math.floor(ageInMonths / 12);
    const remainingMonths = ageInMonths % 12;

    if (ageInYears === 0) {
      return `${ageInMonths} month${ageInMonths !== 1 ? 's' : ''}`;
    } else {
      return `${ageInYears} year${ageInYears !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading child details...</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-500">
          Child record not found.
        </div>
      </div>
    );
  }

  const developmentalStage = getDevelopmentalStage(record.patient?.date_of_birth);
  const age = calculateAge(record.patient?.date_of_birth);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Child Details</h1>
          <div className="flex space-x-3">
            <Link
              to="/patients/children"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to List
            </Link>
            <Link
              to={`/patients/children/${record.id}/edit`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Edit Record
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border overflow-hidden">
          {/* Child Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Child Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Child Name</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.patient?.first_name} {record.patient?.last_name}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Gender</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGenderBadge(record.gender)}`}>
                  {record.gender?.charAt(0).toUpperCase() + record.gender?.slice(1)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.patient?.date_of_birth ? new Date(record.patient.date_of_birth).toLocaleDateString() : 'Not specified'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Age</label>
                <p className="mt-1 text-sm text-gray-900">{age}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Developmental Stage</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAgeBadge(developmentalStage)}`}>
                  {developmentalStage}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                <p className="mt-1 text-sm text-gray-900">{record.patient?.phone_number || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Birth Details */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Birth Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Birth Weight</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.birth_weight ? `${record.birth_weight} kg` : 'Not recorded'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Birth Height</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.birth_height ? `${record.birth_height} cm` : 'Not recorded'}
                </p>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Parent Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Mother's Name</label>
                <p className="mt-1 text-sm text-gray-900">{record.mother_name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Mother's Phone</label>
                <p className="mt-1 text-sm text-gray-900">{record.mother_phone}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Father's Name</label>
                <p className="mt-1 text-sm text-gray-900">{record.father_name || 'Not specified'}</p>
              </div>

              {record.mother && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Mother Patient Record</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {record.mother.first_name} {record.mother.last_name}
                  </p>
                </div>
              )}
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

export default ChildDetails;