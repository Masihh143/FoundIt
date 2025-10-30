import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api, { lostAPI } from '../services/api';

const ItemDetailModal = ({ item, type, isOpen, onClose, onClaimItem }) => {
  const { user } = useAuth();
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [selectedLostItem, setSelectedLostItem] = useState('');
  const [userLostItems, setUserLostItems] = useState([]);

  if (!isOpen || !item) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleClaimClick = async () => {
    if (type === 'found' && user) {
      // Fetch user's lost items for selection
      try {
        const response = await lostAPI.getAll();
        const allLostItems = response.data;
        const userItems = allLostItems.filter(lostItem => 
          lostItem.user._id === user._id && lostItem.status === 'lost'
        );
        setUserLostItems(userItems);
        setShowClaimForm(true);
      } catch (error) {
        console.error('Error fetching user lost items:', error);
      }
    }
  };

  const handleClaimSubmit = async () => {
    if (selectedLostItem && onClaimItem) {
      await onClaimItem(item._id, selectedLostItem);
      setShowClaimForm(false);
      onClose();
    }
  };

  const handleCloseLostItem = async () => {
    if (type === 'lost' && user && item.user._id === user._id) {
      try {
        const response = await api.patch(`/lost/${item._id}/close`);
        
        if (response.status === 200) {
          onClose();
          // Refresh the page or update the list
          window.location.reload();
        }
      } catch (error) {
        console.error('Error closing lost item:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {type === 'lost' ? 'Lost Item Details' : 'Found Item Details'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="space-y-4">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.itemName}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.itemName}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">{item.location}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">
                    {type === 'lost' ? 'Lost on' : 'Found on'} {formatDate(type === 'lost' ? item.dateLost : item.dateFound)}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-700">Reported by {item.user?.name}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.status === 'lost' ? 'bg-red-100 text-red-800' :
                    item.status === 'found' ? 'bg-green-100 text-green-800' :
                    item.status === 'unclaimed' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            {type === 'found' && user && (
              <button
                onClick={handleClaimClick}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>That's Mine!</span>
              </button>
            )}

            {type === 'lost' && user && item.user._id === user._id && (
              <button
                onClick={handleCloseLostItem}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Close Request</span>
              </button>
            )}
          </div>

          {/* Claim Form */}
          {showClaimForm && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3">Select Your Lost Item</h4>
              <div className="space-y-2">
                {userLostItems.length === 0 ? (
                  <p className="text-gray-600">You don't have any active lost items to claim.</p>
                ) : (
                  <>
                    {userLostItems.map((lostItem) => (
                      <label key={lostItem._id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="lostItem"
                          value={lostItem._id}
                          checked={selectedLostItem === lostItem._id}
                          onChange={(e) => setSelectedLostItem(e.target.value)}
                          className="text-blue-600"
                        />
                        <span className="text-gray-700">{lostItem.itemName}</span>
                      </label>
                    ))}
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={handleClaimSubmit}
                        disabled={!selectedLostItem}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Claim Item
                      </button>
                      <button
                        onClick={() => setShowClaimForm(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;
