import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';

const PregnantWomanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');

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

  const getEducationLevel = (education) => {
    const levels = {
      'primary': 'Msingi',
      'secondary': 'Sekondari',
      'college': 'Chuo',
      'other': 'Nyingine'
    };
    return levels[education] || education;
  };

  const getMaritalStatus = (status) => {
    const statuses = {
      'married': 'Ameolewa',
      'single': 'Hajaolewa',
      'other': 'Nyingine'
    };
    return statuses[status] || status;
  };

  const getDeliveryType = (type) => {
    const types = {
      'normal': 'Kawaida',
      'csection': 'Upasuaji (C-section)',
      'assisted': 'Usaidizi',
      'vacuum': 'Kuvutwa kwa vacuum',
      'forceps': 'Kuvutwa kwa forceps',
      'other': 'Nyingine'
    };
    return types[type] || type;
  };

  const getOutcome = (outcome) => {
    const outcomes = {
      'live_birth': 'Mtoto hai',
      'still_birth': 'Mtoto mfu',
      'miscarriage': 'Mimba iliharibika',
      'abortion': 'Abortion'
    };
    return outcomes[outcome] || outcome;
  };

  const getNormalCycle = (cycle) => {
    return cycle === 'yes' ? 'Ndiyo' : 'Hapana';
  };

  const RiskFactorBadge = ({ condition, label }) => {
    if (!condition) return null;
    
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2 mb-2">
        {label}
      </span>
    );
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

  const tabs = [
    { id: 'basic', name: 'Taarifa za Msingi' },
    { id: 'address', name: 'Anuani na Elimu' },
    { id: 'partner', name: 'Taarifa za Mwenzi' },
    { id: 'contacts', name: 'Ndugu na Mwenyekiti' },
    { id: 'medical', name: 'Mtoa Huduma na Aleji' },
    { id: 'pregnancy', name: 'Muhtasari wa Ujauzito' },
    { id: 'history', name: 'Historia ya Uzazi' },
    { id: 'risks', name: 'Vidokezo vya Hatari' }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'basic':
        return renderBasicInfo();
      case 'address':
        return renderAddressInfo();
      case 'partner':
        return renderPartnerInfo();
      case 'contacts':
        return renderContactsInfo();
      case 'medical':
        return renderMedicalInfo();
      case 'pregnancy':
        return renderPregnancyInfo();
      case 'history':
        return renderHistoryInfo();
      case 'risks':
        return renderRisksInfo();
      default:
        return renderBasicInfo();
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* Patient Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Taarifa za Mgonjwa</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500">Jina la Mgonjwa</label>
          <p className="mt-1 text-sm text-gray-900">
            {record.patient?.first_name} {record.patient?.last_name}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500">Namba ya Simu</label>
          <p className="mt-1 text-sm text-gray-900">{record.patient?.phone_number}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Anuani</label>
          <p className="mt-1 text-sm text-gray-900">{record.patient?.address}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Alisajiliwa na</label>
          <p className="mt-1 text-sm text-gray-900">
            {record.patient?.registered_by?.first_name} {record.patient?.registered_by?.last_name}
          </p>
        </div>
      </div>

      {/* Pregnancy Details */}
      <div className="bg-green-50 p-4 rounded-lg mt-6">
        <h3 className="text-sm font-medium text-green-800 mb-2">Taarifa za Ujauzito</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500">Tarehe ya Hedhi ya Mwisho</label>
          <p className="mt-1 text-sm text-gray-900">
            {new Date(record.last_menstrual_period).toLocaleDateString()}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Tarehe ya Kutarajia Kuzalia</label>
          <p className="mt-1 text-sm text-gray-900">
            {new Date(record.expected_delivery_date).toLocaleDateString()}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Umri wa Mimba (Majuma)</label>
          <p className="mt-1 text-sm text-gray-900">{gestationalAge} majuma</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Trimeshta</label>
          <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTrimesterBadge(trimester)}`}>
            {trimester} Trimester
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Gravida (Idadi ya mimba)</label>
          <p className="mt-1 text-sm text-gray-900">{record.gravida}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Parity (Idadi ya watoto waliozaliwa hai)</label>
          <p className="mt-1 text-sm text-gray-900">{record.parity}</p>
        </div>
      </div>

      {/* Husband/Partner Information */}
      {(record.husband_name || record.husband_phone) && (
        <>
          <div className="bg-purple-50 p-4 rounded-lg mt-6">
            <h3 className="text-sm font-medium text-purple-800 mb-2">Taarifa za Mume/Mwenzi</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {record.husband_name && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Jina</label>
                <p className="mt-1 text-sm text-gray-900">{record.husband_name}</p>
              </div>
            )}
            {record.husband_phone && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Simu</label>
                <p className="mt-1 text-sm text-gray-900">{record.husband_phone}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  const renderAddressInfo = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">A. Anuani ya makazi ya Mjamzito</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {record.street && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Mtaa</label>
            <p className="mt-1 text-sm text-gray-900">{record.street}</p>
          </div>
        )}
        
        {record.ward && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Kata</label>
            <p className="mt-1 text-sm text-gray-900">{record.ward}</p>
          </div>
        )}

        {record.council && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Halmashauri</label>
            <p className="mt-1 text-sm text-gray-900">{record.council}</p>
          </div>
        )}

        {record.region && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Mkoa</label>
            <p className="mt-1 text-sm text-gray-900">{record.region}</p>
          </div>
        )}

        {record.education && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Elimu</label>
            <p className="mt-1 text-sm text-gray-900">
              {getEducationLevel(record.education)}
              {record.other_education && ` - ${record.other_education}`}
            </p>
          </div>
        )}

        {record.marital_status && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Hali ya ndoa</label>
            <p className="mt-1 text-sm text-gray-900">
              {getMaritalStatus(record.marital_status)}
              {record.other_marital_status && ` - ${record.other_marital_status}`}
            </p>
          </div>
        )}

        {record.occupation && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500">Kazi</label>
            <p className="mt-1 text-sm text-gray-900">{record.occupation}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPartnerInfo = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-green-800 mb-2">B. Taarifa za Mwenzi</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {record.partner_first_name && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Jina la kwanza</label>
            <p className="mt-1 text-sm text-gray-900">{record.partner_first_name}</p>
          </div>
        )}

        {record.partner_middle_name && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Jina la kati</label>
            <p className="mt-1 text-sm text-gray-900">{record.partner_middle_name}</p>
          </div>
        )}

        {record.partner_last_name && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Jina la mwisho</label>
            <p className="mt-1 text-sm text-gray-900">{record.partner_last_name}</p>
          </div>
        )}

        {record.partner_phone && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Namba ya Simu</label>
            <p className="mt-1 text-sm text-gray-900">{record.partner_phone}</p>
          </div>
        )}

        {record.partner_education && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Elimu</label>
            <p className="mt-1 text-sm text-gray-900">
              {getEducationLevel(record.partner_education)}
              {record.partner_other_education && ` - ${record.partner_other_education}`}
            </p>
          </div>
        )}

        {record.partner_occupation && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500">Kazi</label>
            <p className="mt-1 text-sm text-gray-900">{record.partner_occupation}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderContactsInfo = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-purple-800 mb-2">C & D. Ndugu wa Karibu na Mwenyekiti</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {record.relative_first_name && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Jina la kwanza (ndugu)</label>
            <p className="mt-1 text-sm text-gray-900">{record.relative_first_name}</p>
          </div>
        )}

        {record.relative_middle_name && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Jina la kati (ndugu)</label>
            <p className="mt-1 text-sm text-gray-900">{record.relative_middle_name}</p>
          </div>
        )}

        {record.relative_last_name && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Jina la mwisho (ndugu)</label>
            <p className="mt-1 text-sm text-gray-900">{record.relative_last_name}</p>
          </div>
        )}

        {record.relative_phone && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Namba ya Simu (ndugu)</label>
            <p className="mt-1 text-sm text-gray-900">{record.relative_phone}</p>
          </div>
        )}

        {record.chairperson_name && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Jina la mwenyekiti</label>
            <p className="mt-1 text-sm text-gray-900">{record.chairperson_name}</p>
          </div>
        )}

        {record.chairperson_phone && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Namba ya simu (mwenyekiti)</label>
            <p className="mt-1 text-sm text-gray-900">{record.chairperson_phone}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMedicalInfo = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">E. Taarifa za mtoa huduma</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {record.provider_first_name && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Jina la kwanza (mtoa huduma)</label>
            <p className="mt-1 text-sm text-gray-900">{record.provider_first_name}</p>
          </div>
        )}

        {record.provider_middle_name && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Jina la kati (mtoa huduma)</label>
            <p className="mt-1 text-sm text-gray-900">{record.provider_middle_name}</p>
          </div>
        )}

        {record.provider_last_name && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Jina la mwisho (mtoa huduma)</label>
            <p className="mt-1 text-sm text-gray-900">{record.provider_last_name}</p>
          </div>
        )}

        {record.provider_position && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Cheo cha mtoa huduma za afya</label>
            <p className="mt-1 text-sm text-gray-900">{record.provider_position}</p>
          </div>
        )}

        {record.allergies && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500">Mzio (allegry)</label>
            <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{record.allergies}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPregnancyInfo = () => (
    <div className="space-y-6">
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-red-800 mb-2">F. Muhtasari Wa Ujauzito</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {record.menstrual_cycle_days && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Mzunguko wa hedhi (siku)</label>
            <p className="mt-1 text-sm text-gray-900">{record.menstrual_cycle_days} siku</p>
          </div>
        )}

        {record.normal_cycle && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Mzunguko wa kawaida</label>
            <p className="mt-1 text-sm text-gray-900">{getNormalCycle(record.normal_cycle)}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-500">Idadi ya watoto walio hai</label>
          <p className="mt-1 text-sm text-gray-900">{record.living_children || 0}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Watoto waliozaliwa wafu</label>
          <p className="mt-1 text-sm text-gray-900">{record.still_births || 0}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Mimba zilizoharibika</label>
          <p className="mt-1 text-sm text-gray-900">{record.miscarriages || 0}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Mimba zilizotungwa nje ya mfuko wa uzazi</label>
          <p className="mt-1 text-sm text-gray-900">{record.ectopic_pregnancies || 0}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Kuzaa mtoto mfu</label>
          <p className="mt-1 text-sm text-gray-900">{record.abortions || 0}</p>
        </div>
      </div>
    </div>
  );

  const renderHistoryInfo = () => (
    <div className="space-y-6">
      <div className="bg-indigo-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-indigo-800 mb-2">G & H. Historia ya Uzazi na Njia za Kujifungua</h3>
      </div>

      {/* Pregnancy History */}
      {record.pregnancy_history && record.pregnancy_history.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4">Historia ya Ujauzito Ulopita</h4>
          <div className="space-y-4">
            {record.pregnancy_history.map((history, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-700 mb-3">Ujauzito {index + 1}</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {history.year && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Mwaka</label>
                      <p className="mt-1 text-sm text-gray-900">{history.year}</p>
                    </div>
                  )}
                  {history.delivery_type && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Aina ya uzazi</label>
                      <p className="mt-1 text-sm text-gray-900">{getDeliveryType(history.delivery_type)}</p>
                    </div>
                  )}
                  {history.outcome && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Matokeo</label>
                      <p className="mt-1 text-sm text-gray-900">{getOutcome(history.outcome)}</p>
                    </div>
                  )}
                  {history.birth_weight && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Uzito wa kuzaliwa (kg)</label>
                      <p className="mt-1 text-sm text-gray-900">{history.birth_weight} kg</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Methods */}
      {record.delivery_methods && record.delivery_methods.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-700 mb-4">Njia za Kujifungua Zilizotumika</h4>
          <div className="space-y-4">
            {record.delivery_methods.map((method, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-700 mb-3">Kujifungua {index + 1}</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {method.year && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Mwaka</label>
                      <p className="mt-1 text-sm text-gray-900">{method.year}</p>
                    </div>
                  )}
                  {method.method && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Njia ya kujifungua</label>
                      <p className="mt-1 text-sm text-gray-900">{getDeliveryType(method.method)}</p>
                    </div>
                  )}
                  {method.complications && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500">Matatizo</label>
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{method.complications}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!record.pregnancy_history || record.pregnancy_history.length === 0) && 
       (!record.delivery_methods || record.delivery_methods.length === 0) && (
        <div className="text-center text-gray-500 py-8">
          Hakuna rekodi za historia ya uzazi au njia za kujifungua.
        </div>
      )}
    </div>
  );

  const renderRisksInfo = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-orange-800 mb-2">I & J. Vidokezo vya Hatari</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 - I. Chunguza Vidokezo */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4">I. Chunguza Vidokezo</h4>
          <div className="space-y-2">
            <RiskFactorBadge condition={record.age_under_20} label="Umri chini ya miaka 20" />
            <RiskFactorBadge condition={record.last_pregnancy_10_years} label="Miaka 10 au zaidi tokea mimba ya mwisho" />
            <RiskFactorBadge condition={record.previous_c_section} label="Kujifungua kwa upasuaji" />
            <RiskFactorBadge condition={record.stillbirth_history} label="Kuzaa mtoto mfu/kifo cha mtoto mchanga" />
            <RiskFactorBadge condition={record.multiple_miscarriages} label="Kuharibika kwa mimba mbili au zaidi" />
            <RiskFactorBadge condition={record.heart_disease} label="Magonjwa ya moyo" />
            <RiskFactorBadge condition={record.diabetes} label="Kisukari" />
            <RiskFactorBadge condition={record.tuberculosis} label="Kifua Kikuu" />
            <RiskFactorBadge condition={record.disabled_child} label="Mtoto mlemavu" />
          </div>
        </div>

        {/* Column 2 - J. Weka (ndio) */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4">J. Weka (ndio)</h4>
          <div className="space-y-2">
            <RiskFactorBadge condition={record.fifth_pregnancy_plus} label="Mimba ya tano au zaidi" />
            <RiskFactorBadge condition={record.height_under_150} label="Kimo chini ya Sentimita 150" />
            <RiskFactorBadge condition={record.pelvic_deformity} label="Kilema cha nyonga" />
            <RiskFactorBadge condition={record.first_pregnancy_over_35} label="Mimba ya kwanza miaka 35 na zaidi" />
            <RiskFactorBadge condition={record.instrument_delivery} label="Kujifungua kwa upasuaji au mtoto kuvutwa kwa kifaa" />
            <RiskFactorBadge condition={record.postpartum_hemorrhage} label="Kutokwa na damu nyingi baada ya kujifungua" />
            <RiskFactorBadge condition={record.retained_placenta} label="Kondo la nyuma kukwama" />
            <RiskFactorBadge condition={record.eclampsia_history} label="Kuwahi kupata kifafa cha mimba" />
          </div>
        </div>
      </div>

      {/* Summary */}
      {Object.values({
        age_under_20: record.age_under_20,
        last_pregnancy_10_years: record.last_pregnancy_10_years,
        previous_c_section: record.previous_c_section,
        stillbirth_history: record.stillbirth_history,
        multiple_miscarriages: record.multiple_miscarriages,
        heart_disease: record.heart_disease,
        diabetes: record.diabetes,
        tuberculosis: record.tuberculosis,
        disabled_child: record.disabled_child,
        fifth_pregnancy_plus: record.fifth_pregnancy_plus,
        height_under_150: record.height_under_150,
        pelvic_deformity: record.pelvic_deformity,
        first_pregnancy_over_35: record.first_pregnancy_over_35,
        instrument_delivery: record.instrument_delivery,
        postpartum_hemorrhage: record.postpartum_hemorrhage,
        retained_placenta: record.retained_placenta,
        eclampsia_history: record.eclampsia_history
      }).some(value => value) ? (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Maelezo ya Hatari</h4>
          <p className="text-sm text-yellow-700">
            Mjamzito huyu ana vidokezo vya hatari. Inashauriwa kufanyiwa ufuatiliaji wa karibu na kupata huduma maalum za afya.
          </p>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 mb-2">Maelezo ya Hatari</h4>
          <p className="text-sm text-green-700">
            Mjamzito huyu hana vidokezo vya hatari vinavyojulikana. Ufuatiliaji wa kawaida unapendekezwa.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Taarifa za Mjamzito</h1>
            <p className="text-gray-600 mt-1">
              {record.patient?.first_name} {record.patient?.last_name} - {record.patient?.phone_number}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/patients/pregnant-women"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Rudi kwenye Orodha
            </Link>
            <Link
              to={`/patients/pregnant-women/${record.id}/edit`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Badilisha Rekodi
            </Link>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white border-b mb-6">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Registration Details */}
        <div className="bg-white rounded-lg shadow border mt-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Maelezo ya Usajili</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Tarehe ya Usajili</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(record.created_at).toLocaleDateString('sw-TZ')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Tarehe ya Mwisho ya Kubadilisha</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(record.updated_at).toLocaleDateString('sw-TZ')}
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