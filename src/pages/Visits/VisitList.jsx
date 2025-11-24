import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';

const VisitsList = () => {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchVisits();
    }, []);

    const fetchVisits = async () => {
        try {
            setLoading(true);
            setError('');
            
            console.log('Fetching visits...');
            const response = await axiosInstance.get('/visits');
            console.log('API Response:', response.data);
            
            if (response.data.success) {
                // Handle different data formats
                const responseData = response.data.data;
                
                if (Array.isArray(responseData)) {
                    setVisits(responseData);
                } else if (responseData && Array.isArray(responseData.data)) {
                    // Laravel pagination format
                    setVisits(responseData.data);
                } else if (responseData && typeof responseData === 'object') {
                    // Convert object to array if needed
                    setVisits(Object.values(responseData));
                } else {
                    console.warn('Unexpected data format:', responseData);
                    setVisits([]);
                }
            } else {
                throw new Error(response.data.message || 'Failed to fetch visits');
            }
        } catch (error) {
            console.error('Error fetching visits:', error);
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.message || 
                               error.message || 
                               'Failed to load visits';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getVisitTypeBadge = (type) => {
        const types = {
            routine: 'bg-blue-100 text-blue-800',
            emergency: 'bg-red-100 text-red-800',
            followup: 'bg-green-100 text-green-800',
            vaccination: 'bg-purple-100 text-purple-800'
        };
        return types[type] || 'bg-gray-100 text-gray-800';
    };

    const getPatientTypeBadge = (type) => {
        const types = {
            pregnant: 'bg-pink-100 text-pink-800',
            child: 'bg-green-100 text-green-800',
            breastfeeding: 'bg-purple-100 text-purple-800'
        };
        return types[type] || 'bg-gray-100 text-gray-800';
    };

    // Safe array check before mapping
    const visitsArray = Array.isArray(visits) ? visits : [];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading visits...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <div className="text-red-600 text-4xl mb-4">⚠️</div>
                        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Visits</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchVisits}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Patient Visits</h1>
                            <p className="text-gray-600 mt-2">
                                Manage and track all patient visits in the system
                            </p>
                        </div>
                        <Link
                            to="/visits/create"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            + Create New Visit
                        </Link>
                    </div>
                </div>

                {/* Visits Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {visitsArray.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">📋</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No visits found</h3>
                            <p className="text-gray-600 mb-4">
                                Get started by creating your first visit
                            </p>
                            <Link
                                to="/visits/create"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Visit
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Patient
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Visit Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {visitsArray.map((visit) => (
                                        <tr key={visit.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-600 font-semibold text-sm">
                                                            {visit.patient?.first_name?.charAt(0) || 'P'}
                                                            {visit.patient?.last_name?.charAt(0) || ''}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {visit.patient?.first_name} {visit.patient?.last_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {visit.patient?.phone_number || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                                {formatDate(visit.visit_date)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col space-y-1">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVisitTypeBadge(visit.visit_type)}`}>
                                                        {visit.visit_type || 'N/A'}
                                                    </span>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPatientTypeBadge(visit.patient?.patient_type)}`}>
                                                        {visit.patient?.patient_type || 'Unknown'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        to={`/visits/${visit.id}`}
                                                        className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        to={`/visits/${visit.id}/edit`}
                                                        className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-lg hover:bg-green-100 transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisitsList;