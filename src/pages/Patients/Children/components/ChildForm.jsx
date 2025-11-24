import React, { useState, useEffect } from 'react';
import axios from '../../../../api/axios';

const ChildForm = ({ record, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    // Foreign keys
    patient_id: '',
    mother_id: '',
    
    // A: Taarifa Binafsi Za Mtoto
    gender: '',
    current_street: '',
    current_facility: '',
    current_village: '',
    child_number: '',
    current_district: '',
    chairperson_name: '',
    mother_name: '',
    mother_phone: '',
    father_name: '',
    birth_date: '',
    gestational_age: '',
    
    // B: Vipimo alipozaliwa
    birth_weight: '',
    birth_height: '',
    head_circumference: '',
    birth_type: 'single',
    birth_order: 1,
    previous_child_birth_date: '',
    
    // C: Taarifa Muhimu (Checkbox)
    low_birth_weight: false,
    birth_defect: false,
    mother_died: false,
    is_twin: false,
    birth_asphyxia: false,
    father_died: false,
    jaundice: false,
    siblings_died: false,
    other_reasons_check: false,
    other_reasons_description: '',
    
    // D: Huduma za PMTCT kwa mtoto
    given_protection_drug: '',
    protection_drug_details: '',
    dna_pcr_tested_4_6_weeks: false,
    dna_pcr_results: '',
    dna_pcr_referral_ctc: '',
    dna_pcr_ctc_number: '',
    contri_drug_given: '',
    antibody_test_9_months: '',
    antibody_dna_tested_6_weeks_after_breastfeeding: false,
    antibody_breastfeeding_referral_ctc: '',
    antibody_breastfeeding_ctc_number: '',
    antibody_test_18_months: ''
  });

  const [patients, setPatients] = useState([]);
  const [mothers, setMothers] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingMothers, setLoadingMothers] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [activeSection, setActiveSection] = useState('personal'); // For section navigation

  useEffect(() => {
    if (record) {
      setFormData({
        // Foreign keys
        patient_id: record.patient_id || '',
        mother_id: record.mother_id || '',
        
        // A: Taarifa Binafsi Za Mtoto
        gender: record.gender || '',
        current_street: record.current_street || '',
        current_facility: record.current_facility || '',
        current_village: record.current_village || '',
        child_number: record.child_number || '',
        current_district: record.current_district || '',
        chairperson_name: record.chairperson_name || '',
        mother_name: record.mother_name || '',
        mother_phone: record.mother_phone || '',
        father_name: record.father_name || '',
        birth_date: record.birth_date || '',
        gestational_age: record.gestational_age || '',
        
        // B: Vipimo alipozaliwa
        birth_weight: record.birth_weight || '',
        birth_height: record.birth_height || '',
        head_circumference: record.head_circumference || '',
        birth_type: record.birth_type || 'single',
        birth_order: record.birth_order || 1,
        previous_child_birth_date: record.previous_child_birth_date || '',
        
        // C: Taarifa Muhimu (Checkbox)
        low_birth_weight: record.low_birth_weight || false,
        birth_defect: record.birth_defect || false,
        mother_died: record.mother_died || false,
        is_twin: record.is_twin || false,
        birth_asphyxia: record.birth_asphyxia || false,
        father_died: record.father_died || false,
        jaundice: record.jaundice || false,
        siblings_died: record.siblings_died || false,
        other_reasons_check: record.other_reasons_check || false,
        other_reasons_description: record.other_reasons_description || '',
        
        // D: Huduma za PMTCT kwa mtoto
        given_protection_drug: record.given_protection_drug || '',
        protection_drug_details: record.protection_drug_details || '',
        dna_pcr_tested_4_6_weeks: record.dna_pcr_tested_4_6_weeks || false,
        dna_pcr_results: record.dna_pcr_results || '',
        dna_pcr_referral_ctc: record.dna_pcr_referral_ctc || '',
        dna_pcr_ctc_number: record.dna_pcr_ctc_number || '',
        contri_drug_given: record.contri_drug_given || '',
        antibody_test_9_months: record.antibody_test_9_months || '',
        antibody_dna_tested_6_weeks_after_breastfeeding: record.antibody_dna_tested_6_weeks_after_breastfeeding || false,
        antibody_breastfeeding_referral_ctc: record.antibody_breastfeeding_referral_ctc || '',
        antibody_breastfeeding_ctc_number: record.antibody_breastfeeding_ctc_number || '',
        antibody_test_18_months: record.antibody_test_18_months || ''
      });
    }
    fetchChildPatients();
    fetchMothers();
  }, [record]);

  const fetchChildPatients = async () => {
    try {
      setLoadingPatients(true);
      const response = await axios.get('/patients?per_page=1000');
      const allPatients = response.data.data?.data || response.data.data || [];
      
      const childPatients = allPatients.filter(patient => 
        patient.patient_type === 'child'
      );
      
      const patientsWithRecords = await getChildrenWithExistingRecords();
      const availablePatients = childPatients.filter(patient => 
        !patientsWithRecords.includes(parseInt(patient.id))
      );
      
      setPatients(availablePatients);
    } catch (error) {
      console.error('Error fetching child patients:', error);
      alert('Failed to load child patients');
    } finally {
      setLoadingPatients(false);
    }
  };

  const fetchMothers = async () => {
    try {
      setLoadingMothers(true);
      const response = await axios.get('/patients?per_page=1000');
      const allPatients = response.data.data?.data || response.data.data || [];
      
      const motherPatients = allPatients.filter(patient => 
        patient.patient_type === 'pregnant' || patient.patient_type === 'breastfeeding'
      );
      setMothers(motherPatients);
    } catch (error) {
      console.error('Error fetching mothers:', error);
      alert('Failed to load mothers list');
    } finally {
      setLoadingMothers(false);
    }
  };

  const getChildrenWithExistingRecords = async () => {
    try {
      const response = await axios.get('/children?per_page=1000');
      const existingRecords = response.data.data?.data || response.data.data || response.data || [];
      
      const patientIds = existingRecords
        .map(record => record.patient_id)
        .filter(id => id != null)
        .map(id => parseInt(id));
      
      return patientIds;
    } catch (error) {
      console.error('Error fetching existing children records:', error);
      return [];
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMotherSelect = (e) => {
    const motherId = e.target.value;
    
    if (motherId) {
      const selectedMother = mothers.find(mother => mother.id == motherId);
      if (selectedMother) {
        setFormData(prev => ({
          ...prev,
          mother_id: motherId,
          mother_name: `${selectedMother.first_name} ${selectedMother.last_name}`.trim(),
          mother_phone: selectedMother.phone_number || ''
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        mother_id: '',
        mother_name: '',
        mother_phone: ''
      }));
    }
  };

  const handlePatientSelect = (e) => {
    const patientId = e.target.value;
    if (patientId) {
      setFormData(prev => ({
        ...prev,
        patient_id: patientId
      }));
    }
  };

  const calculateAge = async (birthDate) => {
    if (!birthDate) return;
    
    try {
      setCalculating(true);
      const response = await axios.get(`/patients/children/calculate-age?birth_date=${birthDate}`);
      const { age_description, developmental_stage } = response.data.data;
      alert(`Age calculated: ${age_description} - ${developmental_stage}`);
    } catch (error) {
      console.error('Error calculating age:', error);
      alert('Failed to calculate age');
    } finally {
      setCalculating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!record && !formData.patient_id) {
      alert('Please select a child patient');
      return;
    }
    
    if (!formData.gender) {
      alert('Please select gender');
      return;
    }
    
    if (!formData.mother_name) {
      alert('Please enter mother\'s name');
      return;
    }
    
    if (!formData.mother_phone) {
      alert('Please enter mother\'s phone number');
      return;
    }

    if (!record && patients.length === 0) {
      alert('No available child patients for registration');
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      patient_id: formData.patient_id || record?.patient_id,
      birth_weight: formData.birth_weight ? parseFloat(formData.birth_weight) : null,
      birth_height: formData.birth_height ? parseFloat(formData.birth_height) : null,
      head_circumference: formData.head_circumference ? parseFloat(formData.head_circumference) : null,
      gestational_age: formData.gestational_age ? parseInt(formData.gestational_age) : null,
      birth_order: formData.birth_order ? parseInt(formData.birth_order) : 1,
      mother_id: formData.mother_id || null
    };

    console.log('Submitting data:', submitData);
    onSubmit(submitData);
  };

  const selectedPatient = patients.find(p => p.id == formData.patient_id) || record?.patient;

  // Section navigation
  const sections = [
    { id: 'personal', name: 'A. Taarifa Binafsi Za Mtoto' },
    { id: 'measurements', name: 'B. Vipimo alipozaliwa' },
    { id: 'health', name: 'C. Taarifa Muhimu' },
    { id: 'pmtct', name: 'D. Huduma za PMTCT' }
  ];

  const renderSection = () => {
    switch(activeSection) {
      case 'personal':
        return renderPersonalInfo();
      case 'measurements':
        return renderMeasurements();
      case 'health':
        return renderHealthInfo();
      case 'pmtct':
        return renderPMTCTInfo();
      default:
        return renderPersonalInfo();
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {/* Patient Selection - Only show when creating new record */}
      {!record && (
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Child Patient *
          </label>
          {loadingPatients ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading available child patients...</p>
            </div>
          ) : (
            <>
              <select
                name="patient_id"
                value={formData.patient_id}
                onChange={handlePatientSelect}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select a child patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} - {patient.phone_number} 
                    {patient.date_of_birth && ` - DOB: ${new Date(patient.date_of_birth).toLocaleDateString()}`}
                  </option>
                ))}
              </select>
              <div className="mt-2 text-sm text-gray-600">
                <p>Showing {patients.length} child patient(s) available for registration</p>
                {patients.length === 0 && (
                  <p className="text-red-600 mt-1">
                    No available child patients. Please register a patient with type "child" first.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Namba ya Mtoto</label>
          <input
            type="text"
            name="child_number"
            value={formData.child_number}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter child number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tarehe ya Kuzaliwa *</label>
          <input
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Umri wa Mimba (weeks)</label>
          <input
            type="number"
            name="gestational_age"
            value={formData.gestational_age}
            onChange={handleChange}
            min="20"
            max="45"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., 38"
          />
        </div>

        {/* Location Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mtaa/Kitongoji</label>
          <input
            type="text"
            name="current_street"
            value={formData.current_street}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter street/village"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Jina la Kituo</label>
          <input
            type="text"
            name="current_facility"
            value={formData.current_facility}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter facility name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Eneo/Kijiji</label>
          <input
            type="text"
            name="current_village"
            value={formData.current_village}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter village/area"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Wilaya</label>
          <input
            type="text"
            name="current_district"
            value={formData.current_district}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter district"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Jina la Mwenyekiti wa Kitongoji/Mtaa</label>
          <input
            type="text"
            name="chairperson_name"
            value={formData.chairperson_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter chairperson name"
          />
        </div>

        {/* Parent Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Mother (Optional)</label>
          {loadingMothers ? (
            <div className="p-3 border border-gray-300 rounded-lg text-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-1 text-xs text-gray-600">Loading mothers...</p>
            </div>
          ) : (
            <select
              value={formData.mother_id}
              onChange={handleMotherSelect}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select mother from patients</option>
              {mothers.map(mother => (
                <option key={mother.id} value={mother.id}>
                  {mother.first_name} {mother.last_name} - {mother.phone_number}
                  {mother.patient_type && ` (${mother.patient_type})`}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name *</label>
          <input
            type="text"
            name="mother_name"
            value={formData.mother_name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter mother's full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Phone *</label>
          <input
            type="tel"
            name="mother_phone"
            value={formData.mother_phone}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter mother's phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name (Optional)</label>
          <input
            type="text"
            name="father_name"
            value={formData.father_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter father's full name"
          />
        </div>
      </div>
    </div>
  );

  const renderMeasurements = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Birth Weight (kg)</label>
          <input
            type="number"
            name="birth_weight"
            value={formData.birth_weight}
            onChange={handleChange}
            min="0.5"
            max="10"
            step="0.01"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., 3.2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Birth Height (cm)</label>
          <input
            type="number"
            name="birth_height"
            value={formData.birth_height}
            onChange={handleChange}
            min="20"
            max="100"
            step="0.1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., 50.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mzingo wa Kichwa (cm)</label>
          <input
            type="number"
            name="head_circumference"
            value={formData.head_circumference}
            onChange={handleChange}
            min="20"
            max="60"
            step="0.1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., 35.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mmoja au Pacha</label>
          <select
            name="birth_type"
            value={formData.birth_type}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="single">Mmoja (Single)</option>
            <option value="twin">Mapacha (Twin)</option>
            <option value="triplet">Mapacha watatu (Triplet)</option>
            <option value="multiple">Zaidi (Multiple)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Wa ngapi kuzaliwa</label>
          <input
            type="number"
            name="birth_order"
            value={formData.birth_order}
            onChange={handleChange}
            min="1"
            max="10"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tarehe ya kuzaliwa ya mtoto aliemtangulia</label>
          <input
            type="date"
            name="previous_child_birth_date"
            value={formData.previous_child_birth_date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>
    </div>
  );

  const renderHealthInfo = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">Taarifa Muhimu</h3>
        <p className="text-sm text-yellow-700">Chagua yote yanayohusiana na mtoto</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <input
            type="checkbox"
            name="low_birth_weight"
            checked={formData.low_birth_weight}
            onChange={handleChange}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">Uzito wa kuzaliwa &lt; kilo 2.5</span>
        </label>

        <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <input
            type="checkbox"
            name="birth_defect"
            checked={formData.birth_defect}
            onChange={handleChange}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">Kilema cha kuzaliwa</span>
        </label>

        <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <input
            type="checkbox"
            name="mother_died"
            checked={formData.mother_died}
            onChange={handleChange}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">Mama amefariki</span>
        </label>

        <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <input
            type="checkbox"
            name="is_twin"
            checked={formData.is_twin}
            onChange={handleChange}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">Mapacha</span>
        </label>

        <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <input
            type="checkbox"
            name="birth_asphyxia"
            checked={formData.birth_asphyxia}
            onChange={handleChange}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">Birth asphyxia</span>
        </label>

        <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <input
            type="checkbox"
            name="father_died"
            checked={formData.father_died}
            onChange={handleChange}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">Baba amefariki</span>
        </label>

        <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <input
            type="checkbox"
            name="jaundice"
            checked={formData.jaundice}
            onChange={handleChange}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">Jaundice</span>
        </label>

        <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <input
            type="checkbox"
            name="siblings_died"
            checked={formData.siblings_died}
            onChange={handleChange}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">Nduguze wawili au zaidi wamefariki</span>
        </label>

        <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <input
            type="checkbox"
            name="other_reasons_check"
            checked={formData.other_reasons_check}
            onChange={handleChange}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">Sababu nyingine</span>
        </label>
      </div>

      {formData.other_reasons_check && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Maelezo ya Sababu Nyingine</label>
          <textarea
            name="other_reasons_description"
            value={formData.other_reasons_description}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Andika maelezo ya sababu nyingine..."
          />
        </div>
      )}
    </div>
  );

  const renderPMTCTInfo = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Huduma za PMTCT kwa mtoto</h3>
        <p className="text-sm text-blue-700">Taarifa kuhusu matibabu na uchunguzi wa PMTCT</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mtoto amepewa dawa ya kinga mara baada ya kuzaliwa</label>
          <select
            name="given_protection_drug"
            value={formData.given_protection_drug}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Chagua...</option>
            <option value="yes">Ndiyo</option>
            <option value="no">Hapana</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dawa gani alizopewa mara baada ya kuzaliwa?</label>
          <input
            type="text"
            name="protection_drug_details"
            value={formData.protection_drug_details}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Andika majina ya dawa"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="dna_pcr_tested_4_6_weeks"
              checked={formData.dna_pcr_tested_4_6_weeks}
              onChange={handleChange}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">Mtoto amepimwa kipimo cha DNA PCR (DBS) kuanzia wiki 4-6</span>
          </label>
        </div>

        {formData.dna_pcr_tested_4_6_weeks && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Majibu ya kipimo cha DNA PCR kwa mtoto</label>
              <select
                name="dna_pcr_results"
                value={formData.dna_pcr_results}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Chagua...</option>
                <option value="negative">Hasi</option>
                <option value="positive">Chanya</option>
                <option value="not_tested">Hakupimwa</option>
              </select>
            </div>

            {formData.dna_pcr_results === 'positive' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mtoto amepewa rufaa kwenda CTC?</label>
                  <select
                    name="dna_pcr_referral_ctc"
                    value={formData.dna_pcr_referral_ctc}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Chagua...</option>
                    <option value="yes">Ndiyo</option>
                    <option value="no">Hapana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Namba ya CTC</label>
                  <input
                    type="text"
                    name="dna_pcr_ctc_number"
                    value={formData.dna_pcr_ctc_number}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Andika namba ya CTC"
                  />
                </div>
              </>
            )}
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mtoto amepewa dawa ya contrimoxazole kuanzia wiki ya 4-6?</label>
          <select
            name="contri_drug_given"
            value={formData.contri_drug_given}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Chagua...</option>
            <option value="yes">Ndiyo</option>
            <option value="no">Hapana</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Majibu ya kipimo cha Antibody katika umri wa miezi 9</label>
          <select
            name="antibody_test_9_months"
            value={formData.antibody_test_9_months}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Chagua...</option>
            <option value="positive">Chanya</option>
            <option value="negative">Hasi</option>
            <option value="not_tested">Hakupimwa</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="antibody_dna_tested_6_weeks_after_breastfeeding"
              checked={formData.antibody_dna_tested_6_weeks_after_breastfeeding}
              onChange={handleChange}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">Mtoto amepimwa kipimo cha Antibody/DNA PCR wiki 6 baada ya kuacha kunyonya?</span>
          </label>
        </div>

        {formData.antibody_dna_tested_6_weeks_after_breastfeeding && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kama majibu ni chanya: mtoto amepewa rufaa kwenda CTC?</label>
              <select
                name="antibody_breastfeeding_referral_ctc"
                value={formData.antibody_breastfeeding_referral_ctc}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Chagua...</option>
                <option value="yes">Ndiyo</option>
                <option value="no">Hapana</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Namba ya CTC</label>
              <input
                type="text"
                name="antibody_breastfeeding_ctc_number"
                value={formData.antibody_breastfeeding_ctc_number}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Andika namba ya CTC"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Majibu ya kipimo cha Antibody katika umri wa miezi 18</label>
          <select
            name="antibody_test_18_months"
            value={formData.antibody_test_18_months}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Chagua...</option>
            <option value="positive">Chanya</option>
            <option value="negative">Hasi</option>
            <option value="not_tested">Hakupimwa</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section Navigation */}
      <div className="bg-white border-b">
        <nav className="flex space-x-8">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === section.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {section.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Active Section Content */}
      <div className="bg-white p-6 rounded-lg border">
        {renderSection()}
      </div>

      {/* Age Calculator */}
      {selectedPatient?.date_of_birth && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Age Information</h3>
          <p className="text-sm text-blue-700">
            Child's Date of Birth: {new Date(selectedPatient.date_of_birth).toLocaleDateString()}
          </p>
          <button
            type="button"
            onClick={() => calculateAge(selectedPatient.date_of_birth)}
            disabled={calculating}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {calculating ? 'Calculating...' : 'Calculate Current Age'}
          </button>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <div>
          {activeSection !== 'personal' && (
            <button
              type="button"
              onClick={() => {
                const currentIndex = sections.findIndex(s => s.id === activeSection);
                setActiveSection(sections[currentIndex - 1].id);
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          {activeSection !== 'pmtct' ? (
            <button
              type="button"
              onClick={() => {
                const currentIndex = sections.findIndex(s => s.id === activeSection);
                setActiveSection(sections[currentIndex + 1].id);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || (patients.length === 0 && !record)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : (record ? 'Update Child Record' : 'Create Child Record')}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ChildForm;