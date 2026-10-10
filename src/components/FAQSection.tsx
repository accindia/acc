import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Zap,
  Users,
  CreditCard,
  GraduationCap,
  ShieldCheck,
  Phone,
  MessageCircle,
  FileCheck2,
  Sparkles,
  Calculator,
  ArrowRight,
  X,
} from 'lucide-react';
import { StorageService } from '../services/storage';

export interface FAQItem {
  id: string;
  category: 'swis' | 'twis' | 'registration' | 'payouts' | 'student' | 'legal';
  question: string;
  answer: string;
  highlight?: string;
  tags: string[];
}

interface FAQSectionProps {
  onGoToRegister?: () => void;
  onGoToCalculator?: () => void;
  onGoToContact?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  onGoToRegister,
  onGoToCalculator,
  onGoToContact,
}) => {
  const siteConfig = StorageService.getSiteConfig();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('faq-swis-1');

  // Interactive Mini Pocket Money Calculator state
  const [calcReferrals, setCalcReferrals] = useState<number>(5);
  const [calcMonthlyRecharge, setCalcMonthlyRecharge] = useState<number>(1500);

  const categories = [
    { id: 'all', label: 'सभी सवाल (All)', icon: HelpCircle },
    { id: 'swis', label: 'SWIS रिचार्ज बचत', icon: Zap },
    { id: 'twis', label: 'TWIS ₹150 रेफरल', icon: Users },
    { id: 'registration', label: 'रजिस्ट्रेशन व ₹249', icon: FileCheck2 },
    { id: 'payouts', label: 'कमीशन व विथड्रॉल', icon: CreditCard },
    { id: 'student', label: 'स्टूडेंट पॉकेट मनी', icon: GraduationCap },
    { id: 'legal', label: 'लीगल व सुरक्षा', icon: ShieldCheck },
  ];

  const faqs: FAQItem[] = [
    // SWIS Category
    {
      id: 'faq-swis-1',
      category: 'swis',
      question: 'SWIS क्या है और मुझे 3.30% रिचार्ज कमीशन कैसे मिलता है?',
      answer:
        'SWIS (Self Working Income System) एक सीधा रिचार्ज बचत सिस्टम है। जब आप अपने या किसी परिवार/मित्र के मोबाइल (Jio, Airtel, Vi, BSNL) या DTH का रिचार्ज ACC पोर्टल से करते हैं, तो आपको कुल रिचार्ज राशि का 3.30% फिक्स्ड कमीशन तुरंत आपके वॉलेट में वापस मिलता है। उदाहरण के लिए, ₹2,000 के रिचार्ज पर आपको सीधा ₹66 की बचत होती है।',
      highlight: '3.30% फिक्स्ड कमीशन सभी प्रमुख ऑपरेटर्स पर मान्य है।',
      tags: ['swis', 'recharge', 'commission', 'cashback', '3.30%', 'jio', 'airtel'],
    },
    {
      id: 'faq-swis-2',
      category: 'swis',
      question: 'PhonePe या Google Pay के मुकाबले ACC से रिचार्ज करने पर क्या फायदा है?',
      answer:
        'PhonePe, Paytm और Google Pay अब हर रिचार्ज पर ₹1 से ₹3 तक अतिरिक्त "प्लेटफॉर्म फीस" वसूलते हैं, यानी ₹299 के रिचार्ज के लिए आपको ₹302 चुकाने पड़ते हैं। इसके विपरीत, ACC पोर्टल पर ₹0 प्लेटफॉर्म फीस है, और उल्टा 3.30% (लगभग ₹10) कमीशन आपके वॉलेट में वापस आता है। इस प्रकार हर रिचार्ज पर आपकी कुल ₹13 तक की सीधी बचत होती है।',
      highlight: 'Zero Platform Fee + 3.30% Cashback = हर महीने सैकड़ों रुपये की बचत।',
      tags: ['phonepe', 'gpay', 'paytm', 'platform fee', 'extra charge', 'saving'],
    },
    {
      id: 'faq-swis-3',
      category: 'swis',
      question: 'अगर रिचार्ज फेल हो जाए या राशि कट जाए तो क्या होगा?',
      answer:
        'यदि किसी ऑपरेटर के सर्वर डाउन होने से रिचार्ज पेंडिंग या फेल होता है, तो कटा हुआ पैसा 10 से 15 मिनट के भीतर आपके ACC वॉलेट में स्वतः रिफंड हो जाता है। इसके अलावा एडमिन हेल्पलाइन और 24x7 WhatsApp सपोर्ट (+91 8877490845) पर शिकायत दर्ज कर तुरंत समाधान पाया जा सकता है।',
      tags: ['refund', 'failed', 'support', 'recharge issue'],
    },

    // TWIS Category
    {
      id: 'faq-twis-1',
      category: 'twis',
      question: 'TWIS क्या है और ₹150 प्रति रेफरल इनकम कैसे मिलती है?',
      answer:
        'TWIS (Team Working Income System) एक डायरेक्ट एफिलिएट प्रोग्राम है। जब आप अपने किसी दोस्त या सहपाठी को अपना रेफरल लिंक (accindia.js.org/?sponsor=YOUR_ID) भेजते हैं और वह ₹249 देकर अपनी लाइफटाइम ID एक्टिवेट करता है, तो आपको तुरंत ₹150 का डायरेक्ट रेफरल बोनस आपके वॉलेट में दिया जाता है, जिसे आप सीधे UPI/बैंक में निकाल सकते हैं।',
      highlight: 'हर 1 सफल एक्टिवेशन पर सीधा ₹150 तुरंत वॉलेट में!',
      tags: ['twis', 'referral', '150', 'bonus', 'direct income', 'sponsor'],
    },
    {
      id: 'faq-twis-2',
      category: 'twis',
      question: 'क्या रेफरल करने की कोई सीमा (Limit) है या मैं असीमित दोस्तों को जोड़ सकता हूँ?',
      answer:
        'कोई सीमा नहीं है! आप जितने चाहें उतने दोस्तों, सहपाठियों और पड़ोसियों को जोड़ सकते हैं। यदि आप 10 दोस्तों को जोड़ते हैं तो ₹1,500, 20 दोस्तों पर ₹3,000 और 50 दोस्तों पर ₹7,500 सीधा कमा सकते हैं। यह पूरी तरह आपकी मेहनत और टीम पर निर्भर करता है।',
      highlight: '100% अनलिमिटेड डायरेक्ट रेफरल्स — जितनी मेहनत, उतनी कमाई।',
      tags: ['limit', 'unlimited', 'earning potential', 'friends'],
    },
    {
      id: 'faq-twis-3',
      category: 'twis',
      question: 'क्या मेरे द्वारा जोड़े गए दोस्त को भी कोई फायदा मिलता है?',
      answer:
        'हाँ, बिल्कुल! आपके दोस्त को ₹249 एक्टिवेशन के बदले लाइफटाइम 3.30% रिचार्ज कमीशन, आधिकारिक डिजिटल PVC ID कार्ड, स्टूडेंट स्किल ट्रेनिंग वीडियो और खुद भी दूसरों को जोड़कर प्रति व्यक्ति ₹150 कमाने का पूरा अधिकार मिलता है।',
      tags: ['friend benefit', 'activation', 'value'],
    },

    // Registration Category
    {
      id: 'faq-reg-1',
      category: 'registration',
      question: '₹249 का एक्टिवेशन शुल्क क्यों लिया जाता है और इसके बदले क्या मिलता है?',
      answer:
        '₹249 कोई निवेश नहीं है, बल्कि यह पोर्टल का लाइफटाइम सर्वर सॉफ्टवेयर, मेंटेनेंस और डिजिटल पहचान शुल्क है। इसके बदले आपको: (1) लाइफटाइम 3.30% रिचार्ज पोर्टल, (2) आधिकारिक डिजिटल ID कार्ड विथ वेरिफाइड QR कोड, (3) TWIS ₹150 रेफरल अर्निंग लाइसेंस, (4) स्टूडेंट पॉकेट मनी ट्रेनिंग किट, और (5) 24x7 एडमिन सपोर्ट मिलता है।',
      highlight: 'केवल एक बार ₹249 — कोई मासिक या वार्षिक रिन्यूअल फीस नहीं!',
      tags: ['249', 'activation fee', 'charge', 'why 249', 'lifetime'],
    },
    {
      id: 'faq-reg-2',
      category: 'registration',
      question: 'पेमेंट के बाद मेरी ID और ID कार्ड कितनी देर में एक्टिवेट होते हैं?',
      answer:
        'जब आप ₹249 का भुगतान कर अपना UTR नंबर और स्क्रीनशॉट सबमिट करते हैं, तो एडमिन टीम द्वारा 15 से 30 मिनट के भीतर सत्यापन कर दिया जाता है। सत्यापन होते ही आपकी ID एक्टिव हो जाती है और आप तुरंत अपना रंगीन डिजिटल ID कार्ड डाउनलोड कर सकते हैं।',
      tags: ['approval', 'verification', 'utr', 'screenshot', 'activation time'],
    },
    {
      id: 'faq-reg-3',
      category: 'registration',
      question: 'अगर मेरे पास कोई Sponsor ID नहीं है, तो क्या मैं रजिस्टर कर सकता हूँ?',
      answer:
        'हाँ! यदि आपके पास किसी मित्र का रेफरल कोड नहीं है, तो आप कम्युनिटी की डिफ़ॉल्ट अधिकृत Sponsor ID (SWACCRK01 या TWACCRK01) का उपयोग करके सीधे रजिस्टर कर सकते हैं।',
      tags: ['no sponsor', 'default sponsor', 'register'],
    },

    // Commission Payouts Category
    {
      id: 'faq-pay-1',
      category: 'payouts',
      question: 'वॉलेट से पैसे अपने बैंक अकाउंट या UPI (PhonePe/GPay) में कैसे निकालें?',
      answer:
        'डैशबोर्ड में "Withdraw Money (पैसे निकालें)" बटन पर क्लिक करें। अपनी UPI ID (जैसे 9876543210@ybl या name@oksbi) और राशि दर्ज करके सबमिट करें। एडमिन द्वारा सत्यापन के बाद राशि सीधे आपके बैंक खाते में ट्रांसफर कर दी जाती है।',
      highlight: 'सीधा आपके PhonePe, Google Pay या Paytm UPI पर ट्रांसफर।',
      tags: ['withdrawal', 'bank transfer', 'upi', 'payout', 'wallet'],
    },
    {
      id: 'faq-pay-2',
      category: 'payouts',
      question: 'न्यूनतम निकासी राशि (Minimum Withdrawal Limit) कितनी है?',
      answer:
        'न्यूनतम निकासी सीमा केवल ₹150 है। यानी सिर्फ 1 दोस्त को जोड़ते ही जो ₹150 आपको मिलते हैं, आप उसे उसी दिन अपने बैंक खाते में निकाल सकते हैं! कोई लंबी प्रतीक्षा या बड़े टारगेट की बाध्यता नहीं है।',
      highlight: 'न्यूनतम निकासी केवल ₹150 — पहले ही दिन पैसा आपके खाते में!',
      tags: ['minimum withdrawal', 'threshold', '150 limit'],
    },
    {
      id: 'faq-pay-3',
      category: 'payouts',
      question: 'क्या विथड्रॉल पर कोई हिडन चार्ज या कटौती होती है?',
      answer:
        'नहीं, वॉलेट से विथड्रॉल करने पर ACC द्वारा कोई अनधिकृत हिडन चार्ज नहीं काटा जाता। आपकी पूरी मेहनत की कमाई पारदर्शी तरीके से आपके खाते में भेजी जाती है।',
      tags: ['hidden charge', 'deduction', 'transparency'],
    },

    // Student Life Category
    {
      id: 'faq-stu-1',
      category: 'student',
      question: 'कॉलेज छात्र अपनी पढ़ाई के साथ रोज़ाना 15-20 मिनट में कैसे काम कर सकते हैं?',
      answer:
        'छात्रों के लिए हमने एक 3-स्टेप डेली रूटीन तैयार किया है: (1) सुबह 8:00 AM पर अपने WhatsApp स्टेटस पर रिचार्ज बचत प्रूफ पोस्टर लगाएं, (2) लंच ब्रेक में रुचि रखने वाले दोस्तों को डैशबोर्ड से रेडी-मेड स्क्रिप्ट भेजें, (3) शाम को एक्टिवेशन पूरा कराएं। महीने में केवल 15-20 सक्रिय साथियों को जोड़ने पर ₹3,000 से ₹5,000 की शुद्ध पॉकेट मनी बिना पढ़ाई प्रभावित किए बन जाती है।',
      highlight: 'कोई ऑफिस या फिक्स्ड टाइम नहीं — 100% वर्क फ्रॉम फोन (Smartphone Work)।',
      tags: ['student', 'college', 'part time', 'routine', 'study friendly'],
    },
    {
      id: 'faq-stu-2',
      category: 'student',
      question: 'क्या इसके लिए किसी लैपटॉप, कंप्यूटर या खास तकनीकी ज्ञान की आवश्यकता है?',
      answer:
        'बिल्कुल नहीं! सारा काम आपके स्मार्टफोन और WhatsApp से ही होता है। पोस्टर बनाने, लिंक शेयर करने, और ID कार्ड डाउनलोड करने के सारे टूल्स इस वेबसाइट पर 1-क्लिक में उपलब्ध हैं।',
      tags: ['no laptop', 'mobile only', 'smartphone', 'easy work'],
    },

    // Legal & Security Category
    {
      id: 'faq-leg-1',
      category: 'legal',
      question: 'क्या यह पोर्टल 100% लीगल है? क्या यह कोई फ्रॉड या MLM पिरामिड है?',
      answer:
        'हाँ, यह पूरी तरह लीगल है। यह कोई गैर-कानूनी मल्टी-लेवल पिरामिड स्कीम नहीं है, बल्कि Google Pay या PhonePe की तरह 1-Tier Affiliate व Utility Cashback मॉडल पर आधारित है। यहाँ सिर्फ डायरेक्ट रेफरल (₹150) मिलता है और वास्तविक रिचार्ज सेवाएं दी जाती हैं। यह Consumer Protection (Direct Selling) Rules, 2021 के अनुपालन में संचालित होता है।',
      highlight: '100% सिंगल-लेयर वैध एफिलिएट व एमएसमे पंजीकृत कम्युनिटी मॉडल।',
      tags: ['legal', 'fraud check', 'mlm', 'pyramid', 'consumer protection', 'msme'],
    },
    {
      id: 'faq-leg-2',
      category: 'legal',
      question: 'मेरा व्यक्तिगत डेटा, मोबाइल नंबर और पेमेंट रिकॉर्ड कितना सुरक्षित है?',
      answer:
        'आपकी सुरक्षा हमारी सर्वोच्च प्राथमिकता है। हमारे सिस्टम में प्राइवेसी सेटिंग्स मौजूद हैं जिससे आप सार्वजनिक ID कार्ड पर अपना मोबाइल नंबर और ईमेल छुपा (Mask) सकते हैं। सारा डेटा सुरक्षित क्लाउड फायरस्टोर पर एन्क्रिप्टेड रूप में स्टोर रहता है।',
      tags: ['privacy', 'security', 'data protection', 'safe'],
    },
  ];

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  // Mini calculator earnings
  const potentialEarnings = useMemo(() => {
    const referralIncome = calcReferrals * 150;
    const monthlyRechargeCashback = Math.round((calcMonthlyRecharge * 3.3) / 100);
    const yearlyRechargeCashback = monthlyRechargeCashback * 12;
    const platformFeeSavedYearly = Math.round((calcMonthlyRecharge / 300) * 3 * 12);
    const totalFirstMonth = referralIncome + monthlyRechargeCashback;
    return {
      referralIncome,
      monthlyRechargeCashback,
      yearlyRechargeCashback,
      platformFeeSavedYearly,
      totalFirstMonth,
    };
  }, [calcReferrals, calcMonthlyRecharge]);

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Student Friendly & Clean */}
      <div className="bg-gradient-to-r from-[#1e3a8a] via-[#2874f0] to-[#0284c7] text-white p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>ACC Student & Member Help Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
            अक्सर पूछे जाने वाले सवाल (FAQ & Helpdesk)
          </h2>
          <p className="text-sm text-blue-100 leading-relaxed">
            SWIS रिचार्ज बचत, TWIS ₹150 रेफरल इनकम, ₹249 एक्टिवेशन और दैनिक बैंक विथड्रॉल से जुड़े सभी सवालों के पारदर्शी और सटीक जवाब।
          </p>
        </div>

        {/* Search Bar inside Hero */}
        <div className="mt-5 relative max-w-xl z-10">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="सवाल खोजें... (उदा. रिचार्ज कमीशन, विथड्रॉल, ₹249, लीगल)"
            className="w-full bg-white text-slate-900 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-md placeholder-slate-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Buttons - Zero-Pill Interactive Segmented Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-[#2874f0] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-gray-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Search & Count Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          कुल <strong>{filteredFaqs.length}</strong> सवाल मिले
          {selectedCategory !== 'all' && ` (${categories.find((c) => c.id === selectedCategory)?.label})`}
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-[#2874f0] hover:underline font-semibold"
          >
            खोज हटाएं
          </button>
        )}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">कोई सवाल नहीं मिला</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              आपकी खोज "{searchQuery}" से मिलता हुआ कोई प्रश्न नहीं मिला। सीधे हेल्पलाइन या WhatsApp पर संपर्क करें।
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition"
            >
              सभी सवाल देखें
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white border transition-all rounded-xl overflow-hidden ${
                  isExpanded ? 'border-blue-400 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-md bg-blue-50 text-[#2874f0] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#2874f0]" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-gray-100 bg-slate-50/50 space-y-3">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {faq.answer}
                    </p>
                    {faq.highlight && (
                      <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-emerald-900 text-xs font-semibold flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{faq.highlight}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Student Pocket Money Calculator Widget */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-slate-900">
            <Calculator className="w-5 h-5 text-[#2874f0]" />
            <h3 className="font-bold text-sm sm:text-base">
              🎓 स्टूडेंट पॉकेट मनी अनुमान कैलकुलेटर (Pocket Money Estimator)
            </h3>
          </div>
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded font-bold">
            Live Calculation
          </span>
        </div>

        <p className="text-xs text-slate-600">
          अपनी पढ़ाई के साथ आप महीने में कितने दोस्तों को जोड़ सकते हैं और खुद/घर का कितना रिचार्ज करते हैं, चुनकर अपनी संभावित कमाई देखें:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Slider 1: Referrals */}
          <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">मासिक एक्टिवेटेड रेफरल्स (TWIS):</span>
              <span className="font-mono-acc font-black text-[#2874f0] text-sm bg-white px-2 py-0.5 rounded border border-gray-200">
                {calcReferrals} दोस्त
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={calcReferrals}
              onChange={(e) => setCalcReferrals(Number(e.target.value))}
              className="w-full accent-[#2874f0] cursor-pointer"
            />
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>1 दोस्त = ₹150</span>
              <span>10 दोस्त = ₹1,500</span>
              <span>30 दोस्त = ₹4,500</span>
            </div>
          </div>

          {/* Slider 2: Monthly Recharges */}
          <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">मासिक कुल रिचार्ज खर्च (SWIS):</span>
              <span className="font-mono-acc font-black text-emerald-700 text-sm bg-white px-2 py-0.5 rounded border border-gray-200">
                ₹{calcMonthlyRecharge}
              </span>
            </div>
            <input
              type="range"
              min="300"
              max="5000"
              step="100"
              value={calcMonthlyRecharge}
              onChange={(e) => setCalcMonthlyRecharge(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>₹300/माह</span>
              <span>₹2,500/माह</span>
              <span>₹5,000/माह</span>
            </div>
          </div>
        </div>

        {/* Result Strip */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs text-slate-400">
              कुल संभावित प्रथम माह की आय (First Month Pocket Money):
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono-acc text-amber-400">
              ₹{potentialEarnings.totalFirstMonth.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-300">
              (रेफरल इनकम: ₹{potentialEarnings.referralIncome} + रिचार्ज कैशबैक: ₹{potentialEarnings.monthlyRechargeCashback})
            </div>
          </div>

          {onGoToRegister && (
            <button
              onClick={onGoToRegister}
              className="px-5 py-2.5 bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
            >
              <span>अभी ID एक्टिवेट करें (₹249)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Still Have Questions? Direct Helpline Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-center sm:justify-start gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#2874f0]" />
            <span>क्या आपका कोई अन्य सवाल है?</span>
          </h4>
          <p className="text-xs text-slate-600">
            हमारी समर्पित एडमिन व कम्युनिटी टीम आपकी सहायता के लिए 24x7 उपलब्ध है।
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-center">
          <a
            href={`https://wa.me/${(siteConfig.whatsappNumber || '+91 8877490845').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              'नमस्ते ACC एडमिन! मुझे SWIS/TWIS से संबंधित सहायता चाहिए।'
            )}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp सहायता</span>
          </a>

          <a
            href={`tel:${siteConfig.helplinePhone || '+91 8877490845'}`}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-gray-300 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>कॉल करें</span>
          </a>
        </div>
      </div>
    </div>
  );
};
