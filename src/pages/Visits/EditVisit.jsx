import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditVisit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        patient_id: '',
        doctor_id: '',
        visit_date: '',
        visit_type: '',
        notes: '',
        // Add other fields as needed
    });
    
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [patientVisits, setPatientVisits] = useState([]);
    const [activeSection, setActiveSection] = useState('common');

    useEffect(() => {
        fetchVisitData();
    }, [id]);

    const fetchVisitData = async () => {
        try {
            const [visitRes, patientsRes, doctorsRes] = await Promise.all([
                axios.get(`/api/visits/${id}`),
                axios.get('/api/patients'),
                axios.get('/api/doctors')
            ]);

            const visitData = visitRes.data.data;
            
            // Update form data with existing visit data
            setFormData(prevData => ({
                ...prevData,
                ...visitData
            }));

            setPatients(patientsRes.data.data || []);
            setDoctors(doctorsRes.data.data || []);
            setSelectedPatient(visitData.patient);

            // Fetch patient visits
            if (visitData.patient) {
                fetchPatientDetails(visitData.patient.id);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error loading visit data');
        }
    };

    const fetchPatientDetails = async (patientId) => {
        try {
            const visitsRes = await axios.get(`/api/visits/patient/${patientId}`);
            setPatientVisits(visitsRes.data.data?.visits || []);
        } catch (error) {
            console.error('Error fetching patient details:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.patient_id) newErrors.patient_id = 'Patient is required';
        if (!formData.doctor_id) newErrors.doctor_id = 'Doctor is required';
        if (!formData.visit_date) newErrors.visit_date = 'Visit date is required';
        if (!formData.visit_type) newErrors.visit_type = 'Visit type is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            await axios.put(`/api/visits/${id}`, formData);
            alert('Visit updated successfully!');
            navigate('/visits');
        } catch (error) {
            console.error('Error updating visit:', error);
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
                alert('Please check the form for errors');
            } else {
                alert('Error updating visit. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const renderPatientDetails = () => {
        if (!selectedPatient) return null;

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
                            📊 All Visits ({patientVisits.length})
                        </h4>
                        <div className="bg-white rounded-lg border border-green-200 max-h-32 overflow-y-auto">
                            {patientVisits.map((visit, index) => (
                                <div key={visit.id} className={`p-3 border-b border-green-100 last:border-b-0 ${
                                    visit.id == id ? 'bg-blue-50' : ''
                                }`}>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium">
                                            {new Date(visit.visit_date).toLocaleDateString()}
                                        </span>
                                        <span className="text-gray-600">{visit.visit_type}</span>
                                        <span className="font-semibold">
                                            {visit.weight ? `${visit.weight} kg` : 'No weight'}
                                        </span>
                                        {visit.id == id && (
                                            <span className="text-blue-600 text-xs">Current</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderCommonFields = () => {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Patient *
                        </label>
                        <select
                            name="patient_id"
                            value={formData.patient_id}
                            onChange={handleInputChange}
                            disabled
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 ${
                                errors.patient_id ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select Patient</option>
                            {patients.map(patient => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.first_name} {patient.last_name} ({patient.patient_type})
                                </option>
                            ))}
                        </select>
                        {errors.patient_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.patient_id}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Doctor *
                        </label>
                        <select
                            name="doctor_id"
                            value={formData.doctor_id}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.doctor_id ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.first_name} {doctor.last_name}
                                </option>
                            ))}
                        </select>
                        {errors.doctor_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.doctor_id}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Visit Date *
                        </label>
                        <input
                            type="date"
                            name="visit_date"
                            value={formData.visit_date}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.visit_date ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.visit_date && (
                            <p className="text-red-500 text-sm mt-1">{errors.visit_date}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Visit Type *
                        </label>
                        <select
                            name="visit_type"
                            value={formData.visit_type}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.visit_type ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="routine">Routine Checkup</option>
                            <option value="emergency">Emergency</option>
                            <option value="followup">Follow-up</option>
                            <option value="vaccination">Vaccination</option>
                        </select>
                        {errors.visit_type && (
                            <p className="text-red-500 text-sm mt-1">{errors.visit_type}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                    </label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Additional notes about this visit..."
                    />
                </div>
            </div>
        );
    };

    const renderNavigation = () => {
        const sections = [
            { id: 'common', name: 'Common Information', icon: '📋' }
        ];

        if (selectedPatient) {
            if (selectedPatient.patient_type === 'pregnant') {
                sections.push({ id: 'pregnancy', name: 'Pregnancy Details', icon: '🤰' });
            } else if (selectedPatient.patient_type === 'child') {
                sections.push({ id: 'child', name: 'Child Details', icon: '👶' });
            } else if (selectedPatient.patient_type === 'breastfeeding') {
                sections.push({ id: 'breastfeeding', name: 'Breastfeeding Details', icon: '🍼' });
            }
        }

        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <nav className="flex space-x-4 overflow-x-auto">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => handleSectionChange(section.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition duration-200 ${
                                activeSection === section.id
                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                            <span className="mr-2">{section.icon}</span>
                            {section.name}
                        </button>
                    ))}
                </nav>
            </div>
        );
    };

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'common':
                return renderCommonFields();
            // Add other sections as needed
            default:
                return renderCommonFields();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Edit Visit</h1>
                        <p className="text-gray-600 mt-2">Update the visit details</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg border border-gray-200">
                        <div className="p-6">
                            {renderPatientDetails()}
                            {renderNavigation()}
                            {renderActiveSection()}
                        </div>

                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 px-6 pb-6">
                            <button
                                type="button"
                                onClick={() => navigate('/visits')}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Update Visit
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditVisit;