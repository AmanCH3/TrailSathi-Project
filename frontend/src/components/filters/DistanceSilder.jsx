import React from 'react';

export default function DistanceSlider({ value, onChange }) {
  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-1'>
        Distance (km) - Max: {value} km
      </label>
      <input
        type='range'
        min={0}
        max={20}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full accent-green-600'
      />
      <div className='flex justify-between text-xs text-gray-500'>
        <span>0 km</span>
        <span>20 km</span>
      </div>
    </div>
  );
}