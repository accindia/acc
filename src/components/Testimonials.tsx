import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Users,
  Zap,
  ArrowRight,
  TrendingUp,
  Quote,
  GraduationCap,
  Store,
  CreditCard,
  Building2,
  Sparkles,
  Award,
} from 'lucide-react';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  city: string;
  state: string;
  avatarText: string;
  plan: 'SWIS' | 'TWIS' | 'COMBO';
  accId: string;
  earnedAmount: number;
  timeframe: string;
  verifiedUtr: string;
  quote: string;
  category: 'student' | 'swis' | 'twis' | 'retailer';
  rating: number;
  highlightBadge: string;
}

interface TestimonialsProps {
  onGoToRegister?: () => void;
  onGoToVideo?: () => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  onGoToRegister,
  onGoToVideo,
}) => {
  const [filter, setFilter] = useState<'all' | 'student' | 'swis' | 'twis'>('all');

  const testimonials: TestimonialItem[] = [
    {
      id: 'test-1',
      name: 'अमन शर्मा (Aman Sharma)',
      role: 'B.Sc 2nd Year Student',
      city: 'इंदौर (Indore)',
      state: 'मध्य प्रदेश',
      avatarText: 'AS',
      plan: 'COMBO',
      accId: 'SWACCAK03',
      earnedAmount: 4850,
      timeframe: 'पहले माह में (Month 1)',
      verifiedUtr: 'UTR 42891048***',
      quote:
        'कॉलेज की फीस और किताबों के लिए माता-पिता से बार-बार पैसे मांगने में संकोच होता था। ACC से जुड़कर मैंने अपने हॉस्टल और क्लास के दोस्तों को PhonePe के ₹2-₹3 एक्स्ट्रा चार्ज से बचाया। 31 दोस्तों के एक्टिवेशन और रिचार्ज से पहले ही महीने ₹4,850 सीधे मेरे PhonePe UPI में आए!',
      category: 'student',
      rating: 5,
      highlightBadge: '₹4,850 सीधा UPI बैंक पेआउट',
    },
    {
      id: 'test-2',
      name: 'पूजा वर्मा (Pooja Verma)',
      role: 'B.Com 1st Year Student',
      city: 'भोपाल (Bhopal)',
      state: 'मध्य प्रदेश',
      avatarText: 'PV',
      plan: 'TWIS',
      accId: 'TWACCPV01',
      earnedAmount: 3150,
      timeframe: '3 हफ्तों में (In 3 Weeks)',
      verifiedUtr: 'UTR 42938192***',
      quote:
        'मुझसे कई सहेलियों ने पूछा कि क्या लड़कियां भी फोन से काम कर सकती हैं? मैंने सिर्फ अपने कॉलेज व्हाट्सएप ग्रुप में बचत का पोस्टर लगाया। बिना किसी को परेशान किए 21 लड़कियों ने खुद ID बनाई। ₹150 प्रति रेफरल का पेआउट एकदम रियल और तुरंत बैंक में आता है।',
      category: 'student',
      rating: 5,
      highlightBadge: '21 एक्टिव रेफरल · ₹3,150 क्रेडिट',
    },
    {
      id: 'test-3',
      name: 'राजेश पाटीदार (Rajesh Patidar)',
      role: 'किराना व मोबाइल शॉप संचालक',
      city: 'उज्जैन (Ujjain)',
      state: 'मध्य प्रदेश',
      avatarText: 'RP',
      plan: 'SWIS',
      accId: 'SWACCRP02',
      earnedAmount: 2480,
      timeframe: 'मासिक रिचार्ज कमीशन (Monthly)',
      verifiedUtr: 'UTR 42901174***',
      quote:
        'मेरी दुकान पर रोज़ 25-30 ग्राहक रिचार्ज कराने आते हैं। पहले दूसरी कंपनियों में 1.2% से 1.5% मिलता था। ACC SWIS में 3.30% फिक्स्ड कमीशन मिलता है, जिससे मेरी दुकान का बिजली बिल इसी कमीशन से निकल जाता है। बहुत भरोसेमंद सिस्टम है।',
      category: 'swis',
      rating: 5,
      highlightBadge: '3.30% फिक्स्ड रिचार्ज कमीशन',
    },
    {
      id: 'test-4',
      name: 'विकास यादव (Vikas Yadav)',
      role: 'पॉलिटेक्निक फाइनल ईयर',
      city: 'पटना (Patna)',
      state: 'बिहार',
      avatarText: 'VY',
      plan: 'TWIS',
      accId: 'TWACCVY05',
      earnedAmount: 6300,
      timeframe: '40 दिनों में (In 40 Days)',
      verifiedUtr: 'UTR 42948201***',
      quote:
        'मैंने पोर्टल से अपना डिजिटल PVC ID कार्ड डाउनलोड करके लैमिनेट करवाया और अपने बैग पर लगाया। दोस्तों ने देखा तो खुद पूछा। मैंने डैशबोर्ड की रेडी-मेड 3-लाइन स्क्रिप्ट भेजी। 42 साथियों ने रजिस्ट्रेशन किया और ₹6,300 सीधे मेरे खाते में क्रेडिट हुए!',
      category: 'twis',
      rating: 5,
      highlightBadge: '₹6,300 कुल अर्निंग · 42 रेफरल्स',
    },
    {
      id: 'test-5',
      name: 'नेहा राठौर (Neha Rathore)',
      role: 'B.A. छात्रा',
      city: 'कोटा (Kota)',
      state: 'राजस्थान',
      avatarText: 'NR',
      plan: 'TWIS',
      accId: 'TWACCNR01',
      earnedAmount: 2850,
      timeframe: '25 दिनों में (In 25 Days)',
      verifiedUtr: 'UTR 42955102***',
      quote:
        'मेरा खुद का बैंक खाता नहीं था, इसलिए मैंने अपने पिताजी का Google Pay UPI जोड़ा। ACC का पेरेंट्स अकाउंट सपोर्ट फीचर हम जैसे कॉलेज छात्रों के लिए सबसे बड़ा वरदान है। पिताजी के खाते में जब पैसे आए तो उन्हें भी गर्व हुआ।',
      category: 'student',
      rating: 5,
      highlightBadge: 'पेरेंट्स UPI सपोर्ट से ₹2,850 पेआउट',
    },
    {
      id: 'test-6',
      name: 'दीपक चौरसिया (Deepak Chaurasia)',
      role: 'विद्यार्थी व पार्ट-टाइम ऑपरेटर',
      city: 'वाराणसी (Varanasi)',
      state: 'उत्तर प्रदेश',
      avatarText: 'DC',
      plan: 'SWIS',
      accId: 'SWACCDC04',
      earnedAmount: 3620,
      timeframe: 'रिचार्ज + DTH बिल',
      verifiedUtr: 'UTR 42967119***',
      quote:
        'घर के 4 मोबाइल और पड़ोसियों के Tata Play/D2H का रिचार्ज मैं ही करता हूँ। पहले Google Pay पर ₹2-₹3 एक्स्ट्रा कटते थे, अब 3.30% वॉलेट में वापस आता है। ₹150 मिनिमम विथड्रॉल लिमिट बहुत आसान है।',
      category: 'swis',
      rating: 5,
      highlightBadge: 'Zero Platform Fee + ₹3,620 सेविंग्स',
    },
  ];

  const filteredTestimonials = testimonials.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'student') return t.category === 'student';
    if (filter === 'swis') return t.category === 'swis' || t.plan === 'SWIS';
    if (filter === 'twis') return t.category === 'twis' || t.plan === 'TWIS';
    return true;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header & Social Proof Trust Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-gray-100 pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2874f0] uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-500" />
            <span>100% Real Community Reviews & Payout Proofs</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">
            विद्यार्थी व सदस्यों के सफलता के अनुभव
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            जानिए कैसे कॉलेज छात्र अपनी पढ़ाई के साथ और छोटे दुकानदार अपनी दुकान के साथ ACC से हर महीने निश्चित पॉकेट मनी व रिचार्ज बचत कमा रहे हैं।
          </p>
        </div>

        {/* Live Metrics Trust Pill */}
        <div className="flex items-center gap-4 bg-slate-50 border border-gray-200 rounded-xl p-3 shrink-0">
          <div className="text-center pr-3 border-r border-gray-200">
            <div className="flex items-center justify-center gap-0.5 text-amber-500 font-black text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>4.9 / 5</span>
            </div>
            <span className="text-[10px] text-slate-500 block">संतुष्ट सदस्य</span>
          </div>

          <div className="text-center pr-3 border-r border-gray-200">
            <span className="text-sm font-black font-mono-acc text-[#2874f0]">1,200+</span>
            <span className="text-[10px] text-slate-500 block">एक्टिव ID</span>
          </div>

          <div className="text-center">
            <span className="text-sm font-black font-mono-acc text-emerald-700">₹150</span>
            <span className="text-[10px] text-slate-500 block">न्यूनतम निकासी</span>
          </div>
        </div>
      </div>

      {/* Segmented Filter Buttons - Zero-Pill Interactive Discipline */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'सभी अनुभव (All Stories)' },
          { id: 'student', label: '🎓 कॉलेज छात्र (Students)' },
          { id: 'twis', label: '👥 TWIS ₹150 रेफरल (Referral Payouts)' },
          { id: 'swis', label: '⚡ SWIS रिचार्ज बचत (Recharge Savings)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition cursor-pointer ${
              filter === tab.id
                ? 'bg-[#2874f0] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-gray-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTestimonials.map((item) => (
          <div
            key={item.id}
            className="bg-slate-50 hover:bg-white border border-gray-200 hover:border-blue-400 rounded-xl p-5 flex flex-col justify-between transition-all hover:shadow-md space-y-4 group"
          >
            {/* Top Row: User Avatar, Name & Location */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2874f0] to-blue-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs border-2 border-white">
                    {item.avatarText}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {item.name}
                    </h3>
                    {/* Unboxed Metadata with Typographic Separator */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                      <span>{item.city}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.role}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Verified Earnings Badge */}
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item.highlightBadge}</span>
                </div>
                <span className="font-mono-acc font-black text-emerald-800 text-xs">
                  ₹{item.earnedAmount.toLocaleString()}
                </span>
              </div>

              {/* Quote Text */}
              <p className="text-xs text-slate-700 leading-relaxed italic relative pl-4 border-l-2 border-blue-300">
                "{item.quote}"
              </p>
            </div>

            {/* Bottom Row: UTR & Plan Info */}
            <div className="pt-3 border-t border-gray-200/80 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono-acc font-semibold text-slate-600">
                ID: {item.accId}
              </span>
              <span className="text-emerald-700 font-mono-acc font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{item.verifiedUtr}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 sm:p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-sm sm:text-base flex items-center justify-center sm:justify-start gap-1.5 text-white">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>आप भी आज ही अपनी पॉकेट मनी व बचत की शुरुआत करें!</span>
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            मात्र ₹249 वन-टाइम एक्टिवेशन शुल्क में पाएं लाइफटाइम 3.30% रिचार्ज कमीशन, ₹150 डायरेक्ट रेफरल इनकम और प्रमाणित डिजिटल ID कार्ड।
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-center">
          {onGoToRegister && (
            <button
              onClick={onGoToRegister}
              className="px-5 py-2.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>रजिस्ट्रेशन करें (₹249)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {onGoToVideo && (
            <button
              onClick={onGoToVideo}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>वीडियो देखें</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
