import React from 'react';
import {
  Medal,
  Award,
  Trophy,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { getMemberTier, MemberTierInfo, TierLevel } from '../utils/memberTier';

interface MemberTierBadgeProps {
  referralsCount: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const MemberTierBadge: React.FC<MemberTierBadgeProps> = ({
  referralsCount,
  size = 'md',
  showDetails = false,
}) => {
  const tierInfo = getMemberTier(referralsCount);

  const getTierIcon = (level: TierLevel, iconSize: string) => {
    switch (level) {
      case 'diamond':
        return <Sparkles className={`${iconSize} text-cyan-500 fill-cyan-400`} />;
      case 'gold':
        return <Trophy className={`${iconSize} text-amber-500 fill-amber-400`} />;
      case 'silver':
        return <Award className={`${iconSize} text-slate-500 fill-slate-300`} />;
      case 'bronze':
      default:
        return <Medal className={`${iconSize} text-amber-700 fill-amber-600`} />;
    }
  };

  if (!showDetails) {
    const sizeClasses = {
      sm: 'text-[10px] px-2 py-0.5 gap-1',
      md: 'text-xs px-2.5 py-1 gap-1.5',
      lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
    }[size];

    const iconSizes = {
      sm: 'w-3 h-3',
      md: 'w-3.5 h-3.5',
      lg: 'w-4 h-4',
    }[size];

    return (
      <span
        className={`inline-flex items-center font-bold rounded-full border shadow-2xs font-display ${tierInfo.tailwindBg} ${tierInfo.tailwindText} ${tierInfo.tailwindBorder} ${sizeClasses}`}
        title={`${tierInfo.nameEnglish} (${tierInfo.nameHindi}) - ${referralsCount} Referrals`}
      >
        {getTierIcon(tierInfo.level, iconSizes)}
        <span>{tierInfo.nameEnglish}</span>
      </span>
    );
  }

  // Full Progression Card for UserDashboard
  return (
    <div className={`rounded-xl border p-4 sm:p-5 shadow-xs space-y-4 ${tierInfo.tailwindBg} ${tierInfo.tailwindBorder}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-xs flex items-center justify-center shrink-0">
            {getTierIcon(tierInfo.level, 'w-6 h-6')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className={`text-base font-black font-display ${tierInfo.tailwindText}`}>
                {tierInfo.nameEnglish} ({tierInfo.nameHindi})
              </h4>
              <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-full font-bold text-slate-700">
                Tier {tierInfo.level.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              सक्रिय रेफरल्स: <strong className="font-mono-acc text-slate-900">{referralsCount} साथी</strong>
            </p>
          </div>
        </div>

        {tierInfo.nextTierName && (
          <div className="text-left sm:text-right text-xs bg-white/80 p-2.5 rounded-lg border border-gray-200/80">
            <span className="text-slate-500 block text-[11px]">अगला टियर:</span>
            <span className="font-bold text-[#2874f0] flex items-center gap-1">
              <span>{tierInfo.nextTierName}</span>
            </span>
            <span className="text-[10px] text-slate-500">
              केवल <strong>{tierInfo.remainingForNext} रेफरल</strong> और बाकी
            </span>
          </div>
        )}
      </div>

      {/* Progression Bar */}
      {tierInfo.nextTierName && (
        <div className="space-y-1.5 bg-white/70 p-3 rounded-lg border border-gray-200/60">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700">टियर प्रगति (Tier Progress):</span>
            <span className="font-mono-acc font-bold text-[#2874f0]">
              {tierInfo.progressPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2874f0] to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${tierInfo.progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Unlocked Perks Grid */}
      <div className="pt-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
          आपके एक्टिव टियर अधिकार व सुविधाएं (Unlocked Perks):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {tierInfo.perks.map((perk, i) => (
            <div
              key={i}
              className="bg-white p-2 rounded-md border border-gray-200 flex items-center gap-2 text-slate-700"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{perk}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
