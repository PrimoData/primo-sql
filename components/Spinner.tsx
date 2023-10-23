// components/Spinner.tsx
import React from 'react';

const Spinner: React.FC = () => (
  <div className="flex justify-center items-center mt-5">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);

export default Spinner;
