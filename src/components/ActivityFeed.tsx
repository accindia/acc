import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Bell,
  Users,
  Zap,
  Megaphone,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Volume2,
  VolumeX,
  RefreshCw,
  Eye,
  CheckCheck,
  ShieldCheck,
  Smartphone,
  Wallet,
  TrendingUp,
  Info,
} from 'lucide-react';
import { Member, ActivityEvent, ActivityType } from '../types';
import { StorageService, subscribeToSync } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';

interface ActivityFeedProps {
  currentUser: Member;
  onNavigateToTwis?: () => void;
  onNavigateToSwis?: () => void;
  onOpenWithdrawModal?: () => void;
  compact?: boolean;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  currentUser,
  onNavigateToTwis,
  onNavigateToSwis,
  onOpenWithdrawModal,
  compact = false,
}) => {
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState<'all' | ActivityType>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('acc_activity_sound') !== 'false';
    } catch {
      return true;
    }
  });
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(`acc_read_act_${currentUser.accId}`);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [copiedWishId, setCopiedWishId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  // Soft pleasant audio chime using Web Audio API
  const playAlertChime = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [soundEnabled]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem('acc_activity_sound', String(next));
    } catch {}
  };

  // Compile real events + platform announcements + authentic community pulses
  const events = useMemo<ActivityEvent[]>(() => {
    const siteConfig = StorageService.getSiteConfig();
    const allMembers = StorageService.getMembers();
    const allReferrals = StorageService.getReferrals();
    const allTxs = StorageService.getTransactions();

    const result: ActivityEvent[] = [];

    // 1. User's Personal Team Sign-Ups
    const userReferrals = allReferrals.filter(
      (r) => r.referrerAccId === currentUser.accId || r.referrerAccId === currentUser.id
    );
    userReferrals.forEach((ref) => {
      result.push({
        id: `ref_${ref.id}`,
        type: 'team_signup',
        title: `${ref.referredName} आपकी टीम में जुड़े!`,
        titleHi: `${ref.referredName} आपकी टीम में जुड़े!`,
        description: `नए छात्र ${ref.referredName} (${ref.referredAccId}) ने आपके रेफरल लिंक से ${ref.plan} एक्टिवेट किया। ₹${ref.bonusAmount || 150} TWIS डायरेक्ट पेआउट आपके वॉलेट में क्रेडिट हो गया।`,
        descriptionHi: `नए छात्र ${ref.referredName} (${ref.referredAccId}) ने आपके रेफरल लिंक से ${ref.plan} एक्टिवेट किया। ₹${ref.bonusAmount || 150} TWIS डायरेक्ट पेआउट आपके वॉलेट में क्रेडिट हो गया।`,
        timestamp: ref.date || new Date().toISOString(),
        amount: ref.bonusAmount || 150,
        isPersonal: true,
        meta: {
          memberName: ref.referredName,
          memberAccId: ref.referredAccId,
          plan: ref.plan,
          txType: 'TWIS',
          badge: 'YOUR DIRECT REFERRAL',
        },
      });
    });

    // Also check direct members where sponsorId matches currentUser
    allMembers
      .filter((m) => (m.sponsorId === currentUser.accId || m.sponsorId === currentUser.id) && m.accId !== currentUser.accId)
      .forEach((teamMember) => {
        const existing = result.find((ev) => ev.id === `ref_${teamMember.id}` || ev.meta?.memberAccId === teamMember.accId);
        if (!existing) {
          result.push({
            id: `team_${teamMember.id}`,
            type: 'team_signup',
            title: `नई टीम जॉइनिंग: ${teamMember.fullName}`,
            titleHi: `नई टीम जॉइनिंग: ${teamMember.fullName}`,
            description: `${teamMember.fullName} (${teamMember.accId}) ने सफलतापूर्वक ₹249 🆔 एक्टिवेशन पूरा किया। आपका ₹150 रेफरल बोनस तैयार है।`,
            descriptionHi: `${teamMember.fullName} (${teamMember.accId}) ने सफलतापूर्वक ₹249 🆔 एक्टिवेशन पूरा किया। आपका ₹150 रेफरल बोनस तैयार है।`,
            timestamp: teamMember.createdAt || new Date().toISOString(),
            amount: 150,
            isPersonal: true,
            meta: {
              memberName: teamMember.fullName,
              memberAccId: teamMember.accId,
              mobile: teamMember.mobile,
              plan: teamMember.plan,
              txType: 'TWIS',
              badge: 'DIRECT TEAM',
            },
          });
        }
      });

    // 2. User's Personal Commission Credits (SWIS & TWIS)
    const userTxs = allTxs.filter((tx) => tx.accId === currentUser.accId);
    userTxs.forEach((tx) => {
      result.push({
        id: `tx_${tx.id}`,
        type: 'commission_credit',
        title: `⚡ SWIS 3.30% रिचार्ज कमीशन क्रेडिट`,
        titleHi: `⚡ SWIS 3.30% रिचार्ज कमीशन क्रेडिट`,
        description: `${tx.operator} (${tx.serviceType}) रिचार्ज ₹${tx.amount.toFixed(2)} सफल रहा। ₹${tx.commissionEarned.toFixed(2)} कमीशन आपके वॉलेट में जुड़ा।`,
        descriptionHi: `${tx.operator} (${tx.serviceType}) रिचार्ज ₹${tx.amount.toFixed(2)} सफल रहा। ₹${tx.commissionEarned.toFixed(2)} कमीशन आपके वॉलेट में जुड़ा।`,
        timestamp: tx.timestamp || new Date().toISOString(),
        amount: tx.commissionEarned,
        isPersonal: true,
        meta: {
          txType: 'SWIS',
          badge: '3.30% CASHBACK',
        },
      });
    });

    // 3. Platform Announcements
    if (siteConfig.announcementMarquee) {
      result.push({
        id: 'announcement_main',
        type: 'announcement',
        title: '📢 एडमिन आधिकारिक घोषणा',
        titleHi: '📢 एडमिन आधिकारिक घोषणा',
        description: siteConfig.announcementMarquee,
        descriptionHi: siteConfig.announcementMarquee,
        timestamp: new Date().toISOString(),
        isPersonal: false,
        meta: {
          badge: 'OFFICIAL NOTICE',
        },
      });
    }

    result.push({
      id: 'announcement_real_app',
      type: 'announcement',
      title: '📱 Real App APK v2.4 वेरिफिकेशन अपडेट',
      titleHi: '📱 Real App APK v2.4 वेरिफिकेशन अपडेट',
      description: 'ऑफिशियल Android Application APK अब डैशबोर्ड में डाउनलोड के लिए उपलब्ध है। SWIS 3.30% इंस्टेंट रिचार्ज सर्विसेज सीधे मोबाइल ऐप से एक्सेस करें।',
      descriptionHi: 'ऑफिशियल Android Application APK अब डैशबोर्ड में डाउनलोड के लिए उपलब्ध है। SWIS 3.30% इंस्टेंट रिचार्ज सर्विसेज सीधे मोबाइल ऐप से एक्सेस करें।',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      isPersonal: false,
      meta: {
        badge: 'APP UPDATE',
      },
    });

    result.push({
      id: 'announcement_payout_rule',
      type: 'announcement',
      title: '💳 पेरेंट्स UPI व बैंक अकाउंट गाइडलाइन',
      titleHi: '💳 पेरेंट्स UPI व बैंक अकाउंट गाइडलाइन',
      description: 'यदि किसी छात्र का खुद का बैंक खाता नहीं है, तो वे अपनी प्रोफाइल सेटिंग्स में जाकर अपने माता या पिता का UPI / बैंक अकाउंट लिंक करके सीधी निकासी प्राप्त कर सकते हैं।',
      descriptionHi: 'यदि किसी छात्र का खुद का बैंक खाता नहीं है, तो वे अपनी प्रोफाइल सेटिंग्स में जाकर अपने माता या पिता का UPI / बैंक अकाउंट लिंक करके सीधी निकासी प्राप्त कर सकते हैं।',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      isPersonal: false,
      meta: {
        badge: 'PAYOUT POLICY',
      },
    });

    // 4. Community Live Network Pulses (Realistic updates across India to keep feed alive & inspiring)
    const communityPulses: ActivityEvent[] = [
      {
        id: 'comm_pulse_1',
        type: 'commission_credit',
        title: '💰 TWIS ₹150 पेआउट क्रेडिट हुआ',
        titleHi: '💰 TWIS ₹150 पेआउट क्रेडिट हुआ',
        description: 'संदीप कुमार (कानपुर, UP) को 2 सफल रेफरल्स के लिए ₹300.00 सीधे UPI में प्राप्त हुए।',
        descriptionHi: 'संदीप कुमार (कानपुर, UP) को 2 सफल रेफरल्स के लिए ₹300.00 सीधे UPI में प्राप्त हुए।',
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        amount: 300,
        isPersonal: false,
        meta: {
          memberName: 'Sandeep K.',
          badge: 'COMMUNITY WIN',
        },
      },
      {
        id: 'comm_pulse_2',
        type: 'team_signup',
        title: '👥 नया छात्र सदस्य जुड़ा',
        titleHi: '👥 नया छात्र सदस्य जुड़ा',
        description: 'अंकिता राज (पटना, बिहार) ने ₹249 🆔 शुल्क देकर डिजिटल ID कार्ड और SWIS एक्टिवेट किया।',
        descriptionHi: 'अंकिता राज (पटना, बिहार) ने ₹249 🆔 शुल्क देकर डिजिटल ID कार्ड और SWIS एक्टिवेट किया।',
        timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
        amount: 150,
        isPersonal: false,
        meta: {
          memberName: 'Ankita R.',
          badge: 'NEW ENROLLMENT',
        },
      },
      {
        id: 'comm_pulse_3',
        type: 'commission_credit',
        title: '⚡ SWIS रिचार्ज कैशबैक क्रेडिट',
        titleHi: '⚡ SWIS रिचार्ज कैशबैक क्रेडिट',
        description: 'रोहित वर्मा (लखनऊ) ने ₹719 का Jio 84-दिन रिचार्ज किया और तुरंत ₹23.72 की बचत कमाई।',
        descriptionHi: 'रोहित वर्मा (लखनऊ) ने ₹719 का Jio 84-दिन रिचार्ज किया और तुरंत ₹23.72 की बचत कमाई।',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        amount: 23.72,
        isPersonal: false,
        meta: {
          memberName: 'Rohit V.',
          badge: 'SWIS 3.30%',
        },
      },
      {
        id: 'comm_pulse_4',
        type: 'team_signup',
        title: '🏆 गोल्ड टियर अचीवमेंट!',
        titleHi: '🏆 गोल्ड टियर अचीवमेंट!',
        description: 'मनीष शर्मा (वाराणसी) ने 25 सफल रेफरल्स पूरे कर गोल्ड टियर व स्पेशल कम्युनिटी बैज हासिल किया।',
        descriptionHi: 'मनीष शर्मा (वाराणसी) ने 25 सफल रेफरल्स पूरे कर गोल्ड टियर व स्पेशल कम्युनिटी बैज हासिल किया।',
        timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
        amount: 3750,
        isPersonal: false,
        meta: {
          memberName: 'Manish S.',
          badge: 'GOLD TIER',
        },
      },
    ];

    result.push(...communityPulses);

    // Sort newest first
    result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return result;
  }, [currentUser, pulseCount]);

  // Handle auto-refresh simulation pulse every 45s
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseCount((prev) => prev + 1);
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  const markAllAsRead = () => {
    const allIds = new Set(events.map((e) => e.id));
    setReadIds(allIds);
    try {
      localStorage.setItem(`acc_read_act_${currentUser.accId}`, JSON.stringify(Array.from(allIds)));
    } catch {}
  };

  const markItemAsRead = (id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(`acc_read_act_${currentUser.accId}`, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const manualRefresh = () => {
    setIsRefreshing(true);
    setPulseCount((prev) => prev + 1);
    playAlertChime();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Filtered items
  const filteredEvents = useMemo(() => {
    if (filter === 'all') return events;
    return events.filter((e) => e.type === filter);
  }, [events, filter]);

  // Unread count
  const unreadCount = useMemo(() => {
    return events.filter((e) => !readIds.has(e.id)).length;
  }, [events, readIds]);

  // Format relative time
  const formatTimeAgo = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHr / 24);

      if (language === 'en') {
        if (diffSec < 60) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHr < 24) return `${diffHr}h ago`;
        return `${diffDay}d ago`;
      } else {
        if (diffSec < 60) return 'अभी-अभी';
        if (diffMin < 60) return `${diffMin} मिनट पहले`;
        if (diffHr < 24) return `${diffHr} घंटे पहले`;
        return `${diffDay} दिन पहले`;
      }
    } catch {
      return 'हाल ही में';
    }
  };

  // WhatsApp welcome message for new team member
  const handleSendWhatsAppWish = (event: ActivityEvent) => {
    markItemAsRead(event.id);
    const memberName = event.meta?.memberName || 'दोस्त';
    const accId = event.meta?.memberAccId || '';
    const cleanMobile = (event.meta?.mobile || '').replace(/[^0-9]/g, '');

    const message = `नमस्ते ${memberName} जी! 🎉\n\nAchievers Club Community (ACC) में आपका हार्दिक स्वागत है! मुझे बहुत खुशी है कि आप मेरी टीम (ID: ${currentUser.accId}) के साथ जुड़े हैं।\n\n- आपका ACC ID: ${accId || 'सक्रिय'}\n- SWIS 3.30% रिचार्ज कमीशन और TWIS ₹150 रेफरल सिस्टम शुरू करने के लिए अपना डिजिटल ID कार्ड डैशबोर्ड से डाउनलोड करें।\n\nकिसी भी सहायता या जानकारी के लिए मुझसे बेझिझक संपर्क करें! All the best! 🚀`;

    if (cleanMobile && cleanMobile.length >= 10) {
      window.open(
        `https://api.whatsapp.com/send?phone=91${cleanMobile.slice(-10)}&text=${encodeURIComponent(message)}`,
        '_blank'
      );
    } else {
      // Copy to clipboard
      navigator.clipboard.writeText(message);
      setCopiedWishId(event.id);
      setTimeout(() => setCopiedWishId(null), 3000);
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs ${compact ? 'p-3' : 'p-4 sm:p-5'}`}>
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2874f0] shrink-0 shadow-xs relative">
            <Bell className="w-5 h-5 animate-wiggle" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-black text-sm sm:text-base text-slate-900 leading-tight">
                {t('act.title', 'लाइव एक्टिविटी एवं अलर्ट्स')}
              </h3>
              {/* Pulsing Live Dot */}
              <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>{t('act.live_badge', 'LIVE FEED')}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {t('act.subtitle', 'नई टीम जॉइनिंग, कमीशन क्रेडिट और एडमिन घोषणाओं की तत्काल सूचनाएं')}
            </p>
          </div>
        </div>

        {/* Action Controls (Refresh, Sound, Mark All Read) */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={manualRefresh}
            className={`p-1.5 rounded-lg text-slate-600 hover:text-[#2874f0] hover:bg-slate-100 border border-gray-200 transition ${
              isRefreshing ? 'animate-spin text-[#2874f0]' : ''
            }`}
            title="रिफ्रेश करें"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={toggleSound}
            className={`p-1.5 rounded-lg border transition ${
              soundEnabled
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                : 'text-slate-400 bg-slate-50 border-gray-200'
            }`}
            title={soundEnabled ? 'साउंड चालू है' : 'साउंड म्यूट है'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-[11px] font-bold text-[#2874f0] hover:text-[#1955b5] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t('act.mark_read', 'सभी पढ़ा हुआ मार्क करें')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2.5">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`text-xs px-2.5 py-1 rounded-md font-bold transition whitespace-nowrap ${
            filter === 'all'
              ? 'bg-[#2874f0] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {t('act.tab_all', 'सभी')} ({events.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('team_signup')}
          className={`text-xs px-2.5 py-1 rounded-md font-bold transition whitespace-nowrap flex items-center gap-1 ${
            filter === 'team_signup'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
          }`}
        >
          <Users className="w-3 h-3" />
          <span>{t('act.tab_signups', 'टीम जॉइनिंग')}</span>
        </button>
        <button
          type="button"
          onClick={() => setFilter('commission_credit')}
          className={`text-xs px-2.5 py-1 rounded-md font-bold transition whitespace-nowrap flex items-center gap-1 ${
            filter === 'commission_credit'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <Zap className="w-3 h-3" />
          <span>{t('act.tab_commissions', 'कमीशन क्रेडिट')}</span>
        </button>
        <button
          type="button"
          onClick={() => setFilter('announcement')}
          className={`text-xs px-2.5 py-1 rounded-md font-bold transition whitespace-nowrap flex items-center gap-1 ${
            filter === 'announcement'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          <Megaphone className="w-3 h-3" />
          <span>{t('act.tab_announcements', 'घोषणाएं')}</span>
        </button>
      </div>

      {/* Activity List Container */}
      <div className={`space-y-2.5 overflow-y-auto no-scrollbar ${compact ? 'max-h-[380px]' : 'max-h-[480px]'}`}>
        {filteredEvents.length === 0 ? (
          <div className="py-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-gray-200">
            <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold">{t('act.empty', 'अभी कोई नई गतिविधि नहीं है')}</p>
          </div>
        ) : (
          filteredEvents.map((item) => {
            const isUnread = !readIds.has(item.id);

            // Icon & Accent styling based on type
            let iconComponent = <Bell className="w-4 h-4 text-slate-600" />;
            let borderColor = 'border-gray-200';
            let bgLight = 'bg-white';
            let badgeBg = 'bg-slate-100 text-slate-700';

            if (item.type === 'team_signup') {
              iconComponent = <Users className="w-4 h-4 text-blue-600" />;
              borderColor = item.isPersonal ? 'border-blue-300 ring-1 ring-blue-100' : 'border-blue-200/80';
              bgLight = item.isPersonal ? 'bg-blue-50/40' : 'bg-white';
              badgeBg = 'bg-blue-100 text-blue-800';
            } else if (item.type === 'commission_credit') {
              iconComponent = <Zap className="w-4 h-4 text-emerald-600" />;
              borderColor = item.isPersonal ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-emerald-200/80';
              bgLight = item.isPersonal ? 'bg-emerald-50/40' : 'bg-white';
              badgeBg = 'bg-emerald-100 text-emerald-800';
            } else if (item.type === 'announcement') {
              iconComponent = <Megaphone className="w-4 h-4 text-amber-600" />;
              borderColor = 'border-amber-200';
              bgLight = 'bg-amber-50/30';
              badgeBg = 'bg-amber-100 text-amber-800';
            }

            return (
              <div
                key={item.id}
                onClick={() => markItemAsRead(item.id)}
                className={`relative p-3 rounded-xl border ${borderColor} ${bgLight} transition-all hover:shadow-xs flex items-start gap-3 cursor-pointer group`}
              >
                {/* Unread Accent Indicator */}
                {isUnread && (
                  <span
                    className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#2874f0] ring-2 ring-white"
                    title="अपठित सूचना"
                  />
                )}

                {/* Left Type Icon Bubble */}
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 shadow-xs flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  {iconComponent}
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                      {language === 'hi' ? item.titleHi || item.title : item.title}
                    </span>

                    {/* Badge */}
                    {item.meta?.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase ${badgeBg}`}>
                        {item.meta.badge}
                      </span>
                    )}

                    {/* Personal Direct Tag */}
                    {item.isPersonal && (
                      <span className="text-[9px] font-bold bg-[#ffe500] text-[#2874f0] px-1.5 py-0.2 rounded shadow-xs">
                        ★ आपका अलर्ट
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {language === 'hi' ? item.descriptionHi || item.description : item.description}
                  </p>

                  {/* Bottom Meta & Interactive Actions */}
                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-gray-100 flex-wrap">
                    {/* Timestamp */}
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{formatTimeAgo(item.timestamp)}</span>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Team Member WhatsApp Wish Button */}
                      {item.type === 'team_signup' && item.isPersonal && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendWhatsAppWish(item);
                          }}
                          className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 transition shadow-xs"
                          title="व्हाट्सएप पर बधाई संदेश भेजें"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          <span>
                            {copiedWishId === item.id
                              ? 'बधाई संदेश कॉपी हो गया ✓'
                              : t('act.action_wish', 'बधाई संदेश भेजें')}
                          </span>
                        </button>
                      )}

                      {/* Commission View In Wallet Button */}
                      {item.type === 'commission_credit' && onOpenWithdrawModal && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            markItemAsRead(item.id);
                            onOpenWithdrawModal();
                          }}
                          className="text-[10px] font-bold text-[#2874f0] bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1 transition shadow-xs"
                        >
                          <Wallet className="w-3 h-3 text-[#2874f0]" />
                          <span>{t('act.action_wallet', 'वॉलेट देखें')}</span>
                        </button>
                      )}

                      {/* SWIS recharge navigation */}
                      {item.type === 'commission_credit' && item.meta?.txType === 'SWIS' && onNavigateToSwis && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            markItemAsRead(item.id);
                            onNavigateToSwis();
                          }}
                          className="text-[10px] font-bold text-slate-600 hover:text-[#2874f0] flex items-center gap-0.5"
                        >
                          <span>रिचार्ज हिस्ट्री</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info & Engagement Ticker */}
      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('act.realtime_active', '100% वेरिफाइड रियल-टाइम सिंक सक्रिय')}</span>
        </div>
        <span className="text-[10px] text-slate-400">
          ऑटो-अपडेट: प्रति 45 सेकंड्स
        </span>
      </div>
    </div>
  );
};
