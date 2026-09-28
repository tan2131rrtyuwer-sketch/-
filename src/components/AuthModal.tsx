import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup } from '../types';
import { BANGLADESH_DIVISIONS } from '../data/bangladeshLocations';
import { X, CheckCircle, ShieldCheck, ArrowRight, ArrowLeft, KeyRound, Phone, User as UserIcon, Mail, MapPin, Droplet, Lock } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    loginUser,
    registerDonor,
    language,
    donors,
  } = useApp();

  // Mode: login or register
  const [tab, setTab] = useState<'login' | 'register'>(authModalTab);

  // Register steps: 1: basic info, 2: blood & location, 3: OTP verification
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Login form
  const [loginPhone, setLoginPhone] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [age, setAge] = useState<number>(24);

  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [division, setDivision] = useState('ঢাকা');
  const [district, setDistrict] = useState('ঢাকা');
  const [upazila, setUpazila] = useState('মিরপুর');
  const [address, setAddress] = useState('');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [bio, setBio] = useState('');

  // OTP state
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  if (!authModalOpen) return null;

  const currentDivisionData = BANGLADESH_DIVISIONS.find(d => d.division === division) || BANGLADESH_DIVISIONS[0];
  const currentDistrictData = currentDivisionData.districts.find(d => d.name === district) || currentDivisionData.districts[0];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginPhone.trim()) {
      setLoginError(language === 'bn' ? 'দয়া করে মোবাইল নম্বর দিন' : 'Please enter your phone number');
      return;
    }
    const success = loginUser(loginPhone);
    if (success) {
      setAuthModalOpen(false);
    } else {
      setLoginError(
        language === 'bn'
          ? 'এই নম্বরে কোনো রক্তদাতা পাওয়া যায়নি। দয়া করে সঠিক নম্বর দিন অথবা নিচে ডেমো নম্বর দিয়ে চেষ্টা করুন।'
          : 'Donor not found with this phone number. Please check or register.'
      );
    }
  };

  const startOtpFlow = () => {
    if (!name || !phone) {
      alert(language === 'bn' ? 'নাম এবং মোবাইল নম্বর দেওয়া আবশ্যক' : 'Name and Phone are required');
      return;
    }
    // Generate 4-digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setIsOtpSent(true);
    setStep(3);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (userOtp.trim() !== generatedOtp.trim()) {
      setOtpError(language === 'bn' ? 'ভুল ওটিপি কোড! আবার চেষ্টা করুন।' : 'Invalid OTP code! Please try again.');
      return;
    }

    // Register user
    registerDonor({
      name,
      phone,
      email: email || `${phone}@roktobondhu.org`,
      bloodGroup,
      division,
      district,
      upazila,
      address: address || `${upazila}, ${district}`,
      lastDonationDate: lastDonationDate || '',
      isAvailable,
      bio: bio || 'স্বেচ্ছায় রক্তদান করি। মানবতার পাশে দাঁড়াতে প্রস্তুত।',
      gender,
      age: Number(age) || 25,
    });

    setAuthModalOpen(false);
    // Reset state
    setStep(1);
    setUserOtp('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900 dark:border dark:border-neutral-800 transition-all">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tab Toggle */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-5">
          <button
            onClick={() => {
              setTab('login');
              setStep(1);
            }}
            className={`pb-2 text-sm font-semibold transition-colors mr-6 ${
              tab === 'login'
                ? 'border-b-2 border-rose-600 text-rose-600 dark:text-rose-400'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
            }`}
          >
            {language === 'bn' ? 'লগইন করুন' : 'Sign In'}
          </button>
          <button
            onClick={() => {
              setTab('register');
              setStep(1);
            }}
            className={`pb-2 text-sm font-semibold transition-colors ${
              tab === 'register'
                ? 'border-b-2 border-rose-600 text-rose-600 dark:text-rose-400'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
            }`}
          >
            {language === 'bn' ? 'নতুন রক্তদাতা নিবন্ধন' : 'Join as Blood Donor'}
          </button>
        </div>

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Phone Number'}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <input
                  type="tel"
                  required
                  placeholder="01712345678"
                  value={loginPhone}
                  onChange={e => setLoginPhone(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 pl-10 pr-3 py-2 text-sm focus:border-rose-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-neutral-300 pl-10 pr-3 py-2 text-sm focus:border-rose-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            {loginError && (
              <div className="rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 active:scale-98 transition-all"
            >
              {language === 'bn' ? 'লগইন করুন' : 'Log In'}
            </button>

            {/* Quick Demo Logins for smooth evaluation */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <p className="text-[11px] font-medium text-neutral-500 mb-2">
                {language === 'bn' ? 'দ্রুত টেস্ট লগইন করুন (ডেমো ইউজার):' : 'Quick demo accounts:'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {donors.slice(0, 3).map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      loginUser(d.phone);
                      setAuthModalOpen(false);
                    }}
                    className="rounded-md bg-neutral-100 px-2 py-1 text-[11px] text-neutral-700 hover:bg-rose-50 hover:text-rose-600 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {d.name} ({d.bloodGroup})
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* REGISTRATION FORM (3 Steps with OTP) */}
        {tab === 'register' && (
          <div>
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-1.5">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= 1 ? 'bg-rose-600 text-white' : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800'
                }`}>
                  1
                </span>
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  {language === 'bn' ? 'তথ্য' : 'Info'}
                </span>
              </div>
              <div className="h-0.5 w-8 bg-neutral-200 dark:bg-neutral-700" />
              <div className="flex items-center gap-1.5">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= 2 ? 'bg-rose-600 text-white' : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800'
                }`}>
                  2
                </span>
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  {language === 'bn' ? 'রক্ত ও এলাকা' : 'Blood & Area'}
                </span>
              </div>
              <div className="h-0.5 w-8 bg-neutral-200 dark:bg-neutral-700" />
              <div className="flex items-center gap-1.5">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 3 ? 'bg-rose-600 text-white' : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800'
                }`}>
                  3
                </span>
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  {language === 'bn' ? 'ওটিপি' : 'OTP'}
                </span>
              </div>
            </div>

            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {language === 'bn' ? 'সম্পূর্ণ নাম' : 'Full Name'} *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মোঃ জাহিদ হাসান"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 pl-10 pr-3 py-2 text-sm focus:border-rose-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {language === 'bn' ? 'মোবাইল নম্বর (ভেরিফিকেশনের জন্য)' : 'Mobile Number (for verification)'} *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 pl-10 pr-3 py-2 text-sm focus:border-rose-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {language === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-neutral-300 pl-10 pr-3 py-2 text-sm focus:border-rose-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {language === 'bn' ? 'বয়স' : 'Age'}
                    </label>
                    <input
                      type="number"
                      min={18}
                      max={65}
                      value={age}
                      onChange={e => setAge(Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {language === 'bn' ? 'লিঙ্গ' : 'Gender'}
                    </label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value as any)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    >
                      <option value="male">{language === 'bn' ? 'পুরুষ' : 'Male'}</option>
                      <option value="female">{language === 'bn' ? 'নারী' : 'Female'}</option>
                      <option value="other">{language === 'bn' ? 'অন্যান্য' : 'Other'}</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!name.trim() || !phone.trim()) {
                      alert(language === 'bn' ? 'দয়া করে নাম ও মোবাইল নম্বর পূরণ করুন' : 'Please fill name and mobile number');
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
                >
                  <span>{language === 'bn' ? 'পরবর্তী ধাপ' : 'Next Step'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* STEP 2: Blood Group & Location */}
            {step === 2 && (
              <div className="space-y-3">
                {/* Blood Group Selector */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {language === 'bn' ? 'আপনার রক্তের গ্রুপ সিলেক্ট করুন' : 'Select Blood Group'} *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map(bg => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setBloodGroup(bg)}
                        className={`rounded-lg py-2 text-xs font-bold transition-all ${
                          bloodGroup === bg
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-600'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Division, District, Upazila */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {language === 'bn' ? 'বিভাগ' : 'Division'}
                    </label>
                    <select
                      value={division}
                      onChange={e => {
                        const div = e.target.value;
                        setDivision(div);
                        const match = BANGLADESH_DIVISIONS.find(d => d.division === div);
                        if (match && match.districts.length > 0) {
                          setDistrict(match.districts[0].name);
                          setUpazila(match.districts[0].upazilas[0] || '');
                        }
                      }}
                      className="w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    >
                      {BANGLADESH_DIVISIONS.map(d => (
                        <option key={d.division} value={d.division}>
                          {d.division}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {language === 'bn' ? 'জেলা' : 'District'}
                    </label>
                    <select
                      value={district}
                      onChange={e => {
                        const dist = e.target.value;
                        setDistrict(dist);
                        const matchDist = currentDivisionData.districts.find(d => d.name === dist);
                        if (matchDist && matchDist.upazilas.length > 0) {
                          setUpazila(matchDist.upazilas[0]);
                        }
                      }}
                      className="w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    >
                      {currentDivisionData.districts.map(d => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {language === 'bn' ? 'উপজেলা/এলাকা' : 'Area'}
                    </label>
                    <select
                      value={upazila}
                      onChange={e => setUpazila(e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    >
                      {currentDistrictData.upazilas.map(u => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {language === 'bn' ? 'বিস্তারিত ঠিকানা' : 'Detailed Address'}
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: রোড নং ৪, সেক্টর ৯"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                </div>

                {/* Last Donation Date */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {language === 'bn' ? 'শেষ রক্তদানের তারিখ' : 'Last Donation Date'}
                    </label>
                    <input
                      type="date"
                      value={lastDonationDate}
                      onChange={e => setLastDonationDate(e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    />
                    <span className="text-[10px] text-neutral-400">
                      {language === 'bn' ? 'আগে না দিয়ে থাকলে ফাঁকা রাখুন' : 'Leave empty if never donated'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {language === 'bn' ? 'রক্ত দিতে প্রস্তুত?' : 'Ready to Donate?'}
                    </label>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAvailable(!isAvailable)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isAvailable ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isAvailable ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        {isAvailable
                          ? language === 'bn' ? 'হ্যাঁ, রাজি' : 'Available'
                          : language === 'bn' ? 'এখন না' : 'Not now'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>{language === 'bn' ? 'পিছনে' : 'Back'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={startOtpFlow}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-rose-600 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-colors"
                  >
                    <span>{language === 'bn' ? 'ওটিপি ভেরিফিকেশনে যান' : 'Verify via OTP'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: OTP Verification */}
            {step === 3 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300 mb-2">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {language === 'bn' ? 'মোবাইল নম্বর যাচাইকরণ' : 'Phone Verification'}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    {language === 'bn'
                      ? `${phone} নম্বরে ৪ ডিজিটের একটি ওটিপি কোড পাঠানো হয়েছে`
                      : `A 4-digit OTP code has been sent to ${phone}`}
                  </p>
                </div>

                {/* Simulated SMS banner for transparent and effortless testing */}
                <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3 dark:border-rose-900 dark:bg-rose-950/30">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-rose-800 dark:text-rose-200">
                      📩 {language === 'bn' ? 'সিমুলেটেড এসএমএস' : 'Simulated SMS'}:
                    </span>
                    <button
                      type="button"
                      onClick={() => setUserOtp(generatedOtp)}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      {language === 'bn' ? 'কোড বসান [ ' + generatedOtp + ' ]' : 'Autofill [' + generatedOtp + ']'}
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-rose-700 dark:text-rose-300">
                    "রক্তবন্ধু ওটিপি কোড: <strong className="text-sm font-mono tracking-wider">{generatedOtp}</strong>। কাউকে শেয়ার করবেন না।"
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 text-center">
                    {language === 'bn' ? '৪ ডিজিটের কোড দিন' : 'Enter 4-Digit Code'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={userOtp}
                    onChange={e => setUserOtp(e.target.value)}
                    placeholder="••••"
                    className="w-36 mx-auto block text-center font-mono text-2xl tracking-[0.5em] rounded-lg border border-neutral-300 py-2 focus:border-rose-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                </div>

                {otpError && (
                  <p className="text-xs text-center text-rose-600 dark:text-rose-400 font-medium">
                    {otpError}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300"
                  >
                    {language === 'bn' ? 'পিছনে' : 'Back'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-rose-600 py-2.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20"
                  >
                    {language === 'bn' ? 'যাচাই সম্পন্ন করে নিবন্ধন করুন' : 'Verify & Complete Registration'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
