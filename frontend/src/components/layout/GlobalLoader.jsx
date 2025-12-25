import React, { useState, useEffect } from 'react';
import { HikingLoader } from '../common/HikingLoader';

export const GlobalLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Show loader for 1.5 seconds on initial load

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <HikingLoader text="Welcome to TrailSathi" />
      </div>
    );
  }

  return <>{children}</>;
};

export default GlobalLoader;
