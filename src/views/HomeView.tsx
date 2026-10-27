import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup } from '../types';
import { ALL_DISTRICTS } from '../data/bangladeshLocations';
import { BLOOD_COMPATIBILITY } from '../data/mockData';
import { toBengaliNumber } from '../utils/translations';
import heroBloodDonationImg from '../assets/images/hero_blood_donation_1790381887300.jpg';
import communityBloodDriveImg from '../assets/images/community_blood_drive_1790381900041.jpg';
import {
  Search,
  Droplet,
  Heart,
  Users,
  AlertCircle,
  Phone,
  Share2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Hospital,
  Sparkles,
  Award,
} from 'lucide-react';
import {
  FbSearch,
  FbLike,
  FbComment,
  FbShare,
  FbVerified,
  FbDots,
  FbPublic,
  FbReactionLike,
  FbReactionLove,
  FbReactionCare,
  FbLogo,
} from '../components/FacebookIcons';

export const HomeView: React.FC = () => {
  const {
    donors,
    requests,
    language,
    setActiveTab,
    setAuthModalOpen,
    setAuthModalTab,
    setPostRequestModalOpen,
    navigateToSearchWithFilters,
  } = useApp();

  // Hero Quick Search inputs
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | ''>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  // Interactive Blood Compatibility Matrix state
  const [activeMatrixGroup, setActiveMatrixGroup] = useState<BloodGroup>('O+');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToSearchWithFilters(selectedGroup, selectedDistrict);
  };

  // Stats calculation
  const totalDonors = donors.length + 1240;
  const activeRequests = requests.filter(r => r.status === 'open').length;
  const successfulMatches = 840 + donors.reduce((acc, d) => acc + d.totalDonations, 0);
  const todayDonations = 28;

  // Active critical requests
  const urgentRequests = requests.filter(r => r.status === 'open').slice(0, 3);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleWhatsAppShare = (req: any) => {
    const text = `জরুরি রক্তের প্রয়োজন!\nরোগী: ${req.patientName}\nগ্রুপ: ${req.bloodGroup} (${req.bagsNeeded} ব্যাগ)\nহাসপাতাল: ${req.hospitalName}, ${req.district}\nযোগাযোগ: ${req.contactPhone}\nবিস্তারিত: রক্তবন্ধু প্ল্যাটফর্ম`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-white to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 pt-8 pb-12 sm:pt-14 sm:pb-18 border-b border-neutral-200/60 dark:border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Headline & Quick Search Bar */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/90 px-3 py-1 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
                <span className="flex h-2 w-2 rounded-full bg-rose-600 animate-ping" />
                <span>
                  {language === 'bn' ? 'স্বেচ্ছায় রক্তদান • মানবসেবার মহৎ ব্রত' : 'Voluntary Blood Network of Bangladesh'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
                {language === 'bn' ? (
                  <>
                    জীবন বাঁচান, <span className="text-rose-600 dark:text-rose-500">রক্ত দিন</span>।
                    <br />
                    কাছের রক্তদাতা খুঁজুন নিমেষেই।
                  </>
                ) : (
                  <>
                    Save Lives, <span className="text-rose-600 dark:text-rose-500">Donate Blood</span>.
                    <br />
                    Connect with Donors Nearby.
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed">
                {language === 'bn'
                  ? 'রক্তবন্ধু বাংলাদেশের একটি উন্মুক্ত ও নিরপেক্ষ সামাজিক প্ল্যাটফর্ম। জরুরি সময়ে রক্তের জন্য আর দিশেহারা হতে হবে না; সরাসরি কথা বলুন পরীক্ষিত রক্তদাতাদের সাথে।'
                  : 'RoktoBondhu is an open humanitarian platform uniting voluntary blood donors across all 64 districts of Bangladesh for rapid medical response.'}
              </p>

              {/* QUICK BLOOD SEARCH BOX */}
              <div className="rounded-2xl border border-rose-100 bg-white p-4 sm:p-5 shadow-xl shadow-rose-950/5 dark:border-neutral-800 dark:bg-neutral-900/90">
                <form onSubmit={handleHeroSearch} className="space-y-3">
                  <div className="flex items-center gap-2 pb-1 text-xs font-bold text-neutral-900 dark:text-white">
                    <FbSearch className="h-4 w-4 text-[#1877F2]" />
                    <span>{language === 'bn' ? 'ফেসবুক স্টাইল দ্রুত রক্তদাতা সার্চ' : 'Quick Blood Donor Search'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Blood Group Select */}
                    <div className="sm:col-span-5">
                      <label className="block text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                        {language === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}
                      </label>
                      <select
                        value={selectedGroup}
                        onChange={e => setSelectedGroup(e.target.value as BloodGroup)}
                        className="w-full rounded-xl border border-neutral-300 bg-neutral-50/50 px-3 py-2.5 text-sm font-bold text-neutral-800 focus:border-[#1877F2] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                      >
                        <option value="">{language === 'bn' ? 'সব গ্রুপ' : 'All Groups'}</option>
                        {bloodGroups.map(bg => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* District Select */}
                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                        {language === 'bn' ? 'জেলা' : 'District'}
                      </label>
                      <select
                        value={selectedDistrict}
                        onChange={e => setSelectedDistrict(e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 bg-neutral-50/50 px-3 py-2.5 text-sm text-neutral-800 focus:border-[#1877F2] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                      >
                        <option value="">{language === 'bn' ? 'সমগ্র বাংলাদেশ' : 'All Districts'}</option>
                        {ALL_DISTRICTS.map(d => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Search Button */}
                    <div className="sm:col-span-3 flex items-end">
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-1.5 rounded-full bg-[#1877F2] hover:bg-[#166fe5] py-2.5 px-4 text-sm font-bold text-white shadow-md active:scale-95 transition-all"
                      >
                        <FbSearch className="h-4 w-4" />
                        <span>{language === 'bn' ? 'সার্চ করুন' : 'Search'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    setAuthModalTab('register');
                    setAuthModalOpen(true);
                  }}
                  className="rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-5 py-3 text-xs sm:text-sm font-bold shadow hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center gap-2"
                >
                  <Droplet className="h-4 w-4 fill-current text-rose-500" />
                  <span>{language === 'bn' ? 'রক্তদাতা হিসেবে যুক্ত হোন' : 'Join as Blood Donor'}</span>
                </button>
                <button
                  onClick={() => setPostRequestModalOpen(true)}
                  className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-neutral-900 text-rose-600 dark:text-rose-400 px-5 py-3 text-xs sm:text-sm font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{language === 'bn' ? 'জরুরি রক্তের অনুরোধ করুন' : 'Post Urgent Request'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual Image Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 aspect-[16/10] bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={heroBloodDonationImg}
                  alt="Blood Donation Camp Bangladesh"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5">
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                    <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                    <span>{language === 'bn' ? 'প্রতি ২ সেকেন্ডে ১ জন রোগীর রক্তের প্রয়োজন' : 'Every 2 seconds someone needs blood'}</span>
                  </div>
                  <p className="text-white text-sm font-medium mt-1">
                    {language === 'bn' ? 'আপনার ১ ব্যাগ রক্ত বাঁচাতে পারে ৩টি অমূল্য জীবন' : 'Your 1 bag of blood can save up to 3 precious lives'}
                  </p>
                </div>
              </div>

              {/* Floating Facebook verified badge */}
              <div className="absolute -bottom-4 -left-3 rounded-2xl bg-white dark:bg-neutral-900 p-3 shadow-xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#1877F2]">
                  <FbVerified size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1">
                    <span>{language === 'bn' ? '১০০% ভেরিফাইড ডোনার' : '100% Verified Community'}</span>
                    <FbVerified className="w-3.5 h-3.5 inline text-[#1877F2]" />
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    {language === 'bn' ? 'ফেসবুক ও মোবাইল ওটিপি যাচাইকৃত' : 'OTP & profile verified real donors'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME STATISTICS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-100 dark:divide-neutral-800">
            <div className="pt-2 md:pt-0">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {language === 'bn' ? 'নিবন্ধিত রক্তদাতা' : 'Registered Donors'}
              </span>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tabular-nums">
                {language === 'bn' ? toBengaliNumber(totalDonors) : totalDonors}+
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {language === 'bn' ? '৬৪ জেলায় সক্রিয়' : 'Active nationwide'}
              </span>
            </div>

            <div className="pt-4 md:pt-0 md:pl-6">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {language === 'bn' ? 'আজকের রক্তদান' : "Today's Donations"}
              </span>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-500 tabular-nums">
                {language === 'bn' ? toBengaliNumber(todayDonations) : todayDonations} ব্যাগ
              </p>
              <span className="text-[11px] text-neutral-500">
                {language === 'bn' ? 'হাসপাতালে সম্পন্ন' : 'Across clinics'}
              </span>
            </div>

            <div className="pt-4 md:pt-0 md:pl-6">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {language === 'bn' ? 'সফল ম্যাচ ও জীবন রক্ষা' : 'Lives Impacted'}
              </span>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tabular-nums">
                {language === 'bn' ? toBengaliNumber(successfulMatches) : successfulMatches}+
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {language === 'bn' ? 'সরাসরি ডোনেশন' : 'Direct connections'}
              </span>
            </div>

            <div className="pt-4 md:pt-0 md:pl-6">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {language === 'bn' ? 'চলমান জরুরি অনুরোধ' : 'Active Urgent Calls'}
              </span>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-500 tabular-nums">
                {language === 'bn' ? toBengaliNumber(activeRequests) : activeRequests} টি
              </p>
              <span className="text-[11px] text-rose-600 font-semibold animate-pulse">
                {language === 'bn' ? 'জরুরি ডোনার দরকার' : 'Urgent donor needed'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RECENT URGENT REQUESTS FEED */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
              <span>{language === 'bn' ? 'জরুরি রক্তের চাহিদা' : 'Emergency Blood Feed'}</span>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              {language === 'bn' ? 'এখনই রক্তের প্রয়োজন এমন রোগীবৃন্দ' : 'Patients Requiring Blood Right Now'}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('requests')}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{language === 'bn' ? 'সব অনুরোধ দেখুন (' + toBengaliNumber(requests.length) + 'টি)' : 'View all requests'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {urgentRequests.map(req => {
            const isCritical = req.urgency === 'critical_today';
            return (
              <div
                key={req.id}
                className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all overflow-hidden"
              >
                {/* Facebook Post Header */}
                <div className="p-4 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-[#1877F2] text-white font-black text-xs shadow-2xs">
                      {req.bloodGroup}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                          {req.postedByName}
                        </h4>
                        <FbVerified className="w-3 h-3 text-[#1877F2]" />
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400 mt-0.5">
                        <span>{req.hospitalName}</span>
                        <span>•</span>
                        <FbPublic className="w-2.5 h-2.5 text-neutral-400 inline" />
                      </div>
                    </div>
                  </div>
                  <FbDots size={16} className="text-neutral-400" />
                </div>

                {/* Blood Details Box */}
                <div className="px-4 py-2 space-y-2">
                  <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 p-3 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                        {isCritical ? '🚨 আজই জরুরি' : '⏱️ জরুরি রক্তদান'}
                      </span>
                      <h4 className="text-sm font-black text-neutral-900 dark:text-white">
                        {req.patientName}
                      </h4>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white font-black text-sm shadow-xs">
                      {req.bloodGroup}
                    </div>
                  </div>

                  <p className="line-clamp-2 text-neutral-600 dark:text-neutral-300 text-xs italic">
                    "{req.reason}"
                  </p>

                  <div className="text-[11px] text-neutral-500 flex items-center justify-between">
                    <span>প্রয়োজন: <strong className="text-rose-600">{toBengaliNumber(req.bagsNeeded)} ব্যাগ</strong></span>
                    <span>{req.district}</span>
                  </div>
                </div>

                {/* Facebook Reactions Counter */}
                <div className="px-4 py-1.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      <FbReactionLike size={16} className="z-20" />
                      <FbReactionLove size={16} className="-ml-1 z-10" />
                      <FbReactionCare size={16} className="-ml-1" />
                    </div>
                    <span className="text-xs font-semibold ml-0.5">{toBengaliNumber(req.bagsNeeded * 18 + 12)}</span>
                  </div>
                  <span>{toBengaliNumber(req.bagsNeeded * 3 + 2)} টি শেয়ার</span>
                </div>

                {/* Facebook 3-Button Action Row */}
                <div className="px-2 py-1 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-3 gap-1 text-[11px] text-neutral-600 dark:text-neutral-300">
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold"
                  >
                    <FbLike size={15} />
                    <span>লাইক</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold"
                  >
                    <FbComment size={15} />
                    <span>মন্তব্য</span>
                  </button>
                  <button
                    onClick={() => handleWhatsAppShare(req)}
                    className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold"
                  >
                    <FbShare size={15} />
                    <span>শেয়ার</span>
                  </button>
                </div>

                {/* Call CTA */}
                <div className="p-3 pt-2 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                  <a
                    href={`tel:${req.contactPhone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-rose-600 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-2xs"
                  >
                    <Phone className="h-3 w-3" />
                    <span>কল: {req.contactPhone}</span>
                  </a>
                  <button
                    onClick={() => handleWhatsAppShare(req)}
                    className="flex items-center justify-center rounded-full bg-emerald-600 text-white px-2.5 py-1.5 text-xs font-bold hover:bg-emerald-700 transition-colors"
                    title="WhatsApp"
                  >
                    🟢
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. INTERACTIVE BLOOD COMPATIBILITY MATRIX */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              {language === 'bn' ? 'রক্তের তথ্য ও সচেতনতা' : 'Blood Science & Compatibility'}
            </span>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              {language === 'bn' ? 'কে কাকে রক্ত দিতে পারে? (রক্তের গ্রুপ ম্যাট্রিক্স)' : 'Who Can Donate to Whom?'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              {language === 'bn'
                ? 'নিচের যেকোনো রক্তের গ্রুপে ক্লিক করে জেনে নিন দাতা ও গ্রহীতার উপযুক্ততা।'
                : 'Click any blood group below to inspect who they can safely donate to or receive from.'}
            </p>
          </div>

          {/* Group Buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-6">
            {bloodGroups.map(bg => (
              <button
                key={bg}
                onClick={() => setActiveMatrixGroup(bg)}
                className={`py-2.5 px-3 rounded-xl font-bold text-sm transition-all ${
                  activeMatrixGroup === bg
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-600'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>

          {/* Matrix Details Box */}
          <div className="mt-6 rounded-xl border border-rose-100 bg-rose-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-800/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-200/60 dark:border-neutral-700 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-600 text-white text-base font-extrabold">
                  {activeMatrixGroup}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {language === 'bn' ? `রক্তের গ্রুপ: ${activeMatrixGroup}` : `Blood Group: ${activeMatrixGroup}`}
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300">
                    {BLOOD_COMPATIBILITY[activeMatrixGroup].descriptionBn}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {/* Can give to */}
              <div className="rounded-lg bg-white p-3.5 border border-neutral-200/80 dark:border-neutral-700 dark:bg-neutral-900">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 block mb-2">
                  ✅ {language === 'bn' ? `${activeMatrixGroup} রক্ত দিতে পারবেন:` : 'Can safely donate to:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {BLOOD_COMPATIBILITY[activeMatrixGroup].canGiveTo.map(g => (
                    <span
                      key={g}
                      className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 font-bold text-xs border border-emerald-200 dark:border-emerald-800"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Can receive from */}
              <div className="rounded-lg bg-white p-3.5 border border-neutral-200/80 dark:border-neutral-700 dark:bg-neutral-900">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 block mb-2">
                  🩸 {language === 'bn' ? `${activeMatrixGroup} রক্ত নিতে পারবেন:` : 'Can safely receive from:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {BLOOD_COMPATIBILITY[activeMatrixGroup].canReceiveFrom.map(g => (
                    <span
                      key={g}
                      className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200 font-bold text-xs border border-blue-200 dark:border-blue-800"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMMUNITY SPOTLIGHT & DONATION CRITERIA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-md">
            <img
              src={communityBloodDriveImg}
              alt="Community Volunteers Bangladesh"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              {language === 'bn' ? 'স্বেচ্ছায় রক্তদানের শর্তাবলি' : 'Donor Eligibility Criteria'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              {language === 'bn' ? 'রক্তদান কে করতে পারেন?' : 'Who is eligible to donate blood?'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {language === 'bn'
                ? 'একজন সুস্থ মানুষের শরীর থেকে ১ ব্যাগ (৪৫০ মিলি) রক্ত নিলে কোনো ধরনের ক্ষতি হয় না। বরং নতুন রক্তকণিকা তৈরি হয় এবং হৃদরোগের ঝুঁকি কমে।'
                : 'Giving one pint of blood is completely safe for a healthy adult and stimulates bone marrow to produce fresh red cells.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                    {language === 'bn' ? 'বয়স ১৮ থেকে ৬৫ বছর' : 'Age: 18 - 65 Years'}
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    {language === 'bn' ? 'শারীরিকভাবে কর্মক্ষম ও সুস্থ ব্যক্তি' : 'Healthy and active adults'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                    {language === 'bn' ? 'ওজন কমপক্ষে ৫০ কেজি' : 'Weight: At least 50 KG'}
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    {language === 'bn' ? 'মহিলাদের ক্ষেত্রে কমপক্ষে ৪৫ কেজি' : 'Minimum 45kg for females'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                    {language === 'bn' ? 'শেষ ৩ মাসে রক্ত দেননি' : '90 Days Interval'}
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    {language === 'bn' ? '৩ মাস পর পর রক্তদান সম্পূর্ণ নিরাপদ' : '3 months recovery between donations'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                    {language === 'bn' ? 'হিমোগ্লোবিন ও রক্তচাপ স্বাভাবিক' : 'Normal Hemoglobin & BP'}
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    {language === 'bn' ? 'হিমোগ্লোবিন ১২.৫ গ্রাম/ডিএল বা তদূর্ধ্ব' : 'Hemoglobin >= 12.5 g/dL'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setAuthModalTab('register');
                  setAuthModalOpen(true);
                }}
                className="rounded-lg bg-rose-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-sm"
              >
                {language === 'bn' ? 'আমি রক্ত দিতে প্রস্তুত • নিবন্ধন করুন' : 'Register to Save Lives'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
