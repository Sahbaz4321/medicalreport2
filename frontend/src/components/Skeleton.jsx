import React from 'react';

export const SkeletonLine = ({ width = '100%', height = 12, className = '' }) => (
  <div className={`skeleton ${className}`} style={{ width, height }} />
);

export const SkeletonCard = () => (
  <div className="card-modern p-3 bg-white">
    <SkeletonLine width="60%" height={14} className="mb-2" />
    <SkeletonLine width="90%" className="mb-2" />
    <SkeletonLine width="80%" className="mb-2" />
    <SkeletonLine width="40%" />
  </div>
);

