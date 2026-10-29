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
  ShieldCheck,
  Building2,
  Calendar,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { EligibilityQuizCard } from '../components/EligibilityQuizCard';

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
    showToast,
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
    const text = `🚨 জরুরি রক্তের প্রয়োজন!\nরোগী: ${req.patientName}\nগ্রুপ: ${req.bloodGroup} (${toBengaliNumber(req.bagsNeeded)} ব্যাগ)\nহাসপাতাল: ${req.hospitalName}, ${req.district}\nযোগাযোগ: ${req.contactPhone}\nবিস্তারিত: রক্তবন্ধু প্ল্যাটফর্ম`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyRequest = (req: any) => {
    const text = `🚨 জরুরি রক্তের প্রয়োজন!\nরোগী: ${req.patientName}\nগ্রুপ: ${req.bloodGroup} (${toBengaliNumber(req.bagsNeeded)} ব্যাগ)\nহাসপাতাল: ${req.hospitalName}, ${req.district}\nযোগাযোগ: ${req.contactPhone}\nরক্তবন্ধু - স্বেচ্ছায় রক্তদান নেটওয়ার্ক`;
    navigator.clipboard.writeText(text);
    showToast(language === 'bn' ? 'জরুরি রক্তের তথ্য কপি হয়েছে!' : 'Request details copied to clipboard!');
  };

  return (
    <div className="space-y-10 sm:space-y-14 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/60 via-white to-white dark:from-slate-900/60 dark:via-slate-900 dark:to-slate-950 pt-6 pb-12 sm:pt-10 sm:pb-16 border-b border-slate-200/60 dark:border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Headline & Quick Search Bar */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
                <span className="flex h-2 w-2 rounded-full bg-rose-600 animate-ping" />
                <span>
                  {language === 'bn' ? 'স্বেচ্ছায় রক্তদান • মানবসেবার মহৎ ব্রত' : 'Voluntary Blood Network of Bangladesh'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
                {language === 'bn' ? (
                  <>
                    জীবন বাঁচাতে <span className="text-rose-600 dark:text-rose-500">রক্ত দিন</span>।
                    <br />
                    কাছের রক্তদাতা খুঁজুন সহজে।
                  </>
                ) : (
                  <>
                    Save Lives, <span className="text-rose-600 dark:text-rose-500">Donate Blood</span>.
                    <br />
                    Connect with Donors Nearby.
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                {language === 'bn'
                  ? 'রক্তবন্ধু বাংলাদেশের একটি উন্মুক্ত ও মানবিক সামাজিক প্ল্যাটফর্ম। জরুরি রক্তের প্রয়োজনে সরাসরি কথা বলুন ৬৪ জেলার নিবন্ধিত রক্তদাতাদের সাথে।'
                  : 'RoktoBondhu is an open humanitarian platform uniting voluntary blood donors across all 64 districts of Bangladesh for rapid medical response.'}
              </p>

              {/* QUICK BLOOD SEARCH BOX */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xl shadow-rose-900/5 dark:border-slate-800 dark:bg-slate-900">
                <form onSubmit={handleHeroSearch} className="space-y-3.5">
                  <div className="flex items-center gap-2 pb-1 text-xs font-bold text-slate-900 dark:text-white">
                    <Search className="h-4 w-4 text-rose-600" />
                    <span>{language === 'bn' ? 'দ্রুত রক্তদাতা খুঁজুন' : 'Quick Blood Donor Search'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Blood Group Select */}
                    <div className="sm:col-span-5">
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        {language === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}
                      </label>
                      <select
                        value={selectedGroup}
                        onChange={e => setSelectedGroup(e.target.value as BloodGroup)}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        {language === 'bn' ? 'জেলা' : 'District'}
                      </label>
                      <select
                        value={selectedDistrict}
                        onChange={e => setSelectedDistrict(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 py-2.5 px-4 text-sm font-bold text-white shadow-md shadow-rose-600/20 active:scale-95 transition-all"
                      >
                        <Search className="h-4 w-4" />
                        <span>{language === 'bn' ? 'সার্চ' : 'Search'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 1-Tap Quick Blood Group Selector Buttons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        {language === 'bn' ? '⚡ দ্রুত এক ক্লিকে গ্রুপ বেছে নিন:' : '⚡ 1-Tap Blood Group Search:'}
                      </span>
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                        {language === 'bn' ? 'তাৎক্ষণিক রক্তদাতা' : 'Instant Donors'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                      {bloodGroups.map(bg => (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => navigateToSearchWithFilters(bg, selectedDistrict)}
                          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white dark:bg-slate-800 dark:hover:bg-rose-600 text-slate-800 dark:text-slate-200 transition-all font-black text-xs shadow-2xs group"
                          title={`${bg} রক্তদাতা খুঁজুন`}
                        >
                          <span className="group-hover:scale-110 transition-transform">{bg}</span>
                        </button>
                      ))}
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
                  className="rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 text-xs sm:text-sm font-bold shadow-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center gap-2"
                >
                  <Droplet className="h-4 w-4 fill-current text-rose-500" />
                  <span>{language === 'bn' ? 'রক্তদাতা হিসেবে যুক্ত হোন' : 'Join as Blood Donor'}</span>
                </button>
                <button
                  onClick={() => setPostRequestModalOpen(true)}
                  className="rounded-full border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 px-5 py-3 text-xs sm:text-sm font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-2 shadow-xs"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{language === 'bn' ? 'জরুরি রক্তের অনুরোধ করুন' : 'Post Urgent Request'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual Image Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-[16/10] bg-slate-100 dark:bg-slate-800">
                <img
                  src={heroBloodDonationImg}
                  alt="Blood Donation Bangladesh"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-5">
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                    <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                    <span>{language === 'bn' ? 'প্রতি ২ সেকেন্ডে ১ জন রোগীর রক্তের প্রয়োজন' : 'Every 2 seconds someone needs blood'}</span>
                  </div>
                  <p className="text-white text-sm font-medium mt-1">
                    {language === 'bn' ? 'আপনার ১ ব্যাগ রক্ত বাঁচাতে পারে ৩টি অমূল্য জীবন' : 'Your 1 bag of blood can save up to 3 precious lives'}
                  </p>
                </div>
              </div>

              {/* Verified Community Badge */}
              <div className="absolute -bottom-4 -left-3 rounded-2xl bg-white dark:bg-slate-900 p-3 shadow-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <span>{language === 'bn' ? '১০০% ভেরিফাইড রক্তদাতা' : '100% Verified Community'}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {language === 'bn' ? 'যাচাইকৃত ফোন নম্বর ও প্রকৃত ডোনার' : 'Verified phone & active voluntary donors'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME STATISTICS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
            <div className="pt-2 md:pt-0">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'নিবন্ধিত রক্তদাতা' : 'Registered Donors'}
              </span>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {language === 'bn' ? toBengaliNumber(totalDonors) : totalDonors}+
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {language === 'bn' ? '৬৪ জেলায় সক্রিয়' : 'Active nationwide'}
              </span>
            </div>

            <div className="pt-4 md:pt-0 md:pl-6">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'আজকের রক্তদান' : "Today's Donations"}
              </span>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-500 tabular-nums">
                {language === 'bn' ? toBengaliNumber(todayDonations) : todayDonations} ব্যাগ
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'হাসপাতালে সম্পন্ন' : 'Across clinics'}
              </span>
            </div>

            <div className="pt-4 md:pt-0 md:pl-6">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'সফল ম্যাচ ও জীবন রক্ষা' : 'Lives Impacted'}
              </span>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {language === 'bn' ? toBengaliNumber(successfulMatches) : successfulMatches}+
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {language === 'bn' ? 'সরাসরি ডোনেশন' : 'Direct connections'}
              </span>
            </div>

            <div className="pt-4 md:pt-0 md:pl-6">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
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

      {/* 2.5 THREE SIMPLE STEPS FOR USERS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              {language === 'bn' ? 'সহজ ব্যবহারবিধি' : 'Simple 3-Step Guide'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {language === 'bn' ? 'কীভাবে সহজে রক্ত পাবেন বা দেবেন?' : 'How It Works in 3 Simple Steps'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white font-black text-base shadow-xs">
                ১
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'গ্রুপ ও জেলা নির্বাচন করুন' : '1. Choose Group & District'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {language === 'bn'
                    ? 'আপনার প্রয়োজনীয় রক্তের গ্রুপ ও জেলা সিলেক্ট করে সরাসরি সক্রিয় ডোনার খুঁজুন।'
                    : 'Select required blood group and district to filter active donors.'}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white font-black text-base shadow-xs">
                ২
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'সরাসরি কল বা হোয়াটসঅ্যাপ করুন' : '2. Direct Call or WhatsApp'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {language === 'bn'
                    ? 'কোনো মাধ্যম ছাড়া সরাসরি রক্তদাতার নম্বরে কল দিন বা হোয়াটসঅ্যাপে বার্তা পাঠান।'
                    : 'Instantly connect with eligible donors via direct phone call or chat.'}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-base shadow-xs">
                ৩
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'জরুরি রক্তের আবেদন পোস্ট করুন' : '3. Post Emergency Request'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {language === 'bn'
                    ? 'ডোনার না পেলে দ্রুত ফ্রি আবেদন পোস্ট করুন, রক্তদাতারা আপনাকে যোগাযোগ করবে।'
                    : 'If immediate donors are busy, post an emergency request for alerts.'}
                </p>
              </div>
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
              <span>{language === 'bn' ? 'জরুরি রক্তের চাহিদা' : 'Emergency Blood Requests'}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
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
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all overflow-hidden hover:shadow-md"
              >
                {/* Header with Blood Group & Status */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white font-black text-base shadow-sm">
                      {req.bloodGroup}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isCritical
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {isCritical ? (language === 'bn' ? '🚨 আজই জরুরি' : 'Critical') : (language === 'bn' ? '⏱️ জরুরি' : 'Urgent')}
                        </span>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {toBengaliNumber(req.bagsNeeded)} ব্যাগ রক্ত
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {req.patientName}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="font-medium truncate">{req.hospitalName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{req.upazila ? `${req.upazila}, ` : ''}{req.district}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{language === 'bn' ? `প্রয়োজন: ${isCritical ? 'আজই জরুরি' : '২৪ ঘণ্টার মধ্যে'}` : `Needed: ${isCritical ? 'Critical Today' : 'Within 24h'}`}</span>
                  </div>
                  {req.reason && (
                    <p className="mt-1 text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-[11px]">
                      "{req.reason}"
                    </p>
                  )}
                </div>

                {/* Direct Action Buttons: Call, WhatsApp, Share */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <a
                    href={`tel:${req.contactPhone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 py-2 text-xs font-bold text-white transition-colors shadow-xs"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>{language === 'bn' ? 'সরাসরি কল' : 'Call'}</span>
                  </a>
                  <button
                    onClick={() => handleWhatsAppShare(req)}
                    className="flex items-center justify-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-xs font-bold transition-colors"
                    title="WhatsApp"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleCopyRequest(req)}
                    className="flex items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 p-2 text-xs transition-colors"
                    title={language === 'bn' ? 'কপি ও শেয়ার করুন' : 'Share'}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. INTERACTIVE BLOOD COMPATIBILITY MATRIX */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              {language === 'bn' ? 'রক্তের তথ্য ও সচেতনতা' : 'Blood Science & Compatibility'}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {language === 'bn' ? 'কে কাকে রক্ত দিতে পারে? (রক্তের গ্রুপ ম্যাট্রিক্স)' : 'Who Can Donate to Whom?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
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
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>

          {/* Matrix Details Box */}
          <div className="mt-6 rounded-xl border border-rose-100 bg-rose-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-200/60 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white text-base font-extrabold">
                  {activeMatrixGroup}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'bn' ? `রক্তের গ্রুপ: ${activeMatrixGroup}` : `Blood Group: ${activeMatrixGroup}`}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {BLOOD_COMPATIBILITY[activeMatrixGroup].descriptionBn}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {/* Can give to */}
              <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 dark:border-slate-700 dark:bg-slate-900">
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
              <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 dark:border-slate-700 dark:bg-slate-900">
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 block mb-2">
                  🩸 {language === 'bn' ? `${activeMatrixGroup} রক্ত নিতে পারবেন:` : 'Can safely receive from:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {BLOOD_COMPATIBILITY[activeMatrixGroup].canReceiveFrom.map(g => (
                    <span
                      key={g}
                      className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200 font-bold text-xs border border-rose-200 dark:border-rose-800"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Action for this group */}
            <div className="mt-4 pt-3 border-t border-rose-200/60 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-rose-600 dark:text-rose-400">💡 তথ্য: </span>
                {activeMatrixGroup === 'O-'
                  ? (language === 'bn' ? 'O- (ও নেগেটিভ) হলো সর্বজনীন দাতা, যে কাউকে দেওয়া যায়।' : 'O- is the Universal Donor.')
                  : activeMatrixGroup === 'AB+'
                  ? (language === 'bn' ? 'AB+ (এবি পজিটিভ) হলো সর্বজনীন গ্রহীতা, সবার রক্ত নিতে পারে।' : 'AB+ is the Universal Recipient.')
                  : (language === 'bn' ? `জরুরি সময়ে ${activeMatrixGroup} রক্তের রোগীদের জন্য যেকোনো সামঞ্জস্যপূর্ণ গ্রুপের রক্তদাতা নেওয়া সম্ভব।` : `In emergencies, compatible groups can also be utilized.`)}
              </div>
              <button
                type="button"
                onClick={() => navigateToSearchWithFilters(activeMatrixGroup, '')}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-xs font-bold shadow-xs active:scale-95 transition-all self-start sm:self-auto shrink-0"
              >
                <Search className="h-3.5 w-3.5" />
                <span>
                  {language === 'bn'
                    ? `${activeMatrixGroup} রক্তদাতাদের সরাসরি খুঁজুন`
                    : `Search ${activeMatrixGroup} Donors Now`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4.5 INTERACTIVE 2-MINUTE ELIGIBILITY QUIZ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <EligibilityQuizCard />
      </section>

      {/* 5. COMMUNITY SPOTLIGHT & DONATION CRITERIA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {language === 'bn' ? 'রক্তদান কে করতে পারেন?' : 'Who is eligible to donate blood?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'bn'
                ? 'একজন সুস্থ মানুষের শরীর থেকে ১ ব্যাগ (৪৫০ মিলি) রক্ত নিলে কোনো ধরনের ক্ষতি হয় না। বরং নতুন রক্তকণিকা তৈরি হয় এবং হৃদরোগের ঝুঁকি কমে।'
                : 'Giving one pint of blood is completely safe for a healthy adult and stimulates bone marrow to produce fresh red cells.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {language === 'bn' ? 'বয়স ১৮ থেকে ৬৫ বছর' : 'Age: 18 - 65 Years'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'bn' ? 'শারীরিকভাবে কর্মক্ষম ও সুস্থ ব্যক্তি' : 'Healthy and active adults'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {language === 'bn' ? 'ওজন কমপক্ষে ৫০ কেজি' : 'Weight: At least 50 KG'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'bn' ? 'মহিলাদের ক্ষেত্রে কমপক্ষে ৪৫ কেজি' : 'Minimum 45kg for females'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {language === 'bn' ? 'শেষ ৩ মাসে রক্ত দেননি' : '90 Days Interval'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'bn' ? '৩ মাস পর পর রক্তদান সম্পূর্ণ নিরাপদ' : '3 months recovery between donations'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {language === 'bn' ? 'হিমোগ্লোবিন ও রক্তচাপ স্বাভাবিক' : 'Normal Hemoglobin & BP'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
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
                className="rounded-full bg-rose-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-sm"
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
