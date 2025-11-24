import React from 'react';
import axiosInstance from '../../api/axios';

class CreateVisit extends React.Component {
    state = {
        formData: {
            // ==================== BASIC FIELDS ====================
            patient_id: '',
            doctor_id: '',
            visit_date: new Date().toISOString().split('T')[0],
            visit_type: 'consultation',
            notes: '',
            
            // ==================== PREGNANT PATIENT FIELDS ====================
            // A: Huduma zilizotolewa
            weight: '',
            muac_circumference: '',
            albumin_urine: '',
            blood_hb: '',
            sugar_urine: '',
            gestational_age_weeks: '',
            uterine_height: '',
            fetal_position: '',
            fetal_presentation: '',
            fetal_heart_rate: '',
            iron_supplements: '',
            folic_acid: '',
            
            // B: Mama Ameshauriwa Kususu
            danger_signs_advice: '',
            nutrition_advice: '',
            gender_violence_advice: '',
            substance_abuse_advice: '',
            family_planning_advice: '',
            delivery_preparation_advice: '',
            sti_advice: '',
            pmtct_advice: '',
            art_treatment: '',
            ctx_treatment: '',
            service_registration: '',
            adherence_status: '',
            child_nutrition_advice: '',
            alternative_milk: '',
            vaccination_info: '',
            
            // C: Mwisho
            return_date: '',
            provider_name: '',
            provider_position: '',
            provider_signature: '',
            
            // ==================== CHILD PATIENT FIELDS ====================
            // A: Ukuaji na Maendeleo Ya mtoto siku (0-42)
            child_age_days: '',
            child_temperature: '',
            child_blood_hb: '',
            umbilical_cord_status: '',
            skin_condition: '',
            eyes_condition: '',
            feeding_recommendations: '',
            breastfeeding_inability_reason: '',
            exclusive_breastfeeding_desc: '',
            alternative_milk_desc: '',
            
            // B: Ukuaji na maendeleo ya mtoto siku (>42)
            child_age_months: '',
            child_age_weeks: '',
            child_weight: '',
            child_height: '',
            communication_development: '',
            child_blood_hb_42plus: '',
            feeding_recommendations_42plus: '',
            first_food_age_desc: '',
            weaning_age_desc: '',
            
            // ==================== BREASTFEEDING PATIENT FIELDS ====================
            // A: Rekodi ya mama
            postpartum_visit_type: '',
            
            // B: Matiti na unyonyeshaji
            breastfeeding_advice: '',
            
            // G: Lokia
            lochia_amount: '',
            lochia_color: '',
            
            // K: Dawa za Kinga
            vaccination_info_bf: '',
            other_treatments: '',
            
            // L: Rekodi Ya Mtoto
            baby_temperature: '',
            breathing_rate: '',
            umbilical_cord_condition: '',
            
            // ==================== BOOLEAN FIELDS ====================
            // Pregnancy booleans
            fetal_movement: false,
            swelling_hands_face: false,
            iron_folic_acid_combo: false,
            malaria_medication: false,
            deworming_medication: false,
            tb_screening: false,
            urine_test: false,
            malaria_test: false,
            syphilis_test: false,
            exclusive_breastfeeding: false,
            ultrasound_done: false,
            
            // Breastfeeding booleans
            mother_temperature_high: false,
            high_blood_pressure: false,
            low_blood_hb: false,
            pmtct_breastfeeding: false,
            alternative_milk_bf: false,
            breastfeeding_status: false,
            milk_flow: false,
            breastfeeding_start_time: false,
            breast_sores: false,
            breast_engorgement: false,
            breast_abscess: false,
            uterine_involution: false,
            severe_pain: false,
            episiotomy_status: false,
            wound_itchy: false,
            episiotomy_done: false,
            wound_healed: false,
            wound_discharge: false,
            wound_open: false,
            lochia_smell: false,
            heavy_bleeding: false,
            mental_illness: false,
            family_planning_given: false,
            iron_supplements_bf: false,
            folic_acid_bf: false,
            iron_folic_combo_bf: false,
            pmtct_treatment: false,
            postpartum_medication: false,
            vitamin_a_given: false,
            hiv_test_6weeks: false,
            baby_breastfeeding: false,
            jaundice_status: false
        },
        patients: [],
        selectedPatient: null,
        loading: false,
        errors: {},
        showPatientDetails: false,
        patientVisits: []
    };

    componentDidMount() {
        this.fetchPatients();
        this.setCurrentDoctor();
    }

    fetchPatients = async () => {
        try {
            console.log('Fetching patients...');
            
            const patientsRes = await axiosInstance.get('/patients');
            
            const paginationData = patientsRes.data.data;
            const patientsData = paginationData?.data || [];
            
            if (!Array.isArray(patientsData)) {
                console.error('Patients data is not an array:', patientsData);
                this.setState({ patients: [] });
                return;
            }
            
            this.setState({ patients: patientsData });
            
        } catch (error) {
            console.error('Error fetching patients:', error);
            this.setState({ patients: [] });
        }
    };

    setCurrentDoctor = () => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                const currentUser = JSON.parse(userData);
                if (currentUser && currentUser.id) {
                    this.setState(prevState => ({
                        formData: {
                            ...prevState.formData,
                            doctor_id: currentUser.id
                        }
                    }));
                    return;
                }
            }
            
            this.fetchCurrentUser();
            
        } catch (error) {
            console.error('Error setting current doctor:', error);
        }
    };

    fetchCurrentUser = async () => {
        try {
            const userRes = await axiosInstance.get('/profile');
            if (userRes.data && userRes.data.data) {
                const user = userRes.data.data;
                this.setState(prevState => ({
                    formData: {
                        ...prevState.formData,
                        doctor_id: user.id
                    }
                }));
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    handlePatientSelection = (patientId) => {
        if (!patientId) {
            this.setState({ 
                selectedPatient: null, 
                patientVisits: [], 
                showPatientDetails: false
            });
            return;
        }

        // Find patient from the already loaded patients list
        const selectedPatient = this.state.patients.find(patient => patient.id == patientId);
        
        if (selectedPatient) {
            this.setState({
                selectedPatient,
                showPatientDetails: true,
                patientVisits: [] // We'll skip fetching visits for now to avoid errors
            });
        }
    };

    handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [name]: type === 'checkbox' ? checked : value
            },
            errors: {
                ...prevState.errors,
                [name]: ''
            }
        }));

        if (name === 'patient_id') {
            this.handlePatientSelection(value);
        }
    };

    validateForm = () => {
        const errors = {};
        const { formData } = this.state;

        if (!formData.patient_id) errors.patient_id = 'Patient is required';
        if (!formData.doctor_id) errors.doctor_id = 'Doctor is required';
        if (!formData.visit_date) errors.visit_date = 'Visit date is required';
        if (!formData.visit_type) errors.visit_type = 'Visit type is required';

        this.setState({ errors });
        return Object.keys(errors).length === 0;
    };

    // Clean form data before sending
    cleanFormData = (formData) => {
        const cleaned = { ...formData };
        
        // Convert empty strings to null
        Object.keys(cleaned).forEach(key => {
            if (cleaned[key] === '') {
                cleaned[key] = null;
            }
            
            // Convert string numbers to actual numbers
            if (typeof cleaned[key] === 'string' && !isNaN(cleaned[key]) && cleaned[key] !== '' && cleaned[key] !== null) {
                // Check if it's a decimal number
                if (cleaned[key].includes('.')) {
                    cleaned[key] = parseFloat(cleaned[key]);
                } else {
                    cleaned[key] = parseInt(cleaned[key]);
                }
            }
        });
        
        return cleaned;
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!this.validateForm()) {
            alert('Please fill in all required fields');
            return;
        }

        if (!this.state.formData.doctor_id) {
            alert('Error: Doctor ID not set. Please refresh the page.');
            return;
        }

        this.setState({ loading: true });

        try {
            console.log('🔄 Submitting form data...');
            
            // Clean the data before sending
            const cleanedData = this.cleanFormData(this.state.formData);
            console.log('📦 Cleaned form data:', cleanedData);
            
            const response = await axiosInstance.post('/visits', cleanedData);
            console.log('✅ Visit created successfully:', response.data);
            alert('Visit created successfully!');
            this.props.history.push('/visits');
        } catch (error) {
            console.error('❌ Error creating visit:', error);
            
            // IMPROVED ERROR HANDLING - SHOW SPECIFIC VALIDATION ERRORS
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                console.error('🔴 VALIDATION ERRORS DETAILS:', validationErrors);
                
                // Set errors to state for display
                this.setState({ errors: validationErrors });
                
                // Show detailed error messages
                let errorMessage = 'Please fix the following errors:\n\n';
                Object.keys(validationErrors).forEach(field => {
                    errorMessage += `• ${field}: ${validationErrors[field].join(', ')}\n`;
                });
                
                alert(errorMessage);
            } else if (error.response?.data?.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert('Error creating visit. Please try again.');
            }
        } finally {
            this.setState({ loading: false });
        }
    };

    // Method to display field-specific errors
    renderFieldError = (fieldName) => {
        const { errors } = this.state;
        if (errors && errors[fieldName]) {
            return (
                <div className="text-red-500 text-sm mt-1 bg-red-50 p-2 rounded border border-red-200">
                    <strong>Validation Error:</strong> {Array.isArray(errors[fieldName]) ? errors[fieldName].join(', ') : errors[fieldName]}
                </div>
            );
        }
        return null;
    };

    // Test with simple data
    testWithSimpleData = async () => {
        const simpleData = {
            patient_id: this.state.formData.patient_id,
            doctor_id: this.state.formData.doctor_id,
            visit_date: this.state.formData.visit_date,
            visit_type: this.state.formData.visit_type,
            // Skip all other fields initially
        };
        
        console.log('🧪 Testing with simple data:', simpleData);
        
        try {
            const response = await axiosInstance.post('/visits', simpleData);
            console.log('✅ SUCCESS with simple data:', response.data);
            alert('Visit created with basic info! You can add details later.');
            this.props.history.push('/visits');
        } catch (error) {
            console.error('❌ Even simple data failed:', error);
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                console.log('🔴 Simple data validation errors:', validationErrors);
                
                let errorMessage = 'Validation errors with simple data:\n\n';
                Object.keys(validationErrors).forEach(field => {
                    errorMessage += `• ${field}: ${validationErrors[field].join(', ')}\n`;
                });
                alert(errorMessage);
            }
        }
    };

    // ==================== DYNAMIC FIELD RENDERERS ====================

    renderPatientDetails() {
        const { selectedPatient, patientVisits, showPatientDetails } = this.state;

        if (!showPatientDetails || !selectedPatient) return null;

        return (
            <div className="mb-6 p-4 border border-green-300 rounded-lg bg-green-50">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                    📋 Patient Details: {selectedPatient.first_name} {selectedPatient.last_name}
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="text-sm font-medium text-green-700">Patient Type</label>
                        <p className="text-sm font-semibold capitalize">{selectedPatient.patient_type}</p>
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-green-700">Date of Birth</label>
                        <p className="text-sm">{selectedPatient.date_of_birth || 'Not specified'}</p>
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-green-700">Phone</label>
                        <p className="text-sm">{selectedPatient.phone_number || 'Not specified'}</p>
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-green-700">Age</label>
                        <p className="text-sm">{selectedPatient.age || 'Not specified'}</p>
                    </div>
                </div>

                {patientVisits.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-md font-semibold text-green-700 mb-2">
                            📊 Previous Visits ({patientVisits.length})
                        </h4>
                        <div className="bg-white rounded-lg border border-green-200 max-h-32 overflow-y-auto">
                            {patientVisits.slice(0, 5).map((visit, index) => (
                                <div key={visit.id || index} className="p-3 border-b border-green-100 last:border-b-0">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium">
                                            {new Date(visit.visit_date).toLocaleDateString()}
                                        </span>
                                        <span className="text-gray-600">{visit.visit_type}</span>
                                        <span className="font-semibold">
                                            {visit.weight ? `${visit.weight} kg` : 'No weight'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {patientVisits.length === 0 && (
                    <div className="text-center py-2 text-green-600">
                        📝 No previous visits found
                    </div>
                )}
            </div>
        );
    }

    renderBasicInfoFields() {
        const { formData, errors, patients } = this.state;

        const patientsList = Array.isArray(patients) ? patients : [];

        return (
            <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-800">📝 Basic Visit Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Patient *
                        </label>
                        <select
                            name="patient_id"
                            value={formData.patient_id}
                            onChange={this.handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.patient_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select Patient</option>
                            {patientsList.map(patient => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.first_name} {patient.last_name} ({patient.patient_type})
                                </option>
                            ))}
                        </select>
                        {this.renderFieldError('patient_id')}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Visit Date *
                        </label>
                        <input
                            type="date"
                            name="visit_date"
                            value={formData.visit_date}
                            onChange={this.handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.visit_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                        />
                        {this.renderFieldError('visit_date')}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Visit Type *
                        </label>
                        <select
                            name="visit_type"
                            value={formData.visit_type}
                            onChange={this.handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.visit_type ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                        >
                            <option value="consultation">Consultation</option>
                            <option value="lab">Lab</option>
                            <option value="vaccination">Vaccination</option>
                            <option value="pharmacy">Pharmacy</option>
                            <option value="checkup">Checkup</option>
                            <option value="followup">Followup</option>
                        </select>
                        {this.renderFieldError('visit_type')}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Doctor (Automatically assigned)
                        </label>
                        <input
                            type="text"
                            value="Current User (You)"
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                        />
                        {this.renderFieldError('doctor_id')}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                    </label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={this.handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Additional notes about this visit..."
                    />
                </div>

                {/* Test Button */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="text-sm font-semibold text-yellow-800 mb-2">🧪 Debugging Tools</h4>
                    <button
                        type="button"
                        onClick={this.testWithSimpleData}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                    >
                        Test with Basic Data Only
                    </button>
                    <p className="text-xs text-yellow-600 mt-2">
                        This will submit only the basic required fields to identify validation issues.
                    </p>
                </div>
            </div>
        );
    }

    // ==================== PREGNANT PATIENT FIELDS ====================
    renderPregnancySpecificFields() {
        const { formData } = this.state;
        return (
            <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-blue-800">🤰 Pregnancy Patient Visit Information</h3>
                </div>

                {/* A: Huduma zilizotolewa */}
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-blue-700">A: Huduma Zilizotolewa</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Weight (kg)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            name="weight"
                            value={formData.weight}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 65.5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            MUAC Circumference (cm)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            name="muac_circumference"
                            value={formData.muac_circumference}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 25.5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Blood Hb (g/dL)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            name="blood_hb"
                            value={formData.blood_hb}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 12.5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gestational Age (weeks)
                        </label>
                        <input
                            type="number"
                            name="gestational_age_weeks"
                            value={formData.gestational_age_weeks}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 24"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fetal Heart Rate (bpm)
                        </label>
                        <input
                            type="number"
                            name="fetal_heart_rate"
                            value={formData.fetal_heart_rate}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 140"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Uterine Height (cm)
                        </label>
                        <input
                            type="number"
                            name="uterine_height"
                            value={formData.uterine_height}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 26"
                        />
                    </div>
                </div>

                {/* Urine Tests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Albumin in Urine
                        </label>
                        <select
                            name="albumin_urine"
                            value={formData.albumin_urine}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Result</option>
                            <option value="negative">Negative</option>
                            <option value="trace">Trace</option>
                            <option value="1+">1+</option>
                            <option value="2+">2+</option>
                            <option value="3+">3+</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sugar in Urine
                        </label>
                        <select
                            name="sugar_urine"
                            value={formData.sugar_urine}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Result</option>
                            <option value="negative">Negative</option>
                            <option value="trace">Trace</option>
                            <option value="1+">1+</option>
                            <option value="2+">2+</option>
                            <option value="3+">3+</option>
                        </select>
                    </div>
                </div>

                {/* Fetal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fetal Position
                        </label>
                        <input
                            type="text"
                            name="fetal_position"
                            value={formData.fetal_position}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Cephalic"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fetal Presentation
                        </label>
                        <input
                            type="text"
                            name="fetal_presentation"
                            value={formData.fetal_presentation}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Vertex"
                        />
                    </div>
                </div>

                {/* Medications and Supplements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Iron Supplements
                        </label>
                        <input
                            type="text"
                            name="iron_supplements"
                            value={formData.iron_supplements}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Ferrous sulfate 65mg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Folic Acid
                        </label>
                        <input
                            type="text"
                            name="folic_acid"
                            value={formData.folic_acid}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 400mcg daily"
                        />
                    </div>
                </div>

                {/* B: Mama Ameshauriwa Kususu */}
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-blue-700">B: Mama Ameshauriwa Kususu</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Danger Signs Advice
                        </label>
                        <textarea
                            name="danger_signs_advice"
                            value={formData.danger_signs_advice}
                            onChange={this.handleInputChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Advice on danger signs..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nutrition Advice
                        </label>
                        <textarea
                            name="nutrition_advice"
                            value={formData.nutrition_advice}
                            onChange={this.handleInputChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nutrition advice..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender Violence Advice
                        </label>
                        <textarea
                            name="gender_violence_advice"
                            value={formData.gender_violence_advice}
                            onChange={this.handleInputChange}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Gender violence advice..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Substance Abuse Advice
                        </label>
                        <textarea
                            name="substance_abuse_advice"
                            value={formData.substance_abuse_advice}
                            onChange={this.handleInputChange}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Substance abuse advice..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Family Planning Advice
                        </label>
                        <textarea
                            name="family_planning_advice"
                            value={formData.family_planning_advice}
                            onChange={this.handleInputChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Family planning advice..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Delivery Preparation Advice
                        </label>
                        <textarea
                            name="delivery_preparation_advice"
                            value={formData.delivery_preparation_advice}
                            onChange={this.handleInputChange}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Delivery preparation advice..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            STI Advice
                        </label>
                        <textarea
                            name="sti_advice"
                            value={formData.sti_advice}
                            onChange={this.handleInputChange}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="STI advice..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            PMTCT Advice
                        </label>
                        <textarea
                            name="pmtct_advice"
                            value={formData.pmtct_advice}
                            onChange={this.handleInputChange}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="PMTCT advice..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ART Treatment
                        </label>
                        <textarea
                            name="art_treatment"
                            value={formData.art_treatment}
                            onChange={this.handleInputChange}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ART treatment information..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            CTX Treatment
                        </label>
                        <textarea
                            name="ctx_treatment"
                            value={formData.ctx_treatment}
                            onChange={this.handleInputChange}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="CTX treatment information..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service Registration
                        </label>
                        <textarea
                            name="service_registration"
                            value={formData.service_registration}
                            onChange={this.handleInputChange}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Service registration information..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Child Nutrition Advice
                        </label>
                        <textarea
                            name="child_nutrition_advice"
                            value={formData.child_nutrition_advice}
                            onChange={this.handleInputChange}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Child nutrition advice..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Alternative Milk
                        </label>
                        <input
                            type="text"
                            name="alternative_milk"
                            value={formData.alternative_milk}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Alternative milk information..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vaccination Information
                        </label>
                        <textarea
                            name="vaccination_info"
                            value={formData.vaccination_info}
                            onChange={this.handleInputChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Vaccination information..."
                        />
                    </div>
                </div>

                {/* Adherence Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Adherence Status
                        </label>
                        <select
                            name="adherence_status"
                            value={formData.adherence_status}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Status</option>
                            <option value="P">Poor (P)</option>
                            <option value="G">Good (G)</option>
                        </select>
                    </div>
                </div>

                {/* C: Mwisho */}
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-blue-700">C: Mwisho</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Return Date
                        </label>
                        <input
                            type="date"
                            name="return_date"
                            value={formData.return_date}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Provider Name
                        </label>
                        <input
                            type="text"
                            name="provider_name"
                            value={formData.provider_name}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter provider name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Provider Position
                        </label>
                        <input
                            type="text"
                            name="provider_position"
                            value={formData.provider_position}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter provider position"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Provider Signature
                        </label>
                        <input
                            type="text"
                            name="provider_signature"
                            value={formData.provider_signature}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter provider signature"
                        />
                    </div>
                </div>

                {/* Checkboxes for Pregnancy */}
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-blue-700">✅ Pregnancy Checks</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="fetal_movement"
                            checked={formData.fetal_movement}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Fetal movement
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="swelling_hands_face"
                            checked={formData.swelling_hands_face}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Swelling of hands/face
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="ultrasound_done"
                            checked={formData.ultrasound_done}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Ultrasound done
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="iron_folic_acid_combo"
                            checked={formData.iron_folic_acid_combo}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Iron/Folic acid combo
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="malaria_medication"
                            checked={formData.malaria_medication}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Malaria medication
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="deworming_medication"
                            checked={formData.deworming_medication}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Deworming medication
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="tb_screening"
                            checked={formData.tb_screening}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            TB screening
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="urine_test"
                            checked={formData.urine_test}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Urine test
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="malaria_test"
                            checked={formData.malaria_test}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Malaria test
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="syphilis_test"
                            checked={formData.syphilis_test}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Syphilis test
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="exclusive_breastfeeding"
                            checked={formData.exclusive_breastfeeding}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Exclusive breastfeeding
                        </label>
                    </div>
                </div>
            </div>
        );
    }

    // ==================== CHILD PATIENT FIELDS ====================
    renderChildSpecificFields() {
        const { formData } = this.state;
        return (
            <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-green-800">👶 Child Patient Visit Information</h3>
                </div>

                {/* A: Ukuaji na Maendeleo Ya mtoto siku (0-42) */}
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-green-700">A: Ukuaji na Maendeleo Ya Mtoto Siku (0-42)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Child Age (days)
                        </label>
                        <input
                            type="number"
                            name="child_age_days"
                            value={formData.child_age_days}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 45"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Child Temperature (°C)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            name="child_temperature"
                            value={formData.child_temperature}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 37.2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Child Blood Hb (g/dL)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            name="child_blood_hb"
                            value={formData.child_blood_hb}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 11.5"
                        />
                    </div>
                </div>

                {/* Physical Examination - 0-42 days */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Umbilical Cord Status
                        </label>
                        <select
                            name="umbilical_cord_status"
                            value={formData.umbilical_cord_status}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Select Status</option>
                            <option value="healed">Healed</option>
                            <option value="red">Red</option>
                            <option value="discharge">Discharge</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Skin Condition
                        </label>
                        <select
                            name="skin_condition"
                            value={formData.skin_condition}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Select Condition</option>
                            <option value="rash">Rash</option>
                            <option value="discolored">Discolored</option>
                            <option value="normal">Normal</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Eyes Condition
                        </label>
                        <select
                            name="eyes_condition"
                            value={formData.eyes_condition}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Select Condition</option>
                            <option value="clean">Clean</option>
                            <option value="discharge">Discharge</option>
                            <option value="normal">Normal</option>
                        </select>
                    </div>
                </div>

                {/* Feeding Information - 0-42 days */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Feeding Recommendations (0-42 days)
                        </label>
                        <textarea
                            name="feeding_recommendations"
                            value={formData.feeding_recommendations}
                            onChange={this.handleInputChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Feeding recommendations for newborn..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Breastfeeding Inability Reason
                        </label>
                        <textarea
                            name="breastfeeding_inability_reason"
                            value={formData.breastfeeding_inability_reason}
                            onChange={this.handleInputChange}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Reason for breastfeeding inability..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Exclusive Breastfeeding Description
                        </label>
                        <textarea
                            name="exclusive_breastfeeding_desc"
                            value={formData.exclusive_breastfeeding_desc}
                            onChange={this.handleInputChange}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Exclusive breastfeeding description..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Alternative Milk Description
                        </label>
                        <textarea
                            name="alternative_milk_desc"
                            value={formData.alternative_milk_desc}
                            onChange={this.handleInputChange}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Alternative milk description..."
                        />
                    </div>
                </div>

                {/* B: Ukuaji na maendeleo ya mtoto siku (>42) */}
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-green-700">B: Ukuaji na Maendeleo Ya Mtoto Siku (>42)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Child Age (months)
                        </label>
                        <input
                            type="number"
                            name="child_age_months"
                            value={formData.child_age_months}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 6"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Child Age (weeks)
                        </label>
                        <input
                            type="number"
                            name="child_age_weeks"
                            value={formData.child_age_weeks}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 24"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Child Weight (kg)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="child_weight"
                            value={formData.child_weight}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 7.5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Child Height (cm)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            name="child_height"
                            value={formData.child_height}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 65.2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Child Blood Hb (42+ days)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            name="child_blood_hb_42plus"
                            value={formData.child_blood_hb_42plus}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 11.8"
                        />
                    </div>
                </div>

                {/* Development and Feeding - 42+ days */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Communication Development
                        </label>
                        <textarea
                            name="communication_development"
                            value={formData.communication_development}
                            onChange={this.handleInputChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Communication development status..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Feeding Recommendations (42+ days)
                        </label>
                        <textarea
                            name="feeding_recommendations_42plus"
                            value={formData.feeding_recommendations_42plus}
                            onChange={this.handleInputChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Feeding recommendations for older infant..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Food Age Description
                        </label>
                        <input
                            type="text"
                            name="first_food_age_desc"
                            value={formData.first_food_age_desc}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., Started solids at 6 months"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Weaning Age Description
                        </label>
                        <input
                            type="text"
                            name="weaning_age_desc"
                            value={formData.weaning_age_desc}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., Weaning started at 12 months"
                        />
                    </div>
                </div>
            </div>
        );
    }

    // ==================== BREASTFEEDING PATIENT FIELDS ====================
    renderBreastfeedingSpecificFields() {
        const { formData } = this.state;
        return (
            <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-purple-800">🤱 Breastfeeding Patient Visit Information</h3>
                </div>

                {/* A: Rekodi ya mama */}
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-purple-700">A: Rekodi ya mama</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Postpartum Visit Type
                        </label>
                        <select
                            name="postpartum_visit_type"
                            value={formData.postpartum_visit_type}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Select Visit Type</option>
                            <option value="24h">24h</option>
                            <option value="2-3d">2-3d</option>
                            <option value="7-14d">7-14d</option>
                            <option value="42d">42d</option>
                        </select>
                    </div>
                </div>

                {/* B: Matiti na unyonyeshaji */}
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-purple-700">B: Matiti na unyonyeshaji</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Breastfeeding Advice
                        </label>
                        <textarea
                            name="breastfeeding_advice"
                            value={formData.breastfeeding_advice}
                            onChange={this.handleInputChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Breastfeeding advice and recommendations..."
                        />
                    </div>
                </div>

                {/* G: Lokia */}
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-purple-700">G: Lokia</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lochia Amount
                        </label>
                        <select
                            name="lochia_amount"
                            value={formData.lochia_amount}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Select Amount</option>
                            <option value="heavy">Heavy</option>
                            <option value="medium">Medium</option>
                            <option value="light">Light</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lochia Color
                        </label>
                        <input
                            type="text"
                            name="lochia_color"
                            value={formData.lochia_color}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g., Red, Pink, White"
                        />
                    </div>
                </div>

                {/* K: Dawa za Kinga */}
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-purple-700">K: Dawa za Kinga</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vaccination Information
                        </label>
                        <textarea
                            name="vaccination_info_bf"
                            value={formData.vaccination_info_bf}
                            onChange={this.handleInputChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Vaccination information and schedule..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Other Treatments
                        </label>
                        <textarea
                            name="other_treatments"
                            value={formData.other_treatments}
                            onChange={this.handleInputChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Other treatments and medications..."
                        />
                    </div>
                </div>

                {/* L: Rekodi Ya Mtoto */}
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-purple-700">L: Rekodi Ya Mtoto</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Baby Temperature (°C)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            name="baby_temperature"
                            value={formData.baby_temperature}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g., 36.8"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Breathing Rate (per minute)
                        </label>
                        <input
                            type="number"
                            name="breathing_rate"
                            value={formData.breathing_rate}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g., 40"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Umbilical Cord Condition
                        </label>
                        <select
                            name="umbilical_cord_condition"
                            value={formData.umbilical_cord_condition}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Select Condition</option>
                            <option value="clean">Clean</option>
                            <option value="infected">Infected</option>
                            <option value="bleeding">Bleeding</option>
                        </select>
                    </div>
                </div>

                {/* M: Mwisho - USING SAME PROVIDER FIELDS AS PREGNANT */}
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-purple-700">M: Mwisho</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Provider Name
                        </label>
                        <input
                            type="text"
                            name="provider_name"
                            value={formData.provider_name}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter provider name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Provider Position
                        </label>
                        <input
                            type="text"
                            name="provider_position"
                            value={formData.provider_position}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter provider position"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Provider Signature
                        </label>
                        <input
                            type="text"
                            name="provider_signature"
                            value={formData.provider_signature}
                            onChange={this.handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter provider signature"
                        />
                    </div>
                </div>

                {/* Checkboxes for Breastfeeding */}
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-purple-700">✅ Breastfeeding Checks</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="breastfeeding_status"
                            checked={formData.breastfeeding_status}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Breastfeeding established
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="milk_flow"
                            checked={formData.milk_flow}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Good milk flow
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="baby_breastfeeding"
                            checked={formData.baby_breastfeeding}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Baby breastfeeding well
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="mother_temperature_high"
                            checked={formData.mother_temperature_high}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Mother temperature high
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="high_blood_pressure"
                            checked={formData.high_blood_pressure}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            High blood pressure
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="low_blood_hb"
                            checked={formData.low_blood_hb}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Low blood Hb
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="pmtct_breastfeeding"
                            checked={formData.pmtct_breastfeeding}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            PMTCT breastfeeding
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="alternative_milk_bf"
                            checked={formData.alternative_milk_bf}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Alternative milk
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="breastfeeding_start_time"
                            checked={formData.breastfeeding_start_time}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Breastfeeding start time
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="breast_sores"
                            checked={formData.breast_sores}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Breast sores
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="breast_engorgement"
                            checked={formData.breast_engorgement}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Breast engorgement
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="breast_abscess"
                            checked={formData.breast_abscess}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Breast abscess
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="uterine_involution"
                            checked={formData.uterine_involution}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Uterine involution
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="severe_pain"
                            checked={formData.severe_pain}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Severe pain
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="episiotomy_status"
                            checked={formData.episiotomy_status}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Episiotomy status
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="wound_itchy"
                            checked={formData.wound_itchy}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Wound itchy
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="episiotomy_done"
                            checked={formData.episiotomy_done}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Episiotomy done
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="wound_healed"
                            checked={formData.wound_healed}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Wound healed
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="wound_discharge"
                            checked={formData.wound_discharge}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Wound discharge
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="wound_open"
                            checked={formData.wound_open}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Wound open
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="lochia_smell"
                            checked={formData.lochia_smell}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Lochia smell
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="heavy_bleeding"
                            checked={formData.heavy_bleeding}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Heavy bleeding
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="mental_illness"
                            checked={formData.mental_illness}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Mental illness
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="family_planning_given"
                            checked={formData.family_planning_given}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Family planning given
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="iron_supplements_bf"
                            checked={formData.iron_supplements_bf}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Iron supplements
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="folic_acid_bf"
                            checked={formData.folic_acid_bf}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Folic acid
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="iron_folic_combo_bf"
                            checked={formData.iron_folic_combo_bf}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Iron/Folic combo
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="pmtct_treatment"
                            checked={formData.pmtct_treatment}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            PMTCT treatment
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="postpartum_medication"
                            checked={formData.postpartum_medication}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Postpartum medication
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="vitamin_a_given"
                            checked={formData.vitamin_a_given}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Vitamin A given
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="hiv_test_6weeks"
                            checked={formData.hiv_test_6weeks}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            HIV test at 6 weeks
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="jaundice_status"
                            checked={formData.jaundice_status}
                            onChange={this.handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Jaundice present
                        </label>
                    </div>
                </div>
            </div>
        );
    }

    // ==================== MAIN RENDER METHOD ====================
    render() {
        const { loading, selectedPatient } = this.state;

        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Create New Visit</h2>
                            <p className="text-gray-600 mt-2">
                                Fill in the visit details below. Fields marked with * are required.
                            </p>
                        </div>

                        <form onSubmit={this.handleSubmit} className="space-y-8">
                            {/* Basic Information */}
                            {this.renderBasicInfoFields()}

                            {/* Patient Details */}
                            {this.renderPatientDetails()}

                            {/* Conditionally render patient type specific fields */}
                            {selectedPatient && selectedPatient.patient_type === 'pregnant' && (
                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                    {this.renderPregnancySpecificFields()}
                                </div>
                            )}

                            {selectedPatient && selectedPatient.patient_type === 'child' && (
                                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                    {this.renderChildSpecificFields()}
                                </div>
                            )}

                            {selectedPatient && selectedPatient.patient_type === 'breastfeeding' && (
                                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                                    {this.renderBreastfeedingSpecificFields()}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => this.props.history.push('/visits')}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {loading ? 'Creating Visit...' : 'Create Visit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateVisit;