export type TierLevel = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface MemberTierInfo {
  level: TierLevel;
  nameHindi: string;
  nameEnglish: string;
  minReferrals: number;
  maxReferrals: number | null;
  colorHex: string;
  badgeBgHex: string;
  badgeBorderHex: string;
  tailwindBg: string;
  tailwindText: string;
  tailwindBorder: string;
  perks: string[];
  nextTierName: string | null;
  remainingForNext: number;
  progressPercent: number;
}

export function getMemberTier(referralsCount: number = 0): MemberTierInfo {
  const count = Math.max(0, referralsCount);

  if (count >= 30) {
    return {
      level: 'diamond',
      nameHindi: 'डायमंड चैंपियन',
      nameEnglish: 'Diamond Champion',
      minReferrals: 30,
      maxReferrals: null,
      colorHex: '#06b6d4',
      badgeBgHex: '#ecfeff',
      badgeBorderHex: '#06b6d4',
      tailwindBg: 'bg-cyan-50',
      tailwindText: 'text-cyan-800',
      tailwindBorder: 'border-cyan-300',
      perks: [
        'टॉप कम्युनिटी एम्बेसडर स्टेटस',
        '24x7 वीआईपी प्रायोरिटी विथड्रॉल',
        'एक्सक्लूसिव डिजिटल डायमंड शील्ड',
        'लाइफटाइम डायरेक्ट मेंटरशिप',
      ],
      nextTierName: null,
      remainingForNext: 0,
      progressPercent: 100,
    };
  }

  if (count >= 15) {
    const progress = Math.min(100, Math.round(((count - 15) / (30 - 15)) * 100));
    return {
      level: 'gold',
      nameHindi: 'गोल्ड लीडर',
      nameEnglish: 'Gold Leader',
      minReferrals: 15,
      maxReferrals: 29,
      colorHex: '#f59e0b',
      badgeBgHex: '#fffbeb',
      badgeBorderHex: '#f59e0b',
      tailwindBg: 'bg-amber-50',
      tailwindText: 'text-amber-900',
      tailwindBorder: 'border-amber-300',
      perks: [
        'गोल्ड लीडरशिप प्रमाणित बैज',
        'वीआईपी एडमिन हेल्पलाइन सहायता',
        'कम्युनिटी लीडरबोर्ड प्राइम रैंकिंग',
        'विशेष डिजिटल सर्टिफिकेट एक्सेस',
      ],
      nextTierName: 'डायमंड चैंपियन (30 रेफरल)',
      remainingForNext: 30 - count,
      progressPercent: progress,
    };
  }

  if (count >= 5) {
    const progress = Math.min(100, Math.round(((count - 5) / (15 - 5)) * 100));
    return {
      level: 'silver',
      nameHindi: 'सिल्वर अचीवर',
      nameEnglish: 'Silver Achiever',
      minReferrals: 5,
      maxReferrals: 14,
      colorHex: '#94a3b8',
      badgeBgHex: '#f8fafc',
      badgeBorderHex: '#94a3b8',
      tailwindBg: 'bg-slate-100',
      tailwindText: 'text-slate-800',
      tailwindBorder: 'border-slate-300',
      perks: [
        'सिल्वर कैंपस लीडर बैज',
        'फास्ट-ट्रैक बैंक विथड्रॉल प्राथमिकता',
        '3.30% फिक्स्ड रिचार्ज कमीशन',
        'अनलिमिटेड TWIS रेफरल अर्निंग',
      ],
      nextTierName: 'गोल्ड लीडर (15 रेफरल)',
      remainingForNext: 15 - count,
      progressPercent: progress,
    };
  }

  // Default: Bronze
  const progress = Math.min(100, Math.round((count / 5) * 100));
  return {
    level: 'bronze',
    nameHindi: 'ब्राउंज मेंबर',
    nameEnglish: 'Bronze Member',
    minReferrals: 0,
    maxReferrals: 4,
    colorHex: '#b45309',
    badgeBgHex: '#fff7ed',
    badgeBorderHex: '#fdba74',
    tailwindBg: 'bg-orange-50',
    tailwindText: 'text-orange-900',
    tailwindBorder: 'border-orange-200',
    perks: [
      '3.30% SWIS फिक्स्ड रिचार्ज कमीशन',
      '₹150 प्रति डायरेक्ट रेफरल इनकम',
      'वेरिफाइड डिजिटल PVC ID कार्ड',
      '24x7 WhatsApp सपोर्ट हेल्पडेस्क',
    ],
    nextTierName: 'सिल्वर अचीवर (5 रेफरल)',
    remainingForNext: 5 - count,
    progressPercent: progress,
  };
}
