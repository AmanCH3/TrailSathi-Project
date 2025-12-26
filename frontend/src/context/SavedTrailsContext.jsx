import React, { createContext, useContext, useState, useEffect } from 'react';

const SavedTrailsContext = createContext();

export const useSavedTrails = () => {
  const context = useContext(SavedTrailsContext);
  if (!context) {
    throw new Error('useSavedTrails must be used within SavedTrailsProvider');
  }
  return context;
};

export const SavedTrailsProvider = ({ children }) => {
  const [savedTrails, setSavedTrails] = useState([]);

  // Load saved trails from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('savedTrails');
    if (stored) {
      try {
        setSavedTrails(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading saved trails:', error);
        setSavedTrails([]);
      }
    }
  }, []);

  // Save to localStorage whenever savedTrails changes
  useEffect(() => {
    localStorage.setItem('savedTrails', JSON.stringify(savedTrails));
  }, [savedTrails]);

  const saveTrail = (trail) => {
    setSavedTrails((prev) => {
      // Check if already saved
      if (prev.some((t) => t._id === trail._id)) {
        return prev;
      }
      return [...prev, trail];
    });
  };

  const unsaveTrail = (trailId) => {
    setSavedTrails((prev) => prev.filter((t) => t._id !== trailId));
  };

  const isSaved = (trailId) => {
    return savedTrails.some((t) => t._id === trailId);
  };

  const getSavedTrails = () => {
    return savedTrails;
  };

  const clearAllSaved = () => {
    setSavedTrails([]);
  };

  const value = {
    savedTrails,
    saveTrail,
    unsaveTrail,
    isSaved,
    getSavedTrails,
    clearAllSaved,
    savedCount: savedTrails.length,
  };

  return (
    <SavedTrailsContext.Provider value={value}>
      {children}
    </SavedTrailsContext.Provider>
  );
};
