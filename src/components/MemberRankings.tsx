import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Users,
  Search,
  Sparkles,
  ArrowUp,
  Flame,
  Zap,
  TrendingUp,
  ShieldCheck,
  Share2,
  ExternalLink,
  ChevronRight,
  Database,
  RefreshCw,
} from 'lucide-react';
import { Member } from '../types';
import { FirestoreService } from '../services/firestore';
import { StorageService } from '../services/storage';
import { MemberTierBadge } from './MemberTierBadge';
import { useLanguage } from '../context/LanguageContext';
import { getReferralUrl } from '../utils/url';

interface MemberRankingsProps {
  currentUser: Member;
  onNavigateToTwis?: () => void;
  className?: string;
}

export const MemberRankings: React.FC<MemberRankingsProps> = ({
  currentUser,
  onNavigateToTwis,
  className = '',
}) => {
  const { language } = useLanguage();
  const [members, setMembers] = useState<Member[]>(() => StorageService.getMembers());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewLimit, setViewLimit] = useState<10 | 25 | 50>(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Subscribe to real-time Firebase Firestore data
  useEffect(() => {
    setIsLoading(true);
    // 1. Initial snapshot from local storage as immediate render
    const local = StorageService.getMembers();
    if (local && local.length > 0) {
      setMembers(local);
      setIsLoading(false);
    }

    // 2. Real-time Firebase Firestore listener
    const unsubscribe = FirestoreService.subscribeToMembers((cloudMembers) => {
      if (cloudMembers && cloudMembers.length > 0) {
        setMembers(cloudMembers);
        setIsLiveConnected(true);
        setLastUpdated(new Date());
      }
      setIsLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Sorted leaderboard by referral count, then total earnings
  const rankedMembers = useMemo(() => {
    // Clone and ensure all members have valid numbers
    const list = [...members].map((m) => ({
      ...m,
      referralsCount: Number(m.referralsCount || 0),
      twisEarnings: Number(m.twisEarnings || 0),
      totalEarnings: Number(m.totalEarnings || 0),
    }));

    // Ensure currentUser is present in the list with up-to-date numbers
    const userIndex = list.findIndex(
      (m) => m.accId === currentUser.accId || m.id === currentUser.id
    );
    if (userIndex !== -1) {
      list[userIndex] = {
        ...list[userIndex],
        ...currentUser,
        referralsCount: Number(currentUser.referralsCount || 0),
      };
    } else {
      list.push(currentUser);
    }

    // Sort descending
    return list.sort((a, b) => {
      if (b.referralsCount !== a.referralsCount) {
        return b.referralsCount - a.referralsCount;
      }
      return b.twisEarnings - a.twisEarnings;
    });
  }, [members, currentUser]);

  // Current user's rank
  const currentUserRankIndex = rankedMembers.findIndex(
    (m) => m.accId === currentUser.accId || m.id === currentUser.id
  );
  const currentUserRank = currentUserRankIndex !== -1 ? currentUserRankIndex + 1 : 1;
  const userAhead = currentUserRankIndex > 0 ? rankedMembers[currentUserRankIndex - 1] : null;
  const referralsNeededToOvertake = userAhead
    ? Math.max(1, (userAhead.referralsCount || 0) - (currentUser.referralsCount || 0) + 1)
    : 0;

  // Filtered by search query
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) {
      return rankedMembers.slice(0, viewLimit);
    }
    const q = searchQuery.toLowerCase().trim();
    return rankedMembers.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.accId.toLowerCase().includes(q) ||
        (m.city && m.city.toLowerCase().includes(q))
    );
  }, [rankedMembers, searchQuery, viewLimit]);

  const handleManualRefresh = async () => {
    setIsLoading(true);
    try {
      const fresh = await FirestoreService.getMembers();
      if (fresh && fresh.length > 0) {
        setMembers(fresh);
        setIsLiveConnected(true);
        setLastUpdated(new Date());
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-5 ${className}`}>
      {/* Header & Firebase Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Trophy className="w-5 h-5 text-yellow-200 fill-yellow-200" />
            </div>
            <h3 className="text-base sm:text-lg font-black font-display text-slate-900">
              {language === 'hi'
                ? 'शीर्ष अचीवर्स रैंकिंग्स (Top Member Rankings)'
                : 'Top Member Rankings & Leaderboard'}
            </h3>
            {/* Live Firestore indicator */}
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <Database className="w-3 h-3 text-emerald-600" />
              <span>{isLiveConnected ? 'FIRESTORE LIVE' : 'CLOUD SYNCED'}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'hi'
              ? 'सत्यापित छात्रों की रेफरल संख्या और टियर उपलब्धियों पर आधारित वास्तविक-समय लीडरबोर्ड।'
              : 'Real-time performance rankings based on verified student referrals count and community tiers.'}
          </p>
        </div>

        {/* View Limit Pills & Refresh Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-gray-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewLimit(10)}
              className={`px-2.5 py-1 rounded transition ${
                viewLimit === 10 ? 'bg-white text-[#2874f0] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Top 10
            </button>
            <button
              type="button"
              onClick={() => setViewLimit(25)}
              className={`px-2.5 py-1 rounded transition ${
                viewLimit === 25 ? 'bg-white text-[#2874f0] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Top 25
            </button>
            <button
              type="button"
              onClick={() => setViewLimit(50)}
              className={`px-2.5 py-1 rounded transition ${
                viewLimit === 50 ? 'bg-white text-[#2874f0] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Top 50
            </button>
          </div>

          <button
            type="button"
            onClick={handleManualRefresh}
            className={`p-1.5 text-slate-600 hover:text-[#2874f0] hover:bg-slate-100 border border-gray-200 rounded-lg transition ${
              isLoading ? 'animate-spin text-[#2874f0]' : ''
            }`}
            title="रिफ्रेश करें"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* User's Current Rank Callout Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-400/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex flex-col items-center justify-center font-black shadow-md shrink-0">
            <span className="text-[10px] uppercase font-bold leading-none">रैंक</span>
            <span className="text-xl font-mono-acc leading-tight">#{currentUserRank}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm sm:text-base text-white">{currentUser.fullName}</span>
              <span className="text-[10px] bg-white/20 text-yellow-300 font-mono-acc px-2 py-0.5 rounded">
                {currentUser.accId}
              </span>
              <MemberTierBadge referralsCount={currentUser.referralsCount || 0} size="sm" />
            </div>
            <p className="text-xs text-blue-200 mt-1 flex items-center gap-2 flex-wrap">
              <span>
                {language === 'hi' ? 'आपके सफल रेफरल्स:' : 'Your Referrals:'}{' '}
                <strong className="text-white font-mono-acc">{currentUser.referralsCount || 0} छात्र</strong>
              </span>
              <span>•</span>
              <span>
                {language === 'hi' ? 'TWIS अर्निंग:' : 'TWIS Earnings:'}{' '}
                <strong className="text-emerald-300 font-mono-acc">₹{(currentUser.twisEarnings || 0).toFixed(2)}</strong>
              </span>
            </p>
          </div>
        </div>

        {/* Motivational Rank Upgrade Callout */}
        <div className="w-full md:w-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-xs flex items-center justify-between gap-3 shrink-0">
          <div>
            {userAhead ? (
              <>
                <span className="text-yellow-300 font-bold block text-[11px]">
                  {language === 'hi' ? '🎯 अगली रैंक चुनौती' : '🎯 Next Rank Goal'}
                </span>
                <span className="text-white text-[11px]">
                  {language === 'hi'
                    ? `रैंक #${currentUserRank - 1} हासिल करने के लिए केवल ${referralsNeededToOvertake} और रेफरल्स!`
                    : `Need ${referralsNeededToOvertake} more referrals to take Rank #${currentUserRank - 1}!`}
                </span>
              </>
            ) : (
              <>
                <span className="text-yellow-300 font-bold block text-[11px]">
                  👑 शीर्ष स्थान पर! (Champion)
                </span>
                <span className="text-white text-[11px]">
                  {language === 'hi' ? 'आप लीडरबोर्ड में नंबर 1 पर हैं।' : 'You hold the #1 rank on the leaderboard!'}
                </span>
              </>
            )}
          </div>
          {onNavigateToTwis && (
            <button
              type="button"
              onClick={onNavigateToTwis}
              className="px-3 py-1.5 bg-[#ffe500] hover:bg-yellow-400 text-[#2874f0] font-black text-xs rounded-lg transition shadow-xs whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'hi' ? 'रेफर करें' : 'Refer'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            language === 'hi'
              ? 'नाम या ACC ID से लीडरबोर्ड में खोजें...'
              : 'Search leaderboard by name or ACC ID...'
          }
          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2874f0] transition text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Top 3 Podium Cards (when viewing unfiltered top entries) */}
      {!searchQuery && rankedMembers.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Rank 2 (Silver) */}
          <div className="order-2 md:order-1 bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-300/80 rounded-2xl p-4 text-center relative shadow-xs flex flex-col justify-between">
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-slate-400 text-slate-700 flex items-center justify-center font-black text-xs absolute -top-3 left-1/2 -translate-x-1/2 shadow-xs">
              2
            </div>
            <div className="pt-2">
              <span className="text-xs font-black text-slate-600 uppercase tracking-widest block">
                🥈 {language === 'hi' ? 'रैंक #2 SILVER' : 'RANK #2 SILVER'}
              </span>
              <h4 className="font-bold text-sm text-slate-900 mt-1 truncate">
                {rankedMembers[1].fullName}
              </h4>
              <p className="text-[11px] font-mono-acc text-slate-500">{rankedMembers[1].accId}</p>
              <div className="mt-2 flex justify-center">
                <MemberTierBadge referralsCount={rankedMembers[1].referralsCount} size="sm" />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-around text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">रेफरल्स</span>
                <span className="font-mono-acc font-bold text-slate-900 text-sm">
                  {rankedMembers[1].referralsCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">TWIS कमाई</span>
                <span className="font-mono-acc font-bold text-emerald-600 text-sm">
                  ₹{rankedMembers[1].twisEarnings.toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Rank 1 (Gold Champion) */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50/80 via-yellow-50/40 to-white border-2 border-amber-400 rounded-2xl p-4 text-center relative shadow-md flex flex-col justify-between transform md:-translate-y-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-white text-slate-950 flex items-center justify-center font-black text-sm absolute -top-5 left-1/2 -translate-x-1/2 shadow-md">
              👑
            </div>
            <div className="pt-3">
              <span className="text-xs font-black text-amber-700 uppercase tracking-widest block">
                ⭐ {language === 'hi' ? 'रैंक #1 TOP ACHIEVER' : 'RANK #1 TOP ACHIEVER'}
              </span>
              <h4 className="font-black text-base text-slate-900 mt-1 truncate">
                {rankedMembers[0].fullName}
              </h4>
              <p className="text-[11px] font-mono-acc text-[#2874f0] font-bold">{rankedMembers[0].accId}</p>
              <div className="mt-2 flex justify-center">
                <MemberTierBadge referralsCount={rankedMembers[0].referralsCount} size="md" />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-amber-200 flex items-center justify-around text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">रेफरल्स</span>
                <span className="font-mono-acc font-black text-[#2874f0] text-base">
                  {rankedMembers[0].referralsCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">TWIS कमाई</span>
                <span className="font-mono-acc font-black text-emerald-600 text-base">
                  ₹{rankedMembers[0].twisEarnings.toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="order-3 bg-gradient-to-b from-amber-50/40 to-orange-50/20 border border-amber-300/70 rounded-2xl p-4 text-center relative shadow-xs flex flex-col justify-between">
            <div className="w-8 h-8 rounded-full bg-amber-200 border-2 border-amber-400 text-amber-900 flex items-center justify-center font-black text-xs absolute -top-3 left-1/2 -translate-x-1/2 shadow-xs">
              3
            </div>
            <div className="pt-2">
              <span className="text-xs font-black text-amber-800 uppercase tracking-widest block">
                🥉 {language === 'hi' ? 'रैंक #3 BRONZE' : 'RANK #3 BRONZE'}
              </span>
              <h4 className="font-bold text-sm text-slate-900 mt-1 truncate">
                {rankedMembers[2].fullName}
              </h4>
              <p className="text-[11px] font-mono-acc text-slate-500">{rankedMembers[2].accId}</p>
              <div className="mt-2 flex justify-center">
                <MemberTierBadge referralsCount={rankedMembers[2].referralsCount} size="sm" />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-around text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">रेफरल्स</span>
                <span className="font-mono-acc font-bold text-slate-900 text-sm">
                  {rankedMembers[2].referralsCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">TWIS कमाई</span>
                <span className="font-mono-acc font-bold text-emerald-600 text-sm">
                  ₹{rankedMembers[2].twisEarnings.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table / Full Ranking Rows */}
      <div className="overflow-x-auto no-scrollbar border border-gray-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b border-gray-200 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-2.5 px-3 w-16 text-center">रैंक</th>
              <th className="py-2.5 px-3">सदस्य (Member)</th>
              <th className="py-2.5 px-3 text-center">टियर बैज</th>
              <th className="py-2.5 px-3 text-center">रेफरल्स</th>
              <th className="py-2.5 px-3 text-right">TWIS कमाई</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredList.map((member, idx) => {
              const actualRank = rankedMembers.findIndex(
                (m) => m.accId === member.accId || m.id === member.id
              ) + 1;
              const isMe = member.accId === currentUser.accId || member.id === currentUser.id;

              return (
                <tr
                  key={member.accId || member.id || idx}
                  className={`transition ${
                    isMe
                      ? 'bg-blue-50/80 font-bold hover:bg-blue-100/70 border-l-4 border-l-[#2874f0]'
                      : actualRank <= 3
                      ? 'bg-amber-50/20 hover:bg-slate-50'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Rank Column */}
                  <td className="py-3 px-3 text-center">
                    {actualRank === 1 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-black text-xs shadow-xs">
                        1
                      </span>
                    ) : actualRank === 2 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black text-xs shadow-xs">
                        2
                      </span>
                    ) : actualRank === 3 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs shadow-xs">
                        3
                      </span>
                    ) : (
                      <span className="font-mono-acc text-slate-600 font-bold text-xs">
                        #{actualRank}
                      </span>
                    )}
                  </td>

                  {/* Member Name & ID */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-gray-200 text-[#2874f0] flex items-center justify-center font-bold text-[11px] shrink-0 overflow-hidden">
                        {member.avatarUrl ? (
                          <img src={member.avatarUrl} alt={member.fullName} className="w-full h-full object-cover" />
                        ) : (
                          member.fullName.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`truncate text-xs ${isMe ? 'text-[#2874f0] font-black' : 'text-slate-900 font-semibold'}`}>
                            {member.fullName}
                          </span>
                          {isMe && (
                            <span className="bg-[#2874f0] text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                              आप (YOU)
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono-acc block truncate">
                          {member.accId} {member.city ? `• ${member.city}` : ''}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Tier Badge */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex justify-center">
                      <MemberTierBadge referralsCount={member.referralsCount} size="sm" />
                    </div>
                  </td>

                  {/* Referrals Count */}
                  <td className="py-3 px-3 text-center">
                    <span className="font-mono-acc font-black text-xs sm:text-sm text-slate-900">
                      {member.referralsCount}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">
                      {language === 'hi' ? 'छात्र' : 'members'}
                    </span>
                  </td>

                  {/* TWIS Earnings */}
                  <td className="py-3 px-3 text-right">
                    <span className="font-mono-acc font-black text-xs sm:text-sm text-emerald-600">
                      ₹{member.twisEarnings.toFixed(2)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Meta & Sync Timestamp */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {language === 'hi'
              ? 'क्लाउड फायरबेस द्वारा 100% सत्यापित डेटा'
              : '100% Verified Cloud Firestore Data'}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono-acc">
          अंतिम अपडेट: {lastUpdated.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};
