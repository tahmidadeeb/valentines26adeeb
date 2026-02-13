import React, { useState, useEffect, useRef, useCallback } from 'react';
import PageOne from './components/PageOne';
import PageTwo from './components/PageTwo';
import HeartConfetti from './components/HeartConfetti';

const App: React.FC = () => {
  const [showPageTwo, setShowPageTwo] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [scale, setScale] = useState(1);
  const [isPortrait, setIsPortrait] = useState(false);
  const audio1Ref = useRef<HTMLAudioElement>(null);
  const audio2Ref = useRef<HTMLAudioElement>(null);

  // Resolution
  const TARGET_WIDTH = 1920;
  const TARGET_HEIGHT = 1080;

  const handleResize = useCallback(() => {
    // Check orientation
    const portrait = window.innerHeight > window.innerWidth;
    setIsPortrait(portrait);

    const windowRatio = window.innerWidth / window.innerHeight;
    const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
    
    let newScale;
    if (windowRatio > targetRatio) {
      // Window is wider than target
      newScale = window.innerHeight / TARGET_HEIGHT;
    } else {
      // Window is narrower than target
      newScale = window.innerWidth / TARGET_WIDTH;
    }
    setScale(newScale);
  }, []);

  useEffect(() => {
    // Handle resize and orientation change
    const handleLayoutChange = () => {
       handleResize();
       setTimeout(handleResize, 100);
       setTimeout(handleResize, 500);
    };

    window.addEventListener('resize', handleLayoutChange);
    window.addEventListener('orientationchange', handleLayoutChange);
    
    handleLayoutChange();
    
    return () => {
        window.removeEventListener('resize', handleLayoutChange);
        window.removeEventListener('orientationchange', handleLayoutChange);
    };
  }, [handleResize]);

  // Audio Management
  useEffect(() => {
    // Attempt to autoplay audio 1 on mount
    const playAudio1 = async () => {
      if (audio1Ref.current) {
        try {
          audio1Ref.current.volume = 0.5;
          // Reload to ensure source is picked up if needed
          audio1Ref.current.load();
          await audio1Ref.current.play();
        } catch (e) {
          console.log("Autoplay blocked, waiting for interaction");
        }
      }
    };

    // If page two isn't shown, play audio 1
    if (!showPageTwo) {
       playAudio1();
    } else {
      // Transition to Audio 2
      if (audio1Ref.current) {
        audio1Ref.current.pause();
        audio1Ref.current.currentTime = 0;
      }
      if (audio2Ref.current) {
        try {
            audio2Ref.current.volume = 0.5;
            audio2Ref.current.load();
            audio2Ref.current.play();
        } catch(e) {
            console.error("Audio 2 play error", e);
        }
      }
    }
  }, [showPageTwo]);

  // Global click listener to start audio if autoplay was blocked
  useEffect(() => {
    const handleGlobalClick = () => {
      if (!showPageTwo && audio1Ref.current && audio1Ref.current.paused) {
        audio1Ref.current.play().catch(() => {});
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [showPageTwo]);

  const handleYesClick = () => {
    setShowConfetti(true);
    setTimeout(() => {
        setShowPageTwo(true);
    }, 100); 
  };

  if (isPortrait) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-[#C0C0C0] p-8 text-center z-50">
        <h1 className="text-4xl mb-6">Please rotate your device ↻</h1>
        <p className="text-2xl">This experience is designed for landscape mode.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden touch-none">
        {/* Audio Elements with explicit source and type */}
        <audio ref={audio1Ref} loop>
            <source src="./assets/audio1.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={audio2Ref} loop>
            <source src="./assets/audio2.mp3" type="audio/mpeg" />
        </audio>

        {/* Main Scaled Container */}
        <div 
            style={{
                width: TARGET_WIDTH,
                height: TARGET_HEIGHT,
                transform: `scale(${scale})`,
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#1a1a1a',
                flexShrink: 0,
            }}
        >
            <PageTwo />
            {showConfetti && <HeartConfetti />}
            <PageOne onYesClick={handleYesClick} isActive={!showPageTwo} />
        </div>
    </div>
  );
};

export default App;