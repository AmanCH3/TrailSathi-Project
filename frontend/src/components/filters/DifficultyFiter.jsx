import React from 'react';


const difficultyLevels = ['All', 'Easy', 'Moderate', 'Hard'];

// The component now accepts `value` and `onChange` from its parent
export default function DifficultyFilter({ value, onChange }) {
  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        Difficulty Level
      </label>
      <div className='space-y-2 text-sm text-gray-500'>
        {difficultyLevels.map((level) => (
          <div className='flex items-center' key={level}>
            <input
              type='radio'
              id={level.toLowerCase()}
              name='difficulty' // All radio buttons in a group must have the same name
              
              value={level}
              
              checked={value === level}
              
              onChange={(e) => onChange(e.target.value)}
              className='accent-green-600'
            />
            <label htmlFor={level.toLowerCase()} className='ml-2'>
              {level === 'All' ? 'All Difficulties' : level}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}