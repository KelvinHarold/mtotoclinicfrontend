import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';

const VisitDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [visit, setVisit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVisitDetail();
    }, [id]);

    const fetchVisitDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(`/visits/${id}`);
            setVisit(response.data.data);
        } catch (error) {
            console.error('Error fetching visit details:', error);
            setError('Failed to load visit details');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        navigate(`/visits/${id}/edit`);
    };

    const handleBack = () => {
        navigate('/visits');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderBooleanValue = (value) => {
        return value ? '✅ Yes' : '❌ No';
    };

    const renderPregnancyFields = () => {
        if (!visit) return null;
        
        return (
            <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-blue-800">🤰 Pregnancy Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visit.weight && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Weight</label>
                            <p className="text-sm text-gray-900">{visit.weight} kg</p>
                        </div>
                    )}
                    {visit.muac_circumference && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">MUAC</label>
                            <p className="text-sm text-gray-900">{visit.muac_circumference} cm</p>
                        </div>
                    )}
                    {visit.blood_hb && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Blood Hb</label>
                            <p className="text-sm text-gray-900">{visit.blood_hb} g/dL</p>
                        </div>
                    )}
                    {visit.gestational_age_weeks && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gestational Age</label>
                            <p className="text-sm text-gray-900">{visit.gestational_age_weeks} weeks</p>
                        </div>
                    )}
                    {visit.uterine_height && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Uterine Height</label>
                            <p className="text-sm text-gray-900">{visit.uterine_height} cm</p>
                        </div>
                    )}
                    {visit.fetal_heart_rate && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fetal Heart Rate</label>
                            <p className="text-sm text-gray-900">{visit.fetal_heart_rate} bpm</p>
                        </div>
                    )}
                </div>

                {/* Boolean checks for pregnancy */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="flex items-center">
                        {renderBooleanValue(visit.fetal_movement)}
                        <span className="ml-2 text-sm text-gray-700">Fetal Movement</span>
                    </div>
                    <div className="flex items-center">
                        {renderBooleanValue(visit.ultrasound_done)}
                        <span className="ml-2 text-sm text-gray-700">Ultrasound Done</span>
                    </div>
                    <div className="flex items-center">
                        {renderBooleanValue(visit.iron_folic_acid_combo)}
                        <span className="ml-2 text-sm text-gray-700">Iron/Folic Combo</span>
                    </div>
                    <div className="flex items-center">
                        {renderBooleanValue(visit.malaria_medication)}
                        <span className="ml-2 text-sm text-gray-700">Malaria Medication</span>
                    </div>
                </div>

                {/* Advice sections */}
                {visit.danger_signs_advice && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Danger Signs Advice</label>
                        <p className="text-sm text-gray-900 mt-1 bg-yellow-50 p-3 rounded">{visit.danger_signs_advice}</p>
                    </div>
                )}

                {visit.nutrition_advice && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nutrition Advice</label>
                        <p className="text-sm text-gray-900 mt-1 bg-green-50 p-3 rounded">{visit.nutrition_advice}</p>
                    </div>
                )}
            </div>
        );
    };

    const renderChildFields = () => {
        if (!visit) return null;
        
        return (
            <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-green-800">👶 Child Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visit.child_age_days && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Age (Days)</label>
                            <p className="text-sm text-gray-900">{visit.child_age_days} days</p>
                        </div>
                    )}
                    {visit.child_age_months && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Age (Months)</label>
                            <p className="text-sm text-gray-900">{visit.child_age_months} months</p>
                        </div>
                    )}
                    {visit.child_weight && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Weight</label>
                            <p className="text-sm text-gray-900">{visit.child_weight} kg</p>
                        </div>
                    )}
                    {visit.child_height && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Height</label>
                            <p className="text-sm text-gray-900">{visit.child_height} cm</p>
                        </div>
                    )}
                    {visit.child_temperature && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Temperature</label>
                            <p className="text-sm text-gray-900">{visit.child_temperature} °C</p>
                        </div>
                    )}
                    {visit.child_blood_hb && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Blood Hb</label>
                            <p className="text-sm text-gray-900">{visit.child_blood_hb} g/dL</p>
                        </div>
                    )}
                </div>

                {visit.communication_development && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Communication Development</label>
                        <p className="text-sm text-gray-900 mt-1 bg-blue-50 p-3 rounded">{visit.communication_development}</p>
                    </div>
                )}
            </div>
        );
    };

    const renderBreastfeedingFields = () => {
        if (!visit) return null;
        
        return (
            <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-purple-800">🤱 Breastfeeding Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visit.postpartum_visit_type && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Postpartum Visit Type</label>
                            <p className="text-sm text-gray-900">{visit.postpartum_visit_type}</p>
                        </div>
                    )}
                    {visit.baby_temperature && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Baby Temperature</label>
                            <p className="text-sm text-gray-900">{visit.baby_temperature} °C</p>
                        </div>
                    )}
                    {visit.breathing_rate && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Breathing Rate</label>
                            <p className="text-sm text-gray-900">{visit.breathing_rate} /min</p>
                        </div>
                    )}
                </div>

                {/* Boolean checks for breastfeeding */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="flex items-center">
                        {renderBooleanValue(visit.breastfeeding_status)}
                        <span className="ml-2 text-sm text-gray-700">Breastfeeding Established</span>
                    </div>
                    <div className="flex items-center">
                        {renderBooleanValue(visit.milk_flow)}
                        <span className="ml-2 text-sm text-gray-700">Good Milk Flow</span>
                    </div>
                    <div className="flex items-center">
                        {renderBooleanValue(visit.baby_breastfeeding)}
                        <span className="ml-2 text-sm text-gray-700">Baby Breastfeeding Well</span>
                    </div>
                </div>

                {visit.breastfeeding_advice && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Breastfeeding Advice</label>
                        <p className="text-sm text-gray-900 mt-1 bg-purple-50 p-3 rounded">{visit.breastfeeding_advice}</p>
                    </div>
                )}
            </div>
        );
    };

    const renderPatientTypeSpecificFields = () => {
        if (!visit) return null;

        const patientType = visit.patient?.patient_type;

        switch (patientType) {
            case 'pregnant':
                return renderPregnancyFields();
            case 'child':
                return renderChildFields();
            case 'breastfeeding':
                return renderBreastfeedingFields();
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading visit details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <div className="text-red-500 text-6xl mb-4">❌</div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Error Loading Visit</h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button
                            onClick={handleBack}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Back to Visits
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!visit) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <div className="text-gray-400 text-6xl mb-4">📋</div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Visit Not Found</h3>
                        <p className="text-gray-500 mb-4">The visit you're looking for doesn't exist.</p>
                        <button
                            onClick={handleBack}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Back to Visits
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Visit Details</h2>
                                <p className="text-blue-100 mt-1">
                                    {formatDate(visit.visit_date)}
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleBack}
                                    className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleEdit}
                                    className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
                                >
                                    Edit Visit
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Basic Information */}
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Patient</label>
                                    <p className="text-sm text-gray-900 mt-1 font-semibold">
                                        {visit.patient?.first_name} {visit.patient?.last_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {visit.patient?.phone_number} • {visit.patient?.patient_type}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Visit Type</label>
                                    <p className="text-sm text-gray-900 mt-1 capitalize">{visit.visit_type}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Doctor</label>
                                    <p className="text-sm text-gray-900 mt-1">{visit.doctor?.first_name} {visit.doctor?.last_name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Visit Date</label>
                                    <p className="text-sm text-gray-900 mt-1">{formatDate(visit.visit_date)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Patient Type Specific Information */}
                        {renderPatientTypeSpecificFields()}

                        {/* Notes */}
                        {visit.notes && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes</h3>
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{visit.notes}</p>
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Metadata</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <label className="font-medium text-gray-700">Created</label>
                                    <p className="text-gray-600">
                                        {new Date(visit.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="font-medium text-gray-700">Last Updated</label>
                                    <p className="text-gray-600">
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
};

export default VisitDetail;