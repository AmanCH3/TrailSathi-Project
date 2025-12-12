import React from 'react';
import zxcvbn from 'zxcvbn';

const PasswordStrengthMeter = ({ password }) => {
  if (!password) {
    return null;
  }

  const testResult = zxcvbn(password);
  const score = testResult.score;
  const feedback = testResult.feedback;

  const getLabel = () => {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  const getColorClass = () => {
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-sky-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="mt-2">
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getColorClass()}`}
          style={{ width: `${(score + 1) * 20}%` }}
        ></div>
      </div>
      <div className="flex items-start justify-between mt-1">
        <div className="text-xs text-gray-600">
            {feedback.warning && (
              <p className="font-medium text-red-600">{feedback.warning}</p>
            )}
            {feedback.suggestions && feedback.suggestions.length > 0 && (
              <ul className="mt-1 space-y-1 list-disc list-inside">
                {feedback.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            )}
        </div>
        <p className="pl-2 text-xs text-right text-gray-600 whitespace-nowrap">
          Strength: <span className="font-semibold">{getLabel()}</span>
        </p>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;