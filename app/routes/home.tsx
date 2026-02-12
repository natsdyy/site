import { useState, useRef, useEffect } from 'react';

interface LyricLine {
  time: number; // in seconds
  text: string;
}

const styles = `
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes heart-float {
    0% { transform: translateY(0) scale(0.5) rotateZ(0deg) translateX(var(--tx, 0px)); opacity: 0; }
    10% { opacity: 0.6; }
    90% { opacity: 0.6; }
    100% { transform: translateY(-120vh) scale(1) rotateZ(360deg) translateX(var(--tx, 0px)); opacity: 0; }
  }

  /* --- PETAL ANIMATIONS (Gentle Bloom) --- */
  @keyframes petal-bloom-1 { 0%, 100% { transform: rotateZ(0deg) rotateX(55deg) scale(0.4); opacity: 0; } 50% { transform: rotateZ(0deg) rotateX(10deg) scale(1) translateY(-15px); opacity: 0.9; } }
  @keyframes petal-bloom-2 { 0%, 100% { transform: rotateZ(45deg) rotateX(55deg) scale(0.4); opacity: 0; } 50% { transform: rotateZ(45deg) rotateX(10deg) scale(1) translateY(-15px); opacity: 0.9; } }
  @keyframes petal-bloom-3 { 0%, 100% { transform: rotateZ(90deg) rotateX(55deg) scale(0.4); opacity: 0; } 50% { transform: rotateZ(90deg) rotateX(10deg) scale(1) translateY(-15px); opacity: 0.9; } }
  @keyframes petal-bloom-4 { 0%, 100% { transform: rotateZ(135deg) rotateX(55deg) scale(0.4); opacity: 0; } 50% { transform: rotateZ(135deg) rotateX(10deg) scale(1) translateY(-15px); opacity: 0.9; } }
  @keyframes petal-bloom-5 { 0%, 100% { transform: rotateZ(180deg) rotateX(55deg) scale(0.4); opacity: 0; } 50% { transform: rotateZ(180deg) rotateX(10deg) scale(1) translateY(-15px); opacity: 0.9; } }
  @keyframes petal-bloom-6 { 0%, 100% { transform: rotateZ(225deg) rotateX(55deg) scale(0.4); opacity: 0; } 50% { transform: rotateZ(225deg) rotateX(10deg) scale(1) translateY(-15px); opacity: 0.9; } }
  @keyframes petal-bloom-7 { 0%, 100% { transform: rotateZ(270deg) rotateX(55deg) scale(0.4); opacity: 0; } 50% { transform: rotateZ(270deg) rotateX(10deg) scale(1) translateY(-15px); opacity: 0.9; } }
  @keyframes petal-bloom-8 { 0%, 100% { transform: rotateZ(315deg) rotateX(55deg) scale(0.4); opacity: 0; } 50% { transform: rotateZ(315deg) rotateX(10deg) scale(1) translateY(-15px); opacity: 0.9; } }

  @keyframes center-glow {
    0%, 100% { box-shadow: 0 0 15px rgba(255, 255, 200, 0.6); transform: translate(-50%, -50%) scale(1); }
    50% { box-shadow: 0 0 35px rgba(255, 255, 255, 0.9); transform: translate(-50%, -50%) scale(1.1); }
  }

  @keyframes stem-sway {
    0%, 100% { transform: translateX(-50%) rotateZ(-2deg); }
    50% { transform: translateX(-50%) rotateZ(2deg); }
  }

  @keyframes lotus-main-bloom {
    0%, 100% { transform: translate(-50%, -50%) scale(0.9); }
    50% { transform: translate(-50%, -50%) scale(1.05); }
  }

  @keyframes lyrics-entrance {
    from { opacity: 0; transform: translateX(-20px) scale(0.95); }
    to { opacity: 1; transform: translateX(0) scale(1); }
  }

  @keyframes controls-float {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-5px); }
  }

  @keyframes grow-ans {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .grow-ans {
    animation: grow-ans 2s var(--d) backwards;
    position: relative;
    height: 100px;
    display: flex;
    align-items: flex-end;
  }

  .leaf {
    position: relative;
    bottom: 0;
    left: 50%;
    transform-origin: bottom center;
    transform: translateX(-50%);
  }

  .leaf--0 { width: 24px; height: 90px; background: linear-gradient(to top, #0d7a8f 0%, #1a9db5 50%, #4fd1e8 100%); border-radius: 50% 50% 40% 40% / 60% 60% 40% 40%; transform: translateX(-50%) rotateZ(-25deg); box-shadow: inset 0 0 8px rgba(255,255,255,0.2); }
  .leaf--1 { width: 22px; height: 85px; background: linear-gradient(to top, #0e8b9f 0%, #2bb5c9 50%, #5adde8 100%); border-radius: 50% 50% 40% 40% / 60% 60% 40% 40%; transform: translateX(-50%) rotateZ(15deg); box-shadow: inset 0 0 8px rgba(255,255,255,0.2); }
  .leaf--2 { width: 26px; height: 95px; background: linear-gradient(to top, #0d6975 0%, #168ca1 50%, #48c9dd 100%); border-radius: 50% 50% 40% 40% / 60% 60% 40% 40%; transform: translateX(-50%) rotateZ(-35deg); box-shadow: inset 0 0 8px rgba(255,255,255,0.2); }
  .leaf--3 { width: 23px; height: 88px; background: linear-gradient(to top, #0e8396 0%, #1ba5b8 50%, #52d0e8 100%); border-radius: 50% 50% 40% 40% / 60% 60% 40% 40%; transform: translateX(-50%) rotateZ(20deg); box-shadow: inset 0 0 8px rgba(255,255,255,0.2); }

  .long-g {
    position: absolute;
    bottom: 0;
    width: auto;
    height: 120px;
    display: flex;
    gap: 12px;
    align-items: flex-end;
    justify-content: center;
    pointer-events: none;
  }

  .long-g--1 { left: 8%; width: 12%; }
  .long-g--2 { left: 28%; width: 12%; }
  .long-g--3 { left: 50%; transform: translateX(-50%); width: 12%; }
  .long-g--4 { right: 28%; width: 12%; }
  .long-g--5 { right: 8%; width: 12%; }

  @keyframes fern-sway {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(3deg); }
  }
  @keyframes blade-sway {
    0%, 100% { transform: skewX(0deg); }
    50% { transform: skewX(5deg); }
  }

  /* --- COMPONENT STYLES --- */
  .lotus-wrapper {
    position: absolute;
    top: 60%;
    left: 50%;
    width: 400px;
    height: 600px;
    transform: translate(-50%, -50%);
    z-index: 20; /* Higher than grass back, lower than grass front */
  }

  .lotus-stem {
    position: absolute;
    left: 50%;
    top: 50%; 
    width: 8px; /* Thinner stem */
    height: 500px; /* Longer to go deep into grass */
    /* TEAL GRADIENT TO MATCH GRASS */
    background: linear-gradient(90deg, #2d6e75, #5adbb5, #2d6e75);
    border-radius: 20px;
    transform-origin: top center;
    animation: stem-sway 6s ease-in-out infinite;
    z-index: 1; 
    box-shadow: 0 0 10px rgba(90, 219, 181, 0.3);
  }

  .lotus-flower-head {
    position: absolute;
    top: 50%; 
    left: 50%;
    width: 0; height: 0;
    z-index: 10;
    animation: lotus-main-bloom 12s ease-in-out infinite;
    filter: drop-shadow(0 0 15px rgba(255, 182, 193, 0.6));
  }

  .lotus-petal {
    position: absolute;
    bottom: -10px;
    left: 50%;
    width: 80px;
    height: 140px;
    margin-left: -40px;
    /* ETHEREAL GLASSY LOOK */
    background: linear-gradient(to top, rgba(255, 105, 180, 0.4), rgba(255, 255, 255, 0.7));
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    transform-origin: bottom center;
    box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(2px);
    z-index: 5;
    mix-blend-mode: screen;
  }

  .lotus-petal--1 { animation: petal-bloom-1 12s ease-in-out infinite; }
  .lotus-petal--2 { animation: petal-bloom-2 12s ease-in-out infinite; }
  .lotus-petal--3 { animation: petal-bloom-3 12s ease-in-out infinite; }
  .lotus-petal--4 { animation: petal-bloom-4 12s ease-in-out infinite; }
  .lotus-petal--5 { animation: petal-bloom-5 12s ease-in-out infinite; }
  .lotus-petal--6 { animation: petal-bloom-6 12s ease-in-out infinite; }
  .lotus-petal--7 { animation: petal-bloom-7 12s ease-in-out infinite; }
  .lotus-petal--8 { animation: petal-bloom-8 12s ease-in-out infinite; }

  .lotus-center-circle {
    position: absolute;
    width: 50px; height: 50px;
    top: 0; left: 0;
    border-radius: 50%;
    /* BRIGHTER GLOWING CENTER */
    background: radial-gradient(circle at 30% 30%, #ffffff, #ffee00, #ffcc00);
    transform: translate(-50%, -50%);
    animation: center-glow 6s ease-in-out infinite alternate;
    z-index: 20;
  }

  /* --- GRASS STYLES --- */
  .grass-container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 160px;
    z-index: 15;
    pointer-events: none;
    overflow: hidden;
    background: linear-gradient(to bottom, transparent 0%, rgba(45, 90, 61, 0.2) 60%, #2d5a3d 100%);
  }

  .svg-ferns-back {
    animation: fern-sway 7s ease-in-out infinite;
    transform-origin: bottom center;
  }
  .svg-grass-blades {
    animation: blade-sway 5s ease-in-out infinite;
    transform-origin: bottom center;
  }
  .svg-ferns-front {
    animation: fern-sway 9s ease-in-out infinite reverse;
    transform-origin: bottom center;
  }

  .progress-bar {
    width: 100%; height: 4px; border-radius: 2px;
    background: rgba(255, 255, 255, 0.2);
    outline: none; -webkit-appearance: none; appearance: none;
    cursor: pointer;
  }
  .progress-bar::-webkit-slider-thumb {
    -webkit-appearance: none; width: 12px; height: 12px;
    border-radius: 50%; background: white; cursor: pointer;
    box-shadow: 0 0 10px rgba(255, 255, 255, 1); transition: transform 0.2s;
  }
  .progress-bar::-webkit-slider-thumb:hover { transform: scale(1.5); }

  /* Responsive Scaling */
  @media (max-width: 1024px) { .lotus-wrapper { transform: translate(-50%, -50%) scale(0.8); } }
  @media (max-width: 768px) { .lotus-wrapper { transform: translate(-50%, -50%) scale(0.65); top: 50%; } }
`;

export default function ValentinesSurprise() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);

  // --- FIX START: Add isMounted check ---
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  // --- FIX END ---

  const lyrics: LyricLine[] = [
    { time: 0, text: 'Come stop the crying, it\'ll be alright.' },
    { time: 5, text: 'Just take my hand, hold it tight.' },
    { time: 10, text: 'I will protect you from all around you.' },
    { time: 16, text: 'I will be here, don\'t you cry.' },
    { time: 21, text: 'For one so small, you seem so strong.' },
    { time: 25, text: 'My arm will hold you, keep you safe and warm.' },
    { time: 31, text: 'This bond between us can\'t be broken.' },
    { time: 36, text: 'I will be here, don\'t you cry.' },
    { time: 41, text: 'Cause you\'ll be in my heart.' },
    { time: 45, text: 'Yes, you\'ll be in my heart.' },
    { time: 50, text: 'From this day on, now and forevermore.' },
    { time: 61, text: 'Yes, you\'ll be in my heart.' },
    { time: 66, text: 'No matter what they say.' },
    { time: 71, text: 'You\'ll be here in my heart.' },
    { time: 77, text: 'Always.' },
    { time: 82, text: 'Why can\'t they understand the way we feel?' },
    { time: 87, text: 'They just don\'t trust, but they can\'t explain.' },
    { time: 92, text: 'I know we\'re different, deep inside us.' },
    { time: 97, text: 'We\'re not that different at all.' },
    { time: 102, text: 'You\'ll be in my heart.' },
    { time: 107, text: 'Yes, you\'ll be in my heart.' },
    { time: 112, text: 'From this day on, now and forevermore.' },
    { time: 122, text: 'Don\'t listen to them, cause what do they know?' },
    { time: 127, text: 'We need each other, to have and to hold.' },
    { time: 133, text: 'They\'ll see in time.' },
    { time: 137, text: 'I\'m together cause you\'re just a golden shoulder.' },
    { time: 227, text: 'I\'ll be there for you.' },
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      const currentIndex = lyrics.findIndex(
        (line, index) =>
          audio.currentTime >= line.time &&
          (index === lyrics.length - 1 || audio.currentTime < lyrics[index + 1].time)
      );
      if (currentIndex !== -1) setActiveLyricIndex(currentIndex);
    };

    if (isPlaying) {
      audio.addEventListener('timeupdate', updateTime);
      return () => audio.removeEventListener('timeupdate', updateTime);
    }
  }, [isPlaying, lyrics]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- FIX START: Don't render anything on the server ---
  if (!isMounted) {
    return <div className="min-h-screen bg-black" />; // Or return null
  }
  // --- FIX END ---

  return (
    <>
      <style>{styles}</style>
      <div className="flex items-center justify-center h-screen w-full overflow-hidden relative" style={{
        // UPDATED: Using the image from your public folder
        backgroundImage: "url('/image.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        
        {/* Optional: Dark Overlay so text remains readable against the photo */}
        <div className="absolute inset-0 bg-black/30 z-0"></div>

        {/* Floating Hearts */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(15)].map((_, i) => (
            <div 
              key={`heart-${i}`} 
              className="absolute text-2xl opacity-0"
              style={{
                top: '110%',
                left: `${Math.random() * 100}%`,
                animation: `heart-float ${8 + Math.random() * 6}s infinite linear`,
                animationDelay: `${Math.random() * 5}s`,
                '--tx': `${(Math.random() - 0.5) * 150}px` as any,
                filter: 'drop-shadow(0 0 5px rgba(255,100,100,0.5))'
              }}
            >
              ❤️
            </div>
          ))}
        </div>

        {/* --- THE FLOWER --- */}
        <div className="lotus-wrapper pointer-events-none">
          <div className="lotus-stem"></div>
          <div className="lotus-flower-head">
            <div className="lotus-petal lotus-petal--1"></div>
            <div className="lotus-petal lotus-petal--2"></div>
            <div className="lotus-petal lotus-petal--3"></div>
            <div className="lotus-petal lotus-petal--4"></div>
            <div className="lotus-petal lotus-petal--5"></div>
            <div className="lotus-petal lotus-petal--6"></div>
            <div className="lotus-petal lotus-petal--7"></div>
            <div className="lotus-petal lotus-petal--8"></div>
            <div className="lotus-center-circle"></div>
          </div>
        </div>
        
        {/* --- ANIMATED GRASS --- */}
        <div className="grass-container">
          <div className="long-g long-g--1">
            <div className="grow-ans" style={{"--d": "4s"} as any}>
              <div className="leaf leaf--0"></div>
            </div>
            <div className="grow-ans" style={{"--d": "4.2s"} as any}>
              <div className="leaf leaf--1"></div>
            </div>
            <div className="grow-ans" style={{"--d": "3s"} as any}>
              <div className="leaf leaf--2"></div>
            </div>
            <div className="grow-ans" style={{"--d": "3.6s"} as any}>
              <div className="leaf leaf--3"></div>
            </div>
          </div>

          <div className="long-g long-g--2">
            <div className="grow-ans" style={{"--d": "3.8s"} as any}>
              <div className="leaf leaf--0"></div>
            </div>
            <div className="grow-ans" style={{"--d": "4.1s"} as any}>
              <div className="leaf leaf--1"></div>
            </div>
            <div className="grow-ans" style={{"--d": "3.3s"} as any}>
              <div className="leaf leaf--2"></div>
            </div>
            <div className="grow-ans" style={{"--d": "3.9s"} as any}>
              <div className="leaf leaf--3"></div>
            </div>
          </div>

          <div className="long-g long-g--3">
            <div className="grow-ans" style={{"--d": "4s"} as any}>
              <div className="leaf leaf--0"></div>
            </div>
            <div className="grow-ans" style={{"--d": "4.2s"} as any}>
              <div className="leaf leaf--1"></div>
            </div>
            <div className="grow-ans" style={{"--d": "3s"} as any}>
              <div className="leaf leaf--2"></div>
            </div>
            <div className="grow-ans" style={{"--d": "3.6s"} as any}>
              <div className="leaf leaf--3"></div>
            </div>
          </div>

          <div className="long-g long-g--4">
            <div className="grow-ans" style={{"--d": "3.7s"} as any}>
              <div className="leaf leaf--0"></div>
            </div>
            <div className="grow-ans" style={{"--d": "4.3s"} as any}>
              <div className="leaf leaf--1"></div>
            </div>
            <div className="grow-ans" style={{"--d": "3.2s"} as any}>
              <div className="leaf leaf--2"></div>
            </div>
            <div className="grow-ans" style={{"--d": "3.8s"} as any}>
              <div className="leaf leaf--3"></div>
            </div>
          </div>

          <div className="long-g long-g--5">
            <div className="grow-ans" style={{"--d": "4.1s"} as any}>
              <div className="leaf leaf--0"></div>
            </div>
            <div className="grow-ans" style={{"--d": "4s"} as any}>
              <div className="leaf leaf--1"></div>
            </div>
            <div className="grow-ans" style={{"--d": "3.4s"} as any}>
              <div className="leaf leaf--2"></div>
            </div>
            <div className="grow-ans" style={{"--d": "3.7s"} as any}>
              <div className="leaf leaf--3"></div>
            </div>
          </div>
        </div>

        <audio ref={audioRef} src="/valentines-music.mp3" />

        {/* Lyrics Display */}
        <div className="absolute z-40 top-10 left-8 max-w-lg transition-all duration-300">
          <div className="current-lyric text-white font-bold leading-tight tracking-wide" style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            textShadow: '0 4px 10px rgba(0,0,0,0.5), 0 0 20px rgba(255,105,180,0.4)',
            animation: 'lyrics-entrance 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fontFamily: '"Georgia", serif'
          }}>
            {lyrics[activeLyricIndex]?.text || 'Press play...'}
          </div>
        </div>

        {/* Player Controls */}
        <div className="absolute bottom-8 left-1/2 flex items-center z-50 bg-black/40 rounded-full backdrop-blur-md border border-white/10" style={{
          transform: 'translateX(-50%)',
          padding: '12px 24px',
          gap: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          animation: 'controls-float 4s ease-in-out infinite',
          width: 'min(90%, 450px)'
        }}>
          <button
            className="rounded-full w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-all shadow-lg border border-white/5"
            onClick={handlePlayPause}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          
          <div className="flex-grow">
            <input
              type="range"
              min="0"
              max={audioRef.current?.duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="progress-bar w-full block"
            />
          </div>
          
          <div className="text-white font-mono text-sm min-w-[3rem] text-right opacity-90">
            {formatTime(currentTime)}
          </div>
        </div>
      </div>
    </>
  );
}