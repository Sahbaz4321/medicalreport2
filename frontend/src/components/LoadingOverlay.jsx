import React from 'react';

const LoadingOverlay = ({ message = 'Loading...', show = true }) => {
  if (!show) return null;

  return (
    <div className="loading-overlay">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-3"></div>
        <div className="fw-medium text-muted">{message}</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
