import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';
import ChildForm from './components/ChildForm';

const CreateChild = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      console.log('Submitting to /children:', formData);
      
      // 🔥 BADILISHA KUTUMIA /children INSTEAD OF /patients/children
      await axios.post('/children', formData);
      
      alert('Child record created successfully!');
      navigate('/patients/children'); // Au /children kama hii ndio route yako
    } catch (error) {
      console.error('Error creating child record:', error);
      
      // Ona error details zaidi na wale watakao 
      const errorDetails = error.response?.data;
      console.log('Error details:', errorDetails);
      
      if (errorDetails?.errors) {
        const errorMessages = Object.values(errorDetails.errors).flat().join(', ');
        alert(`Validation Error: ${errorMessages}`);
      } else {
        const errorMessage = errorDetails?.message || 'Failed to create child record';
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow border p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Register Child</h1>
          <ChildForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default CreateChild;