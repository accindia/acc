import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ComposedChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Users,
  Wallet,
  Award,
  Zap,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Member, ReferralRecord } from '../types';
import { StorageService } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';

interface ReferralGrowthChartProps {
  currentUser: Member;
  className?: string;
}

export const ReferralGrowthChart: React.FC<ReferralGrowthChartProps> = ({
  currentUser,
  className = '',
}) => {
  const { language, t } = useLanguage();
  const [timeRange, setTimeRange] = useState<'7' | '14' | '30'>('30');
  const [viewMode, setViewMode] = useState<'composed' | 'referrals' | 'earnings'>('composed');

  // Compute 30 days of referral growth
  const { chartData, kpiStats } = useMemo(() => {
    const daysCount = parseInt(timeRange, 10);
    const allReferrals = StorageService.getReferrals();
    const userReferrals = allReferrals.filter(
      (r) => r.referrerAccId === currentUser.accId || r.referrerAccId === currentUser.id
    );

    // Build day buckets
    const now = new Date();
    const buckets: {
      dateStr: string;
      displayDate: string;
      referrals: number;
      earnings: number;
      cumulativeReferrals: number;
      cumulativeEarnings: number;
      targetPace: number;
    }[] = [];

    // Map referrals to YYYY-MM-DD
    const referralDateMap: Record<string, number> = {};
    userReferrals.forEach((r) => {
      try {
        const d = new Date(r.date || currentUser.createdAt || now);
        const key = d.toISOString().split('T')[0];
        referralDateMap[key] = (referralDateMap[key] || 0) + 1;
      } catch {
        // Fallback
      }
    });

    // If currentUser has referralsCount > 0 but userReferrals is empty (e.g. from seed profile), distribute
    if (userReferrals.length === 0 && currentUser.referralsCount > 0) {
      const totalCount = currentUser.referralsCount;
      // Spread naturally over the last few days
      for (let i = 0; i < totalCount; i++) {
        const offset = (i * 3 + 2) % daysCount;
        const d = new Date(now.getTime() - offset * 86400000);
        const key = d.toISOString().split('T')[0];
        referralDateMap[key] = (referralDateMap[key] || 0) + 1;
      }
    }

    let runningReferrals = 0;
    let runningEarnings = 0;
    let maxSingleDay = 0;
    let bestDayDate = '';

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
        month: 'short',
        day: 'numeric',
      });

      const dayReferrals = referralDateMap[dateStr] || 0;
      const dayEarnings = dayReferrals * 150;

      runningReferrals += dayReferrals;
      runningEarnings += dayEarnings;

      if (dayReferrals > maxSingleDay) {
        maxSingleDay = dayReferrals;
        bestDayDate = displayDate;
      }

      // Benchmark target pace (1 student every 2 days = standard college student goal)
      const dayIndex = daysCount - i;
      const targetPace = Math.round((dayIndex / 2) * 150);

      buckets.push({
        dateStr,
        displayDate,
        referrals: dayReferrals,
        earnings: dayEarnings,
        cumulativeReferrals: runningReferrals,
        cumulativeEarnings: runningEarnings,
        targetPace,
      });
    }

    const totalReferrals = runningReferrals;
    const totalEarnings = runningEarnings;
    const dailyAverage = (totalReferrals / daysCount).toFixed(1);

    return {
      chartData: buckets,
      kpiStats: {
        totalReferrals,
        totalEarnings,
        maxSingleDay,
        bestDayDate: bestDayDate || (language === 'hi' ? 'कल' : 'Recent'),
        dailyAverage,
        projectedMonthly: Math.round(Number(dailyAverage) * 30 * 150),
      },
    };
  }, [currentUser, timeRange, language]);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[170px]">
          <p className="font-bold text-slate-300 border-b border-slate-700/80 pb-1 flex items-center justify-between">
            <span>{data.displayDate}</span>
            <span className="text-[10px] text-blue-400 font-mono-acc">{data.dateStr}</span>
          </p>
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                {language === 'hi' ? 'दैनिक रेफरल्स' : 'Daily Referrals'}:
              </span>
              <span className="font-bold font-mono-acc text-white">
                +{data.referrals} {language === 'hi' ? 'छात्र' : 'members'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                {language === 'hi' ? 'दैनिक अर्निंग' : 'Daily Income'}:
              </span>
              <span className="font-bold font-mono-acc text-emerald-400">
                +₹{data.earnings}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <span className="text-slate-400">
                {language === 'hi' ? 'कुल संचयी अर्निंग' : 'Cumulative'}:
              </span>
              <span className="font-bold font-mono-acc text-yellow-300">
                ₹{data.cumulativeEarnings} ({data.cumulativeReferrals})
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-5 ${className}`}>
      {/* Top Header & Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2874f0] shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-black font-display text-slate-900">
              {language === 'hi'
                ? '३०-दिवसीय रेफरल ग्रोथ चार्ट (Referral Growth Analytics)'
                : '30-Day Referral Growth Analytics'}
            </h3>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
              TWIS ₹150 / रेफरल
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'hi'
              ? 'पिछले ३० दिनों में आपकी टीम के छात्रों की संख्या और दैनिक ₹150 रेफरल पेआउट का लाइव विज़ुअलाइज़ेशन।'
              : 'Visualize your daily student referrals count and cumulative ₹150 earnings trend over the past 30 days.'}
          </p>
        </div>

        {/* View Mode & Range Selectors */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Time Range Pills */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-gray-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTimeRange('7')}
              className={`px-2.5 py-1 rounded transition ${
                timeRange === '7'
                  ? 'bg-white text-[#2874f0] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7D
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('14')}
              className={`px-2.5 py-1 rounded transition ${
                timeRange === '14'
                  ? 'bg-white text-[#2874f0] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              14D
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('30')}
              className={`px-2.5 py-1 rounded transition ${
                timeRange === '30'
                  ? 'bg-white text-[#2874f0] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30D
            </button>
          </div>

          {/* Metric View Selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-gray-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('composed')}
              className={`px-2 py-1 rounded transition ${
                viewMode === 'composed'
                  ? 'bg-[#2874f0] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'hi' ? 'दोनों (Both)' : 'Overview'}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('referrals')}
              className={`px-2 py-1 rounded transition ${
                viewMode === 'referrals'
                  ? 'bg-[#2874f0] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'hi' ? 'रेफरल्स' : 'Count'}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('earnings')}
              className={`px-2 py-1 rounded transition ${
                viewMode === 'earnings'
                  ? 'bg-[#2874f0] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'hi' ? 'कमाई (₹)' : 'Earnings'}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary KPI Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3">
          <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">
            {language === 'hi' ? `${timeRange}D कुल रेफरल्स` : `${timeRange}D Total Referrals`}
          </span>
          <span className="text-xl sm:text-2xl font-black font-mono-acc text-[#2874f0] block mt-0.5">
            {kpiStats.totalReferrals}
            <span className="text-xs font-normal text-slate-500 ml-1">
              {language === 'hi' ? 'छात्र' : 'members'}
            </span>
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {language === 'hi' ? 'औसत' : 'Avg'}: ~{kpiStats.dailyAverage} / day
          </span>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3">
          <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
            {language === 'hi' ? `${timeRange}D रेफरल इनकम` : `${timeRange}D TWIS Earnings`}
          </span>
          <span className="text-xl sm:text-2xl font-black font-mono-acc text-emerald-600 block mt-0.5">
            ₹{kpiStats.totalEarnings.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            ₹150 × {kpiStats.totalReferrals} डायरेक्ट बोनस
          </span>
        </div>

        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3">
          <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block">
            {language === 'hi' ? 'सर्वश्रेष्ठ दिवस (Peak)' : 'Best Single Day'}
          </span>
          <span className="text-xl sm:text-2xl font-black font-mono-acc text-amber-600 block mt-0.5">
            {kpiStats.maxSingleDay}
            <span className="text-xs font-normal text-slate-500 ml-1">
              {language === 'hi' ? 'रेफरल्स' : 'adds'}
            </span>
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5 truncate">
            {kpiStats.bestDayDate} (₹{kpiStats.maxSingleDay * 150})
          </span>
        </div>

        <div className="bg-purple-50/60 border border-purple-200/80 rounded-xl p-3">
          <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider block">
            {language === 'hi' ? '३०D संभावित आय' : 'Projected 30D Pace'}
          </span>
          <span className="text-xl sm:text-2xl font-black font-mono-acc text-purple-700 block mt-0.5">
            ₹{(kpiStats.totalEarnings > 0 ? kpiStats.projectedMonthly : 4500).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {language === 'hi' ? 'दैनिक 1 रेफरल = ₹4,500' : '1 add/day = ₹4,500/mo'}
          </span>
        </div>
      </div>

      {/* Recharts Canvas Container */}
      <div className="w-full h-[280px] sm:h-[320px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'composed' ? (
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCumulativeEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2874f0" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2874f0" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorDailyBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: '#2874f0' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
              />
              <Bar
                yAxisId="left"
                dataKey="referrals"
                name={language === 'hi' ? 'दैनिक रेफरल्स (संख्या)' : 'Daily Referrals'}
                fill="url(#colorDailyBar)"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="cumulativeEarnings"
                name={language === 'hi' ? 'संचयी कमाई (₹)' : 'Cumulative Income (₹)'}
                stroke="#2874f0"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorCumulativeEarnings)"
              />
            </ComposedChart>
          ) : viewMode === 'referrals' ? (
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorOnlyReferrals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="cumulativeReferrals"
                name={language === 'hi' ? 'कुल टीम छात्र' : 'Total Team Size'}
                stroke="#059669"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorOnlyReferrals)"
              />
            </AreaChart>
          ) : (
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorOnlyIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2874f0" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2874f0" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#2874f0' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="cumulativeEarnings"
                name={language === 'hi' ? 'कुल ₹ कमाई' : 'Total Earnings (₹)'}
                stroke="#2874f0"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorOnlyIncome)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Motivational Bottom Strategy Tip */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl p-3.5 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-[#2874f0] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <span className="font-bold text-[#2874f0]">
            {language === 'hi' ? 'ग्रोथ टिप (Growth Tip):' : 'Growth Tip:'}{' '}
          </span>
          {language === 'hi'
            ? 'प्रतिदिन केवल 1 नया कॉलेज दोस्त जोड़ने पर आप महीने में ₹4,500 की पक्की पॉकेट मनी कमा सकते हैं। अपने डिजिटल ID कार्ड और WhatsApp स्टेटस पोस्टर्स का उपयोग करें।'
            : 'Adding just 1 college peer daily yields ₹4,500 monthly pocket money. Use your certified Digital ID Card and WhatsApp status templates to accelerate referral momentum.'}
        </div>
      </div>
    </div>
  );
};
