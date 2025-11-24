import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';

class EditPatientVisit extends React.Component {
    state = {
        formData: {
            patient_id: '',
            visit_date: '',
            current_department: 'reception',
            status: 'waiting',
            visit_purpose: 'consultation',
            created_by: ''
        },
        patients: [],
        loading: false,
        initialLoading: true,
        errors: {},
        showPatientDetails: false,
        selectedPatient: null,
        originalData: null
    };

    componentDidMount() {
        this.fetchVisit();
        this.fetchPatients();
    }

    fetchVisit = async () => {
        try {
            const { id } = this.props.params; // CHANGED: from this.props.match.params to this.props.params
            const response = await axiosInstance.get(`/patient-visits/${id}`);
            const visit = response.data.data;
            
            this.setState({
                formData: {
                    patient_id: visit.patient_id || '',
                    visit_date: visit.visit_date ? new Date(visit.visit_date).toISOString().split('T')[0] : '',
                    current_department: visit.current_department || 'reception',
                    status: visit.status || 'waiting',
                    visit_purpose: visit.visit_purpose || 'consultation',
                    created_by: visit.created_by || ''
                },
                originalData: visit,
                initialLoading: false
            });

            // Set selected patient if patient data exists
            if (visit.patient) {
                this.setState({
                    selectedPatient: visit.patient,
                    showPatientDetails: true
                });
            }

        } catch (error) {
            console.error('Error fetching visit:', error);
            this.setState({
                error: 'Failed to load visit details',
                initialLoading: false
            });
        }
    };

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
            const { id } = this.props.params; // CHANGED: using params from props
            const response = await axiosInstance.put(`/patient-visits/${id}`, this.state.formData);
            
            alert('Visit updated successfully!');
            this.props.navigate(`/patient-visits/${id}`); // CHANGED: using navigate from props
        } catch (error) {
            console.error('Error updating visit:', error);
            
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                this.setState({ errors: validationErrors });
                
                let errorMessage = 'Please fix the following errors:\n\n';
                Object.keys(validationErrors).forEach(field => {
                    errorMessage += `• ${field}: ${validationErrors[field].join(', ')}\n`;
                });
                alert(errorMessage);
            } else if (error.response?.data?.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert('Error updating visit. Please try again.');
            }
        } finally {
            this.setState({ loading: false });
        }
    };

    handleCancel = () => {
        const { id } = this.props.params; // CHANGED: using params from props
        this.props.navigate(`/patient-visits/${id}`); // CHANGED: using navigate from props
    };

    handleReset = () => {
        if (this.state.originalData) {
            const visit = this.state.originalData;
            this.setState({
                formData: {
                    patient_id: visit.patient_id || '',
                    visit_date: visit.visit_date ? new Date(visit.visit_date).toISOString().split('T')[0] : '',
                    current_department: visit.current_department || 'reception',
                    status: visit.status || 'waiting',
                    visit_purpose: visit.visit_purpose || 'consultation',
                    created_by: visit.created_by || ''
                },
                errors: {}
            });

            // Reset selected patient
            if (visit.patient) {
                this.setState({
                    selectedPatient: visit.patient,
                    showPatientDetails: true
                });
            }
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

    renderStatusBadge(status) {
        const statusConfig = {
            waiting: { color: 'bg-yellow-100 text-yellow-800', label: 'Waiting' },
            in_progress: { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
            completed: { color: 'bg-green-100 text-green-800', label: 'Completed' }
        };
        
        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
        return (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
                {config.label}
            </span>
        );
    }

    renderDepartmentBadge(department) {
        const departmentConfig = {
            reception: { color: 'bg-purple-100 text-purple-800', label: 'Reception' },
            doctor: { color: 'bg-blue-100 text-blue-800', label: 'Doctor' },
            lab: { color: 'bg-orange-100 text-orange-800', label: 'Lab' },
            pharmacy: { color: 'bg-green-100 text-green-800', label: 'Pharmacy' },
            vaccination: { color: 'bg-teal-100 text-teal-800', label: 'Vaccination' },
            maternity: { color: 'bg-pink-100 text-pink-800', label: 'Maternity' }
        };
        
        const config = departmentConfig[department] || { color: 'bg-gray-100 text-gray-800', label: department };
        return (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
                {config.label}
            </span>
        );
    }

    render() {
        const { formData, loading, initialLoading, patients, errors, originalData } = this.state;
        const { navigate } = this.props; // CHANGED: using navigate from props

        if (initialLoading) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading visit details...</p>
                    </div>
                </div>
            );
        }

        if (!originalData) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-4">❌</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Visit Not Found</h3>
                        <p className="text-gray-500 mb-4">The requested visit could not be found.</p>
                        <button
                            onClick={() => navigate('/patient-visits')} // CHANGED: using navigate
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Back to Visits
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Edit Patient Visit</h2>
                                    <p className="text-gray-600 mt-2">
                                        Editing visit record from {new Date(originalData.visit_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    {this.renderStatusBadge(originalData.status)}
                                    {this.renderDepartmentBadge(originalData.current_department)}
                                </div>
                            </div>
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
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.patient_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
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
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.visit_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
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
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.current_department ? 'border-red-500 bg-red-50' : 'border-gray-300'
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
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.visit_purpose ? 'border-red-500 bg-red-50' : 'border-gray-300'
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

                                    {/* Created By (Read-only) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Created By
                                        </label>
                                        <input
                                            type="text"
                                            value={originalData.created_by?.name || 'System'}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            This field cannot be changed
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Patient Details */}
                            {this.renderPatientDetails()}

                            {/* Original Data Info */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                    📊 Original Visit Information
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <label className="text-gray-600">Original Date:</label>
                                        <p>{new Date(originalData.visit_date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <label className="text-gray-600">Original Department:</label>
                                        <p className="capitalize">{originalData.current_department}</p>
                                    </div>
                                    <div>
                                        <label className="text-gray-600">Original Status:</label>
                                        <p className="capitalize">{originalData.status}</p>
                                    </div>
                                    <div>
                                        <label className="text-gray-600">Original Purpose:</label>
                                        <p className="capitalize">{originalData.visit_purpose}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-between pt-6 border-t border-gray-200">
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={this.handleReset}
                                        className="px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        Reset Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={this.handleCancel}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/patient-visits/${originalData.id}`)} // CHANGED: using navigate
                                        className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            loading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {loading ? 'Updating Visit...' : 'Update Visit'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

// Wrapper component to use hooks with class component
function EditPatientVisitWrapper() {
    const params = useParams();
    const navigate = useNavigate();
    
    return <EditPatientVisit params={params} navigate={navigate} />;
}

export default EditPatientVisitWrapper;