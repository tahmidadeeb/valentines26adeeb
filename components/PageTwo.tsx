import React from 'react';

const PageTwo: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src="./assets/background.png"
        alt="Romantic Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
    </div>
  );
};

export default PageTwo;