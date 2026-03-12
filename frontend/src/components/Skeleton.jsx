import React from 'react';

export const SkeletonLine = ({
  width = '100%',
  height = 12,
  className = ''
}) => (
  <div
    className={`skeleton-shimmer rounded ${className}`}
    style={{ width, height }}
  />
);

export const SkeletonCard = () => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <SkeletonLine width="70%" height={20} className="mb-3" />
        <SkeletonLine width="40%" height={14} className="mb-2" />
      </div>
      <SkeletonLine width={60} height={28} className="rounded-full" />
    </div>

    <div className="space-y-2 mb-4">
      <SkeletonLine width="100%" height={12} />
      <SkeletonLine width="95%" height={12} />
      <SkeletonLine width="85%" height={12} />
    </div>

    <div className="flex gap-2 pt-3 border-t border-gray-100">
      <SkeletonLine width={80} height={32} className="rounded-full" />
      <SkeletonLine width={100} height={32} className="rounded-full" />
      <SkeletonLine width={90} height={32} className="rounded-full" />
    </div>
  </div>
);
