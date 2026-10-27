import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup } from '../types';
import { ALL_DISTRICTS } from '../data/bangladeshLocations';
import { toBengaliNumber } from '../utils/translations';
import {
  Phone,
  Check,
  Plus,
  Send,
  Building,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  FbLike,
  FbComment,
  FbShare,
  FbDots,
  FbPublic,
  FbVerified,
  FbReactionLike,
  FbReactionLove,
  FbReactionCare,
  FbLogo,
} from '../components/FacebookIcons';

export const EmergencyRequestsView: React.FC = () => {
  const {
    requests,
    markRequestFulfilled,
    language,
    setPostRequestModalOpen,
    currentUser,
  } = useApp();

  const [filterGroup, setFilterGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [filterDistrict, setFilterDistrict] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'fulfilled'>('open');

  // Interactive Facebook post state: Reactions, comments, share modal
  const [userReactions, setUserReactions] = useState<Record<string, 'like' | 'love' | 'care' | null>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [postComments, setPostComments] = useState<Record<string, Array<{ id: string; name: string; text: string; time: string }>>>({
    'req-1': [
      { id: 'c1', name: 'মোঃ রাশেদুল ইসলাম', text: 'আমি কুর্মিটোলা হাসপাতালের কাছাকাছি আছি, প্রয়োজন হলে ০১৭xxxxxxxx এ নক দিন।', time: '২৫ মিনিট আগে' },
      { id: 'c2', name: 'তানভীর হাসান', text: 'আল্লাহ দ্রুত সুস্থতা দান করুন। পোস্টটি রক্তদাতা গ্রুপে শেয়ার করলাম।', time: '১০ মিনিট আগে' }
    ]
  });
  const [shareToast, setShareToast] = useState<string | null>(null);

  const bloodGroups: (BloodGroup | 'ALL')[] = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredRequests = requests.filter(req => {
    if (filterGroup !== 'ALL' && req.bloodGroup !== filterGroup) return false;
    if (filterDistrict && req.district !== filterDistrict) return false;
    if (filterStatus !== 'all' && req.status !== filterStatus) return false;
    return true;
  });

  const handleToggleReaction = (reqId: string, type: 'like' | 'love' | 'care' = 'like') => {
    setUserReactions(prev => {
      const current = prev[reqId];
      if (current === type) {
        return { ...prev, [reqId]: null };
      }
      return { ...prev, [reqId]: type };
    });
  };

  const handleAddComment = (reqId: string) => {
    const text = commentInputs[reqId]?.trim();
    if (!text) return;
    const authorName = currentUser?.name || (language === 'bn' ? 'স্বেচ্ছাসেবী রক্তবন্ধু' : 'Voluntary Donor');
    const newComment = {
      id: Date.now().toString(),
      name: authorName,
      text,
      time: language === 'bn' ? 'এইমাত্র' : 'Just now'
    };
    setPostComments(prev => ({
      ...prev,
      [reqId]: [...(prev[reqId] || []), newComment]
    }));
    setCommentInputs(prev => ({ ...prev, [reqId]: '' }));
    setOpenComments(prev => ({ ...prev, [reqId]: true }));
  };

  const handleFacebookShare = (req: any) => {
    const shareUrl = window.location.href;
    const shareTitle = `🚨 জরুরি রক্তের অনুরোধ: ${req.bloodGroup} (${req.bagsNeeded} ব্যাগ) - ${req.patientName}, ${req.hospitalName}, ${req.district}`;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`;
    window.open(fbUrl, '_blank', 'width=600,height=500');
    setShareToast(language === 'bn' ? 'ফেসবুকে শেয়ার উইন্ডো ওপেন হয়েছে!' : 'Opening Facebook Share!');
    setTimeout(() => setShareToast(null), 3500);
  };

  const handleWhatsAppShare = (req: any) => {
    const text = `🚨 *জরুরি রক্তের অনুরোধ* 🚨\n\n🩸 রক্তের গ্রুপ: *${req.bloodGroup}* (${req.bagsNeeded} ব্যাগ)\n👤 রোগীর নাম: ${req.patientName}\n🏥 হাসপাতাল: ${req.hospitalName}\n📍 এলাকা: ${req.hospitalAddress}, ${req.district}\n⏱️ জরুরিতা: ${req.urgency === 'critical_today' ? 'আজই জরুরি' : 'জরুরি'}\n📞 সরাসরি কল: ${req.contactPhone} ${req.altPhone ? `(${req.altPhone})` : ''}\n\n📝 বিস্তারিত: ${req.reason}\n\n_প্ল্যাটফর্ম: রক্তবন্ধু (RoktoBondhu)_`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = (req: any) => {
    navigator.clipboard?.writeText?.(window.location.href);
    setShareToast(language === 'bn' ? '📋 পোস্টের লিংক কপি করা হয়েছে!' : 'Link copied to clipboard!');
    setTimeout(() => setShareToast(null), 3000);
  };

  return (
    <div className="mx-auto max-w-5xl px-3 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Toast Alert */}
      {shareToast && (
        <div className="fixed bottom-16 sm:bottom-6 right-6 z-50 rounded-xl bg-neutral-900 text-white px-4 py-2.5 text-xs font-semibold shadow-2xl flex items-center gap-2 border border-neutral-700 animate-bounce">
          <FbLogo size={16} />
          <span>{shareToast}</span>
        </div>
      )}

      {/* Facebook-Style Feed Header */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#1877F2] text-xs font-bold uppercase tracking-wider">
            <FbLogo size={18} />
            <span>{language === 'bn' ? 'ফেসবুক স্টাইল লাইভ ফিড • রক্তবন্ধু' : 'Facebook-Style Live Feed'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1">
            {language === 'bn' ? 'জরুরি রক্তের আবেদন ও পোস্টসমূহ' : 'Urgent Blood Requests & Posts'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {language === 'bn'
              ? 'মুহূর্তের নোটিশে লাইক, মন্তব্য ও শেয়ার করে রক্তদাতাদের কাছে আবেদনটি পৌঁছে দিন।'
              : 'React, comment, and share to mobilize life-saving blood donors immediately.'}
          </p>
        </div>

        {/* Facebook-Style Create Post Button */}
        <button
          onClick={() => setPostRequestModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-full bg-[#1877F2] hover:bg-[#166fe5] px-5 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>{language === 'bn' ? 'রক্তের আবেদন পোস্ট করুন' : 'Create Post'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-2.5">
        {/* Blood Group Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mr-2">
            {language === 'bn' ? 'গ্রুপ:' : 'Group:'}
          </span>
          {bloodGroups.map(bg => (
            <button
              key={bg}
              onClick={() => setFilterGroup(bg)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
                filterGroup === bg
                  ? 'bg-[#1877F2] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
            >
              {bg === 'ALL' ? (language === 'bn' ? 'সব' : 'All') : bg}
            </button>
          ))}
        </div>

        {/* District and Status */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <div className="w-full sm:w-60">
            <select
              value={filterDistrict}
              onChange={e => setFilterDistrict(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-3 py-1.5 text-xs focus:border-[#1877F2] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="">{language === 'bn' ? 'সকল জেলা' : 'All Districts'}</option>
              {ALL_DISTRICTS.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-full text-xs">
            <button
              onClick={() => setFilterStatus('open')}
              className={`px-3 py-1 font-semibold rounded-full transition-colors ${
                filterStatus === 'open'
                  ? 'bg-white text-[#1877F2] shadow-xs dark:bg-neutral-900 dark:text-white'
                  : 'text-neutral-500'
              }`}
            >
              {language === 'bn' ? '🔴 চলমান আবেদন' : 'Open'}
            </button>
            <button
              onClick={() => setFilterStatus('fulfilled')}
              className={`px-3 py-1 font-semibold rounded-full transition-colors ${
                filterStatus === 'fulfilled'
                  ? 'bg-white text-emerald-600 shadow-xs dark:bg-neutral-900 dark:text-white'
                  : 'text-neutral-500'
              }`}
            >
              {language === 'bn' ? '🟢 রক্তদাতা প্রাপ্ত' : 'Fulfilled'}
            </button>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 font-semibold rounded-full transition-colors ${
                filterStatus === 'all'
                  ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white'
                  : 'text-neutral-500'
              }`}
            >
              {language === 'bn' ? 'সব' : 'All'}
            </button>
          </div>

          <span className="text-xs text-neutral-500 ml-auto">
            {language === 'bn' ? `মোট: ${toBengaliNumber(filteredRequests.length)}টি পোস্ট` : `Total: ${filteredRequests.length} posts`}
          </span>
        </div>
      </div>

      {/* Facebook Post Feed List */}
      {filteredRequests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            {language === 'bn' ? 'এই ফিল্টারে কোনো রক্তের আবেদন পাওয়া যায়নি।' : 'No matching blood requests found.'}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredRequests.map(req => {
            const isCritical = req.urgency === 'critical_today';
            const isFulfilled = req.status === 'fulfilled';
            const reaction = userReactions[req.id];
            const comments = postComments[req.id] || [];
            const isCommentsOpen = openComments[req.id];
            const baseLikes = req.bagsNeeded * 24 + 15;
            const totalLikes = reaction ? baseLikes + 1 : baseLikes;

            return (
              <div
                key={req.id}
                className="rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all overflow-hidden"
              >
                {/* 1. Facebook Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* User Profile Avatar with Blood Group badge */}
                    <div className="relative">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-[#1877F2] text-white font-black text-sm shadow-xs">
                        {req.bloodGroup}
                      </div>
                      <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-neutral-900 shadow-2xs">
                        <FbLogo size={14} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white hover:underline cursor-pointer">
                          {req.postedByName}
                        </h3>
                        <FbVerified className="w-3.5 h-3.5 text-[#1877F2]" />
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-0.5">
                        <span>{req.hospitalName}</span>
                        <span>•</span>
                        <span>{req.district}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5" title="পাবলিক পোস্ট">
                          <FbPublic className="w-3 h-3 text-neutral-400" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isFulfilled ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="h-3 w-3 stroke-[3]" />
                        <span>{language === 'bn' ? 'রক্তদাতা সম্পন্ন' : 'Fulfilled'}</span>
                      </span>
                    ) : isCritical ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse">
                        🚨 {language === 'bn' ? 'আজই জরুরি' : 'Critical Today'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        ⏱️ {language === 'bn' ? 'জরুরি প্রয়োজন' : 'Urgent Need'}
                      </span>
                    )}

                    <button
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                      title="পোস্ট মেনু"
                    >
                      <FbDots size={18} />
                    </button>
                  </div>
                </div>

                {/* 2. Facebook Post Body */}
                <div className="px-4 pb-3 space-y-3">
                  {/* Urgent Blood Notice Banner */}
                  <div className="rounded-xl bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/40 dark:to-orange-950/20 p-3.5 border border-rose-200/80 dark:border-rose-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-600 text-white font-black text-xl shadow-md">
                        {req.bloodGroup}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                          {language === 'bn' ? 'জরুরি রক্তের আবেদন' : 'Emergency Blood Requirement'}
                        </p>
                        <h4 className="text-base font-extrabold text-neutral-900 dark:text-white">
                          রোগী: {req.patientName}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-neutral-500 block">প্রয়োজন:</span>
                      <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                        {language === 'bn' ? toBengaliNumber(req.bagsNeeded) : req.bagsNeeded} ব্যাগ
                      </span>
                    </div>
                  </div>

                  {/* Post Caption / Details */}
                  <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed font-normal">
                    "{req.reason}"
                  </p>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-neutral-500 pt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                      <span>{req.hospitalAddress}, {req.district}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-neutral-400" />
                      <span>{req.hospitalName}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Facebook Reaction Counters Bar */}
                <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
                    {/* Overlapping Facebook Reaction Circles */}
                    <div className="flex items-center">
                      <FbReactionLike size={18} className="z-30" />
                      <FbReactionLove size={18} className="-ml-1.5 z-20" />
                      <FbReactionCare size={18} className="-ml-1.5 z-10" />
                    </div>
                    <span className="font-medium text-neutral-600 dark:text-neutral-400">
                      {language === 'bn' ? toBengaliNumber(totalLikes) : totalLikes}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setOpenComments(prev => ({ ...prev, [req.id]: !prev[req.id] }))}
                      className="hover:underline"
                    >
                      {language === 'bn' ? `${toBengaliNumber(comments.length)} টি মন্তব্য` : `${comments.length} comments`}
                    </button>
                    <span>•</span>
                    <button onClick={() => handleFacebookShare(req)} className="hover:underline">
                      {language === 'bn' ? `${toBengaliNumber(req.bagsNeeded * 4 + 7)} টি শেয়ার` : 'Shares'}
                    </button>
                  </div>
                </div>

                {/* 4. Facebook 3-Button Action Bar (Like, Comment, Share) */}
                <div className="px-2 py-1 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-3 gap-1">
                  {/* LIKE BUTTON WITH FACEBOOK ICON */}
                  <div className="relative group">
                    <button
                      onClick={() => handleToggleReaction(req.id, 'like')}
                      className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                        reaction === 'like'
                          ? 'text-[#1877F2] bg-blue-50/50 dark:bg-blue-950/30'
                          : reaction === 'love'
                          ? 'text-[#FA3E3E] bg-red-50/50 dark:bg-red-950/30'
                          : reaction === 'care'
                          ? 'text-[#F7B125] bg-amber-50/50 dark:bg-amber-950/30'
                          : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {reaction === 'love' ? (
                        <FbReactionLove size={18} />
                      ) : reaction === 'care' ? (
                        <FbReactionCare size={18} />
                      ) : (
                        <FbLike size={18} active={reaction === 'like'} />
                      )}
                      <span>
                        {reaction === 'love'
                          ? 'লাভ'
                          : reaction === 'care'
                          ? 'কেয়ার'
                          : reaction === 'like'
                          ? 'লাইক'
                          : (language === 'bn' ? 'লাইক' : 'Like')}
                      </span>
                    </button>

                    {/* Facebook Hover Reaction Bar Popup */}
                    <div className="hidden group-hover:flex absolute -top-11 left-2 z-40 items-center gap-1.5 rounded-full bg-white dark:bg-neutral-800 p-1.5 shadow-xl border border-neutral-200 dark:border-neutral-700 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleToggleReaction(req.id, 'like');
                        }}
                        className="hover:scale-125 transition-transform p-0.5"
                        title="Like"
                      >
                        <FbReactionLike size={24} />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleToggleReaction(req.id, 'love');
                        }}
                        className="hover:scale-125 transition-transform p-0.5"
                        title="Love"
                      >
                        <FbReactionLove size={24} />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleToggleReaction(req.id, 'care');
                        }}
                        className="hover:scale-125 transition-transform p-0.5"
                        title="Care / Donate"
                      >
                        <FbReactionCare size={24} />
                      </button>
                    </div>
                  </div>

                  {/* COMMENT BUTTON WITH FACEBOOK ICON */}
                  <button
                    onClick={() => setOpenComments(prev => ({ ...prev, [req.id]: !prev[req.id] }))}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <FbComment size={18} />
                    <span>{language === 'bn' ? 'মন্তব্য' : 'Comment'}</span>
                  </button>

                  {/* SHARE BUTTON WITH FACEBOOK ICON */}
                  <button
                    onClick={() => handleFacebookShare(req)}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <FbShare size={18} />
                    <span>{language === 'bn' ? 'শেয়ার' : 'Share'}</span>
                  </button>
                </div>

                {/* 5. Direct Call & WhatsApp Action Bar */}
                <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <a
                      href={`tel:${req.contactPhone}`}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-rose-600 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-2xs"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{language === 'bn' ? 'সরাসরি কল: ' + req.contactPhone : 'Call: ' + req.contactPhone}</span>
                    </a>

                    <button
                      onClick={() => handleWhatsAppShare(req)}
                      className="flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold transition-colors shadow-2xs"
                      title="Share to WhatsApp"
                    >
                      <span>🟢 WhatsApp</span>
                    </button>

                    <button
                      onClick={() => handleCopyLink(req)}
                      className="p-2 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Copy Link"
                    >
                      🔗
                    </button>
                  </div>

                  {!isFulfilled && (
                    <button
                      onClick={() => markRequestFulfilled(req.id)}
                      className="rounded-full border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 text-xs font-bold hover:bg-emerald-100 transition-colors whitespace-nowrap"
                    >
                      {language === 'bn' ? '✓ রক্তদাতা পেয়ে গেছি' : 'Mark Fulfilled'}
                    </button>
                  )}
                </div>

                {/* 6. Facebook Inline Comments Drawer */}
                {isCommentsOpen && (
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1877F2] text-white font-bold text-xs">
                        {currentUser?.name ? currentUser.name[0] : 'ব'}
                      </div>
                      <div className="flex-1 flex items-center rounded-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 shadow-2xs">
                        <input
                          type="text"
                          value={commentInputs[req.id] || ''}
                          onChange={e => setCommentInputs(prev => ({ ...prev, [req.id]: e.target.value }))}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleAddComment(req.id);
                          }}
                          placeholder={language === 'bn' ? 'একটি সান্ত্বনা বা সাহায্যের মন্তব্য লিখুন...' : 'Write a comment...'}
                          className="flex-1 bg-transparent text-xs text-neutral-800 dark:text-white placeholder:text-neutral-400 focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddComment(req.id)}
                          className="text-[#1877F2] hover:text-[#166fe5] p-1 font-bold text-xs"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Existing Comments List */}
                    <div className="space-y-2 pt-1">
                      {comments.length === 0 ? (
                        <p className="text-[11px] text-neutral-400 italic text-center py-1">
                          {language === 'bn' ? 'এখনও কোনো মন্তব্য করা হয়নি। প্রথম মন্তব্যটি করুন।' : 'No comments yet.'}
                        </p>
                      ) : (
                        comments.map(c => (
                          <div key={c.id} className="flex items-start gap-2 text-xs">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold text-[10px]">
                              {c.name[0]}
                            </div>
                            <div className="rounded-2xl bg-white dark:bg-neutral-900 px-3.5 py-2 border border-neutral-200/80 dark:border-neutral-700/80 shadow-2xs max-w-lg">
                              <span className="font-bold text-neutral-900 dark:text-white block">
                                {c.name}
                              </span>
                              <p className="text-neutral-700 dark:text-neutral-300 mt-0.5 leading-relaxed">
                                {c.text}
                              </p>
                              <span className="text-[10px] text-neutral-400 mt-1 block">
                                {c.time}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
