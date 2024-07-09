import React from 'react';

const CardComponent = ({ children }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 h-screen overflow-x-hidden">
      <div className="hidden sm:block bg-neutral-900 relative justify-center  shadow-[0_3px_10px_rgb(0,0,0,1)]">
        {children}
      </div>
    </div>
  );
};

export default CardComponent;
