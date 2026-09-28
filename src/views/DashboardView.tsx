import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup } from '../types';
import { BANGLADESH_DIVISIONS } from '../data/bangladeshLocations';
import { toBengaliNumber, isEligibleToDonate, getBadgeDetails } from '../utils/translations';
import {
  User,
  Heart,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  Bell,
  Plus,
  ShieldCheck,
  Building,
  Edit3,
  Save,
  Printer,
  ChevronRight,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    toggleAvailability,
    addDonationRecord,
    requests,
    notifications,
    markNotificationRead,
    clearNotifications,
    language,
    setAuthModalOpen,
    setCertificateModalDonor,
  } = useApp();

  // Active dashboard tab
  const [dashTab, setDashTab] = useState<'overview' | 'history' | 'requests' | 'notifications'>('overview');

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editDistrict, setEditDistrict] = useState(currentUser?.district || 'ঢাকা');
  const [editUpazila, setEditUpazila] = useState(currentUser?.upazila || 'ধানমন্ডি');
  const [editAddress, setEditAddress] = useState(currentUser?.address || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editLastDate, setEditLastDate] = useState(currentUser?.lastDonationDate || '');

  // Add donation form state
  const [showAddDonationModal, setShowAddDonationModal] = useState(false);
  const [donationDate, setDonationDate] = useState(new Date().toISOString().split('T')[0]);
  const [hospitalName, setHospitalName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [units, setUnits] = useState(1);
  const [donationNotes, setDonationNotes] = useState('');

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 mb-4">
          <User className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          {language === 'bn' ? 'ড্যাশবোর্ড দেখতে লগইন করুন' : 'Sign in to access your dashboard'}
        </h2>
        <p className="text-xs text-neutral-500 mt-1 mb-6">
          {language === 'bn'
            ? 'আপনার প্রোফাইল, রক্তদানের রিমাইন্ডার এবং হিস্টোরি দেখতে লগইন করুন।'
            : 'Track your donation history, cooldown reminders, and donor certificate.'}
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20"
        >
          {language === 'bn' ? 'লগইন বা নিবন্ধন করুন' : 'Log In or Register'}
        </button>
      </div>
    );
  }

  const eligibility = isEligibleToDonate(currentUser.lastDonationDate);
  const badge = getBadgeDetails(currentUser.badge, language);
  const myRequests = requests.filter(r => r.postedByUserId === currentUser.id);

  // 90-day progress percentage
  const progressPercent = Math.min(100, Math.round((eligibility.daysPassed / 90) * 100));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      phone: editPhone,
      email: editEmail,
      district: editDistrict,
      upazila: editUpazila,
      address: editAddress,
      bio: editBio,
      lastDonationDate: editLastDate,
    });
    setIsEditing(false);
  };

  const handleAddDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalName) {
      alert(language === 'bn' ? 'হাসপাতালের নাম দিন' : 'Hospital name is required');
      return;
    }
    addDonationRecord({
      donorId: currentUser.id,
      date: donationDate,
      hospital: hospitalName,
      recipientName: recipientName || (language === 'bn' ? 'অজ্ঞাত রোগী' : 'Patient'),
      units: Number(units) || 1,
      notes: donationNotes,
    });
    setShowAddDonationModal(false);
    setHospitalName('');
    setRecipientName('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* 1. HERO USER CARD & STATUS BANNER */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {/* Blood Avatar */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 text-white font-black text-2xl shadow-lg shadow-rose-600/30">
              {currentUser.bloodGroup}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                  {currentUser.name}
                </h1>
                {currentUser.isVerified && (
                  <span title="Verified">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {currentUser.phone} • {currentUser.upazila}, {currentUser.district}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${badge.bg}`}>
                  {badge.label}
                </span>
                <span className="text-xs text-neutral-500">
                  {language === 'bn' ? 'মোট দান: ' : 'Total: '}
                  <strong className="text-neutral-800 dark:text-neutral-200">{language === 'bn' ? toBengaliNumber(currentUser.totalDonations) : currentUser.totalDonations} বার</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Availability Toggle Switch */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-neutral-100 dark:border-neutral-800">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-3 bg-neutral-50 dark:bg-neutral-800/50">
              <span className="block text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                {language === 'bn' ? 'রক্তদানের ইচ্ছা ও প্রাপ্যতা:' : 'Availability Status:'}
              </span>
              <div className="flex items-center gap-2.5 mt-1">
                <button
                  type="button"
                  onClick={toggleAvailability}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    currentUser.isAvailable ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      currentUser.isAvailable ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  {currentUser.isAvailable
                    ? (language === 'bn' ? '🟢 রক্ত দিতে রাজি' : 'Available')
                    : (language === 'bn' ? '⚪ বিশ্রামে আছেন' : 'Resting')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setCertificateModalDonor(currentUser)}
              className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 transition-colors shadow-xs"
            >
              <Award className="h-4 w-4 text-amber-600" />
              <span>{language === 'bn' ? 'আমার সম্মাননা সনদ' : 'My Certificate'}</span>
            </button>
          </div>
        </div>

        {/* 2. 90-DAY DONATION COOLDOWN & ELIGIBILITY METER */}
        <div className="mt-6 rounded-xl border border-rose-100 bg-rose-50/60 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{language === 'bn' ? 'রক্তদানের রিমাইন্ডার ও যোগ্যতা মিটার' : 'Donation Cooldown & Eligibility Meter'}</span>
              </span>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5">
                {eligibility.eligible
                  ? (language === 'bn'
                      ? 'অভিনন্দন! আপনার শেষ রক্তদানের ৯০ দিন পার হয়েছে। আপনি সম্পূর্ণ সুস্থ থাকলে এখনই রক্ত দিতে পারেন।'
                      : 'You are fully eligible to donate blood now!')
                  : (language === 'bn'
                      ? `শেষ রক্তদানের পর শরীর পুনরুদ্ধারের জন্য আরও ${toBengaliNumber(eligibility.daysRemaining)} দিন বিশ্রাম নিন।`
                      : `${eligibility.daysRemaining} days remaining for your 90-day cooldown period.`)}
              </p>
            </div>
            <span className="text-xs font-extrabold text-neutral-900 dark:text-white tabular-nums">
              {progressPercent}% {language === 'bn' ? 'প্রস্তুত' : 'Ready'}
            </span>
          </div>

          <div className="mt-3 h-2.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                eligibility.eligible ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. DASHBOARD NAV TABS */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-4 overflow-x-auto">
        <button
          onClick={() => setDashTab('overview')}
          className={`pb-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
            dashTab === 'overview'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
          }`}
        >
          {language === 'bn' ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}
        </button>

        <button
          onClick={() => setDashTab('history')}
          className={`pb-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
            dashTab === 'history'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
          }`}
        >
          {language === 'bn' ? 'রক্তদানের ইতিহাস' : 'Donation History'}
        </button>

        <button
          onClick={() => setDashTab('requests')}
          className={`pb-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
            dashTab === 'requests'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
          }`}
        >
          {language === 'bn' ? 'আমার জরুরি অনুরোধ' : 'My Requests'} ({myRequests.length})
        </button>

        <button
          onClick={() => setDashTab('notifications')}
          className={`pb-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
            dashTab === 'notifications'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
          }`}
        >
          {language === 'bn' ? 'নোটিফিকেশন সেন্টার' : 'Notifications'} ({notifications.length})
        </button>
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB 1: PROFILE EDIT */}
      {dashTab === 'overview' && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {language === 'bn' ? 'ব্যক্তিগত তথ্য ও ঠিকানা' : 'Personal Information & Contact'}
              </h3>
              <p className="text-xs text-neutral-500">
                {language === 'bn' ? 'জরুরি রক্তের প্রয়োজনে রোগীরা এই ঠিকানায় আপনাকে খুঁজবে।' : 'Keep your contact information updated.'}
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>{language === 'bn' ? 'এডিট করুন' : 'Edit Profile'}</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {language === 'bn' ? 'নাম' : 'Name'}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs disabled:bg-neutral-100 disabled:text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs disabled:bg-neutral-100 disabled:text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {language === 'bn' ? 'ইমেইল' : 'Email'}
                </label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs disabled:bg-neutral-100 disabled:text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {language === 'bn' ? 'শেষ রক্তদানের তারিখ' : 'Last Donation Date'}
                </label>
                <input
                  type="date"
                  disabled={!isEditing}
                  value={editLastDate}
                  onChange={e => setEditLastDate(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs disabled:bg-neutral-100 disabled:text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {language === 'bn' ? 'জেলা' : 'District'}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={editDistrict}
                  onChange={e => setEditDistrict(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs disabled:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {language === 'bn' ? 'উপজেলা / এলাকা' : 'Area'}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={editUpazila}
                  onChange={e => setEditUpazila(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs disabled:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'bn' ? 'বায়ো / অনুভূতি' : 'Bio / Note'}
              </label>
              <textarea
                rows={2}
                disabled={!isEditing}
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs disabled:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
                >
                  <Save className="h-4 w-4" />
                  <span>{language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 2: DONATION HISTORY */}
      {dashTab === 'history' && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {language === 'bn' ? 'আমার রক্তদানের ইতিহাস' : 'My Blood Donation Log'}
              </h3>
              <p className="text-xs text-neutral-500">
                {language === 'bn' ? 'আপনার প্রতিবার রক্তদানের বিবরণ এখানে লিপিবদ্ধ থাকবে।' : 'Track each donation and advance your donor badge.'}
              </p>
            </div>
            <button
              onClick={() => setShowAddDonationModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>{language === 'bn' ? 'নতুন রক্তদান যোগ করুন' : 'Log Donation'}</span>
            </button>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {/* Example seeded donation logs */}
            <div className="py-3 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-white">
                  ঢাকা মেডিকেল কলেজ হাসপাতাল (ডিএমসিএইচ)
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  গ্রহীতা: সালমা বেগম • ১ ব্যাগ রক্ত • সিজারিয়ান অপারেশন
                </p>
              </div>
              <span className="text-xs text-neutral-400 font-medium">১০ মে, ২০২৬</span>
            </div>

            <div className="py-3 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-white">
                  বাংলাদেশ শিশু হাসপাতাল ও ইনস্টিটিউট
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  গ্রহীতা: শিশু রোহান • ১ ব্যাগ রক্ত • থ্যালাসেমিয়া
                </p>
              </div>
              <span className="text-xs text-neutral-400 font-medium">১৫ জানুয়ারি, ২০২৬</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MY REQUESTS */}
      {dashTab === 'requests' && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            {language === 'bn' ? 'আমার প্রকাশিত অনুরোধসমূহ' : 'My Blood Requests'}
          </h3>

          {myRequests.length === 0 ? (
            <p className="text-xs text-neutral-500 py-6 text-center">
              {language === 'bn' ? 'আপনি এখনো কোনো জরুরি অনুরোধ পোস্ট করেননি।' : 'You have not posted any requests yet.'}
            </p>
          ) : (
            <div className="space-y-3">
              {myRequests.map(r => (
                <div key={r.id} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {r.patientName} ({r.bloodGroup} - {r.bagsNeeded} ব্যাগ)
                    </h4>
                    <p className="text-xs text-neutral-500">{r.hospitalName}, {r.district}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    r.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {r.status === 'fulfilled' ? 'সম্পন্ন' : 'সক্রিয়'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS */}
      {dashTab === 'notifications' && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {language === 'bn' ? 'নোটিফিকেশন সেন্টার' : 'Notification Center'}
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-xs text-rose-600 hover:underline"
              >
                {language === 'bn' ? 'সব নোটিফিকেশন মুছুন' : 'Clear All'}
              </button>
            )}
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {notifications.map(n => (
              <div key={n.id} className="py-3 flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{n.title}</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5">{n.message}</p>
                </div>
                <span className="text-[11px] text-neutral-400">{n.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD DONATION MODAL */}
      {showAddDonationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900 dark:border dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">
              {language === 'bn' ? 'নতুন রক্তদানের তথ্য যোগ করুন' : 'Log Blood Donation'}
            </h3>
            <form onSubmit={handleAddDonationSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {language === 'bn' ? 'রক্তদানের তারিখ' : 'Date of Donation'}
                </label>
                <input
                  type="date"
                  required
                  value={donationDate}
                  onChange={e => setDonationDate(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {language === 'bn' ? 'হাসপাতালের নাম' : 'Hospital Name'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ঢাকা মেডিকেল কলেজ হাসপাতাল"
                  value={hospitalName}
                  onChange={e => setHospitalName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {language === 'bn' ? 'রোগী / গ্রহীতার নাম' : 'Patient Name'}
                </label>
                <input
                  type="text"
                  placeholder="যেমন: অজ্ঞাত বা রোগীর নাম"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {language === 'bn' ? 'কত ব্যাগ রক্ত দিলেন?' : 'Units (Bags)'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={2}
                  value={units}
                  onChange={e => setUnits(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDonationModal(false)}
                  className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
                >
                  {language === 'bn' ? 'যোগ করুন' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
