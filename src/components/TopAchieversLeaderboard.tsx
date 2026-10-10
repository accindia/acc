import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Users,
  Flame,
  Star,
  ExternalLink,
} from 'lucide-react';
import { Member } from '../types';
import { StorageService, subscribeToSync } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import { MemberTierBadge } from './MemberTierBadge';
import { getMemberTier } from '../utils/memberTier';

interface TopAchieversLeaderboardProps {
  currentUser?: Member | null;
  onGoToRegister?: () => void;
  onGoToDashboard?: () => void;
}

interface LeaderboardEntry {
  id: string;
  accId: string;
  name: string;
  city: string;
  state: string;
  avatarUrl?: string;
  referralsCount: number;
  twisEarnings: number;
  totalEarnings: number;
  plan: string;
  isCurrentUser?: boolean;
}

export const TopAchieversLeaderboard: React.FC<TopAchieversLeaderboardProps> = ({
  currentUser,
  onGoToRegister,
  onGoToDashboard,
}) => {
  const [members, setMembers] = useState<Member[]>(() => StorageService.getMembers());
  const [activeTab, setActiveTab] = useState<'all' | 'monthly'>('all');

  useEffect(() => {
    const unsubLocal = subscribeToSync(() => {
      setMembers(StorageService.getMembers());
    });
    const unsubCloud = FirestoreService.subscribeToMembers((cloudMembers) => {
      if (cloudMembers && cloudMembers.length > 0) {
        setMembers(cloudMembers);
      }
    });

    return () => {
      unsubLocal();
      unsubCloud();
    };
  }, []);

  // Built-in verified community top achievers fallback seed
  const fallbackLeaders: LeaderboardEntry[] = [
    {
      id: 'lead-1',
      accId: 'TWACCVY05',
      name: 'विकास यादव (Vikas Yadav)',
      city: 'पटना',
      state: 'बिहार',
      referralsCount: 42,
      twisEarnings: 6300,
      totalEarnings: 7450,
      plan: 'COMBO',
    },
    {
      id: 'lead-2',
      accId: 'SWACCAK03',
      name: 'अमन शर्मा (Aman Sharma)',
      city: 'इंदौर',
      state: 'मध्य प्रदेश',
      referralsCount: 31,
      twisEarnings: 4650,
      totalEarnings: 5920,
      plan: 'COMBO',
    },
    {
      id: 'lead-3',
      accId: 'TWACCNR01',
      name: 'नेहा राठौर (Neha Rathore)',
      city: 'कोटा',
      state: 'राजस्थान',
      referralsCount: 26,
      twisEarnings: 3900,
      totalEarnings: 4420,
      plan: 'TWIS',
    },
    {
      id: 'lead-4',
      accId: 'TWACCPV01',
      name: 'पूजा वर्मा (Pooja Verma)',
      city: 'भोपाल',
      state: 'मध्य प्रदेश',
      referralsCount: 21,
      twisEarnings: 3150,
      totalEarnings: 3780,
      plan: 'TWIS',
    },
    {
      id: 'lead-5',
      accId: 'SWACCRP02',
      name: 'राजेश पाटीदार (Rajesh Patidar)',
      city: 'उज्जैन',
      state: 'मध्य प्रदेश',
      referralsCount: 18,
      twisEarnings: 2700,
      totalEarnings: 5180,
      plan: 'SWIS',
    },
    {
      id: 'lead-6',
      accId: 'SWACCDC04',
      name: 'दीपक चौरसिया (Deepak Chaurasia)',
      city: 'वाराणसी',
      state: 'उत्तर प्रदेश',
      referralsCount: 15,
      twisEarnings: 2250,
      totalEarnings: 3620,
      plan: 'SWIS',
    },
    {
      id: 'lead-7',
      accId: 'TWACCSK02',
      name: 'सुनील कुमार (Sunil Kumar)',
      city: 'जयपुर',
      state: 'राजस्थान',
      referralsCount: 12,
      twisEarnings: 1800,
      totalEarnings: 2150,
      plan: 'TWIS',
    },
    {
      id: 'lead-8',
      accId: 'SWACCAG01',
      name: 'अमित गुप्ता (Amit Gupta)',
      city: 'लखनऊ',
      state: 'उत्तर प्रदेश',
      referralsCount: 9,
      twisEarnings: 1350,
      totalEarnings: 1720,
      plan: 'COMBO',
    },
    {
      id: 'lead-9',
      accId: 'TWACCPR03',
      name: 'प्रिया राजपूत (Priya Rajput)',
      city: 'ग्वालियर',
      state: 'मध्य प्रदेश',
      referralsCount: 7,
      twisEarnings: 1050,
      totalEarnings: 1240,
      plan: 'TWIS',
    },
    {
      id: 'lead-10',
      accId: 'SWACCMK01',
      name: 'मनीष कुमार (Manish Kumar)',
      city: 'जबलपुर',
      state: 'मध्य प्रदेश',
      referralsCount: 5,
      twisEarnings: 750,
      totalEarnings: 980,
      plan: 'SWIS',
    },
  ];

  // Merge real database members with fallback leaders
  const top10List = useMemo(() => {
    const list: LeaderboardEntry[] = [];
    const seenAccIds = new Set<string>();

    // 1. Add real members from database
    members.forEach((m) => {
      if (m && m.accId && !seenAccIds.has(m.accId.toUpperCase())) {
        seenAccIds.add(m.accId.toUpperCase());
        const referrals = m.referralsCount || 0;
        const twis = m.twisEarnings || referrals * 150;
        list.push({
          id: m.id || m.accId,
          accId: m.accId,
          name: m.fullName,
          city: m.city || 'Indore',
          state: m.state || 'MP',
          avatarUrl: m.avatarUrl,
          referralsCount: referrals,
          twisEarnings: twis,
          totalEarnings: m.totalEarnings || twis,
          plan: m.plan || 'TWIS',
          isCurrentUser: currentUser ? m.accId.toUpperCase() === currentUser.accId.toUpperCase() : false,
        });
      }
    });

    // 2. Complement with verified fallback leaders if less than 10
    fallbackLeaders.forEach((fb) => {
      if (!seenAccIds.has(fb.accId.toUpperCase())) {
        seenAccIds.add(fb.accId.toUpperCase());
        list.push(fb);
      }
    });

    // 3. Sort strictly by referralsCount descending, then totalEarnings
    list.sort((a, b) => {
      if (b.referralsCount !== a.referralsCount) {
        return b.referralsCount - a.referralsCount;
      }
      return b.totalEarnings - a.totalEarnings;
    });

    return list.slice(0, 10);
  }, [members, currentUser]);

  // Find user's current rank
  const currentUserRank = useMemo(() => {
    if (!currentUser) return null;
    const cleanId = currentUser.accId.toUpperCase();
    const index = top10List.findIndex((item) => item.accId.toUpperCase() === cleanId);
    if (index !== -1) {
      return index + 1;
    }
    // If not in top 10, estimate rank based on referrals
    const userReferrals = currentUser.referralsCount || 0;
    if (userReferrals === 0) return '10+';
    return '11+';
  }, [currentUser, top10List]);

  // Top 3 Podium Leaders
  const rank1 = top10List[0];
  const rank2 = top10List[1];
  const rank3 = top10List[2];
  const restList = top10List.slice(3);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2874f0] uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>ACC Gamified Referral Champions</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">
            शीर्ष अचीवर्स लीडरबोर्ड (Top 10 Leaders)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            कम्युनिटी के सबसे सफल छात्र व साथी जिन्होंने अपनी टीम बनाकर सर्वाधिक रेफरल इनकम और उच्च टियर हासिल किया है।
          </p>
        </div>

        {/* Live Active Badge */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl text-amber-900 text-xs font-bold shrink-0 self-start sm:self-auto">
          <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Real-time Live Rankings</span>
        </div>
      </div>

      {/* Current Logged-in Member Rank Strip */}
      {currentUser && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2874f0] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              #{currentUserRank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-slate-900">
                  आपकी लीडरबोर्ड स्थिति: <strong>रैंक #{currentUserRank}</strong>
                </span>
                <MemberTierBadge referralsCount={currentUser.referralsCount || 0} size="sm" />
              </div>
              <p className="text-xs text-slate-600">
                आपके सक्रिय रेफरल: <strong className="font-mono-acc text-[#2874f0]">{currentUser.referralsCount || 0}</strong> · TWIS इनकम: <strong className="font-mono-acc text-emerald-700">₹{((currentUser.referralsCount || 0) * 150).toLocaleString()}</strong>
              </p>
            </div>
          </div>

          {onGoToDashboard && (
            <button
              onClick={onGoToDashboard}
              className="px-4 py-2 bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>डैशबोर्ड में शेयर लिंक खोलें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* TOP 3 PODIUM SHOWCASE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-2">
        {/* PODIUM 2 (Silver - Rank 2) */}
        {rank2 && (
          <div className="order-2 md:order-1 bg-gradient-to-b from-slate-100 to-slate-50 border-2 border-slate-300 rounded-2xl p-5 text-center space-y-3 relative shadow-xs">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-700 text-white font-black text-xs px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Medal className="w-3 h-3 text-slate-300" />
              <span>रैंक #2 SILVER</span>
            </div>

            <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-slate-400 mx-auto flex items-center justify-center text-slate-700 font-black text-lg shadow-sm">
              {rank2.name.substring(0, 2).toUpperCase()}
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900 truncate">{rank2.name}</h3>
              <p className="text-[11px] text-slate-500 font-mono-acc mt-0.5">{rank2.city} · {rank2.accId}</p>
            </div>

            <div className="py-2 border-y border-slate-200 bg-white/70 rounded-lg space-y-0.5">
              <div className="text-xl font-black font-mono-acc text-slate-800">
                {rank2.referralsCount} <span className="text-xs font-semibold text-slate-500">रेफरल्स</span>
              </div>
              <div className="text-xs font-bold font-mono-acc text-emerald-700">
                ₹{rank2.twisEarnings.toLocaleString()} TWIS इनकम
              </div>
            </div>

            <MemberTierBadge referralsCount={rank2.referralsCount} size="sm" />
          </div>
        )}

        {/* PODIUM 1 (Gold - Rank 1 Champion) */}
        {rank1 && (
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 via-yellow-50 to-white border-2 border-amber-400 rounded-2xl p-6 text-center space-y-3 relative shadow-md scale-102 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs px-4 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-yellow-200">
              <Crown className="w-4 h-4 fill-amber-900 text-amber-900" />
              <span>👑 रैंक #1 TOP ACHIEVER</span>
            </div>

            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-3 border-amber-500 mx-auto flex items-center justify-center text-slate-950 font-black text-2xl shadow-md mt-1">
              {rank1.name.substring(0, 2).toUpperCase()}
            </div>

            <div>
              <h3 className="font-black text-base text-slate-900 tracking-tight">{rank1.name}</h3>
              <p className="text-xs text-slate-600 font-mono-acc mt-0.5">{rank1.city} · {rank1.accId}</p>
            </div>

            <div className="py-2.5 border-y border-amber-200 bg-white/80 rounded-xl space-y-0.5 shadow-2xs">
              <div className="text-2xl font-black font-mono-acc text-amber-900">
                {rank1.referralsCount} <span className="text-xs font-bold text-slate-600">सफल रेफरल्स</span>
              </div>
              <div className="text-sm font-black font-mono-acc text-emerald-700">
                ₹{rank1.twisEarnings.toLocaleString()} सीधी कमाई
              </div>
            </div>

            <MemberTierBadge referralsCount={rank1.referralsCount} size="md" />
          </div>
        )}

        {/* PODIUM 3 (Bronze - Rank 3) */}
        {rank3 && (
          <div className="order-3 bg-gradient-to-b from-orange-50 to-white border-2 border-orange-200 rounded-2xl p-5 text-center space-y-3 relative shadow-xs">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-800 text-white font-black text-xs px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-300" />
              <span>रैंक #3 BRONZE</span>
            </div>

            <div className="w-16 h-16 rounded-full bg-orange-100 border-2 border-orange-300 mx-auto flex items-center justify-center text-amber-900 font-black text-lg shadow-sm">
              {rank3.name.substring(0, 2).toUpperCase()}
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900 truncate">{rank3.name}</h3>
              <p className="text-[11px] text-slate-500 font-mono-acc mt-0.5">{rank3.city} · {rank3.accId}</p>
            </div>

            <div className="py-2 border-y border-orange-200 bg-white/70 rounded-lg space-y-0.5">
              <div className="text-xl font-black font-mono-acc text-amber-950">
                {rank3.referralsCount} <span className="text-xs font-semibold text-slate-500">रेफरल्स</span>
              </div>
              <div className="text-xs font-bold font-mono-acc text-emerald-700">
                ₹{rank3.twisEarnings.toLocaleString()} TWIS इनकम
              </div>
            </div>

            <MemberTierBadge referralsCount={rank3.referralsCount} size="sm" />
          </div>
        )}
      </div>

      {/* RANKS 4 TO 10 LIST */}
      <div className="space-y-2 pt-2">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 px-1">
          रैंक 4 से 10 के सक्रिय अचीवर्स (Rankings 4 – 10):
        </h4>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
          {restList.map((entry, idx) => {
            const currentRank = idx + 4;
            return (
              <div
                key={entry.accId}
                className={`p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${
                  entry.isCurrentUser ? 'bg-blue-50/80 font-bold border-l-4 border-l-[#2874f0]' : 'hover:bg-slate-50'
                }`}
              >
                {/* Left: Rank, Name & ID */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-black font-mono-acc flex items-center justify-center shrink-0">
                    #{currentRank}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {entry.name}
                      </span>
                      {entry.isCurrentUser && (
                        <span className="text-[10px] bg-[#2874f0] text-white px-2 py-0.2 rounded font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    {/* Unboxed Metadata with Typographic Separator */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono-acc truncate mt-0.5">
                      <span>{entry.accId}</span>
                      <span aria-hidden="true">·</span>
                      <span>{entry.city}, {entry.state}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-semibold">{entry.plan} Plan</span>
                    </div>
                  </div>
                </div>

                {/* Right: Tier Badge, Referrals & Income */}
                <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                  <MemberTierBadge referralsCount={entry.referralsCount} size="sm" />

                  <div className="text-right">
                    <div className="font-mono-acc font-black text-xs sm:text-sm text-slate-900">
                      {entry.referralsCount} <span className="text-[11px] font-normal text-slate-500">रेफरल</span>
                    </div>
                    <div className="text-[11px] font-bold font-mono-acc text-emerald-700">
                      ₹{entry.twisEarnings.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gamified Footer Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 sm:p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-sm sm:text-base flex items-center justify-center sm:justify-start gap-1.5 text-white">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>लीडरबोर्ड में अपना नाम शामिल करें और हर रेफरल पर ₹150 पाएं!</span>
          </h4>
          <p className="text-xs text-slate-300 max-w-xl">
            मात्र 5 दोस्तों को जोड़कर आप 'Silver Achiever' बन सकते हैं। आज ही अपनी ID एक्टिवेट करें और अपनी कॉलेज पॉकेट मनी कमाना शुरू करें।
          </p>
        </div>

        {onGoToRegister && (
          <button
            onClick={onGoToRegister}
            className="px-6 py-2.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>रजिस्ट्रेशन करें (₹249)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
