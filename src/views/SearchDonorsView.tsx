import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup, Donor } from '../types';
import { BANGLADESH_DIVISIONS, ALL_DISTRICTS } from '../data/bangladeshLocations';
import { toBengaliNumber, isEligibleToDonate, getBadgeDetails } from '../utils/translations';
import {
  Search,
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  ShieldCheck,
  Flag,
  Award,
  Layers,
  Map as MapIcon,
  ChevronDown,
  RefreshCw,
  Copy,
  MessageSquare,
  MoreVertical,
} from 'lucide-react';

export const SearchDonorsView: React.FC = () => {
  const {
    donors,
    language,
    presetBloodGroup,
    setPresetBloodGroup,
    presetDistrict,
    setPresetDistrict,
    setReportModalDonor,
    setCertificateModalDonor,
    setPostRequestModalOpen,
    showToast,
    startChatWithDonor,
  } = useApp();

  // Filters
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);
  const [eligibleOnly, setEligibleOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'donations' | 'recent' | 'name'>('donations');
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');

  // Sync preset filters when routed from Home page quick search
  useEffect(() => {
    if (presetBloodGroup) {
      setSelectedBloodGroup(presetBloodGroup);
      setPresetBloodGroup('');
    }
    if (presetDistrict) {
      setSelectedDistrict(presetDistrict);
      setPresetDistrict('');
    }
  }, [presetBloodGroup, presetDistrict, setPresetBloodGroup, setPresetDistrict]);

  const bloodGroups: (BloodGroup | 'ALL')[] = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Upazilas based on selected district
  const upazilaOptions = useMemo(() => {
    if (!selectedDistrict) return [];
    for (const division of BANGLADESH_DIVISIONS) {
      const match = division.districts.find(d => d.name === selectedDistrict);
      if (match) return match.upazilas;
    }
    return [];
  }, [selectedDistrict]);

  // Filter & Sort Logic
  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      // Blood group
      if (selectedBloodGroup !== 'ALL' && donor.bloodGroup !== selectedBloodGroup) {
        return false;
      }
      // District
      if (selectedDistrict && donor.district !== selectedDistrict) {
        return false;
      }
      // Upazila
      if (selectedUpazila && donor.upazila !== selectedUpazila) {
        return false;
      }
      // Availability toggle
      if (onlyAvailable && !donor.isAvailable) {
        return false;
      }
      // 90-days Cooldown eligibility
      if (eligibleOnly) {
        const eligibility = isEligibleToDonate(donor.lastDonationDate);
        if (!eligibility.eligible) return false;
      }
      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = donor.name.toLowerCase().includes(q);
        const matchesPhone = donor.phone.includes(q);
        const matchesDistrict = donor.district.toLowerCase().includes(q);
        const matchesUpazila = donor.upazila.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesDistrict && !matchesUpazila) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'donations') return b.totalDonations - a.totalDonations;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'recent') {
        const dateA = a.lastDonationDate ? new Date(a.lastDonationDate).getTime() : 0;
        const dateB = b.lastDonationDate ? new Date(b.lastDonationDate).getTime() : 0;
        return dateB - dateA;
      }
      return 0;
    });
  }, [donors, selectedBloodGroup, selectedDistrict, selectedUpazila, onlyAvailable, eligibleOnly, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedBloodGroup('ALL');
    setSelectedDistrict('');
    setSelectedUpazila('');
    setOnlyAvailable(false);
    setEligibleOnly(false);
    setSearchQuery('');
  };

  const handleCopyPhone = (phone: string, donorName: string) => {
    navigator.clipboard?.writeText?.(phone);
    showToast(
      language === 'bn'
        ? `📋 ${donorName}-এর মোবাইল নম্বর (${phone}) কপি হয়েছে!`
        : `Phone number copied: ${phone}`,
      'success'
    );
  };

  const getWhatsAppLink = (donor: Donor) => {
    const text = `আসসালামু আলাইকুম ${donor.name} ভাই। রক্তবন্ধু প্ল্যাটফর্ম থেকে আপনার ${donor.bloodGroup} রক্তের তথ্য পেয়ে যোগাযোগ করছি। জরুরি প্রয়োজনে আপনার সাথে কি কথা বলা যাবে?`;
    return `https://api.whatsapp.com/send?phone=88${donor.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(text)}`;
  };

  const getSmsLink = (donor: Donor) => {
    const text = `আসসালামু আলাইকুম ${donor.name} ভাই। রক্তবন্ধুতে আপনার ${donor.bloodGroup} রক্তদাতা প্রোফাইল দেখে যোগাযোগ করছি।`;
    return `sms:${donor.phone}?body=${encodeURIComponent(text)}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>{language === 'bn' ? 'যাচাইকৃত রক্তদাতা তালিকা' : 'Verified Donors Directory'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {language === 'bn' ? 'কাছের রক্তদাতা খুঁজুন' : 'Find Blood Donors'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'bn'
              ? '৬৪ জেলার তালিকা থেকে প্রয়োজনীয় রক্তের গ্রুপের স্বেচ্ছাসেবক রক্তদাতাদের সাথে সরাসরি যোগাযোগ করুন।'
              : 'Directly search verified voluntary blood donors across all 64 districts.'}
          </p>
        </div>

        {/* View Mode Toggle: Cards / Map */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start md:self-auto text-xs">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
              viewMode === 'cards'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{language === 'bn' ? 'কার্ড ভিউ' : 'Cards'}</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
              viewMode === 'map'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" />
            <span>{language === 'bn' ? 'জেলা ম্যাপিং' : 'District Map'}</span>
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        {/* Blood Group Segmented Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            {language === 'bn' ? 'রক্তের গ্রুপ বাছাই করুন:' : 'Filter by Blood Group:'}
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {bloodGroups.map(bg => {
              const count = bg === 'ALL'
                ? donors.length
                : donors.filter(d => d.bloodGroup === bg).length;
              return (
                <button
                  key={bg}
                  onClick={() => setSelectedBloodGroup(bg)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedBloodGroup === bg
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <span>{bg === 'ALL' ? (language === 'bn' ? 'সকল গ্রুপ' : 'All') : bg}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedBloodGroup === bg ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {language === 'bn' ? toBengaliNumber(count) : count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Search Query */}
          <div className="lg:col-span-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={language === 'bn' ? 'ডোনারের নাম বা এলাকা খুঁজুন...' : 'Search by name or area...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs focus:border-rose-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* District Select */}
          <div className="lg:col-span-3">
            <select
              value={selectedDistrict}
              onChange={e => {
                setSelectedDistrict(e.target.value);
                setSelectedUpazila('');
              }}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="">{language === 'bn' ? 'সকল জেলা' : 'All Districts'}</option>
              {ALL_DISTRICTS.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Upazila Select */}
          <div className="lg:col-span-3">
            <select
              value={selectedUpazila}
              onChange={e => setSelectedUpazila(e.target.value)}
              disabled={!selectedDistrict || upazilaOptions.length === 0}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="">{language === 'bn' ? 'সকল উপজেলা/এলাকা' : 'All Areas'}</option>
              {upazilaOptions.map(u => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="donations">{language === 'bn' ? 'সর্বোচ্চ রক্তদান' : 'Most Active'}</option>
              <option value="recent">{language === 'bn' ? 'সম্প্রতি রক্তদান' : 'Recent'}</option>
              <option value="name">{language === 'bn' ? 'নাম অনুসারে' : 'By Name'}</option>
            </select>
          </div>
        </div>

        {/* Toggles row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* Ready to donate toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={e => setOnlyAvailable(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {language === 'bn' ? '🟢 শুধুমাত্র যারা এখন রক্ত দিতে প্রস্তুত' : 'Available Donors Only'}
              </span>
            </label>

            {/* Eligible toggle (90 days) */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={eligibleOnly}
                onChange={e => setEligibleOnly(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {language === 'bn' ? '⏳ শেষ ৩ মাসে রক্ত দেননি (উপযুক্ত)' : 'Eligible (3+ Months)'}
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 dark:text-slate-400">
              {language === 'bn'
                ? `পাওয়া গেছে: ${toBengaliNumber(filteredDonors.length)} জন রক্তদাতা`
                : `Found: ${filteredDonors.length} donors`}
            </span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold"
            >
              <RefreshCw className="h-3 w-3" />
              <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAP / RADIUS VIEW TAB */}
      {viewMode === 'map' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'bn' ? 'বাংলাদেশ রক্তদাতা জেলা ম্যাপিং' : 'District Donor Density Map'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'যেকোনো বিভাগে ক্লিক করে তাৎক্ষণিক ডোনার ফিল্টার করুন' : 'Click a district to filter instantly'}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
              {language === 'bn' ? '৬৪ জেলা সংযুক্ত' : '64 Districts Connected'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {BANGLADESH_DIVISIONS.map(div => {
              const divCount = donors.filter(d => d.division === div.division).length;
              return (
                <div
                  key={div.division}
                  onClick={() => {
                    setSelectedDistrict(div.districts[0].name);
                    setViewMode('cards');
                  }}
                  className="p-3 rounded-xl border border-slate-200 hover:border-rose-400 bg-slate-50 hover:bg-rose-50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 cursor-pointer transition-all text-center"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{div.division}</p>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">
                    {language === 'bn' ? toBengaliNumber(divCount) : divCount} জন ডোনার
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DONOR CARDS GRID */}
      {filteredDonors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 sm:p-12 text-center bg-white dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <Search className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {language === 'bn' ? 'এই ফিল্টারে কোনো রক্তদাতা পাওয়া যায়নি' : 'No Donors Found for Current Filters'}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
            {language === 'bn'
              ? 'অন্য কোনো জেলা বা রক্তের গ্রুপ নির্বাচন করে দেখুন, অথবা অবিলম্বে ১ মিনিটে একটি জরুরি রক্তের আবেদন পোস্ট করুন যেন রক্তদাতারা সরাসরি যোগাযোগ করতে পারে।'
              : 'Try clearing filters, selecting another district, or post an urgent blood request so voluntary donors can reach you directly.'}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setPostRequestModalOpen(true)}
              className="rounded-full bg-rose-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-700 shadow-md transition-all active:scale-95"
            >
              🚨 {language === 'bn' ? 'জরুরি রক্তের আবেদন পোস্ট করুন' : 'Post Urgent Request'}
            </button>
            <button
              onClick={handleResetFilters}
              className="rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              🔄 {language === 'bn' ? 'সব ফিল্টার রিসেট' : 'Reset All Filters'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDonors.map(donor => {
            const eligibility = isEligibleToDonate(donor.lastDonationDate);
            const badge = getBadgeDetails(donor.badge, language);

            return (
              <div
                key={donor.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md hover:border-rose-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-rose-900 transition-all"
              >
                <div>
                  {/* Card Top: Blood Crest + Name + Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Blood Group Icon Badge */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 text-white font-black text-lg shadow-md shadow-rose-600/20">
                        {donor.bloodGroup}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                            {donor.name}
                          </h3>
                          {donor.isVerified && (
                            <span title="ভেরিফাইড রক্তদাতা">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{donor.upazila}, {donor.district}</span>
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <Phone className="h-3 w-3 text-rose-600" />
                          <span className="tabular-nums">{donor.phone}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyPhone(donor.phone, donor.name)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-rose-600 transition-colors"
                            title={language === 'bn' ? 'নম্বর কপি করুন' : 'Copy phone number'}
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Report action button */}
                    <button
                      onClick={() => setReportModalDonor(donor)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                      title={language === 'bn' ? 'রিপোর্ট বা আপত্তি' : 'Report donor'}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Donor Badges & Stats */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className={`px-2 py-0.5 rounded-md font-semibold ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      মোট রক্তদান: <strong className="text-slate-800 dark:text-slate-200">{language === 'bn' ? toBengaliNumber(donor.totalDonations) : donor.totalDonations}</strong> বার
                    </span>
                  </div>

                  {/* Availability & Eligibility Notice */}
                  <div className="mt-3 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">
                        {language === 'bn' ? 'রক্তদানের স্ট্যাটাস:' : 'Status:'}
                      </span>
                      {donor.isAvailable ? (
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{language === 'bn' ? 'এখনই রক্ত দিতে প্রস্তুত' : 'Ready to Donate'}</span>
                        </span>
                      ) : (
                        <span className="font-medium text-amber-600 dark:text-amber-400">
                          {language === 'bn' ? 'বিশ্রামে আছেন' : 'Resting'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{language === 'bn' ? 'শেষ রক্তদান:' : 'Last Donation:'}</span>
                      <span>
                        {donor.lastDonationDate
                          ? (language === 'bn' ? `${toBengaliNumber(eligibility.daysPassed)} দিন আগে` : `${eligibility.daysPassed} days ago`)
                          : (language === 'bn' ? 'নতুন দাতা' : 'First time')}
                      </span>
                    </div>

                    {!eligibility.eligible && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 pt-0.5">
                        ⚠️ {language === 'bn' ? `পরবর্তী রক্তদানের উপযোগী হতে আরও ${toBengaliNumber(eligibility.daysRemaining)} দিন বাকি` : `${eligibility.daysRemaining} days remaining for cooldown`}
                      </p>
                    )}
                  </div>

                  {/* Bio */}
                  {donor.bio && (
                    <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 italic">
                      "{donor.bio}"
                    </p>
                  )}
                </div>

                {/* Card Actions: Call, WhatsApp, SMS, Certificate */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap">
                  <a
                    href={`tel:${donor.phone}`}
                    className="flex-1 min-w-[90px] flex items-center justify-center gap-1.5 rounded-full bg-rose-600 py-2.5 px-3 text-xs font-bold text-white hover:bg-rose-700 active:scale-95 transition-all shadow-xs"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>{language === 'bn' ? 'কল' : 'Call'}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => startChatWithDonor(donor)}
                    className="flex items-center justify-center gap-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 py-2.5 px-3.5 text-xs font-bold transition-all shadow-xs"
                    title={language === 'bn' ? 'সরাসরি প্রাইভেট চ্যাট শুরু করুন' : 'Start direct chat'}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{language === 'bn' ? 'চ্যাট' : 'Chat'}</span>
                  </button>

                  <a
                    href={getWhatsAppLink(donor)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 py-2.5 px-3 text-xs font-bold text-white transition-colors shadow-xs"
                    title="হোয়াটসঅ্যাপে যোগাযোগ করুন"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{language === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
                  </a>

                  <a
                    href={getSmsLink(donor)}
                    className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={language === 'bn' ? 'সরাসরি এসএমএস পাঠান' : 'Send SMS'}
                  >
                    <MessageSquare className="h-4 w-4 text-emerald-600" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopyPhone(donor.phone, donor.name)}
                    className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={language === 'bn' ? 'মোবাইল নম্বর কপি করুন' : 'Copy phone number'}
                  >
                    <Copy className="h-4 w-4 text-rose-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCertificateModalDonor(donor)}
                    className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={language === 'bn' ? 'সম্মাননা সনদপত্র দেখুন' : 'View Certificate'}
                  >
                    <Award className="h-4 w-4 text-amber-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
