import { useState, useRef, useEffect, useMemo } from 'react';
import { Heart, Play, Pause, X, Image as ImageIcon, Gift } from 'lucide-react';

// --- CSS STYLES ---
const styles = `
  /* --- GLOBAL KEYFRAMES --- */
  @keyframes heart-float {
    0% { transform: translateY(0) scale(0.5) rotateZ(0deg) translateX(var(--tx, 0px)); opacity: 0; }
    10% { opacity: 0.8; }
    90% { opacity: 0.8; }
    100% { transform: translateY(-120vh) scale(1) rotateZ(360deg) translateX(var(--tx, 0px)); opacity: 0; }
  }

  @keyframes stem-grow {
    0% { height: 0; }
    100% { height: var(--stem-h, 200px); }
  }

  @keyframes sway {
    0% { transform: rotate(-5deg); }
    100% { transform: rotate(5deg); }
  }

  @keyframes flower-bloom {
    0% { transform: scale(0); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes center-glow {
    0%, 100% { box-shadow: 0 0 5px rgba(255, 255, 200, 0.6); transform: translateX(-50%) scale(1); }
    50% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.9); transform: translateX(-50%) scale(1.1); }
  }

  @keyframes lyrics-entrance {
    from { opacity: 0; transform: translateX(-20px) scale(0.95); }
    to { opacity: 1; transform: translateX(0) scale(1); }
  }

  @keyframes controls-float {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-5px); }
  }

  /* --- MODAL ANIMATIONS --- */
  @keyframes modal-overlay-in {
    from { opacity: 0; backdrop-filter: blur(0px); }
    to { opacity: 1; backdrop-filter: blur(8px); }
  }

  @keyframes modal-pop {
    0% { transform: scale(0.5); opacity: 0; }
    70% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }

  /* --- FLOWER WRAPPERS --- */
  .flower-position-wrapper {
    position: absolute;
    transform-origin: bottom center;
    z-index: 10;
  }

  .flower-sway-inner {
    width: 100%; height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
    transform-origin: bottom center;
  }

  /* --- TULIP SPECIFIC --- */
  .tulip-head-group {
    position: absolute; bottom: 100%; width: 60px; height: 80px;
    animation: flower-bloom 1.5s ease-out var(--d, 0s) backwards;
    transform-origin: bottom center;
  }
  .t-petal {
    position: absolute; bottom: 0;
    background: linear-gradient(to top, #db2777, #fbcfe8);
    border-radius: 50% 50% 20% 20%;
    transform-origin: bottom center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }
  .t-petal.center { width: 40px; height: 65px; left: 10px; z-index: 2; background: linear-gradient(to top, #be185d, #f472b6); }
  .t-petal.left { width: 35px; height: 60px; left: 0; transform: rotate(-15deg); z-index: 1; }
  .t-petal.right { width: 35px; height: 60px; right: 0; transform: rotate(15deg); z-index: 1; }

  /* --- DAISY SPECIFIC --- */
  .daisy-head-group {
    position: absolute; bottom: 100%; width: 60px; height: 60px;
    animation: flower-bloom 1.5s ease-out var(--d, 0s) backwards;
  }
  .daisy-center {
    position: absolute; top: 50%; left: 50%;
    width: 20px; height: 20px;
    background: radial-gradient(circle, #facc15, #ca8a04);
    border-radius: 50%; transform: translate(-50%, -50%); z-index: 5;
    box-shadow: 0 0 5px rgba(0,0,0,0.2);
  }
  .daisy-petal {
    position: absolute; top: 50%; left: 50%;
    width: 12px; height: 35px; background: white; border-radius: 50%;
    transform-origin: center bottom; z-index: 1;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .dp-1 { transform: translate(-50%, -100%) rotate(0deg); }
  .dp-2 { transform: translate(-50%, -100%) rotate(45deg); }
  .dp-3 { transform: translate(-50%, -100%) rotate(90deg); }
  .dp-4 { transform: translate(-50%, -100%) rotate(135deg); }
  .dp-5 { transform: translate(-50%, -100%) rotate(180deg); }
  .dp-6 { transform: translate(-50%, -100%) rotate(225deg); }
  .dp-7 { transform: translate(-50%, -100%) rotate(270deg); }
  .dp-8 { transform: translate(-50%, -100%) rotate(315deg); }

  /* --- LOTUS CENTER SPECIFIC --- */
  .lotus-position-wrapper {
      position: absolute; bottom: 15px; left: 50%;
      transform: translateX(-50%) scale(1.3); z-index: 20;
  }
  .lotus-sway-inner {
      display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
      transform-origin: bottom center;
  }
  .lotus-head-group {
      position: absolute; bottom: 100%; width: 100px; height: 90px;
      animation: flower-bloom 2s ease-out 1.5s backwards;
  }
  .l-petal {
      position: absolute; bottom: 5px; left: 50%; width: 30px; height: 75px; margin-left: -15px;
      background: linear-gradient(to top, #ff69b4, rgba(255, 255, 255, 0.9));
      border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
      transform-origin: bottom center;
      box-shadow: inset 0 0 10px rgba(255,255,255,0.4); mix-blend-mode: screen;
  }
  .lp-1 { transform: rotate(0deg) rotateX(20deg); z-index: 5; }
  .lp-2 { transform: rotate(45deg) rotateX(20deg); z-index: 4;}
  .lp-3 { transform: rotate(90deg) rotateX(20deg); z-index: 3;}
  .lp-4 { transform: rotate(135deg) rotateX(20deg); z-index: 2;}
  .lp-5 { transform: rotate(180deg) rotateX(20deg); z-index: 1;}
  .lp-6 { transform: rotate(225deg) rotateX(20deg); z-index: 2;}
  .lp-7 { transform: rotate(270deg) rotateX(20deg); z-index: 3;}
  .lp-8 { transform: rotate(315deg) rotateX(20deg); z-index: 4;}
  .lotus-center-glow {
      position: absolute; bottom: -5px; left: 50%; width: 25px; height: 25px;
      background: radial-gradient(circle, #fff, #ffd700); border-radius: 50%;
      transform: translateX(-50%); z-index: 10;
      animation: center-glow 3s ease-in-out infinite alternate;
  }

  /* --- SHARED STEM & LEAF --- */
  .stem {
    width: 6px; background: linear-gradient(to right, #4ade80, #15803d); border-radius: 4px;
    animation: stem-grow 1s ease-out var(--d, 0s) backwards; transform-origin: bottom center;
  }
  .stem.thick { width: 10px; border-radius: 6px; }
  .leaf-generic {
    position: absolute; bottom: 20px; width: 20px; height: 50px;
    background: #22c55e; border-radius: 0 50% 0 50%;
    animation: flower-bloom 1s ease-out var(--d, 0.5s) backwards;
  }
  .leaf-l { left: -15px; transform: rotate(-30deg); }
  .leaf-r { right: -15px; transform: scaleX(-1) rotate(-30deg); }

  /* GRASS & UI */
  .grass-container {
    position: absolute; bottom: 0; left: 0; width: 100%; height: 160px;
    z-index: 25; pointer-events: none; overflow: hidden;
    background: linear-gradient(to bottom, transparent 0%, rgba(45, 90, 61, 0.4) 70%, #2d5a3d 100%);
  }
  .progress-bar {
    width: 100%; height: 4px; border-radius: 2px;
    background: rgba(255, 255, 255, 0.2); outline: none; -webkit-appearance: none; appearance: none; cursor: pointer;
  }
  .progress-bar::-webkit-slider-thumb {
    -webkit-appearance: none; width: 12px; height: 12px;
    border-radius: 50%; background: white; cursor: pointer;
    box-shadow: 0 0 10px rgba(255, 255, 255, 1); transition: transform 0.2s;
  }
`;

// --- FLOWER COMPONENTS ---

const Tulip = ({ x, scale, delay, height, isPlaying }: any) => (
  <div className="flower-position-wrapper" style={{ left: x, bottom: '15px', transform: `scale(${scale})` }}>
    <div className="flower-sway-inner" style={{
        animation: `sway ${4 + Math.random() * 2}s ease-in-out infinite alternate`,
        animationPlayState: isPlaying ? 'running' : 'paused'
    }}>
      <div className="stem" style={{ height: `${height}px`, '--d': delay } as any}>
        <div className="leaf-generic leaf-l" style={{ '--d': delay } as any}></div>
      </div>
      <div className="tulip-head-group" style={{ '--d': delay } as any}>
        <div className="t-petal left"></div>
        <div className="t-petal right"></div>
        <div className="t-petal center"></div>
      </div>
    </div>
  </div>
);

const Daisy = ({ x, scale, delay, height, isPlaying }: any) => (
  <div className="flower-position-wrapper" style={{ left: x, bottom: '15px', transform: `scale(${scale})` }}>
    <div className="flower-sway-inner" style={{
        animation: `sway ${3 + Math.random() * 2}s ease-in-out infinite alternate-reverse`,
        animationPlayState: isPlaying ? 'running' : 'paused'
    }}>
      <div className="stem" style={{ height: `${height}px`, '--d': delay } as any}>
        <div className="leaf-generic leaf-r" style={{ '--d': delay } as any}></div>
      </div>
      <div className="daisy-head-group" style={{ '--d': delay } as any}>
        <div className="daisy-petal dp-1"></div>
        <div className="daisy-petal dp-2"></div>
        <div className="daisy-petal dp-3"></div>
        <div className="daisy-petal dp-4"></div>
        <div className="daisy-petal dp-5"></div>
        <div className="daisy-petal dp-6"></div>
        <div className="daisy-petal dp-7"></div>
        <div className="daisy-petal dp-8"></div>
        <div className="daisy-center"></div>
      </div>
    </div>
  </div>
);

const LotusCenter = ({ isPlaying }: { isPlaying: boolean }) => (
    <div className="lotus-position-wrapper">
        <div className="lotus-sway-inner" style={{
            animation: `sway 5s ease-in-out infinite alternate`,
            animationPlayState: isPlaying ? 'running' : 'paused'
        }}>
            <div className="stem thick" style={{ height: `350px`, '--d': '1s' } as any}></div>
            <div className="lotus-head-group">
                <div className="l-petal lp-1"></div>
                <div className="l-petal lp-2"></div>
                <div className="l-petal lp-3"></div>
                <div className="l-petal lp-4"></div>
                <div className="l-petal lp-5"></div>
                <div className="l-petal lp-6"></div>
                <div className="l-petal lp-7"></div>
                <div className="l-petal lp-8"></div>
                <div className="lotus-center-glow"></div>
            </div>
        </div>
    </div>
)

// --- MAIN PAGE ---

interface LyricLine { time: number; text: string; }

export default function ValentinesSurprise() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  // --- MODAL STATES ---
  const [showModal, setShowModal] = useState(true);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const flowers = useMemo(() => {
    const items = [];
    for (let i = 0; i < 7; i++) {
      items.push({ type: 'tulip', id: `t-${i}`, x: `${5 + Math.random() * 90}%`, scale: 0.5 + Math.random() * 0.5, delay: `${Math.random() * 1.5}s`, height: 140 + Math.random() * 80 });
    }
    for (let i = 0; i < 7; i++) {
      items.push({ type: 'daisy', id: `d-${i}`, x: `${5 + Math.random() * 90}%`, scale: 0.4 + Math.random() * 0.4, delay: `${Math.random() * 2}s`, height: 110 + Math.random() * 60 });
    }
    return items.sort((a, b) => a.scale - b.scale);
  }, []);

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
      const currentIndex = lyrics.findIndex((line, index) => audio.currentTime >= line.time && (index === lyrics.length - 1 || audio.currentTime < lyrics[index + 1].time));
      if (currentIndex !== -1) setActiveLyricIndex(currentIndex);
    };
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    return () => { audio.removeEventListener('timeupdate', updateTime); audio.removeEventListener('ended', handleEnded); }
  }, [lyrics]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) { audioRef.current.currentTime = time; setCurrentTime(time); }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isMounted) return <div className="h-screen bg-black" />;

  return (
    <>
      <style>{styles}</style>
      <div className="flex items-center justify-center h-screen w-full overflow-hidden relative" style={{
        backgroundImage: "url('/image.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        
        <div className="absolute inset-0 bg-black/30 z-0"></div>

        {/* --- MAIN MESSAGE MODAL --- */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{
            animation: 'modal-overlay-in 0.5s ease-out forwards',
            background: 'rgba(0, 0, 0, 0.6)'
          }} onClick={() => setShowModal(false)}>
            
            <div 
              className="relative bg-white p-2 sm:p-4 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col items-center transform transition-all overflow-y-auto"
              style={{ animation: 'modal-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              onClick={(e) => e.stopPropagation()} 
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 bg-gray-200 text-gray-700 p-1 rounded-full hover:bg-gray-300 transition-colors z-20"
              >
                <X size={20} />
              </button>

              <div className="bg-red-50 p-2 sm:p-3 rounded-lg w-full flex justify-center items-center border-2 border-red-100 border-dashed mb-3">
                <img 
                  src="/kel.png" 
                  alt="Special Surprise" 
                  className="rounded shadow-md max-h-[35vh] object-contain w-auto" 
                />
              </div>
              
              <div className="w-full px-2 text-center">
                 <h3 className="text-xl font-bold text-red-500 mb-2" style={{ fontFamily: 'Georgia, serif'}}>Hello Kel,</h3>
                 
                 <div className="text-gray-700 text-sm leading-relaxed space-y-2 text-justify" style={{ fontFamily: 'Georgia, serif' }}>
                    <p>
                      I just want to thank you for being here with me and for the bonding moments we share. I hope we’ll have even more beautiful memories together in our lives. Sana maging okay na ang lahat.
                    </p>
                    <p>
                      Always remember, I’m here for you. I will never leave you. Keep that in your heart always.
                    </p>
                    <p className="font-semibold text-red-400">
                      Happy Valentine’s! You truly deserve this, and you deserve love and happiness always.
                    </p>
                    <p>
                      As a simple gift, I made a website for you. Sana ma-appreciate mo, it’s my way of showing how much you mean to me.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* --- SURPRISE MODAL (Triggered by button) --- */}
        {showSurpriseModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" style={{
            animation: 'modal-overlay-in 0.3s ease-out forwards',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)'
          }} onClick={() => setShowSurpriseModal(false)}>
            
            <div 
              className="relative bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all"
              style={{ animation: 'modal-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
              onClick={(e) => e.stopPropagation()} 
            >
               <button 
                onClick={() => setShowSurpriseModal(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 p-2"
              >
                <X size={20} />
              </button>
              
              <div className="mb-4 flex justify-center">
                 <Gift size={48} className="text-pink-500 animate-bounce" />
              </div>
              
              <h3 className="text-2xl font-bold text-pink-600 mb-2" style={{ fontFamily: 'Georgia, serif'}}>Surprise!</h3>
              <p className="text-gray-700 text-lg leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                A surprise is coming! <br/> Thank you so much, Kel!
              </p>
            </div>
          </div>
        )}

        {/* --- RE-OPEN BUTTON (Top Right) --- */}
        {!showModal && (
          <button 
            onClick={() => setShowModal(true)}
            className="absolute top-4 right-4 z-[60] bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-3 rounded-full shadow-lg border border-white/30 transition-all active:scale-95"
            title="Read Message"
          >
            <ImageIcon size={24} />
          </button>
        )}

        {/* --- FLOATING HEARTS --- */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(15)].map((_, i) => (
            <div 
              key={`heart-${i}`} 
              className="absolute opacity-0"
              style={{
                top: '110%', left: `${Math.random() * 100}%`,
                animation: `heart-float ${8 + Math.random() * 6}s infinite linear`,
                animationDelay: `${Math.random() * 5}s`,
                '--tx': `${(Math.random() - 0.5) * 150}px` as any,
              }}
            >
              <Heart size={32} fill="#ef4444" stroke="#ef4444" style={{ filter: 'drop-shadow(0 0 5px rgba(255,100,100,0.5))' }} />
            </div>
          ))}
        </div>

        {/* --- FLOWER FIELD --- */}
        {flowers.map((f) => (
          f.type === 'tulip' 
            ? <Tulip key={f.id} x={f.x} scale={f.scale} delay={f.delay} height={f.height} isPlaying={isPlaying} />
            : <Daisy key={f.id} x={f.x} scale={f.scale} delay={f.delay} height={f.height} isPlaying={isPlaying} />
        ))}
        <LotusCenter isPlaying={isPlaying} />
        <div className="grass-container"></div>

        <audio ref={audioRef} src="/valentines-music.mp3" />

        {/* Lyrics & Button Container */}
        <div className="absolute z-40 top-10 left-8 max-w-lg transition-all duration-300 pointer-events-none flex flex-col items-start gap-4">
          <div className="current-lyric text-white font-bold leading-tight tracking-wide" style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            textShadow: '0 4px 10px rgba(0,0,0,0.5), 0 0 20px rgba(255,105,180,0.4)',
            animation: 'lyrics-entrance 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fontFamily: '"Georgia", serif'
          }}>
            {lyrics[activeLyricIndex]?.text || 'Press play...'}
          </div>

          {/* New "Click this button" - with pointer-events-auto enabled */}
          <button 
            onClick={() => setShowSurpriseModal(true)}
            className="pointer-events-auto px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] active:scale-95 flex items-center gap-2"
          >
            Click this button
          </button>
        </div>

        {/* Player Controls */}
        <div className="absolute bottom-8 left-1/2 flex items-center z-50 bg-black/40 rounded-full backdrop-blur-md border border-white/10" style={{
          transform: 'translateX(-50%)', padding: '12px 24px', gap: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          animation: isPlaying ? 'controls-float 4s ease-in-out infinite' : 'none',
          width: 'min(90%, 450px)'
        }}>
          <button className="rounded-full w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-all shadow-lg border border-white/5" onClick={handlePlayPause}>
            {isPlaying ? <Pause size={20} fill="white" stroke="white" /> : <Play size={20} fill="white" stroke="white" className="ml-1" />}
          </button>
          <div className="flex-grow">
            <input type="range" min="0" max={audioRef.current?.duration || 0} value={currentTime} onChange={handleSeek} className="progress-bar w-full block" />
          </div>
          <div className="text-white font-mono text-sm min-w-[3rem] text-right opacity-90">{formatTime(currentTime)}</div>
        </div>
      </div>
    </>
  );
}