import React from 'react';
import axiosInstance from '../../api/axios';

class CreatePatientVisit extends React.Component {
    state = {
        formData: {
            patient_id: '',
            visit_date: new Date().toISOString().split('T')[0],
            current_department: 'reception',
            status: 'waiting',
            visit_purpose: 'consultation',
            created_by: ''
        },
        patients: [],
        loading: false,
        errors: {},
        showPatientDetails: false,
        selectedPatient: null
    };

    componentDidMount() {
        this.fetchPatients();
        this.setCurrentUser();
    }

    fetchPatients = async () => {
        try {
            const response = await axiosInstance.get('/patients');
            const patientsData = response.data.data?.data || response.data.data || [];

            this.setState({ patients: patientsData });
        } catch (error) {
            console.error('Error fetching patients:', error);
            this.setState({ patients: [] });
        }
    };

    setCurrentUser = () => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                const currentUser = JSON.parse(userData);
                if (currentUser && currentUser.id) {
                    this.setState(prevState => ({
                        formData: {
                            ...prevState.formData,
                            created_by: currentUser.id
                        }
                    }));
                }
            }
        } catch (error) {
            console.error('Error setting current user:', error);
        }
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [name]: value
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

    handlePatientSelection = (patientId) => {
        if (!patientId) {
            this.setState({
                selectedPatient: null,
                showPatientDetails: false
            });
            return;
        }

        const selectedPatient = this.state.patients.find(patient => patient.id == patientId);
        this.setState({
            selectedPatient,
            showPatientDetails: !!selectedPatient
        });
    };

    validateForm = () => {
        const errors = {};
        const { formData } = this.state;

        if (!formData.patient_id) errors.patient_id = 'Patient is required';
        if (!formData.visit_date) errors.visit_date = 'Visit date is required';
        if (!formData.current_department) errors.current_department = 'Department is required';
        if (!formData.visit_purpose) errors.visit_purpose = 'Visit purpose is required';
        if (!formData.created_by) errors.created_by = 'Creator is required';

        this.setState({ errors });
        return Object.keys(errors).length === 0;
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        if (!this.validateForm()) {
            alert('Please fill in all required fields');
            return;
        }

        this.setState({ loading: true });

        try {
            const response = await axiosInstance.post('/patient-visits', this.state.formData);

            alert('Visit created successfully!');
            // Use navigate instead of history.push
            this.props.navigate('/patient-visits');
        } catch (error) {
            // ... your existing error handling ...
        } finally {
            this.setState({ loading: false });
        }
    };

    renderFieldError = (fieldName) => {
        const { errors } = this.state;
        if (errors && errors[fieldName]) {
            return (
                <div className="text-red-500 text-sm mt-1 bg-red-50 p-2 rounded border border-red-200">
                    <strong>Error:</strong> {Array.isArray(errors[fieldName]) ? errors[fieldName].join(', ') : errors[fieldName]}
                </div>
            );
        }
        return null;
    };

    renderPatientDetails() {
        const { selectedPatient, showPatientDetails } = this.state;

        if (!showPatientDetails || !selectedPatient) return null;

        return (
            <div className="mb-6 p-4 border border-green-300 rounded-lg bg-green-50">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                    📋 Patient Details: {selectedPatient.first_name} {selectedPatient.last_name}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            </div>
        );
    }

    render() {
        const { formData, loading, patients, errors } = this.state;

        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Create New Patient Visit</h2>
                            <p className="text-gray-600 mt-2">
                                Create a new visit record for a patient
                            </p>
                        </div>

                        <form onSubmit={this.handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="space-y-6">
                                <div className="border-b border-gray-200 pb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">📝 Basic Visit Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Patient Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Patient *
                                        </label>
                                        <select
                                            name="patient_id"
                                            value={formData.patient_id}
                                            onChange={this.handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.patient_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                        >
                                            <option value="">Select Patient</option>
                                            {patients.map(patient => (
                                                <option key={patient.id} value={patient.id}>
                                                    {patient.first_name} {patient.last_name} ({patient.patient_type})
                                                </option>
                                            ))}
                                        </select>
                                        {this.renderFieldError('patient_id')}
                                    </div>

                                    {/* Visit Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Visit Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="visit_date"
                                            value={formData.visit_date}
                                            onChange={this.handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.visit_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                        />
                                        {this.renderFieldError('visit_date')}
                                    </div>

                                    {/* Current Department */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Department *
                                        </label>
                                        <select
                                            name="current_department"
                                            value={formData.current_department}
                                            onChange={this.handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.current_department ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                        >
                                            <option value="reception">Reception</option>
                                            <option value="doctor">Doctor</option>
                                            <option value="lab">Lab</option>
                                            <option value="pharmacy">Pharmacy</option>
                                            <option value="vaccination">Vaccination</option>
                                            <option value="maternity">Maternity</option>
                                        </select>
                                        {this.renderFieldError('current_department')}
                                    </div>

                                    {/* Visit Purpose */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Visit Purpose *
                                        </label>
                                        <select
                                            name="visit_purpose"
                                            value={formData.visit_purpose}
                                            onChange={this.handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.visit_purpose ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                        >
                                            <option value="consultation">Consultation</option>
                                            <option value="checkup">Checkup</option>
                                            <option value="clinic">Clinic</option>
                                        </select>
                                        {this.renderFieldError('visit_purpose')}
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={this.handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="waiting">Waiting</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>

                                    {/* Created By (Auto-filled) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Created By (Automatically assigned)
                                        </label>
                                        <input
                                            type="text"
                                            value="Current User (You)"
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                                        />
                                        {this.renderFieldError('created_by')}
                                    </div>
                                </div>
                            </div>

                            {/* Patient Details */}
                            {this.renderPatientDetails()}

                            {/* Submit Buttons */}
                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => this.props.navigate('/patient-visits')}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''
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

export default CreatePatientVisit;