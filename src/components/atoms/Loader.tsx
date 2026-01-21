'use client';

import React from 'react';
import CircleLoader from 'react-spinners/CircleLoader';

interface LoaderProps {
  loading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ loading }) => {
  const cssOverride: React.CSSProperties = {
    display: 'block',
  };

  return (
    <CircleLoader
      color="#3b82f6" // Using a blue color to match the theme
      loading={loading}
      cssOverride={cssOverride}
      size={20} // A smaller size suitable for inline use
      aria-label="Loading Spinner"
    />
  );
};

export { Loader };