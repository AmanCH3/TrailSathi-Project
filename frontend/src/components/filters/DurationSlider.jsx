import React from 'react';

// The component now accepts `value` and `onChange` props from its parent
export default function DurationSlider({ value, onChange }) {
  return (
    <div>
      {/* 1. Display the current value in the label for better UX */}
      <label className='block text-sm font-medium text-gray-700 mb-1'>
        Duration (hours) - Max: {value} hrs
      </label>
      <input
        type='range'
        min={0}
        max={8}
        step={0.5} 
        
        value={value}
                onChange={(e) => onChange(e.target.value)}
        
        className='w-full accent-green-600'
      />
      <div className='flex justify-between text-xs text-gray-500'>
        <span>0 hrs</span>
        <span>8 hrs</span>
      </div>
    </div>
  );
}