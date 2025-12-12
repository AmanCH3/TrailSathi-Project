import React from 'react';

export default function ElevationSlider({ value, onChange }) {
  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-1'>
        Elevation Gain (m) - Max: {value} m
      </label>
      <input
        type='range'
        min={0}
        max={1500}
        step={50} // A step can improve usability
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full accent-green-500'
      />
      <div className='flex justify-between text-xs text-gray-500'>
        <span>0 m</span>
        <span>1500 m</span>
      </div>
    </div>
  );
}