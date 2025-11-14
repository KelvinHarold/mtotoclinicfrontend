// components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Header = ({ onToggleSidebar }) => {
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [imageEditMode, setImageEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      setFormData({
        first_name: userObj.first_name || '',
        last_name: userObj.last_name || '',
        email: userObj.email || '',
        phone: userObj.phone || ''
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileModal(false);
        setEditMode(false);
        setImageEditMode(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      navigate('/');
    }
  };

  const toggleProfileModal = () => {
    setShowProfileModal(!showProfileModal);
    setEditMode(false);
    setImageEditMode(false);
    setMessage('');
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setImageEditMode(false);
    setMessage('');
  };

  const handleImageEditToggle = () => {
    setImageEditMode(!imageEditMode);
    setEditMode(false);
    setMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB
        setMessage('Image size should be less than 2MB');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      setMessage('Please select an image');
      return;
    }

    setImageLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('profile_image', imageFile);

      const response = await axios.post('/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      setMessage('Profile image updated successfully!');
      setImageEditMode(false);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Image upload error:', error);
      setMessage(error.response?.data?.message || 'Error uploading image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    setImageLoading(true);
    setMessage('');

    try {
      const response = await axios.delete('/profile/image');
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      setMessage('Profile image removed successfully!');
      setImageEditMode(false);
    } catch (error) {
      console.error('Image remove error:', error);
      setMessage(error.response?.data?.message || 'Error removing image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.put('/profile/update', formData);
      const updatedUser = response.data.user;
      
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      setMessage('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const getProfileImageUrl = () => {
    if (user?.profile_image_url) {
      return user.profile_image_url;
    }
    if (user?.profile_image) {
      return `/storage/profile-images/${user.profile_image}`;
    }
    return null;
  };

  if (!user) {
    return null;
  }

  return (
    <header className="bg-white text-gray-800 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo, Hamburger Menu and Brand Name */}
          <div className="flex items-center space-x-3">
            {/* Hamburger Menu for Mobile */}
            <button
              onClick={onToggleSidebar}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <svg 
                className="w-5 h-5 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
            
            <img 
              src="/logo.jpg" 
              alt="MtotoClinic Logo" 
              className="h-8 w-8 md:h-10 md:w-10 object-contain"
            />
            <h1 className="text-lg md:text-xl font-bold" style={{ color: '#006400' }}>
              MtotoClinic
            </h1>
          </div>
          
          {/* User Info and Dropdown */}
          <div className="flex items-center space-x-3 md:space-x-4 relative" ref={dropdownRef}>
            <div className="hidden sm:block text-right">
              <div className="font-medium text-sm md:text-base" style={{ color: '#006400' }}>
                {user.first_name} {user.last_name}
              </div>
              <div className="text-xs md:text-sm text-gray-600 capitalize">
                {user.role || 'User'}
              </div>
            </div>
            
            {/* Dropdown Trigger */}
            <button
              onClick={toggleProfileModal}
              className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2"
              style={{ 
                backgroundColor: '#006400',
                color: 'white'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#004d00'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#006400'}
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </button>

            {/* Profile Modal */}
            {showProfileModal && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
                {/* Modal Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Profile Image with Edit Option */}
                      <div className="relative">
                        {getProfileImageUrl() ? (
                          <img 
                            src={getProfileImageUrl()} 
                            alt="Profile" 
                            className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-green-600"
                          />
                        ) : (
                          <div 
                            className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg border-2 border-green-600"
                            style={{ backgroundColor: '#006400' }}
                          >
                            {user.first_name?.[0]}{user.last_name?.[0]}
                          </div>
                        )}
                        <button
                          onClick={handleImageEditToggle}
                          className="absolute -bottom-1 -right-1 bg-green-600 text-white p-1 rounded-full hover:bg-green-700 transition-colors"
                          title="Edit profile image"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="font-semibold text-sm md:text-base truncate"
                          style={{ color: '#006400' }}
                        >
                          {user.first_name} {user.last_name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 capitalize truncate">
                          {user.role || 'User'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleEditToggle}
                      className="text-gray-500 hover:text-green-600 transition-colors p-1"
                      title="Edit profile"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Modal Body - User Details */}
                <div className="p-4 border-b border-gray-200 max-h-80 overflow-y-auto">
                  {message && (
                    <div className={`p-3 rounded mb-4 text-sm ${
                      message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                    }`}>
                      {message}
                    </div>
                  )}

                  {/* Image Edit Mode */}
                  {imageEditMode && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="mx-auto w-24 h-24 rounded-full overflow-hidden border-2 border-green-600 mb-3">
                          {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : getProfileImageUrl() ? (
                            <img src={getProfileImageUrl()} alt="Current" className="w-full h-full object-cover" />
                          ) : (
                            <div 
                              className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                              style={{ backgroundColor: '#006400' }}
                            >
                              {user.first_name?.[0]}{user.last_name?.[0]}
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors mb-2"
                        >
                          Choose Image
                        </button>
                        <p className="text-xs text-gray-500">JPG, PNG, GIF up to 2MB</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        {imageFile && (
                          <button
                            onClick={handleImageUpload}
                            disabled={imageLoading}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            {imageLoading ? 'Uploading...' : 'Upload Image'}
                          </button>
                        )}
                        {getProfileImageUrl() && (
                          <button
                            onClick={handleRemoveImage}
                            disabled={imageLoading}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            {imageLoading ? 'Removing...' : 'Remove Image'}
                          </button>
                        )}
                        <button
                          onClick={handleImageEditToggle}
                          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Profile Edit Mode */}
                  {editMode && !imageEditMode && (
                    <form onSubmit={handleProfileUpdate} className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">First Name</label>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Last Name</label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          {loading ? 'Updating...' : 'Update'}
                        </button>
                        <button
                          type="button"
                          onClick={handleEditToggle}
                          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* View Mode */}
                  {!editMode && !imageEditMode && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Email</label>
                        <p className="text-sm text-gray-800 truncate">{user.email || 'N/A'}</p>
                      </div>
                      {user.phone && (
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Phone</label>
                          <p className="text-sm text-gray-800">{user.phone}</p>
                        </div>
                      )}
                      {user.department && (
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Department</label>
                          <p className="text-sm text-gray-800 capitalize truncate">{user.department}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                {!editMode && !imageEditMode && (
                  <div className="p-3">
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;