import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Progression</span>
        <span className="text-sm font-medium">
          {current} / {total}
        </span>
      </div>
      <progress
        className="progress progress-primary w-full h-3"
        value={percentage}
        max="100"
      ></progress>
    </div>
  );
};

export default ProgressBar;
