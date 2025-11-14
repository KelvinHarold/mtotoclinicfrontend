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
  FaBaby // Nitaongeza FaBaby icon kwa Children
} from 'react-icons/fa';

const SideNavigation = ({ onClose }) => {
  const [user, setUser] = useState(null);

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
    // Close sidebar on mobile when a nav item is clicked
    if (window.innerWidth < 768) {
      onClose?.();
    }
  };

  return (
    <nav className="w-64 bg-white shadow-sm border-r border-gray-200 flex-shrink-0 flex flex-col h-full">
      {/* Close button for mobile */}
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
              
              <li>
                <NavLink 
                  to="/patients" 
                  end
                  className={({ isActive }) => 
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaUsers className="mr-3 text-blue-500 w-5 h-5" />
                  <span>Manage Patients</span>
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
                  <FaFemale className="mr-3 text-pink-500 w-5 h-5" />
                  <span>Pregnant Women</span>
                </NavLink>
              </li>

              {/* Breastfeeding Women link for Admin */}
              <li>
                <NavLink 
                  to="/patients/breastfeeding-women" 
                  end
                  className={({ isActive }) => 
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaChild className="mr-3 text-blue-400 w-5 h-5" />
                  <span>Breastfeeding Women</span>
                </NavLink>
              </li>

              {/* Children link for Admin */}
              <li>
                <NavLink 
                  to="/patients/children" 
                  end
                  className={({ isActive }) => 
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaBaby className="mr-3 text-purple-500 w-5 h-5" />
                  <span>Children</span>
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
              
              <li>
                <NavLink 
                  to="/patients" 
                  end
                  className={({ isActive }) => 
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaUsers className="mr-3 text-blue-500 w-5 h-5" />
                  <span>Patients</span>
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
                  <FaFemale className="mr-3 text-pink-500 w-5 h-5" />
                  <span>Pregnant Women</span>
                </NavLink>
              </li>

              {/* Breastfeeding Women link for non-Admin users */}
              <li>
                <NavLink 
                  to="/patients/breastfeeding-women" 
                  end
                  className={({ isActive }) => 
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaChild className="mr-3 text-blue-400 w-5 h-5" />
                  <span>Breastfeeding Women</span>
                </NavLink>
              </li>

              {/* Children link for non-Admin users */}
              <li>
                <NavLink 
                  to="/patients/children" 
                  end
                  className={({ isActive }) => 
                    `${navItemClasses} ${hoverNavItemClasses} ${isActive ? activeNavItemClasses : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <FaBaby className="mr-3 text-purple-500 w-5 h-5" />
                  <span>Children</span>
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