import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { MetaFunction } from 'react-router'; // 1. Import this type
import { Heart, Smile, Frown, OctagonAlert } from 'lucide-react';

// 2. Add this META function to define the preview image
export const meta: MetaFunction = () => {
  return [
    { title: "Happy Valentines!! 💗" },
    { name: "description", content: "✨ Are you ready to see more? ✨" },
    
    // This sets the Preview Image to ddc.png
    { property: "og:image", content: "/ddc.png" },
    { property: "og:title", content: "Happy Valentines!! 💗" },
    { property: "og:description", content: "✨ Are you ready to see more? ✨" },
    
    // Twitter / X settings
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: "/ddc.png" },
  ];
};

export default function Valentines() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const handleYes = () => {
    navigate('/home');
  };

  const handleNo = () => {
    if (step < 2) {
      setStep(step + 1);
    }
  };

  const steps = [
    {
      title: '💗 Happy Valentines!! 💗',
      message: '✨ Are you ready to see more? ✨',
      image: '/valentines.webp',
      icon: <Smile className="w-full h-full text-yellow-300 drop-shadow-md" />,
    },
    {
      title: '🥺 Why not ready? 🥺',
      message: '💕 Please say yes!! 💕',
      image: '/please.webp',
      icon: <Frown className="w-full h-full text-blue-300 drop-shadow-md" />,
    },
    {
      title: '😤 You need to say yes 😤',
      message: '⏰ right now! ⏰',
      image: '/needtosayyes.webp',
      icon: <OctagonAlert className="w-full h-full text-red-500 drop-shadow-md" />,
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-gradient-to-br from-red-500 via-pink-400 to-red-400 relative overflow-hidden px-4 py-6">
      
      {/* Background Hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            <Heart
              size={Math.random() * 30 + 20}
              fill="white"
              stroke="white"
              opacity={0.6}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideIn {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.05); }
          50% { transform: scale(1); }
          75% { transform: scale(1.05); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
        .animate-slide-in { animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-heart-beat { animation: heartBeat 1.5s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s infinite ease-in-out; }
      `}</style>

      {/* Main Card Content */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center animate-slide-in">
        
        {/* Step Image */}
        {currentStep.image && (
          <div className="mb-6 flex justify-center animate-heart-beat">
            <img
              src={currentStep.image}
              alt={currentStep.title}
              className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-2xl shadow-xl border-4 border-white/50"
            />
          </div>
        )}

        {/* Lucide Icon Display */}
        <div className="w-20 h-20 mb-4 animate-bounce-slow">
          {currentStep.icon}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 text-center drop-shadow-lg leading-tight px-2">
          {currentStep.title}
        </h1>

        {/* Message */}
        <p className="text-lg text-white/90 mb-8 text-center font-medium drop-shadow-md px-4">
          {currentStep.message}
        </p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 px-4">
          <button
            onClick={handleYes}
            className="w-full py-4 bg-white text-red-500 font-extrabold text-xl rounded-full shadow-lg transform transition active:scale-95 duration-200 border-b-4 border-red-200 hover:bg-red-50 flex items-center justify-center gap-2"
          >
            <span>Yes</span>
            <Heart size={24} fill="currentColor" />
          </button>
          
          {step < 2 && (
            <button
              onClick={handleNo}
              className="w-full py-4 bg-red-800/20 backdrop-blur-sm text-white font-bold text-xl rounded-full shadow-lg transform transition active:scale-95 duration-200 border-2 border-white/30 hover:bg-red-800/30"
            >
              No
            </button>
          )}

          {step === 2 && (
            <div className="text-white text-center text-sm opacity-75 mt-2 animate-pulse">
               (You actually have no choice... 😉)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}