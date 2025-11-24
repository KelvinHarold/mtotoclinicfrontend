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

  const getBooleanBadge = (value) => {
    return value === 'yes' 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getTestResultBadge = (result) => {
    const results = {
      'positive': 'bg-red-100 text-red-800',
      'negative': 'bg-green-100 text-green-800',
      'not_tested': 'bg-gray-100 text-gray-800'
    };
    return results[result] || 'bg-gray-100 text-gray-800';
  };

  const getDeliveryPlaceText = (place) => {
    const places = {
      'health_facility': 'Kituo cha huduma ya afya',
      'home': 'Nyumbani',
      'on_the_way': 'Njiani'
    };
    return places[place] || place;
  };

  const getBirthAttendantText = (attendant) => {
    const attendants = {
      'health_worker': 'Mhudumu wa afya',
      'tba': 'TBA',
      'other': 'Wengineo'
    };
    return attendants[attendant] || attendant;
  };

  const getPmtctStatusText = (status) => {
    const statuses = {
      'pmtct1': 'PMTCT 1',
      'pmtct2': 'PMTCT 2',
      'unknown': 'Haijulikani'
    };
    return statuses[status] || status;
  };

  const getYesNoText = (value) => {
    return value === 'yes' ? 'Ndiyo' : 'Hapana';
  };

  const getTestResultText = (result) => {
    const results = {
      'positive': 'Chanya',
      'negative': 'Hasi',
      'not_tested': 'Hakupimwa'
    };
    return results[result] || result;
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
      <div className="max-w-6xl mx-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Patient Name</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.patient?.first_name} {record.patient?.last_name}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                <p className="mt-1 text-sm text-gray-900">{record.patient?.phone_number || 'Not specified'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Address</label>
                <p className="mt-1 text-sm text-gray-900">{record.patient?.address || 'Not specified'}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Delivery Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.delivery_date ? new Date(record.delivery_date).toLocaleDateString() : 'Not specified'}
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

          {/* Taarifa Ya Mama - Birth Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Taarifa Ya Mama</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Mahali alipo jifungulia</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.delivery_place ? getDeliveryPlaceText(record.delivery_place) : 'Not specified'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Aina ya muhudumu aliyemzalisha</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.birth_attendant ? getBirthAttendantText(record.birth_attendant) : 'Not specified'}
                </p>
              </div>

              {record.other_attendant && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Maelezo ya mhudumu mwingine</label>
                  <p className="mt-1 text-sm text-gray-900">{record.other_attendant}</p>
                </div>
              )}
            </div>
          </div>

          {/* Medical Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Taarifa za Kiafya</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Majibu ya kipimo cha kaswende</label>
                {record.syphilis_test_result ? (
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTestResultBadge(record.syphilis_test_result)}`}>
                    {getTestResultText(record.syphilis_test_result)}
                  </span>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">Not specified</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Kiasi cha damu (Hb) hudhurio la mwisho (g/dl)</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.last_hb_level ? `${record.last_hb_level} g/dl` : 'Not specified'}
                </p>
              </div>
            </div>

            {/* Medications and Supplements */}
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-700 mb-4">Madawa na Vitamini</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Alipata SP 2+</label>
                  {record.received_sp ? (
                    <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.received_sp)}`}>
                      {getYesNoText(record.received_sp)}
                    </span>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">Not specified</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Alipata madini chuma</label>
                  {record.received_iron ? (
                    <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.received_iron)}`}>
                      {getYesNoText(record.received_iron)}
                    </span>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">Not specified</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Alipata Folic Acid</label>
                  {record.received_folic_acid ? (
                    <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.received_folic_acid)}`}>
                      {getYesNoText(record.received_folic_acid)}
                    </span>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">Not specified</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Alipata chanjo ya Pepopunda</label>
                  {record.received_tetanus_vaccine ? (
                    <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.received_tetanus_vaccine)}`}>
                      {getYesNoText(record.received_tetanus_vaccine)}
                    </span>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">Not specified</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Alipata dawa za minyoo</label>
                  {record.received_deworming ? (
                    <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.received_deworming)}`}>
                      {getYesNoText(record.received_deworming)}
                    </span>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">Not specified</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Alipata Vitamin A</label>
                  {record.received_vitamin_a ? (
                    <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.received_vitamin_a)}`}>
                      {getYesNoText(record.received_vitamin_a)}
                    </span>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">Not specified</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* PMTCT Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Taarifa za PMTCT</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Hali ya maambukizi ya VVU ya mama</label>
                {record.hiv_status_pmtct ? (
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    record.hiv_status_pmtct === 'unknown' 
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {getPmtctStatusText(record.hiv_status_pmtct)}
                  </span>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">Not specified</p>
                )}
              </div>

              {record.hiv_status_pmtct === 'pmtct1' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Anatumia Cotrimoxazole</label>
                    {record.uses_cotrimoxazole ? (
                      <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.uses_cotrimoxazole)}`}>
                        {getYesNoText(record.uses_cotrimoxazole)}
                      </span>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">Not specified</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Anatumia dawa ya ARV</label>
                    {record.uses_arv ? (
                      <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.uses_arv)}`}>
                        {getYesNoText(record.uses_arv)}
                      </span>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">Not specified</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {record.hiv_status_pmtct !== 'pmtct1' && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Maelezo ya PMTCT yanaonyeshwa tu kama hali ya VVU ya mama ni PMTCT 1
                </p>
              </div>
            )}
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