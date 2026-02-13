import React, { useState, useEffect } from 'react';
import { Position } from '../types';
import backgroundVideo from '../assets/background.mp4';
import circle from '../assets/circle.png';
import arrow from '../assets/arrow.png';

interface PageOneProps {
  onYesClick: () => void;
  isActive: boolean;
}

const PageOne: React.FC<PageOneProps> = ({ onYesClick, isActive }) => {
  // Initial position set to match the annotated layout (lower right quadrant for "No")
  const [noButtonPos, setNoButtonPos] = useState<Position>({ top: '80%', left: '60%' });
  const [videoError, setVideoError] = useState(false);

  // Initial setup for positions
  useEffect(() => {
    // Reset position if page becomes active again
  }, [isActive]);

  const handleNoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Calculate random position within the 1920x1080 frame
    const margin = 300; 
    const randomX = Math.floor(Math.random() * (1920 - margin * 2)) + margin;
    const randomY = Math.floor(Math.random() * (1080 - margin * 2)) + margin;

    setNoButtonPos({
      top: `${randomY}px`,
      left: `${randomX}px`,
    });
  };

  return (
    <div 
      className={`absolute top-0 left-0 w-full h-full overflow-hidden transition-transform duration-1000 ease-in-out ${isActive ? 'translate-y-0' : '-translate-y-full'}`}
      style={{ zIndex: 20 }}
    >
      <style>{`
        @keyframes flicker {
            0% { opacity: 1; }
            50% { opacity: 0.1; }
            100% { opacity: 1; }
        }
      `}</style>

      {/* Background Video */}
      {!videoError ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          onError={(e) => {
            console.error("Video failed to load or has unsupported source.");
            setVideoError(true);
          }}
        >
            <source src={backgroundVideo} type="video/mp4" />
        </video>
      ) : (
        // Fallback gradient if video is missing
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900 to-black z-0"></div>
      )}
      
      {/* Overlay to ensure text readability if video is bright */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-0"></div>

      {/* Container for buttons and texture */}
      <div className="absolute top-0 left-0 w-full h-full z-10">
        
        {/* Transparent Texture Centered on Yes Button */}
        {/* Using pointer-events-none so it doesn't interfere with clicking the button */}
        <img 
            src={circle} 
            alt="" 
            className="absolute pointer-events-none select-none"
            style={{
                top: '80%',
                left: '40%',
                transform: 'translate(-50%, -50%)',
                height: 'auto',
                animation: 'flicker 0.8s infinite ease-in-out',
            }}
        />
          <img 
        src={arrow} 
        alt="arrow"
        className="absolute"
        style={{
          top:'0%',
          left:'50%',
          height:'400px'
        }}
      />
        <div className='absolute text-gray-300 text-4xl'
          style={{
            top:'10%',
            left:'65%',
            fontFamily:'Schoolbell'
          }}
        >
          please pet the cat first</div>

        {/* YES Button */}
        <button
          onClick={onYesClick}
          className="absolute text-[#C0C0C0] hover:scale-110 transition-transform duration-300"
          style={{
            top: '80%',
            left: '40%',
            transform: 'translate(-50%, -50%)',
            fontSize: '9rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: '"Indie Flower", cursive',
          }}
        >
          yes
        </button>

        {/* NO Button */}
        <button
          onClick={handleNoClick}
          className="absolute text-[#C0C0C0] transition-all duration-300"
          style={{
            top: noButtonPos.top,
            left: noButtonPos.left,
            transform: 'translate(-50%, -50%)',
            fontSize: '3rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: '"Schoolbell", cursive',
            whiteSpace: 'nowrap'
          }}
        >
          nou(?)🥺
        </button>
      </div>
    </div>
  );
};

export default PageOne;