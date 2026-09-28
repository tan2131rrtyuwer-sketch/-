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
  CheckCircle,
  Clock,
  Filter,
  ShieldCheck,
  Flag,
  Award,
  Layers,
  Map as MapIcon,
  ChevronDown,
  RefreshCw,
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

  // Dynamic Upazila list based on selected district
  const upazilaOptions = useMemo(() => {
    if (!selectedDistrict) return [];
    for (const div of BANGLADESH_DIVISIONS) {
      const match = div.districts.find(d => d.name === selectedDistrict);
      if (match) return match.upazilas;
    }
    return [];
  }, [selectedDistrict]);

  // Filtered donors
  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      // Exclude blocked donors
      if (donor.isBlocked) return false;

      // Blood group filter
      if (selectedBloodGroup !== 'ALL' && donor.bloodGroup !== selectedBloodGroup) {
        return false;
      }

      // District filter
      if (selectedDistrict && donor.district !== selectedDistrict) {
        return false;
      }

      // Upazila filter
      if (selectedUpazila && donor.upazila !== selectedUpazila) {
        return false;
      }

      // Only Available
      if (onlyAvailable && !donor.isAvailable) {
        return false;
      }

      // Eligible (last 3 months)
      if (eligibleOnly) {
        const { eligible } = isEligibleToDonate(donor.lastDonationDate);
        if (!eligible) return false;
      }

      // Text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = donor.name.toLowerCase().includes(q);
        const matchesArea = donor.address.toLowerCase().includes(q) || donor.upazila.toLowerCase().includes(q);
        const matchesBio = donor.bio?.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesArea && !matchesBio) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'donations') {
        return b.totalDonations - a.totalDonations;
      } else if (sortBy === 'recent') {
        return (b.lastDonationDate || '').localeCompare(a.lastDonationDate || '');
      } else {
        return a.name.localeCompare(b.name);
      }
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

  const getWhatsAppLink = (donor: Donor) => {
    const raw = donor.phone.replace(/[^0-9]/g, '');
    const intlPhone = raw.startsWith('880') ? raw : raw.startsWith('0') ? `88${raw}` : `880${raw}`;
    const message = `আসসালামু আলাইকুম ${donor.name} ভাই/আপু, রক্তবন্ধু (RoktoBondhu) প্ল্যাটফর্মে আপনার রক্তদানের প্রোফাইল দেখলাম। আমাদের একজন রোগীর জন্য ${donor.bloodGroup} রক্ত প্রয়োজন ছিল। আপনি কি এই মুহূর্তে রক্ত দিতে পারবেন?`;
    return `https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            <Search className="h-4 w-4" />
            <span>{language === 'bn' ? 'রক্তদাতা ডিরেক্টরি' : 'Donor Directory'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
            {language === 'bn' ? 'কাছের রক্তদাতা খুঁজুন' : 'Find Blood Donors Near You'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {language === 'bn'
              ? 'যেকোনো রক্তের গ্রুপ ও এলাকার রক্তদাতাদের সরাসরি মোবাইল বা হোয়াটসঅ্যাপে যোগাযোগ করুন।'
              : 'Search verified blood donors across 64 districts with direct phone and WhatsApp contact.'}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              viewMode === 'cards'
                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{language === 'bn' ? 'কার্ড ভিউ' : 'Card View'}</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              viewMode === 'map'
                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" />
            <span>{language === 'bn' ? 'ম্যাপ ও এলাকা' : 'District Map'}</span>
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
        {/* Blood Group Segmented Filter */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2">
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
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}
                >
                  <span>{bg === 'ALL' ? (language === 'bn' ? 'সকল গ্রুপ' : 'All') : bg}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedBloodGroup === bg ? 'bg-white/25 text-white' : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
                  }`}>
                    {language === 'bn' ? toBengaliNumber(count) : count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          {/* Search Query */}
          <div className="lg:col-span-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder={language === 'bn' ? 'ডোনারের নাম বা এলাকা খুঁজুন...' : 'Search by name or area...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 pl-9 pr-3 py-2 text-xs focus:border-rose-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
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
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
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
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
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
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="donations">{language === 'bn' ? 'সর্বোচ্চ রক্তদান' : 'Most Active'}</option>
              <option value="recent">{language === 'bn' ? 'সম্প্রতি রক্তদান' : 'Recent'}</option>
              <option value="name">{language === 'bn' ? 'নাম অনুসারে' : 'By Name'}</option>
            </select>
          </div>
        </div>

        {/* Toggles row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* Ready to donate toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={e => setOnlyAvailable(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-rose-600 focus:ring-rose-500"
              />
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {language === 'bn' ? '🟢 শুধুমাত্র যারা এখন রক্ত দিতে রাজি' : 'Available Donors Only'}
              </span>
            </label>

            {/* Eligible toggle (90 days) */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={eligibleOnly}
                onChange={e => setEligibleOnly(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-rose-600 focus:ring-rose-500"
              />
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {language === 'bn' ? '⏳ শেষ ৩ মাসে রক্ত দেননি (উপযুক্ত)' : 'Eligible (3+ Months)'}
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-neutral-500">
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
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {language === 'bn' ? 'বাংলাদেশ রক্তদাতা জেলা ম্যাপিং' : 'District Donor Density Map'}
              </h3>
              <p className="text-xs text-neutral-500">
                {language === 'bn' ? 'জেলাভিত্তিক রক্তদাতাদের বিস্তৃতি ও সহজ নির্বাচন' : 'Click a district to filter instantly'}
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
                  className="p-3 rounded-xl border border-neutral-200 hover:border-rose-400 bg-neutral-50/50 hover:bg-rose-50/50 dark:border-neutral-800 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 cursor-pointer transition-all text-center"
                >
                  <p className="text-xs font-bold text-neutral-900 dark:text-white">{div.division}</p>
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
        <div className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center dark:border-neutral-800">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 dark:bg-neutral-800">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-base font-bold text-neutral-900 dark:text-white">
            {language === 'bn' ? 'কোনো রক্তদাতা পাওয়া যায়নি' : 'No Donors Found'}
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            {language === 'bn'
              ? 'ফিল্টার পরিবর্তন করে দেখুন অথবা অন্য কোনো জেলা সিলেক্ট করুন।'
              : 'Try clearing some filters or searching a different district.'}
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
          >
            {language === 'bn' ? 'সব ফিল্টার মুছুন' : 'Reset All Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDonors.map(donor => {
            const eligibility = isEligibleToDonate(donor.lastDonationDate);
            const badge = getBadgeDetails(donor.badge, language);

            return (
              <div
                key={donor.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-rose-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-rose-900 transition-all"
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
                          <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-rose-600 transition-colors">
                            {donor.name}
                          </h3>
                          {donor.isVerified && (
                            <span title="Verified Donor">
                              <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                          <span>{donor.upazila}, {donor.district}</span>
                        </p>
                      </div>
                    </div>

                    {/* Report action button */}
                    <button
                      onClick={() => setReportModalDonor(donor)}
                      className="p-1 text-neutral-400 hover:text-rose-600 rounded transition-colors"
                      title={language === 'bn' ? 'ভুয়া প্রোফাইল রিপোর্ট' : 'Report profile'}
                    >
                      <Flag className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Donor Badges & Stats */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className={`px-2 py-0.5 rounded-md font-semibold ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-neutral-500">
                      মোট রক্তদান: <strong className="text-neutral-800 dark:text-neutral-200">{language === 'bn' ? toBengaliNumber(donor.totalDonations) : donor.totalDonations}</strong> বার
                    </span>
                  </div>

                  {/* Availability & Eligibility Notice */}
                  <div className="mt-3 rounded-xl bg-neutral-50 p-2.5 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">
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

                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
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
                    <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 italic">
                      "{donor.bio}"
                    </p>
                  )}
                </div>

                {/* Card Actions: Call, WhatsApp, Certificate */}
                <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                  <a
                    href={`tel:${donor.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 active:scale-95 transition-all shadow-sm shadow-rose-600/20"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>{language === 'bn' ? 'সরাসরি কল' : 'Call'}</span>
                  </a>

                  <a
                    href={getWhatsAppLink(donor)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 px-3 text-xs font-bold text-white transition-colors shadow-sm"
                    title="Send WhatsApp message"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setCertificateModalDonor(donor)}
                    className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
