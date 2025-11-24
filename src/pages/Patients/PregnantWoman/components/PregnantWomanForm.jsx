import React, { useState, useEffect } from 'react';
import axios from '../../../../api/axios';

const PregnantWomanForm = ({ record, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    patient_id: '',
    last_menstrual_period: '',
    expected_delivery_date: '',
    parity: 0,
    gravida: 1,
    husband_name: '',
    husband_phone: '',
    
    // A. Anuani ya makazi ya Mjamzito
    street: '',
    ward: '',
    council: '',
    region: '',
    education: '',
    other_education: '',
    marital_status: '',
    other_marital_status: '',
    occupation: '',
    
    // B. Taarifa za Mwenzi
    partner_first_name: '',
    partner_middle_name: '',
    partner_last_name: '',
    partner_phone: '',
    partner_education: '',
    partner_other_education: '',
    partner_occupation: '',
    
    // C. Jina la ndugu wa karibu
    relative_first_name: '',
    relative_middle_name: '',
    relative_last_name: '',
    relative_phone: '',
    
    // D. Taarifa za mwenyekiti wa mtaa/kijiji
    chairperson_name: '',
    chairperson_phone: '',
    
    // E. Taarifa za mtoa huduma
    provider_first_name: '',
    provider_middle_name: '',
    provider_last_name: '',
    provider_position: '',
    allergies: '',
    
    // F. Muhtasari Wa Ujauzito
    menstrual_cycle_days: '',
    normal_cycle: '',
    living_children: 0,
    still_births: 0,
    miscarriages: 0,
    ectopic_pregnancies: 0,
    abortions: 0,
    
    // G. Historia ya Uzazi
    pregnancy_history: [],
    
    // H. Njia ya kujifungua
    delivery_methods: [],
    
    // I & J. Risk Factors
    age_under_20: false,
    last_pregnancy_10_years: false,
    previous_c_section: false,
    stillbirth_history: false,
    multiple_miscarriages: false,
    heart_disease: false,
    diabetes: false,
    tuberculosis: false,
    disabled_child: false,
    fifth_pregnancy_plus: false,
    height_under_150: false,
    pelvic_deformity: false,
    first_pregnancy_over_35: false,
    instrument_delivery: false,
    postpartum_hemorrhage: false,
    retained_placenta: false,
    eclampsia_history: false
  });

  const [patients, setPatients] = useState([]);
  const [calculating, setCalculating] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [activeSection, setActiveSection] = useState('basic');
  const [pregnancyHistory, setPregnancyHistory] = useState([{ year: '', delivery_type: '', outcome: '', birth_weight: '' }]);
  const [deliveryMethods, setDeliveryMethods] = useState([{ year: '', method: '', complications: '' }]);

  useEffect(() => {
    if (record) {
      const formattedData = {
        // Basic Information
        patient_id: record.patient_id || '',
        last_menstrual_period: record.last_menstrual_period || '',
        expected_delivery_date: record.expected_delivery_date || '',
        parity: record.parity || 0,
        gravida: record.gravida || 1,
        husband_name: record.husband_name || '',
        husband_phone: record.husband_phone || '',
        
        // A. Anuani ya makazi ya Mjamzito
        street: record.street || '',
        ward: record.ward || '',
        council: record.council || '',
        region: record.region || '',
        education: record.education || '',
        other_education: record.other_education || '',
        marital_status: record.marital_status || '',
        other_marital_status: record.other_marital_status || '',
        occupation: record.occupation || '',
        
        // B. Taarifa za Mwenzi
        partner_first_name: record.partner_first_name || '',
        partner_middle_name: record.partner_middle_name || '',
        partner_last_name: record.partner_last_name || '',
        partner_phone: record.partner_phone || '',
        partner_education: record.partner_education || '',
        partner_other_education: record.partner_other_education || '',
        partner_occupation: record.partner_occupation || '',
        
        // C. Jina la ndugu wa karibu
        relative_first_name: record.relative_first_name || '',
        relative_middle_name: record.relative_middle_name || '',
        relative_last_name: record.relative_last_name || '',
        relative_phone: record.relative_phone || '',
        
        // D. Taarifa za mwenyekiti wa mtaa/kijiji
        chairperson_name: record.chairperson_name || '',
        chairperson_phone: record.chairperson_phone || '',
        
        // E. Taarifa za mtoa huduma
        provider_first_name: record.provider_first_name || '',
        provider_middle_name: record.provider_middle_name || '',
        provider_last_name: record.provider_last_name || '',
        provider_position: record.provider_position || '',
        allergies: record.allergies || '',
        
        // F. Muhtasari Wa Ujauzito
        menstrual_cycle_days: record.menstrual_cycle_days || '',
        normal_cycle: record.normal_cycle || '',
        living_children: record.living_children || 0,
        still_births: record.still_births || 0,
        miscarriages: record.miscarriages || 0,
        ectopic_pregnancies: record.ectopic_pregnancies || 0,
        abortions: record.abortions || 0,
        
        // G. Historia ya Uzazi
        pregnancy_history: record.pregnancy_history || [],
        
        // H. Njia ya kujifungua
        delivery_methods: record.delivery_methods || [],
        
        // I & J. Risk Factors
        age_under_20: record.age_under_20 || false,
        last_pregnancy_10_years: record.last_pregnancy_10_years || false,
        previous_c_section: record.previous_c_section || false,
        stillbirth_history: record.stillbirth_history || false,
        multiple_miscarriages: record.multiple_miscarriages || false,
        heart_disease: record.heart_disease || false,
        diabetes: record.diabetes || false,
        tuberculosis: record.tuberculosis || false,
        disabled_child: record.disabled_child || false,
        fifth_pregnancy_plus: record.fifth_pregnancy_plus || false,
        height_under_150: record.height_under_150 || false,
        pelvic_deformity: record.pelvic_deformity || false,
        first_pregnancy_over_35: record.first_pregnancy_over_35 || false,
        instrument_delivery: record.instrument_delivery || false,
        postpartum_hemorrhage: record.postpartum_hemorrhage || false,
        retained_placenta: record.retained_placenta || false,
        eclampsia_history: record.eclampsia_history || false
      };

      setFormData(formattedData);
      
      // Initialize arrays for editing
      if (record.pregnancy_history && record.pregnancy_history.length > 0) {
        setPregnancyHistory(record.pregnancy_history);
      }
      
      if (record.delivery_methods && record.delivery_methods.length > 0) {
        setDeliveryMethods(record.delivery_methods);
      }
    }
    fetchPregnantPatients();
  }, [record]);

  const fetchPregnantPatients = async () => {
    try {
      setLoadingPatients(true);
      const response = await axios.get('/patients');
      const allPatients = response.data.data.data;
      const pregnantPatients = allPatients.filter(patient => 
        patient.patient_type === 'pregnant'
      );
      
      const patientsWithRecords = await getPatientsWithExistingRecords();
      const availablePatients = pregnantPatients.filter(patient => 
        !patientsWithRecords.includes(patient.id)
      );
      
      setPatients(availablePatients);
    } catch (error) {
      console.error('Error fetching pregnant patients:', error);
    } finally {
      setLoadingPatients(false);
    }
  };

  const getPatientsWithExistingRecords = async () => {
    try {
      const response = await axios.get('/pregnant-women');
      const existingRecords = response.data.data.data;
      return existingRecords.map(record => record.patient_id);
    } catch (error) {
      console.error('Error fetching existing records:', error);
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

  const calculateEDD = async (lmp) => {
    if (!lmp) return;
    
    try {
      setCalculating(true);
      const response = await axios.get(`/pregnant-women/calculate-edd?last_menstrual_period=${lmp}`);
      const { expected_delivery_date, gestational_age_weeks } = response.data.data;
      
      setFormData(prev => ({
        ...prev,
        expected_delivery_date,
        last_menstrual_period: lmp
      }));
      
      alert(`EDD calculated: ${new Date(expected_delivery_date).toLocaleDateString()} (${gestational_age_weeks} weeks gestation)`);
    } catch (error) {
      console.error('Error calculating EDD:', error);
      alert('Failed to calculate EDD');
    } finally {
      setCalculating(false);
    }
  };

  const handleLMPChange = (e) => {
    const lmp = e.target.value;
    setFormData(prev => ({ ...prev, last_menstrual_period: lmp }));
    
    if (lmp) {
      calculateEDD(lmp);
    }
  };

  // Pregnancy History Functions
  const addPregnancyHistory = () => {
    setPregnancyHistory(prev => [...prev, { year: '', delivery_type: '', outcome: '', birth_weight: '' }]);
  };

  const removePregnancyHistory = (index) => {
    setPregnancyHistory(prev => prev.filter((_, i) => i !== index));
  };

  const updatePregnancyHistory = (index, field, value) => {
    setPregnancyHistory(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  // Delivery Methods Functions
  const addDeliveryMethod = () => {
    setDeliveryMethods(prev => [...prev, { year: '', method: '', complications: '' }]);
  };

  const removeDeliveryMethod = (index) => {
    setDeliveryMethods(prev => prev.filter((_, i) => i !== index));
  };

  const updateDeliveryMethod = (index, field, value) => {
    setDeliveryMethods(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!record && !formData.patient_id) {
      alert('Please select a patient');
      return;
    }
    
    // Prepare data for submission
    const submitData = {
      ...formData,
      parity: parseInt(formData.parity) || 0,
      gravida: parseInt(formData.gravida) || 1,
      living_children: parseInt(formData.living_children) || 0,
      still_births: parseInt(formData.still_births) || 0,
      miscarriages: parseInt(formData.miscarriages) || 0,
      ectopic_pregnancies: parseInt(formData.ectopic_pregnancies) || 0,
      abortions: parseInt(formData.abortions) || 0,
      menstrual_cycle_days: formData.menstrual_cycle_days ? parseInt(formData.menstrual_cycle_days) : null,
      pregnancy_history: pregnancyHistory.filter(item => item.year || item.delivery_type || item.outcome),
      delivery_methods: deliveryMethods.filter(item => item.year || item.method)
    };

    onSubmit(submitData);
  };

  // Section navigation
  const sections = [
    { id: 'basic', name: 'A. Taarifa za Msingi' },
    { id: 'address', name: 'B. Anuani na Elimu' },
    { id: 'partner', name: 'C. Taarifa za Mwenzi' },
    { id: 'contacts', name: 'D. Ndugu na Mwenyekiti' },
    { id: 'medical', name: 'E. Mtoa Huduma na Aleji' },
    { id: 'pregnancy', name: 'F. Muhtasari wa Ujauzito' },
    { id: 'history', name: 'G. Historia ya Uzazi' },
    { id: 'delivery', name: 'H. Njia za Kujifungua' },
    { id: 'risks', name: 'I & J. Vidokezo vya Hatari' }
  ];

  const renderSection = () => {
    switch(activeSection) {
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
        return renderPregnancyHistory();
      case 'delivery':
        return renderDeliveryMethods();
      case 'risks':
        return renderRisksInfo();
      default:
        return renderBasicInfo();
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* Patient Selection */}
      {!record && (
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Patient *
          </label>
          {loadingPatients ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading available patients...</p>
            </div>
          ) : (
            <>
              <select
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select a pregnant patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} - {patient.phone_number}
                  </option>
                ))}
              </select>
              <div className="mt-2 text-sm text-gray-600">
                <p>Showing {patients.length} pregnant patient(s) available for registration</p>
                {patients.length === 0 && (
                  <p className="text-red-600 mt-1">
                    No available pregnant patients. Please register a patient with type "pregnant" first.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Last Menstrual Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Menstrual Period (LMP) *
          </label>
          <input
            type="date"
            name="last_menstrual_period"
            value={formData.last_menstrual_period}
            onChange={handleLMPChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          {calculating && (
            <p className="mt-1 text-sm text-blue-600">Calculating EDD...</p>
          )}
        </div>

        {/* Expected Delivery Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Delivery Date (EDD) *
          </label>
          <input
            type="date"
            name="expected_delivery_date"
            value={formData.expected_delivery_date}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Gravida */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gravida (Number of pregnancies) *
          </label>
          <input
            type="number"
            name="gravida"
            value={formData.gravida}
            onChange={handleChange}
            min="1"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Parity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parity (Number of live births) *
          </label>
          <input
            type="number"
            name="parity"
            value={formData.parity}
            onChange={handleChange}
            min="0"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Husband Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Husband/Partner Name
          </label>
          <input
            type="text"
            name="husband_name"
            value={formData.husband_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Husband Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Husband/Partner Phone
          </label>
          <input
            type="tel"
            name="husband_phone"
            value={formData.husband_phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="255712345678"
          />
        </div>
      </div>
    </div>
  );

  const renderAddressInfo = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">A. Anuani ya makazi ya Mjamzito</h3>
        <p className="text-sm text-blue-700">Taarifa za makazi na elimu ya mjamzito</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Street */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mtaa</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter street name"
          />
        </div>

        {/* Ward */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kata</label>
          <input
            type="text"
            name="ward"
            value={formData.ward}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter ward name"
          />
        </div>

        {/* Council */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Halmashauri</label>
          <input
            type="text"
            name="council"
            value={formData.council}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter council name"
          />
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mkoa</label>
          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter region name"
          />
        </div>

        {/* Education */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Elimu</label>
          <select
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Chagua kiwango cha elimu</option>
            <option value="primary">Msingi</option>
            <option value="secondary">Sekondari</option>
            <option value="college">Chuo</option>
            <option value="other">Nyingine</option>
          </select>
        </div>

        {/* Other Education */}
        {formData.education === 'other' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maelezo ya elimu nyingine</label>
            <input
              type="text"
              name="other_education"
              value={formData.other_education}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Andika kiwango cha elimu"
            />
          </div>
        )}

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hali ya ndoa</label>
          <select
            name="marital_status"
            value={formData.marital_status}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Chagua hali ya ndoa</option>
            <option value="married">Ameolewa</option>
            <option value="single">Hajaolewa</option>
            <option value="other">Nyingine</option>
          </select>
        </div>

        {/* Other Marital Status */}
        {formData.marital_status === 'other' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maelezo ya hali nyingine</label>
            <input
              type="text"
              name="other_marital_status"
              value={formData.other_marital_status}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Andika hali ya ndoa"
            />
          </div>
        )}

        {/* Occupation */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Kazi</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter occupation"
          />
        </div>
      </div>
    </div>
  );

  const renderPartnerInfo = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-green-800 mb-2">B. Taarifa za Mwenzi</h3>
        <p className="text-sm text-green-700">Taarifa za mwenzi/mume</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Partner First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">La kwanza</label>
          <input
            type="text"
            name="partner_first_name"
            value={formData.partner_first_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter first name"
          />
        </div>

        {/* Partner Middle Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kati</label>
          <input
            type="text"
            name="partner_middle_name"
            value={formData.partner_middle_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter middle name"
          />
        </div>

        {/* Partner Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mwisho</label>
          <input
            type="text"
            name="partner_last_name"
            value={formData.partner_last_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter last name"
          />
        </div>

        {/* Partner Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Namba ya Simu</label>
          <input
            type="tel"
            name="partner_phone"
            value={formData.partner_phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="255712345678"
          />
        </div>

        {/* Partner Education */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Elimu (mwenzi)</label>
          <select
            name="partner_education"
            value={formData.partner_education}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Chagua kiwango cha elimu</option>
            <option value="primary">Msingi</option>
            <option value="secondary">Sekondari</option>
            <option value="college">Chuo</option>
            <option value="other">Nyingine</option>
          </select>
        </div>

        {/* Partner Other Education */}
        {formData.partner_education === 'other' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maelezo ya elimu nyingine</label>
            <input
              type="text"
              name="partner_other_education"
              value={formData.partner_other_education}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Andika kiwango cha elimu"
            />
          </div>
        )}

        {/* Partner Occupation */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Kazi</label>
          <input
            type="text"
            name="partner_occupation"
            value={formData.partner_occupation}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter occupation"
          />
        </div>
      </div>
    </div>
  );

  const renderContactsInfo = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-purple-800 mb-2">C & D. Ndugu wa Karibu na Mwenyekiti</h3>
        <p className="text-sm text-purple-700">Maelezo ya mtu wa karibu na mwenyekiti</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Relative First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">La kwanza (ndugu)</label>
          <input
            type="text"
            name="relative_first_name"
            value={formData.relative_first_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter first name"
          />
        </div>

        {/* Relative Middle Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kati (ndugu)</label>
          <input
            type="text"
            name="relative_middle_name"
            value={formData.relative_middle_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter middle name"
          />
        </div>

        {/* Relative Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mwisho (ndugu)</label>
          <input
            type="text"
            name="relative_last_name"
            value={formData.relative_last_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter last name"
          />
        </div>

        {/* Relative Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Namba ya Simu (ndugu)</label>
          <input
            type="tel"
            name="relative_phone"
            value={formData.relative_phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="255712345678"
          />
        </div>

        {/* Chairperson Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Jina la mwenyekiti</label>
          <input
            type="text"
            name="chairperson_name"
            value={formData.chairperson_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter chairperson name"
          />
        </div>

        {/* Chairperson Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Namba ya simu (mwenyekiti)</label>
          <input
            type="tel"
            name="chairperson_phone"
            value={formData.chairperson_phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="255712345678"
          />
        </div>
      </div>
    </div>
  );

  const renderMedicalInfo = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">E. Taarifa za mtoa huduma</h3>
        <p className="text-sm text-yellow-700">Maelezo ya mhudumu wa afya na aleji</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Provider First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">La kwanza (mtoa huduma)</label>
          <input
            type="text"
            name="provider_first_name"
            value={formData.provider_first_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter first name"
          />
        </div>

        {/* Provider Middle Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kati (mtoa huduma)</label>
          <input
            type="text"
            name="provider_middle_name"
            value={formData.provider_middle_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter middle name"
          />
        </div>

        {/* Provider Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mwisho (mtoa huduma)</label>
          <input
            type="text"
            name="provider_last_name"
            value={formData.provider_last_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter last name"
          />
        </div>

        {/* Provider Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cheo cha mtoa huduma za afya</label>
          <input
            type="text"
            name="provider_position"
            value={formData.provider_position}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter position"
          />
        </div>

        {/* Allergies */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Mzio (allegry)</label>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Andika maelezo ya aleji zozote..."
          />
        </div>
      </div>
    </div>
  );

  const renderPregnancyInfo = () => (
    <div className="space-y-6">
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-red-800 mb-2">F. Muhtasari Wa Ujauzito</h3>
        <p className="text-sm text-red-700">Taarifa za ziada kuhusu ujauzito</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Menstrual Cycle Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mzunguko wa hedhi (siku)</label>
          <input
            type="number"
            name="menstrual_cycle_days"
            value={formData.menstrual_cycle_days}
            onChange={handleChange}
            min="20"
            max="40"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., 28"
          />
        </div>

        {/* Normal Cycle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mzunguko wa kawaida</label>
          <select
            name="normal_cycle"
            value={formData.normal_cycle}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Chagua...</option>
            <option value="yes">Ndiyo</option>
            <option value="no">Hapana</option>
          </select>
        </div>

        {/* Living Children */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Idadi ya watoto walio hai</label>
          <input
            type="number"
            name="living_children"
            value={formData.living_children}
            onChange={handleChange}
            min="0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Still Births */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Watoto waliozaliwa wafu</label>
          <input
            type="number"
            name="still_births"
            value={formData.still_births}
            onChange={handleChange}
            min="0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Miscarriages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mimba zilizoharibika</label>
          <input
            type="number"
            name="miscarriages"
            value={formData.miscarriages}
            onChange={handleChange}
            min="0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Ectopic Pregnancies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mimba zilizotungwa nje ya mfuko wa uzazi</label>
          <input
            type="number"
            name="ectopic_pregnancies"
            value={formData.ectopic_pregnancies}
            onChange={handleChange}
            min="0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Abortions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kuzaa mtoto mfu</label>
          <input
            type="number"
            name="abortions"
            value={formData.abortions}
            onChange={handleChange}
            min="0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>
    </div>
  );

  const renderPregnancyHistory = () => (
    <div className="space-y-6">
      <div className="bg-indigo-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-indigo-800 mb-2">G. Historia ya Uzazi</h3>
        <p className="text-sm text-indigo-700">Rekodi za ujauzito uliopita</p>
      </div>

      {pregnancyHistory.map((history, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Ujauzito {index + 1}</h4>
            {pregnancyHistory.length > 1 && (
              <button
                type="button"
                onClick={() => removePregnancyHistory(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Ondoa
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mwaka</label>
              <input
                type="number"
                value={history.year}
                onChange={(e) => updatePregnancyHistory(index, 'year', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., 2020"
                min="1900"
                max="2030"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aina ya uzazi</label>
              <select
                value={history.delivery_type}
                onChange={(e) => updatePregnancyHistory(index, 'delivery_type', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Chagua aina ya uzazi</option>
                <option value="normal">Kawaida</option>
                <option value="csection">Upasuaji (C-section)</option>
                <option value="assisted">Usaidizi</option>
                <option value="other">Nyingine</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Matokeo</label>
              <select
                value={history.outcome}
                onChange={(e) => updatePregnancyHistory(index, 'outcome', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Chagua matokeo</option>
                <option value="live_birth">Mtoto hai</option>
                <option value="still_birth">Mtoto mfu</option>
                <option value="miscarriage">Mimba iliharibika</option>
                <option value="abortion">Abortion</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Uzito wa kuzaliwa (kg)</label>
              <input
                type="number"
                step="0.1"
                value={history.birth_weight}
                onChange={(e) => updatePregnancyHistory(index, 'birth_weight', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., 3.2"
                min="0.5"
                max="6.0"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addPregnancyHistory}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors"
      >
        + Ongeza Ujauzito Mwingine
      </button>
    </div>
  );

  const renderDeliveryMethods = () => (
    <div className="space-y-6">
      <div className="bg-pink-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-pink-800 mb-2">H. Njia za Kujifungua</h3>
        <p className="text-sm text-pink-700">Maelezo ya njia za kujifungua zilizotumika</p>
      </div>

      {deliveryMethods.map((method, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Kujifungua {index + 1}</h4>
            {deliveryMethods.length > 1 && (
              <button
                type="button"
                onClick={() => removeDeliveryMethod(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Ondoa
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mwaka</label>
              <input
                type="number"
                value={method.year}
                onChange={(e) => updateDeliveryMethod(index, 'year', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., 2020"
                min="1900"
                max="2030"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Njia ya kujifungua</label>
              <select
                value={method.method}
                onChange={(e) => updateDeliveryMethod(index, 'method', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Chagua njia</option>
                <option value="normal">Kawaida</option>
                <option value="csection">Upasuaji (C-section)</option>
                <option value="vacuum">Kuvutwa kwa vacuum</option>
                <option value="forceps">Kuvutwa kwa forceps</option>
                <option value="other">Nyingine</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Matatizo (kama ylipatika)</label>
              <textarea
                value={method.complications}
                onChange={(e) => updateDeliveryMethod(index, 'complications', e.target.value)}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Andika maelezo ya matatizo yoyote..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addDeliveryMethod}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors"
      >
        + Ongeza Njia Nyingine ya Kujifungua
      </button>
    </div>
  );

  const renderRisksInfo = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-orange-800 mb-2">I & J. Vidokezo vya Hatari</h3>
        <p className="text-sm text-orange-700">Vidokezo vyote vya hatari kwa mjamzito</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 - I. Chunguza Vidokezo */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">I. Chunguza Vidokezo</h4>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="age_under_20"
              checked={formData.age_under_20}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Umri chini ya miaka 20</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="last_pregnancy_10_years"
              checked={formData.last_pregnancy_10_years}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Miaka 10 au zaidi tokea mimba ya mwisho</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="previous_c_section"
              checked={formData.previous_c_section}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Kujifungua kwa upasuaji</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="stillbirth_history"
              checked={formData.stillbirth_history}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Kuzaa mtoto mfu/kifo cha mtoto mchanga</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="multiple_miscarriages"
              checked={formData.multiple_miscarriages}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Kuharibika kwa mimba mbili au zaidi</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="heart_disease"
              checked={formData.heart_disease}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Magonjwa ya moyo</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="diabetes"
              checked={formData.diabetes}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Kisukari</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="tuberculosis"
              checked={formData.tuberculosis}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Kifua Kikuu</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="disabled_child"
              checked={formData.disabled_child}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Mtoto mlemavu</label>
          </div>
        </div>

        {/* Column 2 - J. Weka (ndio) */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">J. Weka (ndio)</h4>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="fifth_pregnancy_plus"
              checked={formData.fifth_pregnancy_plus}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Mimba ya tano au zaidi</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="height_under_150"
              checked={formData.height_under_150}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Kimo chini ya Sentimita 150</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="pelvic_deformity"
              checked={formData.pelvic_deformity}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Kilema cha nyonga</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="first_pregnancy_over_35"
              checked={formData.first_pregnancy_over_35}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Mimba ya kwanza miaka 35 na zaidi</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="instrument_delivery"
              checked={formData.instrument_delivery}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Kujifungua kwa upasuaji au mtoto kuvutwa kwa kifaa</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="postpartum_hemorrhage"
              checked={formData.postpartum_hemorrhage}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Kutokwa na damu nyingi baada ya kujifungua</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="retained_placenta"
              checked={formData.retained_placenta}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Kondo la nyuma kukwama</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="eclampsia_history"
              checked={formData.eclampsia_history}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Kuwahi kupata kifafa cha mimba</label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section Navigation */}
      <div className="bg-white border-b">
        <nav className="flex space-x-8 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
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
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        {renderSection()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <div>
          {activeSection !== 'basic' && (
            <button
              type="button"
              onClick={() => {
                const currentIndex = sections.findIndex(s => s.id === activeSection);
                if (currentIndex > 0) {
                  setActiveSection(sections[currentIndex - 1].id);
                }
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Nyuma
            </button>
          )}
        </div>

        <div className="flex space-x-4">
          {activeSection !== 'risks' ? (
            <button
              type="button"
              onClick={() => {
                const currentIndex = sections.findIndex(s => s.id === activeSection);
                if (currentIndex < sections.length - 1) {
                  setActiveSection(sections[currentIndex + 1].id);
                }
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Endelea
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ghairi
              </button>
              <button
                type="submit"
                disabled={loading || (patients.length === 0 && !record)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Inahifadhi...' : (record ? 'Sasisha Rekodi' : 'Hifadhi Rekodi')}
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
};

export default PregnantWomanForm;