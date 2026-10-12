import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  Sparkles,
  Calendar,
  Award,
  Wallet,
  Users,
  Sliders,
  CheckCircle2,
  Rocket,
  ShieldCheck,
  Target,
  ArrowRight,
} from 'lucide-react';
import { Member } from '../types';
import { StorageService } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';

interface GrowthForecastProps {
  currentUser: Member;
  className?: string;
  onNavigateToTwis?: () => void;
}

export const GrowthForecast: React.FC<GrowthForecastProps> = ({
  currentUser,
  className = '',
  onNavigateToTwis,
}) => {
  const { language } = useLanguage();
  const [effortMultiplier, setEffortMultiplier] = useState<'current' | 'steady' | 'accelerated'>('steady');
  const [metricView, setMetricView] = useState<'combined' | 'members' | 'income'>('combined');

  // Compute baseline daily rate from historical data
  const historicalBaseline = useMemo(() => {
    const allReferrals = StorageService.getReferrals();
    const userReferrals = allReferrals.filter(
      (r) => r.referrerAccId === currentUser.accId || r.referrerAccId === currentUser.id
    );

    const actualCount = Math.max(currentUser.referralsCount || 0, userReferrals.length);

    // Calculate days since account creation
    const createdAt = new Date(currentUser.createdAt || Date.now());
    const daysSince = Math.max(1, Math.floor((Date.now() - createdAt.getTime()) / 86400000));

    // Daily rate
    let dailyRate = actualCount / daysSince;
    if (dailyRate <= 0.05) {
      dailyRate = 0.33; // ~1 referral every 3 days as baseline student activity
    }
    return {
      actualCount,
      dailyRate,
      currentEarnings: currentUser.twisEarnings || actualCount * 150,
    };
  }, [currentUser]);

  // Compute next 30 days forecast data
  const forecastData = useMemo(() => {
    const now = new Date();
    const days = 30;

    // Rate multiplier based on selected strategy
    let rate = historicalBaseline.dailyRate;
    if (effortMultiplier === 'steady') {
      rate = Math.max(rate * 1.5, 0.8); // ~0.8 to 1 referrals/day
    } else if (effortMultiplier === 'accelerated') {
      rate = Math.max(rate * 2.5, 1.8); // ~1.8 to 2 referrals/day
    }

    const data: {
      day: number;
      dateLabel: string;
      projectedNew: number;
      projectedTotalMembers: number;
      projectedTotalIncome: number;
      conservativeIncome: number;
      acceleratedIncome: number;
    }[] = [];

    let currentMembers = historicalBaseline.actualCount;
    let currentIncome = historicalBaseline.currentEarnings;

    let conservativeCumIncome = currentIncome;
    let acceleratedCumIncome = currentIncome;

    for (let i = 1; i <= days; i++) {
      const futureDate = new Date(now.getTime() + i * 86400000);
      const dateLabel = futureDate.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
        month: 'short',
        day: 'numeric',
      });

      // Growth step
      const dailyAddition = rate;
      currentMembers += dailyAddition;
      currentIncome += dailyAddition * 150;

      conservativeCumIncome += 0.4 * 150;
      acceleratedCumIncome += 1.8 * 150;

      data.push({
        day: i,
        dateLabel,
        projectedNew: Number(dailyAddition.toFixed(1)),
        projectedTotalMembers: Math.round(currentMembers),
        projectedTotalIncome: Math.round(currentIncome),
        conservativeIncome: Math.round(conservativeCumIncome),
        acceleratedIncome: Math.round(acceleratedCumIncome),
      });
    }

    const day30 = data[data.length - 1];
    const netMembersAdded = day30.projectedTotalMembers - historicalBaseline.actualCount;
    const netIncomeAdded = day30.projectedTotalIncome - historicalBaseline.currentEarnings;

    return {
      points: data,
      day30Members: day30.projectedTotalMembers,
      day30Income: day30.projectedTotalIncome,
      netMembersAdded,
      netIncomeAdded,
      dailyRateUsed: rate.toFixed(1),
    };
  }, [historicalBaseline, effortMultiplier, language]);

  // Milestone check
  const nextMilestone = useMemo(() => {
    const cur = historicalBaseline.actualCount;
    if (cur < 10) return { title: '🥈 सिल्वर टियर (Silver Tier)', target: 10, bonus: '₹1,500' };
    if (cur < 25) return { title: '👑 गोल्ड टियर (Gold Tier)', target: 25, bonus: '₹3,750' };
    return { title: '💎 डायमंड टियर (Diamond Tier)', target: 50, bonus: '₹7,500' };
  }, [historicalBaseline]);

  // Custom Forecast Tooltip
  const ForecastTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-950/95 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-slate-700 text-xs space-y-1.5 min-w-[180px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="font-bold text-slate-200">{d.dateLabel}</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-mono-acc">
              Day +{d.day}
            </span>
          </div>
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">
                {language === 'hi' ? 'अनुमानित टीम:' : 'Projected Team:'}
              </span>
              <span className="font-bold font-mono-acc text-white">
                {d.projectedTotalMembers} {language === 'hi' ? 'छात्र' : 'members'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">
                {language === 'hi' ? 'अनुमानित कुल आय:' : 'Projected Earnings:'}
              </span>
              <span className="font-bold font-mono-acc text-emerald-400">
                ₹{d.projectedTotalIncome.toLocaleString('en-IN')}
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
      {/* Header & Scenario Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Rocket className="w-5 h-5 text-yellow-300" />
            </div>
            <h3 className="text-base sm:text-lg font-black font-display text-slate-900">
              {language === 'hi'
                ? '३०-दिवसीय ग्रोथ फोरकास्ट (Growth Forecast Projection)'
                : '30-Day Referral Growth Forecast'}
            </h3>
            <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span>AI TREND PREDICTOR</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'hi'
              ? 'आपके वर्तमान ऐतिहासिक रुझान और दैनिक रेफरल गति के आधार पर अगले ३० दिनों का अनुमानित आय मॉडल।'
              : 'Projected referral team expansion and income trajectory for the next 30 days based on your historical activity.'}
          </p>
        </div>

        {/* Strategy Scenario Switcher */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-gray-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setEffortMultiplier('current')}
              className={`px-2.5 py-1 rounded transition ${
                effortMultiplier === 'current'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'hi' ? 'मौजूदा गति' : 'Current Pace'}
            </button>
            <button
              type="button"
              onClick={() => setEffortMultiplier('steady')}
              className={`px-2.5 py-1 rounded transition ${
                effortMultiplier === 'steady'
                  ? 'bg-[#2874f0] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'hi' ? 'दैनिक 1 शेयर 🎯' : '1 Daily Share 🎯'}
            </button>
            <button
              type="button"
              onClick={() => setEffortMultiplier('accelerated')}
              className={`px-2.5 py-1 rounded transition ${
                effortMultiplier === 'accelerated'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'hi' ? 'प्रो गति 🚀' : 'Pro Pace 🚀'}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Forecast Highlights & Milestone Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-3">
          <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider block">
            {language === 'hi' ? '३० दिनों बाद कुल आय' : 'Day +30 Forecast Earnings'}
          </span>
          <span className="text-xl sm:text-2xl font-black font-mono-acc text-purple-800 block mt-0.5">
            ₹{forecastData.day30Income.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
            +₹{forecastData.netIncomeAdded.toLocaleString('en-IN')} नई संभावित आय
          </span>
        </div>

        <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3">
          <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">
            {language === 'hi' ? '३० दिनों बाद टीम साइज' : 'Day +30 Team Size'}
          </span>
          <span className="text-xl sm:text-2xl font-black font-mono-acc text-[#2874f0] block mt-0.5">
            {forecastData.day30Members}
            <span className="text-xs font-normal text-slate-500 ml-1">छात्र</span>
          </span>
          <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">
            +{forecastData.netMembersAdded} नए छात्र जुड़ेंगे
          </span>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3">
          <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
            {language === 'hi' ? 'प्रयुक्त दैनिक गति' : 'Daily Projected Rate'}
          </span>
          <span className="text-xl sm:text-2xl font-black font-mono-acc text-emerald-600 block mt-0.5">
            ~{forecastData.dailyRateUsed}
            <span className="text-xs font-normal text-slate-500 ml-1">रेफरल/दिन</span>
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            ₹{(Number(forecastData.dailyRateUsed) * 150).toFixed(0)}/दिन की कमाई
          </span>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3">
          <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block truncate">
            {language === 'hi' ? 'अगला टियर लक्ष्य' : 'Target Milestone'}
          </span>
          <span className="text-sm sm:text-base font-black text-amber-900 block mt-0.5 truncate">
            {nextMilestone.title}
          </span>
          <span className="text-[10px] text-slate-600 block mt-0.5 font-mono-acc">
            लक्ष्य: {nextMilestone.target} छात्र ({nextMilestone.bonus})
          </span>
        </div>
      </div>

      {/* Metric Mode Filter Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        <span className="text-slate-500 font-semibold">
          {language === 'hi' ? 'ग्राफ़ दृश्य चुनें:' : 'Select Display Metric:'}
        </span>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => setMetricView('combined')}
            className={`px-2.5 py-1 rounded font-bold transition ${
              metricView === 'combined'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'आय व टीम दोनों' : 'Income & Team'}
          </button>
          <button
            type="button"
            onClick={() => setMetricView('income')}
            className={`px-2.5 py-1 rounded font-bold transition ${
              metricView === 'income'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'केवल ₹ आय' : 'Income Only'}
          </button>
          <button
            type="button"
            onClick={() => setMetricView('members')}
            className={`px-2.5 py-1 rounded font-bold transition ${
              metricView === 'members'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'केवल छात्र संख्या' : 'Members Only'}
          </button>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="w-full h-[280px] sm:h-[320px] pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={forecastData.points}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorForecastIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
              interval={4}
            />
            {metricView === 'combined' ? (
              <>
                <YAxis
                  yAxisId="incomeAxis"
                  orientation="left"
                  tick={{ fontSize: 11, fill: '#7c3aed' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val}`}
                />
                <YAxis
                  yAxisId="membersAxis"
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#2563eb' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ForecastTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                />
                <Area
                  yAxisId="incomeAxis"
                  type="monotone"
                  dataKey="projectedTotalIncome"
                  name={language === 'hi' ? 'अनुमानित आय (₹)' : 'Projected Earnings (₹)'}
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  fill="url(#colorForecastIncome)"
                />
                <Line
                  yAxisId="membersAxis"
                  type="monotone"
                  dataKey="projectedTotalMembers"
                  name={language === 'hi' ? 'अनुमानित टीम सदस्य' : 'Projected Team Members'}
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
              </>
            ) : metricView === 'income' ? (
              <>
                <YAxis
                  tick={{ fontSize: 11, fill: '#7c3aed' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip content={<ForecastTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                />
                <Area
                  type="monotone"
                  dataKey="projectedTotalIncome"
                  name={language === 'hi' ? 'अनुमानित आय (₹)' : 'Projected Income (₹)'}
                  stroke="#7c3aed"
                  strokeWidth={3}
                  fill="url(#colorForecastIncome)"
                />
                <Line
                  type="monotone"
                  dataKey="conservativeIncome"
                  name={language === 'hi' ? 'धीमी गति (न्यूनतम)' : 'Conservative Pace'}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                />
              </>
            ) : (
              <>
                <YAxis
                  tick={{ fontSize: 11, fill: '#2563eb' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ForecastTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                />
                <Area
                  type="monotone"
                  dataKey="projectedTotalMembers"
                  name={language === 'hi' ? 'अनुमानित कुल छात्र' : 'Projected Team Count'}
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fill="#dbeafe"
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Motivational Bottom Strategy Action Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Target className="w-4 h-4 text-yellow-300" />
          </div>
          <div className="text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-purple-900">
              {language === 'hi' ? 'ग्रोथ टिप:' : 'Actionable Growth Tip:'}{' '}
            </span>
            {language === 'hi'
              ? 'दैनिक सुबह 8 बजे अपने WhatsApp स्टेटस पर ACC अर्निंग प्रूफ शेयर करें। औसतन 10 व्यूअर्स में से 1 छात्र तुरंत रजिस्ट्रेशन करता है।'
              : 'Post your ACC certified earnings proof on WhatsApp status at 8 AM. Statistically 1 in 10 college viewers converts to a referral.'}
          </div>
        </div>

        {onNavigateToTwis && (
          <button
            type="button"
            onClick={onNavigateToTwis}
            className="w-full sm:w-auto px-4 py-2 bg-[#2874f0] hover:bg-[#1a5bc7] text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>{language === 'hi' ? 'रेफरल लिंक शेयर करें' : 'Share Referral Link'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
