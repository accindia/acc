import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'hi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  hi: {
    // Header & Navigation
    'brand.title': 'Achievers Club',
    'brand.subtitle': 'Community · Start Young',
    'nav.home': 'होम',
    'nav.video': 'ट्रेनिंग वीडियो',
    'nav.calculator': 'पॉकेट मनी कैलकुलेटर',
    'nav.register': 'रजिस्ट्रेशन (₹249)',
    'nav.idcard': 'डिजिटल ID कार्ड',
    'nav.my_idcard': 'मेरा डिजिटल ID कार्ड',
    'nav.dashboard': 'विद्यार्थी डैशबोर्ड',
    'nav.my_dashboard': 'मेरा डैशबोर्ड',
    'nav.promotions': 'प्रमोशन & विजिटिंग कार्ड',
    'nav.admin': 'एडमिन पैनल',
    'nav.faq': 'FAQ सवाल-जवाब',
    'nav.about': 'हमारे बारे में',
    'nav.contact': 'सपोर्ट',
    'nav.login': 'विद्यार्थी लॉगिन',
    'nav.logout': 'लॉगआउट',
    'nav.menu': 'मेनू खोलें',
    'announcement.badge': 'वेबसाइट की खासियत',

    // Hero Section
    'hero.badge': 'विशेष छात्र व युवा अर्निंग प्रोग्राम · ACC ASSURED ✓',
    'hero.title_pre': 'कॉलेज व पढ़ाई के साथ ',
    'hero.title_highlight': 'पॉकेट मनी व पक्की कमाई',
    'hero.title_slogan': 'Start Young, Retire Young',
    'hero.desc': 'क्या आप बिना अपनी पढ़ाई प्रभावित किए अपने स्मार्टफोन से रोजाना 1-2 घंटे में अपनी पॉकेट मनी कमाना चाहते हैं? अचीवर्स क्लब कम्युनिटी (ACC) छात्रों और युवाओं को केवल ₹249 वन-टाइम 🆔 एक्टिवेशन में SWIS रिचार्ज कमीशन (3.30%) और TWIS रेफरल इनकम (₹150 प्रति दोस्त) का 100% वेरिफाइड अवसर देती है।',
    'hero.badge_zero_inv': '0 इन्वेस्टमेंट · ₹249 🆔 शुल्क',
    'hero.badge_recharge': '3.30% फिक्स्ड रिचार्ज कमीशन',
    'hero.badge_referral': '₹150 प्रति रेफरल बैंक/UPI',
    'hero.cta_register': 'विद्यार्थी रजिस्ट्रेशन (₹249)',
    'hero.cta_dashboard': 'मेरा डैशबोर्ड खोलें',
    'hero.cta_video': 'ट्रेनिंग वीडियो देखें',
    'hero.cta_portal': 'विद्यार्थी पोर्टल',

    // Leaderboard
    'lead.title': 'शीर्ष अचीवर्स लीडरबोर्ड (Top 10 Leaders)',
    'lead.desc': 'कम्युनिटी के सबसे सफल छात्र व साथी जिन्होंने अपनी टीम बनाकर सर्वाधिक रेफरल इनकम और उच्च टियर हासिल किया है।',
    'lead.live': 'Real-time Live Rankings',
    'lead.your_rank': 'आपकी लीडरबोर्ड स्थिति',
    'lead.rank1': '👑 रैंक #1 TOP ACHIEVER',
    'lead.rank2': 'रैंक #2 SILVER',
    'lead.rank3': 'रैंक #3 BRONZE',
    'lead.referrals': 'रेफरल्स',
    'lead.direct_income': 'सीधी कमाई',
    'lead.cta': 'लीडरबोर्ड में अपना नाम शामिल करें और हर रेफरल पर ₹150 पाएं!',

    // Testimonials
    'test.title': 'विद्यार्थी व सदस्यों के सफलता के अनुभव',
    'test.desc': 'जानिए कैसे कॉलेज छात्र अपनी पढ़ाई के साथ और छोटे दुकानदार अपनी दुकान के साथ ACC से हर महीने निश्चित पॉकेट मनी व रिचार्ज बचत कमा रहे हैं।',
    'test.all': 'सभी अनुभव (All Stories)',
    'test.students': '🎓 कॉलेज छात्र (Students)',
    'test.twis': '👥 TWIS ₹150 रेफरल (Referral Payouts)',
    'test.swis': '⚡ SWIS रिचार्ज बचत (Recharge Savings)',
    'test.rating': 'संतुष्ट सदस्य रेटिंग',
    'test.active_ids': 'एक्टिव ID',
    'test.min_withdrawal': 'न्यूनतम निकासी',

    // Student Free Tools Hub
    'tools.title': 'छात्रों के लिए फ्री उपयोगी टूल्स व सर्विसेज',
    'tools.desc': 'बिना किसी शुल्क के उपयोग करें: रिचार्ज बचत कैलकुलेटर, पार्ट-टाइम रेज़्यूमे मेकर और कॉलेज पॉकेट मनी प्लानर।',
    'tools.tab1': '1. PhonePe vs ACC बचत कैलकुलेटर',
    'tools.tab2': '2. मासिक पॉकेट मनी गोल ट्रैकर',
    'tools.tab3': '3. रेडी-मेड WhatsApp स्टेटस स्क्रिप्ट्स',
    'tools.tab4': '4. स्टूडेंट पार्ट-टाइम रेज़्यूमे / बायो-डाटा',

    // FAQ Section
    'faq.title': 'अक्सर पूछे जाने वाले सवाल (FAQ & Helpdesk)',
    'faq.desc': 'SWIS रिचार्ज बचत, TWIS ₹150 रेफरल इनकम, ₹249 एक्टिवेशन और दैनिक बैंक विथड्रॉल से जुड़े सभी सवालों के पारदर्शी और सटीक जवाब।',
    'faq.search_placeholder': 'सवाल खोजें... (उदा. रिचार्ज कमीशन, विथड्रॉल, ₹249, लीगल)',
    'faq.calc_title': '🎓 स्टूडेंट पॉकेट मनी अनुमान कैलकुलेटर (Pocket Money Estimator)',
    'faq.still_questions': 'क्या आपका कोई अन्य सवाल है?',
    'faq.whatsapp_btn': 'WhatsApp सहायता',
    'faq.call_btn': 'कॉल करें',

    // Core Systems
    'swis.title': 'SELF WORK INCOME SYSTEM (SWIS)',
    'swis.subtitle': 'रिचार्ज व बिल पेमेंट्स सर्विसेज से रोजाना पक्की आय',
    'swis.badge': '3.30% FIXED COMMISSION',
    'twis.title': 'TEAM WORK INCOME SYSTEM (TWIS)',
    'twis.subtitle': 'टीम वर्क की ताकत से पॉकेट मनी और लाइफटाइम अर्निंग',
    'twis.badge': '₹150 / DIRECT REFERRAL',

    // Activity Feed
    'act.title': 'लाइव एक्टिविटी एवं अलर्ट्स',
    'act.subtitle': 'नई टीम जॉइनिंग, कमीशन क्रेडिट और एडमिन घोषणाओं की तत्काल सूचनाएं',
    'act.live_badge': 'LIVE रियल-टाइम फीड',
    'act.tab_all': 'सभी गतिविधियां',
    'act.tab_signups': '👥 टीम जॉइनिंग',
    'act.tab_commissions': '💰 कमीशन क्रेडिट',
    'act.tab_announcements': '📢 घोषणाएं',
    'act.mark_read': 'सभी पढ़ा हुआ मार्क करें',
    'act.unread': 'अपठित',
    'act.empty': 'अभी कोई नई गतिविधि नहीं है',
    'act.action_wish': 'बधाई संदेश भेजें',
    'act.action_wallet': 'वॉलेट देखें',
    'act.realtime_active': 'रियल-टाइम सिंक सक्रिय',

    // Footer
    'footer.links': 'महत्वपूर्ण लिंक्स',
    'footer.policies': 'नीति एवं सहायता',
    'footer.rights': 'सर्वाधिकार सुरक्षित।',
    'footer.zero_inv': 'Zero Investment Work · One-Time ₹249 Joining',
    'footer.faq': 'सवाल-जवाब (FAQ)',
    'footer.about': 'हमारे बारे में',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'नियम व शर्तें',
    'footer.disclaimer': 'अस्वीकरण',
    'footer.contact': 'सपोर्ट',
  },

  en: {
    // Header & Navigation
    'brand.title': 'Achievers Club',
    'brand.subtitle': 'Community · Start Young',
    'nav.home': 'Home',
    'nav.video': 'Training Video',
    'nav.calculator': 'Income Calculator',
    'nav.register': 'Registration (₹249)',
    'nav.idcard': 'Digital ID Card',
    'nav.my_idcard': 'My Digital ID Card',
    'nav.dashboard': 'Student Dashboard',
    'nav.my_dashboard': 'My Dashboard',
    'nav.promotions': 'Promotions & Visiting Cards',
    'nav.admin': 'Admin Panel',
    'nav.faq': 'FAQ & Helpdesk',
    'nav.about': 'About Us',
    'nav.contact': 'Support',
    'nav.login': 'Student Login',
    'nav.logout': 'Logout',
    'nav.menu': 'Open Menu',
    'announcement.badge': 'Website Feature',

    // Hero Section
    'hero.badge': 'STUDENT & YOUTH EARNING PROGRAM · ACC ASSURED ✓',
    'hero.title_pre': 'Earn Pocket Money & Income Along With ',
    'hero.title_highlight': 'College & Studies',
    'hero.title_slogan': 'Start Young, Retire Young',
    'hero.desc': 'Want to earn pocket money from your smartphone in 1-2 hours daily without disrupting your college studies? Achievers Club Community (ACC) gives students and youth a 100% verified opportunity with just a one-time ₹249 🆔 activation for SWIS recharge cashback (3.30%) and TWIS referral income (₹150 per friend).',
    'hero.badge_zero_inv': 'Zero Investment · ₹249 🆔 Activation',
    'hero.badge_recharge': '3.30% Fixed Recharge Commission',
    'hero.badge_referral': '₹150 / Direct Referral Bank/UPI',
    'hero.cta_register': 'Student Registration (₹249)',
    'hero.cta_dashboard': 'Open My Dashboard',
    'hero.cta_video': 'Watch Training Video',
    'hero.cta_portal': 'Student Portal',

    // Leaderboard
    'lead.title': 'Top Achievers Leaderboard (Top 10 Leaders)',
    'lead.desc': 'Our highest-performing community members and college champions who built their teams to achieve peak referral payouts and top member tiers.',
    'lead.live': 'Real-time Live Rankings',
    'lead.your_rank': 'Your Leaderboard Position',
    'lead.rank1': '👑 RANK #1 TOP ACHIEVER',
    'lead.rank2': 'RANK #2 SILVER',
    'lead.rank3': 'RANK #3 BRONZE',
    'lead.referrals': 'Referrals',
    'lead.direct_income': 'Direct Earnings',
    'lead.cta': 'Claim your spot on the Leaderboard and earn ₹150 on every referral!',

    // Testimonials
    'test.title': 'Student & Member Success Stories',
    'test.desc': 'Discover how college students and local retail shop owners earn consistent monthly pocket money and recharge savings with ACC.',
    'test.all': 'All Stories',
    'test.students': '🎓 College Students',
    'test.twis': '👥 TWIS ₹150 Referral Payouts',
    'test.swis': '⚡ SWIS Recharge Savings',
    'test.rating': 'Satisfied Rating',
    'test.active_ids': 'Active IDs',
    'test.min_withdrawal': 'Min Payout',

    // Student Free Tools Hub
    'tools.title': 'Free Student Utilities & Productivity Hub',
    'tools.desc': 'Use 100% free of charge: Recharge comparison calculator, part-time resume builder, and college pocket money goal tracker.',
    'tools.tab1': '1. PhonePe vs ACC Savings Calculator',
    'tools.tab2': '2. Monthly Pocket Money Goal Tracker',
    'tools.tab3': '3. Ready-Made WhatsApp Status Scripts',
    'tools.tab4': '4. Student Part-Time Resume / Bio-Data',

    // FAQ Section
    'faq.title': 'Frequently Asked Questions (FAQ & Helpdesk)',
    'faq.desc': 'Transparent and authentic answers regarding SWIS recharge cashback, TWIS ₹150 referral bonus, ₹249 activation, and daily UPI bank payouts.',
    'faq.search_placeholder': 'Search questions... (e.g. commission, withdrawal, ₹249, legality)',
    'faq.calc_title': '🎓 Student Pocket Money Estimator (Live Calculation)',
    'faq.still_questions': 'Still have a question or need guidance?',
    'faq.whatsapp_btn': 'WhatsApp Support',
    'faq.call_btn': 'Call Helpline',

    // Core Systems
    'swis.title': 'SELF WORK INCOME SYSTEM (SWIS)',
    'swis.subtitle': 'Daily Guaranteed Savings On Recharges & Utility Bills',
    'swis.badge': '3.30% FIXED COMMISSION',
    'twis.title': 'TEAM WORK INCOME SYSTEM (TWIS)',
    'twis.subtitle': 'Pocket Money & Lifetime Income Through Teamwork',
    'twis.badge': '₹150 / DIRECT REFERRAL',

    // Activity Feed
    'act.title': 'Live Activity & Real-Time Alerts',
    'act.subtitle': 'Instant notifications for new team sign-ups, commission credits & platform announcements',
    'act.live_badge': 'LIVE REAL-TIME FEED',
    'act.tab_all': 'All Activities',
    'act.tab_signups': '👥 Team Sign-ups',
    'act.tab_commissions': '💰 Commission Credits',
    'act.tab_announcements': '📢 Announcements',
    'act.mark_read': 'Mark all as read',
    'act.unread': 'unread',
    'act.empty': 'No new activity yet',
    'act.action_wish': 'Send Welcome Wish',
    'act.action_wallet': 'View Wallet',
    'act.realtime_active': 'Real-Time Sync Active',

    // Footer
    'footer.links': 'Important Links',
    'footer.policies': 'Policies & Support',
    'footer.rights': 'All Rights Reserved.',
    'footer.zero_inv': 'Zero Investment Work · One-Time ₹249 Joining',
    'footer.faq': 'FAQ & Helpdesk',
    'footer.about': 'About Us',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms & Conditions',
    'footer.disclaimer': 'Legal Disclaimer',
    'footer.contact': 'Support',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'hi',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('acc_preferred_language');
      return (saved === 'en' || saved === 'hi') ? saved : 'hi';
    } catch {
      return 'hi';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('acc_preferred_language', lang);
    } catch {}
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'hi' ? 'en' : 'hi';
    setLanguage(nextLang);
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    return translations[language]?.[key] || translations['hi']?.[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
