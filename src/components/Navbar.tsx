import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Droplet,
  User,
  Shield,
  Sun,
  Moon,
  LogOut,
  Plus,
  ChevronDown,
} from 'lucide-react';
import {
  FbHome,
  FbFriends,
  FbEmergency,
  FbMarketplace,
  FbStories,
  FbMessenger,
  FbBell,
  FbSearch,
  FbVerified,
} from './FacebookIcons';
import { toBengaliNumber } from '../utils/translations';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    darkMode,
    toggleDarkMode,
    currentUser,
    logoutUser,
    isAdmin,
    loginAsAdmin,
    logoutAdmin,
    notifications,
    markNotificationRead,
    clearNotifications,
    setAuthModalOpen,
    setAuthModalTab,
    setPostRequestModalOpen,
    navigateToSearchWithFilters,
  } = useApp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [messengerModalOpen, setMessengerModalOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'home', labelBn: 'হোম', labelEn: 'Home', Icon: FbHome },
    { id: 'search', labelBn: 'রক্তদাতা', labelEn: 'Donors', Icon: FbFriends },
    { id: 'requests', labelBn: 'জরুরি অনুরোধ', labelEn: 'Requests', Icon: FbEmergency, badge: true },
    { id: 'hospitals', labelBn: 'ব্লাড ব্যাংক', labelEn: 'Blood Banks', Icon: FbMarketplace },
    { id: 'stories', labelBn: 'গল্প ও ফিড', labelEn: 'Stories', Icon: FbStories },
  ];

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearchQuery.trim()) {
      navigateToSearchWithFilters('', headerSearchQuery.trim());
      setHeaderSearchQuery('');
    } else {
      setActiveTab('search');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95 transition-colors shadow-xs">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6">
          {/* Zone 1: Facebook-Style Left Brand & Search Input */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center gap-2 text-left focus:outline-none"
              title="রক্তবন্ধু হোম"
            >
              {/* Facebook-style circle logo badge */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#1877F2] to-rose-600 text-white shadow-md group-hover:scale-105 transition-transform">
                <Droplet className="h-5 w-5 fill-white stroke-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-black tracking-tight text-neutral-900 dark:text-white flex items-center gap-1">
                  {language === 'bn' ? 'রক্তবন্ধু' : 'RoktoBondhu'}
                  <FbVerified className="w-3.5 h-3.5 inline text-[#1877F2]" />
                </span>
              </div>
            </button>

            {/* Facebook-Style Search Input Pill */}
            <form onSubmit={handleQuickSearch} className="relative hidden md:block">
              <div className="flex items-center rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1877F2] focus-within:shadow-sm border border-transparent dark:border-neutral-700/50 transition-all">
                <FbSearch className="h-4 w-4 text-neutral-500 mr-2 shrink-0" />
                <input
                  type="text"
                  value={headerSearchQuery}
                  onChange={e => setHeaderSearchQuery(e.target.value)}
                  placeholder={language === 'bn' ? 'রক্তবন্ধু বা রক্তদাতা খুঁজুন...' : 'Search blood donors...'}
                  className="w-40 lg:w-56 bg-transparent text-xs text-neutral-800 dark:text-white placeholder:text-neutral-400 focus:outline-none"
                />
              </div>
            </form>
          </div>

          {/* Zone 2: Facebook-Style Centered Top Tab Navigation Bar */}
          <nav className="hidden md:flex items-center h-14 space-x-1 lg:space-x-2">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              const IconComponent = item.Icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`relative flex h-14 w-20 lg:w-24 items-center justify-center transition-all ${
                    isActive
                      ? 'border-b-[3px] border-[#1877F2] text-[#1877F2]'
                      : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                  title={language === 'bn' ? item.labelBn : item.labelEn}
                >
                  <div className={`p-2 rounded-xl transition-colors ${
                    isActive ? '' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}>
                    <IconComponent
                      size={26}
                      active={isActive}
                      className={isActive ? 'text-[#1877F2]' : 'text-neutral-500 dark:text-neutral-400'}
                    />
                  </div>
                  {item.badge && (
                    <span className="absolute top-2.5 right-4 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Facebook-Style Circular 40x40 Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 1. Facebook Plus (+) Create Blood Request Button */}
            <button
              onClick={() => setPostRequestModalOpen(true)}
              className="flex h-10 items-center justify-center gap-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-3 text-xs font-bold text-neutral-800 dark:text-neutral-200 transition-colors shadow-2xs"
              title="নতুন রক্তের অনুরোধ পোস্ট করুন"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white">
                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
              <span className="hidden lg:inline">{language === 'bn' ? 'অনুরোধ' : 'Post'}</span>
            </button>

            {/* 2. Facebook Messenger Icon Button */}
            <div className="relative">
              <button
                onClick={() => setMessengerModalOpen(!messengerModalOpen)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors"
                title="মেসেঞ্জার ও হেল্পলাইন"
              >
                <FbMessenger size={20} className="text-neutral-700 dark:text-neutral-200" />
              </button>

              {/* Messenger Quick Drawer */}
              {messengerModalOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-neutral-200 bg-white p-3 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 z-50">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2 mb-2 px-1">
                    <span className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <FbMessenger size={18} className="text-[#1877F2]" />
                      <span>{language === 'bn' ? 'মেসেঞ্জার হেল্পডেস্ক' : 'Messenger Help'}</span>
                    </span>
                    <button
                      onClick={() => setMessengerModalOpen(false)}
                      className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="text-neutral-600 dark:text-neutral-300">
                      জরুরি রক্তের যেকোনো প্রয়োজনে সরাসরি ফেসবুক বা হোয়াটসঅ্যাপে আমাদের বার্তা দিন:
                    </p>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#1877F2] font-semibold hover:bg-blue-100 transition-colors"
                    >
                      <FbMessenger size={18} />
                      <span>ফেসবুক মেসেঞ্জারে চ্যাট করুন</span>
                    </a>
                    <a
                      href="https://api.whatsapp.com/send?phone=8801712475286&text=জরুরি%20রক্তের%20সাহায্য%20প্রয়োজন"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold hover:bg-emerald-100 transition-colors"
                    >
                      <span className="text-base">🟢</span>
                      <span>হোয়াটসঅ্যাপে হেল্পলাইন (01712-475286)</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Facebook Bell Notification Button */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors"
                title="নোটিফিকেশন"
              >
                <FbBell size={20} className="text-neutral-700 dark:text-neutral-200" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#E41E3F] text-[10px] font-bold text-white shadow-xs">
                    {language === 'bn' ? toBengaliNumber(unreadNotifs) : unreadNotifs}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-neutral-200 bg-white p-2 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 z-50">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 px-3 py-2">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <FbBell size={14} className="text-rose-600" />
                      <span>{language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}</span>
                    </span>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-[11px] text-neutral-500 hover:text-rose-600 dark:text-neutral-400 transition-colors"
                      >
                        {language === 'bn' ? 'সব মুছুন' : 'Clear all'}
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-xs text-neutral-500">
                        {language === 'bn' ? 'কোনো নতুন নোটিফিকেশন নেই' : 'No notifications'}
                      </p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 text-xs transition-colors cursor-pointer rounded-xl ${
                            !n.read ? 'bg-rose-50/70 dark:bg-rose-950/30' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">{n.title}</span>
                            <span className="text-[10px] text-neutral-400">{n.timestamp}</span>
                          </div>
                          <p className="mt-1 text-neutral-600 dark:text-neutral-300 text-[11px]">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Language Switch Circular Button */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 transition-colors"
              title="ভাষা পরিবর্তন"
            >
              {language === 'bn' ? 'EN' : 'বাং'}
            </button>

            {/* 5. Dark Mode Circular Button */}
            <button
              onClick={toggleDarkMode}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
              title="থিম পরিবর্তন"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* 6. User Profile Circle / Facebook-Style Avatar */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-[#1877F2] text-white font-black text-xs shadow-xs">
                    {currentUser.bloodGroup}
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white p-2 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 z-50">
                    <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                      <p className="text-xs font-bold text-neutral-900 dark:text-white truncate flex items-center gap-1">
                        {currentUser.name}
                        <FbVerified className="w-3.5 h-3.5 inline text-[#1877F2]" />
                      </p>
                      <p className="text-[11px] text-neutral-500">{currentUser.phone}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold">
                        {currentUser.bloodGroup} রক্তদাতা
                      </span>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveTab('dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl flex items-center gap-2"
                      >
                        <User className="h-3.5 w-3.5 text-neutral-500" />
                        <span>{language === 'bn' ? 'আমার প্রোফাইল ও ড্যাশবোর্ড' : 'My Dashboard'}</span>
                      </button>
                      <button
                        onClick={() => {
                          if (isAdmin) {
                            logoutAdmin();
                          } else {
                            loginAsAdmin();
                            setActiveTab('admin');
                          }
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl flex items-center gap-2"
                      >
                        <Shield className="h-3.5 w-3.5 text-neutral-500" />
                        <span>{isAdmin ? (language === 'bn' ? 'অ্যাডমিন থেকে প্রস্থান' : 'Exit Admin') : (language === 'bn' ? 'অ্যাডমিন মোড' : 'Admin Console')}</span>
                      </button>
                      <button
                        onClick={() => {
                          logoutUser();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl flex items-center gap-2"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>{language === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthModalTab('login');
                  setAuthModalOpen(true);
                }}
                className="rounded-full bg-[#1877F2] text-white px-3.5 py-2 text-xs font-bold hover:bg-[#166fe5] shadow-xs transition-colors flex items-center gap-1"
              >
                <span>{language === 'bn' ? 'লগইন' : 'Log In'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Facebook-Style Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-around h-14 px-2 shadow-lg">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          const IconComponent = item.Icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all ${
                isActive ? 'text-[#1877F2]' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              <div className="relative">
                <IconComponent
                  size={24}
                  active={isActive}
                  className={isActive ? 'text-[#1877F2]' : 'text-neutral-500 dark:text-neutral-400'}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'font-bold text-[#1877F2]' : ''}`}>
                {language === 'bn' ? item.labelBn : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};
