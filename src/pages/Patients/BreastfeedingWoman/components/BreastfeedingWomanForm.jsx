import React, { useState, useEffect } from 'react';
import axios from '../../../../api/axios';

const BreastfeedingWomanForm = ({ record, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    patient_id: '',
    delivery_date: '',
    baby_name: '',
    baby_age_months: '',
    
    // Taarifa Ya Mama - Birth Information
    delivery_place: '',
    birth_attendant: '',
    other_attendant: '',
    
    // Medical Information
    syphilis_test_result: '',
    last_hb_level: '',
    
    // Medications and Supplements
    received_sp: '',
    received_iron: '',
    received_folic_acid: '',
    received_tetanus_vaccine: '',
    received_deworming: '',
    received_vitamin_a: '',
    
    // PMTCT Information
    hiv_status_pmtct: '',
    uses_cotrimoxazole: '',
    uses_arv: ''
  });

  const [patients, setPatients] = useState([]);
  const [calculating, setCalculating] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [activeSection, setActiveSection] = useState('basic'); // For section navigation

  useEffect(() => {
    if (record) {
      setFormData({
        // Basic Information
        patient_id: record.patient_id || '',
        delivery_date: record.delivery_date || '',
        baby_name: record.baby_name || '',
        baby_age_months: record.baby_age_months || '',
        
        // Taarifa Ya Mama - Birth Information
        delivery_place: record.delivery_place || '',
        birth_attendant: record.birth_attendant || '',
        other_attendant: record.other_attendant || '',
        
        // Medical Information
        syphilis_test_result: record.syphilis_test_result || '',
        last_hb_level: record.last_hb_level || '',
        
        // Medications and Supplements
        received_sp: record.received_sp || '',
        received_iron: record.received_iron || '',
        received_folic_acid: record.received_folic_acid || '',
        received_tetanus_vaccine: record.received_tetanus_vaccine || '',
        received_deworming: record.received_deworming || '',
        received_vitamin_a: record.received_vitamin_a || '',
        
        // PMTCT Information
        hiv_status_pmtct: record.hiv_status_pmtct || '',
        uses_cotrimoxazole: record.uses_cotrimoxazole || '',
        uses_arv: record.uses_arv || ''
      });
    }
    fetchBreastfeedingPatients();
  }, [record]);

  const fetchBreastfeedingPatients = async () => {
    try {
      setLoadingPatients(true);
      const response = await axios.get('/patients');
      const allPatients = response.data.data.data;
      const breastfeedingPatients = allPatients.filter(patient => 
        patient.patient_type === 'breastfeeding'
      );
      
      const patientsWithRecords = await getPatientsWithExistingRecords();
      const availablePatients = breastfeedingPatients.filter(patient => 
        !patientsWithRecords.includes(patient.id)
      );
      
      setPatients(availablePatients);
    } catch (error) {
      console.error('Error fetching breastfeeding patients:', error);
    } finally {
      setLoadingPatients(false);
    }
  };

  const getPatientsWithExistingRecords = async () => {
    try {
      const response = await axios.get('/breastfeeding-women');
      const existingRecords = response.data.data.data;
      return existingRecords.map(record => record.patient_id);
    } catch (error) {
      console.error('Error fetching existing records:', error);
      return [];
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateBabyAge = async (deliveryDate) => {
    if (!deliveryDate) return;
    
    try {
      setCalculating(true);
      const response = await axios.get(`/breastfeeding-women/calculate-baby-age?delivery_date=${deliveryDate}`);
      const { baby_age_months, baby_age_days } = response.data.data;
      
      setFormData(prev => ({
        ...prev,
        baby_age_months: baby_age_months.toString(),
        delivery_date: deliveryDate
      }));
      
      alert(`Baby age calculated: ${baby_age_months} months (${baby_age_days} days)`);
    } catch (error) {
      console.error('Error calculating baby age:', error);
      alert('Failed to calculate baby age');
    } finally {
      setCalculating(false);
    }
  };

  const handleDeliveryDateChange = (e) => {
    const deliveryDate = e.target.value;
    setFormData(prev => ({ ...prev, delivery_date: deliveryDate }));
    
    if (deliveryDate) {
      calculateBabyAge(deliveryDate);
    }
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
      baby_age_months: formData.baby_age_months ? parseInt(formData.baby_age_months) : null,
      last_hb_level: formData.last_hb_level ? parseFloat(formData.last_hb_level) : null
    };

    onSubmit(submitData);
  };

  // Section navigation
  const sections = [
    { id: 'basic', name: 'Taarifa za Msingi' },
    { id: 'birth', name: 'Taarifa Ya Mama' },
    { id: 'medical', name: 'Taarifa za Kiafya' },
    { id: 'pmtct', name: 'Taarifa za PMTCT' }
  ];

  const renderSection = () => {
    switch(activeSection) {
      case 'basic':
        return renderBasicInfo();
      case 'birth':
        return renderBirthInfo();
      case 'medical':
        return renderMedicalInfo();
      case 'pmtct':
        return renderPMTCTInfo();
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
                <option value="">Select a breastfeeding patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} - {patient.phone_number}
                  </option>
                ))}
              </select>
              <div className="mt-2 text-sm text-gray-600">
                <p>Showing {patients.length} breastfeeding patient(s) available for registration</p>
                {patients.length === 0 && (
                  <p className="text-red-600 mt-1">
                    No available breastfeeding patients. Please register a patient with type "breastfeeding" first.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Date *
          </label>
          <input
            type="date"
            name="delivery_date"
            value={formData.delivery_date}
            onChange={handleDeliveryDateChange}
            required
            max={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          {calculating && (
            <p className="mt-1 text-sm text-blue-600">Calculating baby age...</p>
          )}
        </div>

        {/* Baby Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Baby Age (Months) *
          </label>
          <input
            type="number"
            name="baby_age_months"
            value={formData.baby_age_months}
            onChange={handleChange}
            min="0"
            max="24"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Age in months (0-24 months)
          </p>
        </div>

        {/* Baby Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Baby Name
          </label>
          <input
            type="text"
            name="baby_name"
            value={formData.baby_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter baby's name (optional)"
          />
        </div>
      </div>
    </div>
  );

  const renderBirthInfo = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Taarifa Ya Mama</h3>
        <p className="text-sm text-blue-700">Taarifa kuhusu uzazi na wanaomhudumia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Place */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mahali alipo jifungulia *
          </label>
          <select
            name="delivery_place"
            value={formData.delivery_place}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Chagua mahali...</option>
            <option value="health_facility">Kituo cha huduma ya afya</option>
            <option value="home">Nyumbani</option>
            <option value="on_the_way">Njiani</option>
          </select>
        </div>

        {/* Birth Attendant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aina ya muhudumu aliyemzalisha *
          </label>
          <select
            name="birth_attendant"
            value={formData.birth_attendant}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Chagua mhudumu...</option>
            <option value="health_worker">Mhudumu wa afya</option>
            <option value="tba">TBA</option>
            <option value="other">Wengineo</option>
          </select>
        </div>

        {/* Other Attendant Details */}
        {formData.birth_attendant === 'other' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maelezo ya mhudumu mwingine
            </label>
            <input
              type="text"
              name="other_attendant"
              value={formData.other_attendant}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Andika aina ya mhudumu mwingine..."
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderMedicalInfo = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-green-800 mb-2">Taarifa za Kiafya</h3>
        <p className="text-sm text-green-700">Vipimo na matibabu muhimu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Syphilis Test Result */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Majibu ya kipimo cha kaswende
          </label>
          <select
            name="syphilis_test_result"
            value={formData.syphilis_test_result}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Chagua majibu...</option>
            <option value="negative">Hasi</option>
            <option value="positive">Chanya</option>
          </select>
        </div>

        {/* HB Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kiasi cha damu (Hb) hudhurio la mwisho (g/dl)
          </label>
          <input
            type="number"
            name="last_hb_level"
            value={formData.last_hb_level}
            onChange={handleChange}
            min="0"
            max="20"
            step="0.1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., 12.5"
          />
        </div>

        {/* Medications and Supplements */}
        <div className="md:col-span-2">
          <h4 className="text-md font-medium text-gray-700 mb-4">Madawa na Vitamini</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* SP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alipata SP 2+
              </label>
              <select
                name="received_sp"
                value={formData.received_sp}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Chagua...</option>
                <option value="yes">Ndiyo</option>
                <option value="no">Hapana</option>
              </select>
            </div>

            {/* Iron */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alipata madini chuma
              </label>
              <select
                name="received_iron"
                value={formData.received_iron}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Chagua...</option>
                <option value="yes">Ndiyo</option>
                <option value="no">Hapana</option>
              </select>
            </div>

            {/* Folic Acid */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alipata Folic Acid
              </label>
              <select
                name="received_folic_acid"
                value={formData.received_folic_acid}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Chagua...</option>
                <option value="yes">Ndiyo</option>
                <option value="no">Hapana</option>
              </select>
            </div>

            {/* Tetanus Vaccine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alipata chanjo ya Pepopunda
              </label>
              <select
                name="received_tetanus_vaccine"
                value={formData.received_tetanus_vaccine}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Chagua...</option>
                <option value="yes">Ndiyo</option>
                <option value="no">Hapana</option>
              </select>
            </div>

            {/* Deworming */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alipata dawa za minyoo
              </label>
              <select
                name="received_deworming"
                value={formData.received_deworming}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Chagua...</option>
                <option value="yes">Ndiyo</option>
                <option value="no">Hapana</option>
              </select>
            </div>

            {/* Vitamin A */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alipata Vitamin A baada ya kujifungua
              </label>
              <select
                name="received_vitamin_a"
                value={formData.received_vitamin_a}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Chagua...</option>
                <option value="yes">Ndiyo</option>
                <option value="no">Hapana</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPMTCTInfo = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-purple-800 mb-2">Taarifa za PMTCT</h3>
        <p className="text-sm text-purple-700">Huduma za Kuzuia Maambukizi ya VVU kutoka Mama kwa Mtoto</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HIV Status PMTCT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hali ya maambukizi ya VVU ya mama
          </label>
          <select
            name="hiv_status_pmtct"
            value={formData.hiv_status_pmtct}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Chagua hali...</option>
            <option value="pmtct1">PMTCT 1</option>
            <option value="pmtct2">PMTCT 2</option>
            <option value="unknown">Haijulikani</option>
          </select>
        </div>

        {/* Cotrimoxazole Usage */}
        {formData.hiv_status_pmtct === 'pmtct1' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Iwapo mama ni PMTCT1 je anatumia Cotrimoxazole?
            </label>
            <select
              name="uses_cotrimoxazole"
              value={formData.uses_cotrimoxazole}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Chagua...</option>
              <option value="yes">Ndiyo</option>
              <option value="no">Hapana</option>
            </select>
          </div>
        )}

        {/* ARV Usage */}
        {formData.hiv_status_pmtct === 'pmtct1' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kama mama ni PMTCT1 anatumia dawa ya tiba ya ARV?
            </label>
            <select
              name="uses_arv"
              value={formData.uses_arv}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Chagua...</option>
              <option value="yes">Ndiyo</option>
              <option value="no">Hapana</option>
            </select>
          </div>
        )}
      </div>

      {formData.hiv_status_pmtct !== 'pmtct1' && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Maelezo ya PMTCT yataonekana tu kama hali ya VVU ya mama ni PMTCT 1
          </p>
        </div>
      )}
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

   {/* Navigation Buttons */}
<div className="flex justify-between pt-6">
  <div>
    {activeSection !== 'basic' && (
      <div
        onClick={() => {
          const currentIndex = sections.findIndex(s => s.id === activeSection);
          setActiveSection(sections[currentIndex - 1].id);
        }}
        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      >
        Previous
      </div>
    )}
  </div>

  <div className="flex space-x-4">
    <div
      onClick={() => window.history.back()}
      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
    >
      Cancel
    </div>

    {activeSection !== 'pmtct' ? (
      <div
        onClick={() => {
          const currentIndex = sections.findIndex(s => s.id === activeSection);
          setActiveSection(sections[currentIndex + 1].id);
        }}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
      >
        Next
      </div>
    ) : (
      <button
        type="submit"
        disabled={loading || (patients.length === 0 && !record)}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Saving...' : (record ? 'Update Record' : 'Create Record')}
      </button>
    )}
  </div>
</div>
    </form>
  );
};

export default BreastfeedingWomanForm;