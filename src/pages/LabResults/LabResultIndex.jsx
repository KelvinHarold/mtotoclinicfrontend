import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaFlask, FaSearch, FaChevronDown, FaChevronUp, FaCalendarAlt, FaUser, FaStethoscope } from 'react-icons/fa';
import api from '../../api/axios';

const LabResultIndex = () => {
  const navigate = useNavigate();
  const [labResults, setLabResults] = useState([]);
  const [groupedResults, setGroupedResults] = useState({});
  const [expandedDates, setExpandedDates] = useState(new Set());
  const [expandedPatients, setExpandedPatients] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, labResultId: null });

  useEffect(() => {
    fetchLabResults();
  }, []);

  // Group results by date and then by patient
  useEffect(() => {
    if (labResults.length > 0) {
      const grouped = labResults.reduce((acc, result) => {
        const date = new Date(result.lab_test?.test_date).toISOString().split('T')[0];
        const patientId = result.lab_test?.patient_id;
        
        if (!date || !patientId) return acc;
        
        if (!acc[date]) {
          acc[date] = {};
        }
        
        if (!acc[date][patientId]) {
          acc[date][patientId] = {
            patient: result.lab_test?.patient,
            results: []
          };
        }
        
        acc[date][patientId].results.push(result);
        return acc;
      }, {});

      // Sort dates in descending order and sort results within each patient
      const sortedGrouped = {};
      Object.keys(grouped)
        .sort((a, b) => new Date(b) - new Date(a))
        .forEach(date => {
          sortedGrouped[date] = {};
          Object.keys(grouped[date])
            .sort((a, b) => {
              const patientA = grouped[date][a].patient;
              const patientB = grouped[date][b].patient;
              const nameA = patientA ? `${patientA.first_name} ${patientA.last_name}`.toLowerCase() : '';
              const nameB = patientB ? `${patientB.first_name} ${patientB.last_name}`.toLowerCase() : '';
              return nameA.localeCompare(nameB);
            })
            .forEach(patientId => {
              sortedGrouped[date][patientId] = {
                ...grouped[date][patientId],
                results: grouped[date][patientId].results.sort((a, b) => 
                  new Date(b.created_at) - new Date(a.created_at)
                )
              };
            });
        });

      setGroupedResults(sortedGrouped);

      // Auto-expand the most recent date
      const mostRecentDate = Object.keys(sortedGrouped)[0];
      if (mostRecentDate && expandedDates.size === 0) {
        setExpandedDates(new Set([mostRecentDate]));
        
        // Also auto-expand first patient in the most recent date
        const firstPatientId = Object.keys(sortedGrouped[mostRecentDate])[0];
        if (firstPatientId) {
          setExpandedPatients(new Set([`${mostRecentDate}-${firstPatientId}`]));
        }
      }
    } else {
      setGroupedResults({});
    }
  }, [labResults]);

  const fetchLabResults = async () => {
    try {
      setLoading(true);
      const response = await api.get('/lab-results');
      if (response.data.success) {
        setLabResults(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch lab results');
      console.error('Error fetching lab results:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchLabResults();
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/lab-results/search/query?query=${searchTerm}`);
      if (response.data.success) {
        setLabResults(response.data.data);
      }
    } catch (err) {
      setError('Failed to search lab results');
      console.error('Error searching lab results:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (labResultId) => {
    try {
      await api.delete(`/lab-results/${labResultId}`);
      setLabResults(labResults.filter(result => result.id !== labResultId));
      setDeleteDialog({ open: false, labResultId: null });
    } catch (err) {
      setError('Failed to delete lab result');
      console.error('Error deleting lab result:', err);
    }
  };

  const openDeleteDialog = (labResultId) => {
    setDeleteDialog({ open: true, labResultId });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, labResultId: null });
  };

  const toggleDateGroup = (date) => {
    setExpandedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
        // Also collapse all patients in this date
        setExpandedPatients(prevPatients => {
          const newPatientSet = new Set(prevPatients);
          Object.keys(groupedResults[date] || {}).forEach(patientId => {
            newPatientSet.delete(`${date}-${patientId}`);
          });
          return newPatientSet;
        });
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  const togglePatientGroup = (date, patientId) => {
    const key = `${date}-${patientId}`;
    setExpandedPatients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const getPatientName = (patient) => {
    if (patient) {
      return `${patient.first_name} ${patient.last_name}`;
    }
    return 'Unknown Patient';
  };

  const getDoctorName = (labResult) => {
    if (labResult.doctor) {
      const doctor = labResult.doctor;
      return `${doctor.first_name} ${doctor.second_name ? doctor.second_name + ' ' : ''}${doctor.last_name}`;
    }
    return 'Unknown Doctor';
  };

  const getTestName = (labResult) => {
    return labResult.lab_test?.test_name || 'Unknown Test';
  };

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const getResultTime = (labResult) => {
    if (labResult.created_at) {
      return new Date(labResult.created_at).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    return '';
  };

  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getTotalResultsCount = () => {
    return Object.values(groupedResults).reduce((total, dateGroup) => {
      return total + Object.values(dateGroup).reduce((dateTotal, patientGroup) => {
        return dateTotal + patientGroup.results.length;
      }, 0);
    }, 0);
  };

  const getTotalPatientsCount = () => {
    return Object.values(groupedResults).reduce((total, dateGroup) => {
      return total + Object.keys(dateGroup).length;
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading lab results...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            <FaFlask className="inline mr-2 mb-1" />
            Lab Results
          </h1>
          {getTotalResultsCount() > 0 && (
            <p className="text-gray-600 mt-1">
              {getTotalResultsCount()} result(s) for {getTotalPatientsCount()} patient(s) across {Object.keys(groupedResults).length} date(s)
            </p>
          )}
        </div>
        <Link
          to="/lab-results/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
        >
          <FaPlus className="mr-2" />
          New Lab Result
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by test name, result, or interpretation..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition duration-200"
          >
            <FaSearch className="mr-2" />
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              fetchLabResults();
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Clear
          </button>
        </form>
      </div>

      {/* Grouped Results by Date and Patient */}
      <div className="space-y-4">
        {Object.keys(groupedResults).length > 0 ? (
          Object.entries(groupedResults).map(([date, patients]) => (
            <div key={date} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Date Header */}
              <div 
                className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition duration-200 border-b"
                onClick={() => toggleDateGroup(date)}
              >
                <div className="flex items-center space-x-3">
                  <FaCalendarAlt className="text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {getFormattedDate(date)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {Object.keys(patients).length} patient(s) •{' '}
                      {Object.values(patients).reduce((total, patient) => total + patient.results.length, 0)} result(s)
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {expandedDates.has(date) ? 'Hide' : 'Show'}
                  </span>
                  {expandedDates.has(date) ? (
                    <FaChevronUp className="text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </div>
              </div>

              {/* Patients List for this Date */}
              {expandedDates.has(date) && (
                <div className="divide-y divide-gray-200">
                  {Object.entries(patients).map(([patientId, patientData]) => {
                    const patientKey = `${date}-${patientId}`;
                    const isExpanded = expandedPatients.has(patientKey);
                    
                    return (
                      <div key={patientKey} className="bg-gray-50">
                        {/* Patient Header */}
                        <div 
                          className="flex justify-between items-center p-4 hover:bg-gray-100 cursor-pointer transition duration-200"
                          onClick={() => togglePatientGroup(date, patientId)}
                        >
                          <div className="flex items-center space-x-3">
                            <FaUser className="text-gray-400" />
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {getPatientName(patientData.patient)}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {patientData.results.length} result(s)
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {isExpanded ? 'Hide' : 'Show'}
                            </span>
                            {isExpanded ? (
                              <FaChevronUp className="text-gray-400" />
                            ) : (
                              <FaChevronDown className="text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Results List for this Patient */}
                        {isExpanded && (
                          <div className="bg-white overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Test Name
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Result
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Interpretation
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Doctor
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {patientData.results.map((labResult) => (
                                  <tr key={labResult.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-gray-900">
                                        {getTestName(labResult)}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="text-sm text-gray-900 max-w-xs">
                                        {truncateText(labResult.result, 60)}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="text-sm text-gray-500 max-w-xs">
                                        {labResult.interpretation ? truncateText(labResult.interpretation, 60) : 'No interpretation'}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900 flex items-center">
                                        <FaStethoscope className="mr-1" size={12} />
                                        {getDoctorName(labResult)}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {getResultTime(labResult)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                      <div className="flex space-x-2">
                                        <Link
                                          to={`/lab-results/${labResult.id}`}
                                          className="text-blue-600 hover:text-blue-900 transition duration-200 p-1 rounded hover:bg-blue-50"
                                          title="View Details"
                                        >
                                          <FaEye className="inline" />
                                        </Link>
                                        <Link
                                          to={`/lab-results/${labResult.id}/edit`}
                                          className="text-green-600 hover:text-green-900 transition duration-200 p-1 rounded hover:bg-green-50"
                                          title="Edit"
                                        >
                                          <FaEdit className="inline" />
                                        </Link>
                                        <button
                                          onClick={() => openDeleteDialog(labResult.id)}
                                          className="text-red-600 hover:text-red-900 transition duration-200 p-1 rounded hover:bg-red-50"
                                          title="Delete"
                                        >
                                          <FaTrash className="inline" />
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
                    );
                  })}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaFlask className="text-gray-400 text-5xl mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-4">No lab results found</div>
            <p className="text-gray-400 mb-6">Get started by creating your first lab result</p>
            <Link
              to="/lab-results/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center transition duration-200"
            >
              <FaPlus className="mr-2" />
              Create First Lab Result
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this lab result? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteDialog}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-200 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteDialog.labResultId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabResultIndex;