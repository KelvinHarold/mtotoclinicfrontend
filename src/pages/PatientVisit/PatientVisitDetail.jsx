import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';

class PatientVisitDetail extends React.Component {
    state = {
        visit: null,
        loading: true,
        error: null
    };

    componentDidMount() {
        this.fetchVisit();
    }

    fetchVisit = async () => {
        try {
            const { id } = this.props.params; // CHANGED: from this.props.match.params to this.props.params
            const response = await axiosInstance.get(`/patient-visits/${id}`);
            
            this.setState({
                visit: response.data.data,
                loading: false
            });
        } catch (error) {
            console.error('Error fetching visit:', error);
            this.setState({
                error: 'Failed to load visit details',
                loading: false
            });
        }
    };

    getStatusBadge = (status) => {
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
    };

    getDepartmentBadge = (department) => {
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
    };

    render() {
        const { visit, loading, error } = this.state;
        const { navigate } = this.props; // CHANGED: using navigate from props

        if (loading) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading visit details...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-4">❌</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Visit</h3>
                        <p className="text-gray-500 mb-4">{error}</p>
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

        if (!visit) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
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
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Visit Details</h2>
                            <p className="text-gray-600 mt-2">
                                Viewing visit record from {new Date(visit.visit_date).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => navigate(`/patient-visits/${visit.id}/edit`)} // CHANGED: using navigate
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Edit Visit
                            </button>
                            <button
                                onClick={() => navigate('/patient-visits')} // CHANGED: using navigate
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Back to List
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Visit Summary Card */}
                        <div className="bg-blue-50 px-6 py-4 border-b border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-800">
                                        Visit Summary
                                    </h3>
                                    <p className="text-blue-600">
                                        ID: {visit.id} • Created: {new Date(visit.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    {this.getStatusBadge(visit.status)}
                                    {this.getDepartmentBadge(visit.current_department)}
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Patient Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                                        👤 Patient Information
                                    </h4>
                                    {visit.patient ? (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Name</label>
                                                <p className="text-gray-900 font-medium">
                                                    {visit.patient.first_name} {visit.patient.last_name}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Patient Type</label>
                                                <p className="text-gray-900 capitalize">{visit.patient.patient_type}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                                                <p className="text-gray-900">{visit.patient.date_of_birth || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Phone</label>
                                                <p className="text-gray-900">{visit.patient.phone_number || 'Not specified'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">Patient information not available</p>
                                    )}
                                </div>

                                {/* Visit Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                                        📝 Visit Information
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Visit Date</label>
                                            <p className="text-gray-900">
                                                {new Date(visit.visit_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Current Department</label>
                                            <div className="mt-1">
                                                {this.getDepartmentBadge(visit.current_department)}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Status</label>
                                            <div className="mt-1">
                                                {this.getStatusBadge(visit.status)}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Visit Purpose</label>
                                            <p className="text-gray-900 capitalize">{visit.visit_purpose}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Created By</label>
                                            <p className="text-gray-900">{visit.created_by?.name || 'System'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Visit Routings */}
                            {visit.visit_routings && visit.visit_routings.length > 0 && (
                                <div className="mt-8">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                                        🚶 Visit Routing History
                                    </h4>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="space-y-3">
                                            {visit.visit_routings.map((routing, index) => (
                                                <div key={routing.id} className="flex items-center justify-between p-3 bg-white rounded border">
                                                    <div>
                                                        <span className="font-medium text-gray-700">
                                                            {routing.department}
                                                        </span>
                                                        <span className="text-sm text-gray-500 ml-2">
                                                            ({routing.status})
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(routing.created_at).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                    ⏰ Timestamps
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <label className="font-medium text-gray-600">Created At</label>
                                        <p className="text-gray-900">
                                            {new Date(visit.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="font-medium text-gray-600">Updated At</label>
                                        <p className="text-gray-900">
                                            {new Date(visit.updated_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// Wrapper component to use hooks with class component
function PatientVisitDetailWrapper() {
    const params = useParams();
    const navigate = useNavigate();
    
    return <PatientVisitDetail params={params} navigate={navigate} />;
}

export default PatientVisitDetailWrapper;