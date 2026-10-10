import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  Trophy,
  Award,
  X,
  RotateCcw,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export interface CelebrationProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  subtitle?: string;
  type?: 'registration' | 'profile' | 'withdrawal' | 'generic';
  memberName?: string;
  accId?: string;
  duration?: number; // Auto close duration in ms, default 5000 (0 = no auto close)
}

/**
 * Fires multi-cannon celebratory confetti burst across the screen
 */
export function fireCelebrationConfetti(intensity: 'high' | 'medium' = 'high') {
  try {
    const count = intensity === 'high' ? 120 : 60;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    // Cannon 1 - Left
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.4),
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.65 },
      colors: ['#2874f0', '#ffe500', '#10b981', '#fb641b', '#8b5cf6'],
    });

    // Cannon 2 - Right
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.4),
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.65 },
      colors: ['#2874f0', '#ffe500', '#10b981', '#fb641b', '#ec4899'],
    });

    // Cannon 3 - Center Fireworks
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.5),
        spread: 100,
        origin: { x: 0.5, y: 0.55 },
        colors: ['#ffe500', '#2874f0', '#10b981', '#ffffff'],
      });
    }, 250);
  } catch (err) {
    console.debug('Confetti canvas not supported or blocked:', err);
  }
}

export const CelebrationSuccessAnimation: React.FC<CelebrationProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  type = 'profile',
  memberName,
  accId,
  duration = 4500,
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
    if (isOpen) {
      // Fire confetti burst upon opening
      fireCelebrationConfetti(type === 'registration' ? 'high' : 'medium');

      // Auto close if duration > 0
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, type, duration, onClose]);

  if (!isVisible) return null;

  const handleReplay = () => {
    fireCelebrationConfetti('high');
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-2xl text-center space-y-4 animate-scaleUp overflow-hidden"
      >
        {/* Top Decorative Confetti Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#2874f0] via-[#ffe500] via-emerald-500 to-[#fb641b]" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
          aria-label="बंद करें"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dynamic Center Badge Icon with Glow */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-md animate-pulse" />
          <div className="relative w-18 h-18 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg border-3 border-white">
            {type === 'registration' ? (
              <Trophy className="w-9 h-9 text-yellow-200" />
            ) : type === 'profile' ? (
              <UserCheck className="w-9 h-9 text-white" />
            ) : (
              <CheckCircle2 className="w-9 h-9 text-white" />
            )}
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Success Verified</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900 tracking-tight leading-snug">
            {title}
          </h3>

          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              {subtitle}
            </p>
          )}

          {memberName && (
            <p className="text-xs font-semibold text-slate-800 pt-1">
              सदस्य:{' '}
              <span className="text-[#2874f0] font-bold">{memberName}</span>
            </p>
          )}

          {accId && (
            <div className="pt-2">
              <span className="inline-block bg-blue-50 text-[#2874f0] border border-blue-200 font-mono-acc font-black text-xs sm:text-sm px-3 py-1 rounded-md">
                ACC 🆔: {accId}
              </span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={handleReplay}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            title="दोबारा कॉन्फेटी उड़ाएं"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#2874f0]" />
            <span>Celebrate 🎉</span>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            जारी रखें (Continue)
          </button>
        </div>
      </div>
    </div>
  );
};
