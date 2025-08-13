import React from 'react';

const LoadingSkeleton = ({ className = "", variant = "default" }) => {
  const baseClasses = "animate-pulse bg-gray-800/50 rounded";
  
  const variants = {
    default: "h-4 w-full",
    text: "h-4 w-3/4",
    title: "h-8 w-1/2",
    card: "h-48 w-full",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-24"
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
};

const CardSkeleton = () => (
  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 animate-pulse">
    <LoadingSkeleton variant="avatar" className="mb-4" />
    <LoadingSkeleton variant="title" className="mb-2" />
    <LoadingSkeleton variant="text" className="mb-2" />
    <LoadingSkeleton variant="text" className="mb-4 w-1/2" />
    <LoadingSkeleton variant="button" />
  </div>
);

const ServicesSkeleton = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

const ProjectsSkeleton = () => (
  <div className="grid md:grid-cols-2 gap-8">
    {[...Array(4)].map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export { LoadingSkeleton, CardSkeleton, ServicesSkeleton, ProjectsSkeleton };
export default LoadingSkeleton;
