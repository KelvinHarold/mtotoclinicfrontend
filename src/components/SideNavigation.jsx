import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaUserFriends,
  FaUserShield,
  FaUserLock,
  FaKey,
  FaFemale,
  FaTimes,
  FaChild,
  FaBaby,
  FaCalendarAlt,
  FaStethoscope,
  FaExchangeAlt,
  FaFlask,
  FaFileMedical,
  FaPills,
  FaSyringe,
  FaUserPlus // Icon mpya kwa Patient Register
} from 'react-icons/fa';

const SideNavigation = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [patientsOpen, setPatientsOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const isAdmin = user?.roles?.some(role => role.name === 'admin');

  if (!user) {
    return null;
  }

  const navItemClasses = "flex items-center p-3 text-gray-700 rounded-lg transition-colors duration-200";
  const activeNavItemClasses = "bg-green-50 text-green-700 border-r-2 border-green-600";
  const hoverNavItemClasses = "hover:bg-gray-50 hover:text-gray-900";

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      onClose?.();
    }
  };

  return (
    <nav className="w-64 bg-white shadow-sm border-r border-gray-200 flex-shrink-0 flex flex-col h-full">
      <div className="md:hidden flex justify-end p-4 border-b border-gray-200">
        <button
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FaTimes className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="p-4 md:p-6 flex-1">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 md:mb-6">Navigation</h2>

        <ul className="space-y-1 md:space-y-2">
          {isAdmin && (
            <>
              <li>
                <NavLink
                  to="/dashboards/admin"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaTachometerAlt className="mr-3 text-gray-500 w-5 h-5" />
                  <span>Dashboard</span>
                </NavLink>
              </li>

              {/* PATIENTS DROPDOWN */}
              <li>
                <button
                  onClick={() => setPatientsOpen(prev => !prev)}
                  className={`${navItemClasses} ${hoverNavItemClasses} w-full flex justify-between items-center`}
                >
                  <div className="flex items-center">
                    <FaUsers className="mr-3 text-blue-500 w-5 h-5" />
                    <span>Patients</span>
                  </div>
                  <span>{patientsOpen ? "▲" : "▼"}</span>
                </button>

                {patientsOpen && (
                  <ul className="ml-10 mt-2 space-y-1">
                   
                    <li>
                      <NavLink
                        to="/patients"
                        end
                        className={({ isActive }) =>
                          `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                        }
                        onClick={handleNavClick}
                      >
                        <FaUsers className="mr-2 text-blue-500 w-4 h-4" />
                        All Patients
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/patients/pregnant-women"
                        end
                        className={({ isActive }) =>
                          `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                        }
                        onClick={handleNavClick}
                      >
                        <FaFemale className="mr-2 text-pink-500 w-4 h-4" />
                        Pregnant Women
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/patients/breastfeeding-women"
                        end
                        className={({ isActive }) =>
                          `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                        }
                        onClick={handleNavClick}
                      >
                        <FaChild className="mr-2 text-blue-400 w-4 h-4" />
                        Breastfeeding Women
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/patients/children"
                        end
                        className={({ isActive }) =>
                          `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                        }
                        onClick={handleNavClick}
                      >
                        <FaBaby className="mr-2 text-purple-500 w-4 h-4" />
                        Children
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Other Admin links unchanged */}
              <li>
                <NavLink
                  to="/patient-visits"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaStethoscope className="mr-3 text-teal-500 w-5 h-5" />
                  <span>Patient Visits</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/visit-routings"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaExchangeAlt className="mr-3 text-indigo-500 w-5 h-5" />
                  <span>Visit Routings</span>
                </NavLink>
              </li>

              {/* APPOINTMENTS LINK */}
              <li>
                <NavLink
                  to="/appointments"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaCalendarAlt className="mr-3 text-purple-600 w-5 h-5" />
                  <span>Appointments</span>
                </NavLink>
              </li>

              {/* LAB TESTS & RESULTS & MEDICATIONS & VACCINATIONS SECTION */}
              <li>
                <NavLink
                  to="/lab-tests"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaFlask className="mr-3 text-red-500 w-5 h-5" />
                  <span>Lab Tests</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/lab-results"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaFileMedical className="mr-3 text-green-600 w-5 h-5" />
                  <span>Lab Results</span>
                </NavLink>
              </li>

              {/* MEDICATIONS LINK */}
              <li>
                <NavLink
                  to="/medications"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaPills className="mr-3 text-purple-500 w-5 h-5" />
                  <span>Medications</span>
                </NavLink>
              </li>

              {/* VACCINATIONS LINK - NEWLY ADDED */}
              <li>
                <NavLink
                  to="/vaccinations"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaSyringe className="mr-3 text-blue-600 w-5 h-5" />
                  <span>Vaccinations</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/visits"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaCalendarAlt className="mr-3 text-orange-500 w-5 h-5" />
                  <span>Clinic Records</span>
                </NavLink>
              </li>

              {/* MEDICAL ADVICE LINK */}
              <li>
                <NavLink
                  to="/medical-advice"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaStethoscope className="mr-3 text-green-600 w-5 h-5" />
                  <span>Medical Advice</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/users"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaUserFriends className="mr-3 text-green-500 w-5 h-5" />
                  <span>Manage Users</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/roles"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaUserShield className="mr-3 text-purple-500 w-5 h-5" />
                  <span>Manage Roles</span>
                </NavLink>
              </li>

              {/* RELATIVES LINK */}
              <li>
                <NavLink
                  to="/relatives"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaUserFriends className="mr-3 text-green-500 w-5 h-5" />
                  <span>Relatives</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/permissions"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaKey className="mr-3 text-orange-500 w-5 h-5" />
                  <span>Manage Permissions</span>
                </NavLink>
              </li>
            </>
          )}

          {/* NON-ADMIN SECTION */}
          {!isAdmin && (
            <>
              <li>
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaTachometerAlt className="mr-3 text-gray-500 w-5 h-5" />
                  <span>Dashboard</span>
                </NavLink>
              </li>

              {/* PATIENTS DROP-DOWN (Non Admin) */}
              <li>
                <button
                  onClick={() => setPatientsOpen(prev => !prev)}
                  className={`${navItemClasses} ${hoverNavItemClasses} w-full flex justify-between items-center`}
                >
                  <div className="flex items-center">
                    <FaUsers className="mr-3 text-blue-500 w-5 h-5" />
                    <span>Patients</span>
                  </div>
                  <span>{patientsOpen ? "▲" : "▼"}</span>
                </button>

                {patientsOpen && (
                  <ul className="ml-10 mt-2 space-y-1">
                    {/* PATIENT REGISTER LINK - NEW (Non Admin) */}
                    <li>
                      <NavLink
                        to="/patients/register"
                        end
                        className={({ isActive }) =>
                          `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                        }
                        onClick={handleNavClick}
                      >
                        <FaUserPlus className="mr-2 text-green-500 w-4 h-4" />
                        Register Patient
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/patients"
                        end
                        className={({ isActive }) =>
                          `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                        }
                        onClick={handleNavClick}
                      >
                        <FaUsers className="mr-2 text-blue-500 w-4 h-4" />
                        All Patients
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/patients/pregnant-women"
                        end
                        className={({ isActive }) =>
                          `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                        }
                        onClick={handleNavClick}
                      >
                        <FaFemale className="mr-2 text-pink-500 w-4 h-4" />
                        Pregnant Women
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/patients/breastfeeding-women"
                        end
                        className={({ isActive }) =>
                          `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                        }
                        onClick={handleNavClick}
                      >
                        <FaChild className="mr-2 text-blue-400 w-4 h-4" />
                        Breastfeeding Women
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/patients/children"
                        end
                        className={({ isActive }) =>
                          `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                        }
                        onClick={handleNavClick}
                      >
                        <FaBaby className="mr-2 text-purple-500 w-4 h-4" />
                        Children
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Non-admin remaining links */}
              <li>
                <NavLink
                  to="/patient-visits"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaStethoscope className="mr-3 text-teal-500 w-5 h-5" />
                  <span>Patient Visits</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/visit-routings"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaExchangeAlt className="mr-3 text-indigo-500 w-5 h-5" />
                  <span>Visit Routings</span>
                </NavLink>
              </li>

              {/* LAB TESTS & RESULTS & MEDICATIONS & VACCINATIONS SECTION (Non Admin) */}
              <li>
                <NavLink
                  to="/lab-tests"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaFlask className="mr-3 text-red-500 w-5 h-5" />
                  <span>Lab Tests</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/lab-results"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaFileMedical className="mr-3 text-green-600 w-5 h-5" />
                  <span>Lab Results</span>
                </NavLink>
              </li>

              {/* MEDICATIONS LINK */}
              <li>
                <NavLink
                  to="/medications"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaPills className="mr-3 text-purple-500 w-5 h-5" />
                  <span>Medications</span>
                </NavLink>
              </li>

              {/* VACCINATIONS LINK - NEWLY ADDED (Non Admin) */}
              <li>
                <NavLink
                  to="/vaccinations"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaSyringe className="mr-3 text-blue-600 w-5 h-5" />
                  <span>Vaccinations</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/visits"
                  end
                  className={({ isActive }) =>
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaCalendarAlt className="mr-3 text-orange-500 w-5 h-5" />
                  <span>Clinic Records</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default SideNavigation;