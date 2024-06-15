import React from 'react';

const CardComponent = ({ children }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 h-screen px-5 py-5 overflow-x-hidden">
      <div className="hidden sm:block bg-stone-200 relative justify-center rounded-lg shadow-[0_3px_10px_rgb(0,0,0,1)]">
        {children}
      </div>
    </div>
  );
};

export default CardComponent;
