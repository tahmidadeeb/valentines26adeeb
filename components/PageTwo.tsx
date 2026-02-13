import React from 'react';
import background from '../assets/background.png';

const PageTwo: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src={background}
        alt="Romantic Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
    </div>
  );
};

export default PageTwo;