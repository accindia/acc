import React, { useState } from 'react';
import {
  GraduationCap,
  Calculator,
  FileText,
  Target,
  Sparkles,
  Copy,
  Check,
  Download,
  Printer,
  Smartphone,
  Users,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Zap,
  Globe,
  Share2,
} from 'lucide-react';
import { Member } from '../types';
import { getBaseAppUrl, getReferralUrl } from '../utils/url';

interface StudentFreeServicesHubProps {
  currentUser?: Member | null;
  onGoToRegister?: () => void;
  onGoToDashboard?: () => void;
  onGoToIdCard?: () => void;
}

export const StudentFreeServicesHub: React.FC<StudentFreeServicesHubProps> = ({
  currentUser,
  onGoToRegister,
  onGoToDashboard,
  onGoToIdCard,
}) => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'resume' | 'goal' | 'scripts'>('calculator');

  // Tool 1: Savings Calculator State
  const [rechargeSpend, setRechargeSpend] = useState<number>(1000);
  const accSavingsMonthly = Math.round((rechargeSpend * 3.3) / 100);
  const phonepeFeeMonthly = Math.round((rechargeSpend / 299) * 2.5); // Approx ₹2.5 fee per recharge
  const totalMonthlySavings = accSavingsMonthly + phonepeFeeMonthly;
  const totalYearlySavings = totalMonthlySavings * 12;

  // Tool 2: Free Resume Generator State
  const [resumeName, setResumeName] = useState(currentUser?.fullName || 'Rahul Kumar');
  const [resumeCollege, setResumeCollege] = useState('Govt. College of Arts & Commerce');
  const [resumeCourse, setResumeCourse] = useState('B.Com / B.A. / B.Sc (2nd Year)');
  const [resumePhone, setResumePhone] = useState(currentUser?.mobile || '9876543210');
  const [resumeEmail, setResumeEmail] = useState(currentUser?.email || 'student@example.com');
  const [resumeAccId, setResumeAccId] = useState(currentUser?.accId || 'SWACCRK01');
  const [resumeGenerated, setResumeGenerated] = useState(false);

  // Tool 3: Goal Planner State
  const [targetIncome, setTargetIncome] = useState<number>(3000);
  const requiredReferrals = Math.ceil(targetIncome / 150);
  const perWeekReferrals = Math.ceil(requiredReferrals / 4);

  // Tool 4: Scripts State
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const sponsorId = currentUser?.accId || 'SWACCRK01';
  const referralLink = getReferralUrl(sponsorId);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(id);
    setTimeout(() => setCopiedScript(null), 2500);
  };

  const handlePrintResume = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2874f0] uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4 text-[#2874f0]" />
            <span>100% Free Student Utilities</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 tracking-tight">
            छात्रों के लिए फ्री उपयोगी टूल्स व सर्विसेज
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            बिना किसी शुल्क के उपयोग करें: रिचार्ज बचत कैलकुलेटर, पार्ट-टाइम रेज़्यूमे मेकर और कॉलेज पॉकेट मनी प्लानर।
          </p>
        </div>

        {/* Live Domain Status Tag */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-800 text-xs font-bold shrink-0">
          <Globe className="w-4 h-4 text-emerald-600" />
          <span>Portal: accindia.js.org</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition cursor-pointer ${
            activeTab === 'calculator'
              ? 'bg-[#2874f0] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>1. PhonePe vs ACC बचत कैलकुलेटर</span>
        </button>

        <button
          onClick={() => setActiveTab('goal')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition cursor-pointer ${
            activeTab === 'goal'
              ? 'bg-[#2874f0] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>2. मासिक पॉकेट मनी गोल ट्रैकर</span>
        </button>

        <button
          onClick={() => setActiveTab('scripts')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition cursor-pointer ${
            activeTab === 'scripts'
              ? 'bg-[#2874f0] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>3. रेडी-मेड WhatsApp स्टेटस स्क्रिप्ट्स</span>
        </button>

        <button
          onClick={() => setActiveTab('resume')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition cursor-pointer ${
            activeTab === 'resume'
              ? 'bg-[#2874f0] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>4. स्टूडेंट पार्ट-टाइम रेज़्यूमे / बायो-डाटा</span>
        </button>
      </div>

      {/* TAB 1: Recharge Comparison Calculator */}
      {activeTab === 'calculator' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Input Slider */}
            <div className="lg:col-span-6 bg-slate-50 p-5 rounded-xl border border-gray-200 space-y-4 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  आपका व परिवार का मासिक मोबाइल व DTH रिचार्ज खर्च:
                </label>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>₹300 (1 फोन)</span>
                  <span className="text-lg font-mono-acc font-black text-[#2874f0] bg-white px-3 py-1 rounded-md border border-gray-200">
                    ₹{rechargeSpend.toLocaleString()}
                  </span>
                  <span>₹5,000 (पूरा परिवार + दुकान)</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="5000"
                  step="100"
                  value={rechargeSpend}
                  onChange={(e) => setRechargeSpend(Number(e.target.value))}
                  className="w-full accent-[#2874f0] cursor-pointer"
                />
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>PhonePe/Paytm एक्स्ट्रा फीस जो बचती है:</span>
                  <span className="font-bold text-emerald-700 font-mono-acc">+₹{phonepeFeeMonthly}/माह</span>
                </div>
                <div className="flex justify-between">
                  <span>ACC 3.30% फिक्स्ड कमीशन जो मिलता है:</span>
                  <span className="font-bold text-emerald-700 font-mono-acc">+₹{accSavingsMonthly}/माह</span>
                </div>
                <div className="border-t border-gray-100 pt-1.5 flex justify-between font-bold text-slate-900">
                  <span>कुल मासिक बचत:</span>
                  <span className="text-[#2874f0] font-mono-acc font-black text-sm">₹{totalMonthlySavings}/माह</span>
                </div>
              </div>
            </div>

            {/* Comparison Visual Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-5 rounded-xl flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">
                    वार्षिक बचत रिपोर्ट (Annual Savings)
                  </span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-blue-200">
                    100% Guaranteed
                  </span>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-black font-mono-acc text-amber-400">
                    ₹{totalYearlySavings.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    हर साल सिर्फ अपने और घर के फोन रिचार्ज ACC से करने पर आपकी जेब में बचते हैं। यह पैसा आपकी कॉलेज फीस या किताबों के काम आ सकता है!
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="text-slate-300">
                  वन-टाइम एक्टिवेशन: <strong>₹249 लाइफटाइम</strong>
                </span>
                {onGoToRegister && (
                  <button
                    onClick={onGoToRegister}
                    className="px-4 py-2 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>ID बनाएं व बचत शुरू करें</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Goal Tracker */}
      {activeTab === 'goal' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-5 rounded-xl border border-gray-200 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">
              🎯 आपका मासिक पॉकेट मनी लक्ष्य चुनें:
            </h4>

            {/* Quick Goal Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { amount: 1500, label: 'किताबें व स्टेशनरी (₹1,500)' },
                { amount: 3000, label: 'कॉलेज बस व नाश्ता (₹3,000)' },
                { amount: 4500, label: 'हॉस्टल व रूम किराया (₹4,500)' },
                { amount: 7500, label: 'गैजेट्स व सेविंग्स (₹7,500)' },
              ].map((g) => (
                <button
                  key={g.amount}
                  onClick={() => setTargetIncome(g.amount)}
                  className={`p-3 rounded-xl text-left border transition cursor-pointer ${
                    targetIncome === g.amount
                      ? 'bg-white border-[#2874f0] ring-2 ring-blue-100 shadow-xs'
                      : 'bg-white/60 border-gray-200 hover:bg-white'
                  }`}
                >
                  <div className="text-base font-black font-mono-acc text-slate-900">
                    ₹{g.amount}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">{g.label}</div>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                या खुद का लक्ष्य लिखें (₹):
              </label>
              <input
                type="number"
                value={targetIncome}
                onChange={(e) => setTargetIncome(Math.max(150, Number(e.target.value)))}
                className="w-36 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-mono-acc font-bold text-slate-900 focus:outline-none focus:border-[#2874f0]"
                min={150}
                step={150}
              />
            </div>
          </div>

          {/* Goal Action Plan Card */}
          <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl space-y-3">
            <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2874f0]" />
              <span>₹{targetIncome.toLocaleString()} कमाने का सीधा 4-हफ़्ते का एक्शन प्लान:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="text-slate-500 block mb-1">कुल एक्टिवेशन ज़रूरी:</span>
                <span className="font-mono-acc font-black text-lg text-[#2874f0]">
                  {requiredReferrals} दोस्त
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  ({requiredReferrals} × ₹150 = ₹{requiredReferrals * 150})
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="text-slate-500 block mb-1">प्रति सप्ताह लक्ष्य:</span>
                <span className="font-mono-acc font-black text-lg text-emerald-700">
                  केवल {perWeekReferrals} दोस्त/सप्ताह
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  (यानि 7 दिन में सिर्फ {perWeekReferrals} साथियों को बताना है)
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="text-slate-500 block mb-1">दैनिक समय आवश्यक:</span>
                <span className="font-mono-acc font-black text-lg text-purple-700">
                  15-20 मिनट
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  (सुबह 1 स्टेटस + लंच में 2 मैसेज)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WhatsApp Viral Scripts */}
      {activeTab === 'scripts' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            अपने कॉलेज के दोस्तों और पड़ोसियों को भेजने के लिए नीचे दी गई तैयार स्क्रिप्ट्स कॉपी करें। आपका रेफरल लिंक स्वतः जुड़ा हुआ है:
          </p>

          <div className="space-y-3">
            {/* Script 1 */}
            <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2874f0]">
                  स्क्रिप्ट 1: कॉलेज दोस्तों व ग्रुप्स के लिए (Best for WhatsApp Groups)
                </span>
                <button
                  onClick={() =>
                    copyText(
                      `नमस्ते भाई! मैं कॉलेज के साथ अपने फोन से 15-20 मिनट काम करके अपनी पॉकेट मनी कमा रहा हूँ। PhonePe/GPay के एक्स्ट्रा चार्ज से बचकर रिचार्ज पर 3.30% कमीशन मिलता है और हर दोस्त को जोड़ने पर सीधा ₹150 बैंक में आता है। तू भी देख ले: ${referralLink} (Sponsor ID: ${sponsorId})`,
                      'script-1'
                    )
                  }
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#2874f0] border border-gray-300 rounded text-xs font-bold flex items-center gap-1 transition"
                >
                  {copiedScript === 'script-1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript === 'script-1' ? 'कॉपी हो गया ✓' : 'कॉपी करें'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-gray-100 font-mono-acc leading-relaxed">
                "नमस्ते भाई! मैं कॉलेज के साथ अपने फोन से 15-20 मिनट काम करके अपनी पॉकेट मनी कमा रहा हूँ। PhonePe/GPay के एक्स्ट्रा चार्ज से बचकर रिचार्ज पर 3.30% कमीशन मिलता है और हर दोस्त को जोड़ने पर सीधा ₹150 बैंक में आता है। तू भी देख ले: {referralLink} (Sponsor ID: {sponsorId})"
              </p>
            </div>

            {/* Script 2 */}
            <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">
                  स्क्रिप्ट 2: रिचार्ज डिस्काउंट के लिए (परिवार, रिश्तेदार व पड़ोसी)
                </span>
                <button
                  onClick={() =>
                    copyText(
                      `नमस्ते! अगर आप अपने घर के Jio, Airtel, Vi या BSNL का रिचार्ज कराते हैं, तो PhonePe या GPay के ₹2-₹3 एक्स्ट्रा चार्ज मत दीजिए। ACC पर सीधा 3.30% कैशबैक मिलता है। मुझसे करवाएं या खुद अपनी ID बना लें: ${referralLink}`,
                      'script-2'
                    )
                  }
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-emerald-700 border border-gray-300 rounded text-xs font-bold flex items-center gap-1 transition"
                >
                  {copiedScript === 'script-2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript === 'script-2' ? 'कॉपी हो गया ✓' : 'कॉपी करें'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-gray-100 font-mono-acc leading-relaxed">
                "नमस्ते! अगर आप अपने घर के Jio, Airtel, Vi या BSNL का रिचार्ज कराते हैं, तो PhonePe या GPay के ₹2-₹3 एक्स्ट्रा चार्ज मत दीजिए। ACC पर सीधा 3.30% कैशबैक मिलता है। मुझसे करवाएं या खुद अपनी ID बना लें: {referralLink}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Student Part-Time Resume Maker */}
      {activeTab === 'resume' && (
        <div className="space-y-5">
          <div className="bg-slate-50 p-5 rounded-xl border border-gray-200 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">
              📄 अपनी जानकारी भरें (Instant Student Bio-Data / Resume):
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">पूरा नाम:</label>
                <input
                  type="text"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:border-[#2874f0]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">कॉलेज / यूनिवर्सिटी:</label>
                <input
                  type="text"
                  value={resumeCollege}
                  onChange={(e) => setResumeCollege(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:border-[#2874f0]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">कक्षा / कोर्स:</label>
                <input
                  type="text"
                  value={resumeCourse}
                  onChange={(e) => setResumeCourse(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:border-[#2874f0]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">मोबाइल नंबर:</label>
                <input
                  type="text"
                  value={resumePhone}
                  onChange={(e) => setResumePhone(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:border-[#2874f0]"
                />
              </div>
            </div>

            <button
              onClick={() => setResumeGenerated(true)}
              className="px-4 py-2 bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>रेज़्यूमे तैयार करें (Generate Preview)</span>
            </button>
          </div>

          {/* Generated Resume Card */}
          {resumeGenerated && (
            <div className="bg-white border-2 border-slate-300 p-6 rounded-xl space-y-4 shadow-sm text-slate-800 font-sans print:border-none print:shadow-none">
              <div className="flex justify-between items-start border-b border-gray-300 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{resumeName}</h3>
                  <p className="text-xs text-slate-600 font-medium">{resumeCourse} · {resumeCollege}</p>
                  <p className="text-xs text-slate-500 mt-1">Phone: +91 {resumePhone} · Email: {resumeEmail}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-blue-50 text-[#2874f0] border border-blue-200 px-2 py-0.5 rounded font-mono-acc font-bold">
                    ACC ID: {resumeAccId}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Community Affiliate</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-gray-200 pb-1 mb-1.5">
                    1. Career Objective (उद्देश्य)
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    कॉलेज की पढ़ाई के साथ-साथ डिजिटल कम्युनिकेशन, सोशल मीडिया मार्केटिंग और कम्युनिटी मैनेजमेंट में व्यावहारिक अनुभव हासिल करना एवं अपने स्वतंत्र प्रयासों से अपनी शिक्षा का खर्च वहन करना।
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-gray-200 pb-1 mb-1.5">
                    2. Practical Experience (अनुभव)
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Campus Affiliate & Recharge Consultant</span>
                      <span className="text-slate-500 font-normal">Achievers Club Community (2026 - Present)</span>
                    </div>
                    <ul className="list-disc pl-5 text-slate-600 space-y-0.5">
                      <li>डिजिटल रिचार्ज पोर्टल (SWIS) के माध्यम से मोबाइल और यूटिलिटी बिलों का प्रबंधन।</li>
                      <li>व्हाट्सएप और सोशल मीडिया कैंपेन के जरिए छात्रों को कम्युनिटी से जोड़ना (TWIS)।</li>
                      <li>दैनिक कस्टमर सपोर्ट और डिजिटल पेमेंट्स (UPI/QR) का संचालन।</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-gray-200 pb-1 mb-1.5">
                    3. Key Skills (कौशल)
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['Smartphone Operations', 'WhatsApp Marketing', 'UPI & Digital Payments', 'Direct Sales & Promotion', 'Customer Relationship', 'Canva Basic Poster Design'].map((skill) => (
                      <span key={skill} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2 print:hidden">
                <button
                  onClick={handlePrintResume}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>प्रिंट या PDF सेव करें</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
