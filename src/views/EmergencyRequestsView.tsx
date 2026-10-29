import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup } from '../types';
import { ALL_DISTRICTS } from '../data/bangladeshLocations';
import { toBengaliNumber } from '../utils/translations';
import {
  Phone,
  CheckCircle2,
  Plus,
  Send,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  Copy,
  MessageSquare,
  MessageCircle,
  Share2,
  AlertCircle,
  Heart,
  User,
  ShieldCheck,
} from 'lucide-react';

export const EmergencyRequestsView: React.FC = () => {
  const {
    requests,
    markRequestFulfilled,
    language,
    setPostRequestModalOpen,
    currentUser,
    showToast,
  } = useApp();

  const [filterGroup, setFilterGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [filterDistrict, setFilterDistrict] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'fulfilled'>('open');

  // Interactive community comments for coordinating blood donations
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [postComments, setPostComments] = useState<Record<string, Array<{ id: string; name: string; text: string; time: string }>>>({
    'req-1': [
      { id: 'c1', name: 'মোঃ রাশেদুল ইসলাম', text: 'আমি কুর্মিটোলা হাসপাতালের কাছাকাছি আছি, রক্তের জন্য ০১৭xxxxxxxx এ নক দিন।', time: '২৫ মিনিট আগে' },
      { id: 'c2', name: 'তানভীর হাসান', text: 'আল্লাহ দ্রুত সুস্থতা দান করুন। ডোনার গ্রুপের সবাইকে জানিয়েছি।', time: '১০ মিনিট আগে' }
    ]
  });

  const bloodGroups: (BloodGroup | 'ALL')[] = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredRequests = requests.filter(req => {
    if (filterGroup !== 'ALL' && req.bloodGroup !== filterGroup) return false;
    if (filterDistrict && req.district !== filterDistrict) return false;
    if (filterStatus !== 'all' && req.status !== filterStatus) return false;
    return true;
  });

  const handleAddComment = (reqId: string) => {
    const text = commentInputs[reqId]?.trim();
    if (!text) return;
    const authorName = currentUser?.name || (language === 'bn' ? 'স্বেচ্ছাসেবী রক্তদাতা' : 'Volunteer Donor');
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
    showToast(language === 'bn' ? 'আপনার মন্তব্য ও সহায়তা বার্তা যুক্ত হয়েছে।' : 'Your comment was posted.');
  };

  const handleWhatsAppShare = (req: any) => {
    const text = `🚨 *জরুরি রক্তের আবেদন* 🚨\n\n🩸 রক্তের গ্রুপ: *${req.bloodGroup}* (${toBengaliNumber(req.bagsNeeded)} ব্যাগ)\n👤 রোগীর নাম: ${req.patientName}\n🏥 হাসপাতাল: ${req.hospitalName}\n📍 এলাকা: ${req.hospitalAddress || ''}, ${req.district}\n⏱️ সময়: ${req.urgency === 'critical_today' ? 'আজই জরুরি' : 'জরুরি'}\n📞 সরাসরি কল: ${req.contactPhone} ${req.altPhone ? `(${req.altPhone})` : ''}\n\n📝 কারণ: ${req.reason}\n\n_প্ল্যাটফর্ম: রক্তবন্ধু (RoktoBondhu)_`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyRequest = (req: any) => {
    const text = `🚨 জরুরি রক্তের আবেদন!\nরক্তের গ্রুপ: ${req.bloodGroup} (${toBengaliNumber(req.bagsNeeded)} ব্যাগ)\nরোগী: ${req.patientName}\nহাসপাতাল: ${req.hospitalName}, ${req.district}\nযোগাযোগ: ${req.contactPhone}\nরক্তবন্ধু প্ল্যাটফর্ম`;
    navigator.clipboard?.writeText?.(text);
    showToast(
      language === 'bn' ? '📋 রক্তের আবেদনের সম্পূর্ণ তথ্য কপি করা হয়েছে!' : 'Request details copied to clipboard!',
      'success'
    );
  };

  const getSmsLink = (req: any) => {
    const text = `আসসালামু আলাইকুম। রক্তবন্ধু প্ল্যাটফর্মে ${req.patientName}-এর জন্য ${req.bloodGroup} রক্তের পোস্ট দেখে যোগাযোগ করছি। রোগী কোন হাসপাতালে আছেন বিস্তারিত জানাবেন?`;
    return `sms:${req.contactPhone}?body=${encodeURIComponent(text)}`;
  };

  return (
    <div className="mx-auto max-w-5xl px-3 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
            <span className="flex h-2 w-2 rounded-full bg-rose-600 animate-ping" />
            <span>{language === 'bn' ? 'সার্বক্ষণিক লাইভ রক্তের বোর্ড' : 'Live Emergency Blood Board'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {language === 'bn' ? 'জরুরি রক্তের আবেদনসমূহ' : 'Urgent Blood Requests'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'bn'
              ? 'মুহূর্তের প্রয়োজনে রোগীদের পাশে দাঁড়ান — সরাসরি রোগীর স্বজনের নম্বরে কল বা বার্তা দিন।'
              : 'Directly connect with patient attendants via verified phone or WhatsApp.'}
          </p>
        </div>

        {/* Post Request Button */}
        <button
          onClick={() => setPostRequestModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/20 active:scale-95 transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>{language === 'bn' ? '+ জরুরি রক্তের আবেদন করুন' : '+ Post Blood Request'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
        {/* Blood Group Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-2">
            {language === 'bn' ? 'গ্রুপ:' : 'Group:'}
          </span>
          {bloodGroups.map(bg => (
            <button
              key={bg}
              onClick={() => setFilterGroup(bg)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterGroup === bg
                  ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-600/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {bg === 'ALL' ? (language === 'bn' ? 'সব গ্রুপ' : 'All') : bg}
            </button>
          ))}
        </div>

        {/* District and Status Selectors */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="w-full sm:w-60">
            <select
              value={filterDistrict}
              onChange={e => setFilterDistrict(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="">{language === 'bn' ? 'সকল জেলা (সমগ্র বাংলাদেশ)' : 'All Districts'}</option>
              {ALL_DISTRICTS.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilterStatus('open')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-colors ${
                filterStatus === 'open'
                  ? 'bg-white text-rose-600 shadow-xs dark:bg-slate-900 dark:text-rose-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {language === 'bn' ? '🔴 চলমান আবেদন' : 'Open'}
            </button>
            <button
              onClick={() => setFilterStatus('fulfilled')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-colors ${
                filterStatus === 'fulfilled'
                  ? 'bg-white text-emerald-600 shadow-xs dark:bg-slate-900 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {language === 'bn' ? '🟢 ডোনার প্রাপ্ত' : 'Fulfilled'}
            </button>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-colors ${
                filterStatus === 'all'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {language === 'bn' ? 'সব' : 'All'}
            </button>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
            {language === 'bn' ? `মোট: ${toBengaliNumber(filteredRequests.length)}টি আবেদন` : `Total: ${filteredRequests.length} requests`}
          </span>
        </div>
      </div>

      {/* Emergency Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800 bg-white dark:bg-slate-900">
          <AlertCircle className="h-10 w-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {language === 'bn' ? 'এই ফিল্টারে কোনো রক্তের আবেদন পাওয়া যায়নি।' : 'No matching blood requests found.'}
          </p>
          <button
            onClick={() => {
              setFilterGroup('ALL');
              setFilterDistrict('');
              setFilterStatus('all');
            }}
            className="mt-3 text-xs font-bold text-rose-600 hover:underline"
          >
            {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset filters'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(req => {
            const isCritical = req.urgency === 'critical_today';
            const isFulfilled = req.status === 'fulfilled';
            const comments = postComments[req.id] || [];
            const isCommentsOpen = openComments[req.id];

            return (
              <div
                key={req.id}
                className={`rounded-2xl border bg-white shadow-xs dark:bg-slate-900 transition-all overflow-hidden ${
                  isFulfilled
                    ? 'border-emerald-200 dark:border-emerald-900/40 opacity-90'
                    : isCritical
                    ? 'border-rose-300 dark:border-rose-900/60 shadow-rose-950/5'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Request Header */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Big Blood Group Badge */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 text-white font-black text-xl shadow-md shadow-rose-600/20">
                      {req.bloodGroup}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isFulfilled
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : isCritical
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {isFulfilled
                            ? (language === 'bn' ? '✅ রক্তদাতা পাওয়া গেছে' : 'Fulfilled')
                            : isCritical
                            ? (language === 'bn' ? '🚨 আজই জরুরি' : 'Critical Today')
                            : (language === 'bn' ? '⏱️ জরুরি রক্তদান' : 'Urgent')}
                        </span>

                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                          {toBengaliNumber(req.bagsNeeded)} ব্যাগ রক্ত প্রয়োজন
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                        রোগী: {req.patientName}
                      </h2>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        পোস্ট করেছেন: <strong className="text-slate-700 dark:text-slate-300">{req.postedByName}</strong> • {req.createdAt}
                      </p>
                    </div>
                  </div>

                  {/* Status Toggle Button (if owner/admin) */}
                  {!isFulfilled && (
                    <button
                      onClick={() => markRequestFulfilled(req.id)}
                      className="self-start sm:self-auto text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
                      title="রক্ত পাওয়া গেলে সম্পন্ন করুন"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{language === 'bn' ? 'রক্তদাতা পেয়েছি' : 'Mark Fulfilled'}</span>
                    </button>
                  )}
                </div>

                {/* Patient Case & Hospital Details */}
                <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Building2 className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-900 dark:text-white font-bold">{req.hospitalName}</strong>
                        <span className="text-slate-500 dark:text-slate-400">{req.hospitalAddress || 'হাসপাতাল এলাকা'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <MapPin className="h-4 w-4 text-rose-600 shrink-0" />
                      <span>{req.upazila ? `${req.upazila}, ` : ''}{req.district}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Clock className="h-4 w-4 text-rose-600 shrink-0" />
                      <span>প্রয়োজন: <strong className="text-slate-900 dark:text-white">{isCritical ? 'আজই জরুরি' : '২৪ ঘণ্টার মধ্যে'}</strong> • পোস্ট: {req.createdAt}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        রোগীর সমস্যা / অপারেশনের বিবরণ
                      </span>
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        "{req.reason || 'জরুরি চিকিৎসার জন্য রক্তের প্রয়োজন।'}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Action Row: Direct Call, WhatsApp, SMS, Share */}
                <div className="p-3 sm:p-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Direct Phone Dial */}
                    <a
                      href={`tel:${req.contactPhone}`}
                      className="flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-xs active:scale-95 transition-all"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>সরাসরি কল: {req.contactPhone}</span>
                    </a>

                    {/* WhatsApp Direct */}
                    <button
                      onClick={() => handleWhatsAppShare(req)}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs active:scale-95 transition-all"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>হোয়াটসঅ্যাপ</span>
                    </button>

                    {/* SMS */}
                    <a
                      href={getSmsLink(req)}
                      className="flex items-center gap-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>এসএমএস</span>
                    </a>

                    {/* Share / Copy Details */}
                    <button
                      onClick={() => handleCopyRequest(req)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-300 hover:bg-white dark:border-slate-600 dark:hover:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
                      title="তথ্য কপি ও শেয়ার করুন"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>কপি ও শেয়ার</span>
                    </button>
                  </div>

                  {/* Comment / Coordination Toggle */}
                  <button
                    onClick={() => setOpenComments(prev => ({ ...prev, [req.id]: !prev[req.id] }))}
                    className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>সহায়তা বার্তা ({comments.length})</span>
                  </button>
                </div>

                {/* Volunteer Coordination Comments Box */}
                {isCommentsOpen && (
                  <div className="p-4 bg-slate-100/70 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 space-y-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      💬 ডোনারদের সহায়তা ও যোগাযোগের বার্তা:
                    </span>

                    {comments.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">এখনও কোনো বার্তা দেওয়া হয়নি। আপনি যদি রক্ত দিতে সক্ষম হন, নিচে লিখুন।</p>
                    ) : (
                      <div className="space-y-2">
                        {comments.map(c => (
                          <div key={c.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px]">
                              <strong className="text-slate-900 dark:text-white font-bold">{c.name}</strong>
                              <span>{c.time}</span>
                            </div>
                            <p className="mt-1 text-slate-700 dark:text-slate-200">{c.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add comment input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={commentInputs[req.id] || ''}
                        onChange={e => setCommentInputs({ ...commentInputs, [req.id]: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && handleAddComment(req.id)}
                        placeholder="যেমন: আমি হাসপাতালে আসছি / রক্ত দিতে ইচ্ছুক..."
                        className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                      />
                      <button
                        onClick={() => handleAddComment(req.id)}
                        className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 text-xs font-bold flex items-center gap-1 shadow-xs"
                      >
                        <Send className="h-3 w-3" />
                        <span>পাঠান</span>
                      </button>
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
