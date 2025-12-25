import React from 'react';
import { Mountain, Trees, Footprints } from 'lucide-react';
import './HikingLoader.css';

export const HikingLoader = ({ text = "Loading..." }) => {
  return (
    <div className="hiking-loader-container">
      <div className="hiking-loader">
        {/* Mountains in background */}
        <div className="mountains">
          <Mountain className="mountain mountain-1" size={60} />
          <Mountain className="mountain mountain-2" size={48} />
          <Mountain className="mountain mountain-3" size={52} />
        </div>

        {/* Animated trail path */}
        <div className="trail-path">
          <svg viewBox="0 0 200 100" className="path-svg">
            <path
              d="M 10,80 Q 50,20 100,50 T 190,80"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="10,5"
              className="animated-path"
            />
          </svg>
        </div>

        {/* Animated hiker */}
        <div className="hiker-container">
          <Footprints className="hiker-icon" size={32} />
        </div>

        {/* Trees */}
        <div className="trees">
          <Trees className="tree tree-1" size={40} />
          <Trees className="tree tree-2" size={36} />
          <Trees className="tree tree-3" size={42} />
        </div>

        {/* Sun/Circle pulse */}
        <div className="sun-pulse" />
      </div>

      {/* Loading text */}
      {text && (
        <p className="loading-text">
          {text}
          <span className="dot-1">.</span>
          <span className="dot-2">.</span>
          <span className="dot-3">.</span>
        </p>
      )}
    </div>
  );
};

// Simple version without text
export const HikingLoaderSimple = () => {
  return (
    <div className="hiking-loader-simple">
      <div className="spinner-trail">
        <Mountain className="spinner-icon" size={40} />
      </div>
    </div>
  );
};

export default HikingLoader;
