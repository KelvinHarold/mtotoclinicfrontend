import React from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';

class PatientVisitList extends React.Component {
    state = {
        visits: [],
        loading: true,
        pagination: {},
        search: ''
    };

    componentDidMount() {
        this.fetchVisits();
    }

    fetchVisits = async (page = 1) => {
        try {
            this.setState({ loading: true });
            
            const params = new URLSearchParams({
                page: page,
                search: this.state.search
            });

            const response = await axiosInstance.get(`/patient-visits?${params}`);
            const responseData = response.data.data;
            
            this.setState({
                visits: responseData.data || responseData,
                pagination: {
                    current_page: responseData.current_page,
                    last_page: responseData.last_page,
                    total: responseData.total
                },
                loading: false
            });
        } catch (error) {
            console.error('Error fetching visits:', error);
            this.setState({ loading: false, visits: [] });
        }
    };

    handleSearchChange = (e) => {
        this.setState({ search: e.target.value }, () => {
            setTimeout(() => this.fetchVisits(1), 500);
        });
    };

    handleDelete = async (visitId) => {
        if (window.confirm('Are you sure you want to delete this visit?')) {
            try {
                await axiosInstance.delete(`/patient-visits/${visitId}`);
                alert('Visit deleted successfully!');
                this.fetchVisits(this.state.pagination.current_page);
            } catch (error) {
                console.error('Error deleting visit:', error);
                alert('Error deleting visit');
            }
        }
    };

    handlePageChange = (page) => {
        this.fetchVisits(page);
    };

    getStatusBadge = (status) => {
        const statusConfig = {
            waiting: 'bg-yellow-100 text-yellow-800',
            in_progress: 'bg-blue-100 text-blue-800', 
            completed: 'bg-green-100 text-green-800'
        };
        
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[status] || 'bg-gray-100'}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    getDepartmentBadge = (department) => {
        const deptConfig = {
            reception: 'bg-purple-100 text-purple-800',
            doctor: 'bg-blue-100 text-blue-800',
            lab: 'bg-orange-100 text-orange-800',
            pharmacy: 'bg-green-100 text-green-800',
            vaccination: 'bg-teal-100 text-teal-800',
            maternity: 'bg-pink-100 text-pink-800'
        };
        
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${deptConfig[department] || 'bg-gray-100'}`}>
                {department}
            </span>
        );
    };

    render() {
        const { visits, loading, pagination, search } = this.state;

        if (loading) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading visits...</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Patient Visits</h2>
                            <p className="text-gray-600 mt-2">Manage patient visits</p>
                        </div>
                        <Link
                            to="/patient-visits/create"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                        >
                            + New Visit
                        </Link>
                    </div>

                    {/* Simple Search */}
                    <div className="bg-white p-4 rounded-lg shadow mb-6">
                        <div className="max-w-md">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Patients
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={this.handleSearchChange}
                                placeholder="Search by patient name or ID..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Results Count */}
                    {pagination.total !== undefined && (
                        <div className="mb-4 text-sm text-gray-600">
                            Showing {visits.length} of {pagination.total} visits
                        </div>
                    )}

                    {/* Visits Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {visits.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📋</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No visits found</h3>
                                <p className="text-gray-500 mb-4">
                                    {search ? 'Try adjusting your search' : 'No patient visits yet'}
                                </p>
                                <Link
                                    to="/patient-visits/create"
                                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Create First Visit
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Patient
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Visit Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Department
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {visits.map((visit) => (
                                            <tr key={visit.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <span className="text-blue-600 font-medium">
                                                                {visit.patient?.first_name?.charAt(0)}{visit.patient?.last_name?.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {visit.patient?.first_name} {visit.patient?.last_name}
                                                            </div>
                                                            
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(visit.visit_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {this.getDepartmentBadge(visit.current_department)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {this.getStatusBadge(visit.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-3">
                                                        <Link
                                                            to={`/patient-visits/${visit.id}`}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            to={`/patient-visits/${visit.id}/edit`}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => this.handleDelete(visit.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Simple Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-6">
                            <button
                                onClick={() => this.handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-gray-700">
                                Page {pagination.current_page} of {pagination.last_page}
                            </span>
                            <button
                                onClick={() => this.handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default PatientVisitList;