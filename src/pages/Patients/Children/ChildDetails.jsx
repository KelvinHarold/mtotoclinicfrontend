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

  const getBooleanBadge = (value) => {
    return value 
      ? 'bg-red-100 text-red-800'
      : 'bg-green-100 text-green-800';
  };

  const getBirthTypeBadge = (birthType) => {
    const types = {
      'single': 'bg-gray-100 text-gray-800',
      'twin': 'bg-blue-100 text-blue-800',
      'triplet': 'bg-purple-100 text-purple-800',
      'multiple': 'bg-orange-100 text-orange-800'
    };
    return types[birthType] || 'bg-gray-100 text-gray-800';
  };

  const getTestResultBadge = (result) => {
    const results = {
      'positive': 'bg-red-100 text-red-800',
      'negative': 'bg-green-100 text-green-800',
      'not_tested': 'bg-gray-100 text-gray-800'
    };
    return results[result] || 'bg-gray-100 text-gray-800';
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

  const formatBirthType = (birthType) => {
    const types = {
      'single': 'Mmoja (Single)',
      'twin': 'Mapacha (Twin)',
      'triplet': 'Mapacha watatu (Triplet)',
      'multiple': 'Zaidi (Multiple)'
    };
    return types[birthType] || birthType;
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

  const developmentalStage = getDevelopmentalStage(record.birth_date || record.patient?.date_of_birth);
  const age = calculateAge(record.birth_date || record.patient?.date_of_birth);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <label className="block text-sm font-medium text-gray-500">Namba ya Mtoto</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.child_number || 'Not specified'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.birth_date ? new Date(record.birth_date).toLocaleDateString() : 
                   record.patient?.date_of_birth ? new Date(record.patient.date_of_birth).toLocaleDateString() : 'Not specified'}
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

          {/* Location Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Location Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Mtaa/Kitongoji</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.current_street || 'Not specified'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Jina la Kituo</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.current_facility || 'Not specified'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Eneo/Kijiji</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.current_village || 'Not specified'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Wilaya</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.current_district || 'Not specified'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Jina la Mwenyekiti wa Kitongoji/Mtaa</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.chairperson_name || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Birth Details */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Birth Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-500">Mzingo wa Kichwa (Head Circumference)</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.head_circumference ? `${record.head_circumference} cm` : 'Not recorded'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Umri wa Mimba (Gestational Age)</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.gestational_age ? `${record.gestational_age} weeks` : 'Not recorded'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Mmoja au Mapacha (Birth Type)</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBirthTypeBadge(record.birth_type)}`}>
                  {formatBirthType(record.birth_type)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Wangapi Kuzaliwa (Birth Order)</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.birth_order || '1'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Tarehe ya Kuzaliwa Mtoto alie mtangulia</label>
                <p className="mt-1 text-sm text-gray-900">
                  {record.previous_child_birth_date ? 
                    new Date(record.previous_child_birth_date).toLocaleDateString() : 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Health Conditions */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Health Conditions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Uzito wa kuzaliwa &lt; 2.5kg</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.low_birth_weight)}`}>
                  {record.low_birth_weight ? 'Yes' : 'No'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Mapacha</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.is_twin)}`}>
                  {record.is_twin ? 'Yes' : 'No'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Jaundice</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.jaundice)}`}>
                  {record.jaundice ? 'Yes' : 'No'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Kilema cha kuzaliwa</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.birth_defect)}`}>
                  {record.birth_defect ? 'Yes' : 'No'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Birth Asphyxia</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.birth_asphyxia)}`}>
                  {record.birth_asphyxia ? 'Yes' : 'No'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Nduguze wawili au zaidi wamefariki</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.siblings_died)}`}>
                  {record.siblings_died ? 'Yes' : 'No'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Mama amefariki</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.mother_died)}`}>
                  {record.mother_died ? 'Yes' : 'No'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Baba amefariki</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.father_died)}`}>
                  {record.father_died ? 'Yes' : 'No'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Sababu nyingine</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.other_reasons_check)}`}>
                  {record.other_reasons_check ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {record.other_reasons_description && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-500">Maelezo ya Sababu Nyingine</label>
                <div className="mt-1 bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{record.other_reasons_description}</p>
                </div>
              </div>
            )}
          </div>

          {/* PMTCT Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Huduma za PMTCT kwa mtoto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Mtoto amepewa dawa ya kinga mara baada ya kuzaliwa</label>
                {record.given_protection_drug ? (
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    record.given_protection_drug === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {getYesNoText(record.given_protection_drug)}
                  </span>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">Not specified</p>
                )}
              </div>

              {record.protection_drug_details && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Dawa alizopewa</label>
                  <p className="mt-1 text-sm text-gray-900">{record.protection_drug_details}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500">Mtoto amepimwa DNA PCR (wiki 4-6)</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.dna_pcr_tested_4_6_weeks)}`}>
                  {record.dna_pcr_tested_4_6_weeks ? 'Yes' : 'No'}
                </span>
              </div>

              {record.dna_pcr_tested_4_6_weeks && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Majibu ya DNA PCR</label>
                    {record.dna_pcr_results ? (
                      <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTestResultBadge(record.dna_pcr_results)}`}>
                        {getTestResultText(record.dna_pcr_results)}
                      </span>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">Not specified</p>
                    )}
                  </div>

                  {record.dna_pcr_results === 'positive' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Rufaa kwenda CTC</label>
                        {record.dna_pcr_referral_ctc ? (
                          <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            record.dna_pcr_referral_ctc === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {getYesNoText(record.dna_pcr_referral_ctc)}
                          </span>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">Not specified</p>
                        )}
                      </div>

                      {record.dna_pcr_ctc_number && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Namba ya CTC</label>
                          <p className="mt-1 text-sm text-gray-900">{record.dna_pcr_ctc_number}</p>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500">Amepewa Contrimoxazole (wiki 4-6)</label>
                {record.contri_drug_given ? (
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    record.contri_drug_given === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {getYesNoText(record.contri_drug_given)}
                  </span>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">Not specified</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Majibu ya Antibody (miezi 9)</label>
                {record.antibody_test_9_months ? (
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTestResultBadge(record.antibody_test_9_months)}`}>
                    {getTestResultText(record.antibody_test_9_months)}
                  </span>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">Not specified</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Mtoto amepimwa Antibody/DNA PCR (wiki 6 baada ya kunyonya)</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBooleanBadge(record.antibody_dna_tested_6_weeks_after_breastfeeding)}`}>
                  {record.antibody_dna_tested_6_weeks_after_breastfeeding ? 'Yes' : 'No'}
                </span>
              </div>

              {record.antibody_dna_tested_6_weeks_after_breastfeeding && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Rufaa kwenda CTC (baada ya kunyonya)</label>
                    {record.antibody_breastfeeding_referral_ctc ? (
                      <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.antibody_breastfeeding_referral_ctc === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {getYesNoText(record.antibody_breastfeeding_referral_ctc)}
                      </span>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">Not specified</p>
                    )}
                  </div>

                  {record.antibody_breastfeeding_ctc_number && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Namba ya CTC (baada ya kunyonya)</label>
                      <p className="mt-1 text-sm text-gray-900">{record.antibody_breastfeeding_ctc_number}</p>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500">Majibu ya Antibody (miezi 18)</label>
                {record.antibody_test_18_months ? (
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTestResultBadge(record.antibody_test_18_months)}`}>
                    {getTestResultText(record.antibody_test_18_months)}
                  </span>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">Not specified</p>
                )}
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Parent Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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