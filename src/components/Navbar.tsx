import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Droplet,
  Home,
  Users,
  AlertCircle,
  Building2,
  Heart,
  User,
  Shield,
  Sun,
  Moon,
  LogOut,
  Plus,
  Search,
  Bell,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
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
    totalChatUnreadCount,
    loginWithGoogle,
  } = useApp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'home', labelBn: 'হোম', labelEn: 'Home', Icon: Home },
    { id: 'search', labelBn: 'রক্তদাতা', labelEn: 'Donors', Icon: Users },
    { id: 'requests', labelBn: 'জরুরি অনুরোধ', labelEn: 'Requests', Icon: AlertCircle, badge: true },
    { id: 'chat', labelBn: 'চ্যাট', labelEn: 'Chat', Icon: MessageSquare, isChat: true },
    { id: 'hospitals', labelBn: 'ব্লাড ব্যাংক', labelEn: 'Blood Banks', Icon: Building2 },
    { id: 'stories', labelBn: 'অনুপ্রেরণা', labelEn: 'Stories', Icon: Heart },
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
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-colors shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6">
          {/* Brand & Search */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center gap-2.5 text-left focus:outline-none"
              title="রক্তবন্ধু হোম"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 text-white shadow-md shadow-rose-600/20 group-hover:scale-105 transition-transform">
                <Droplet className="h-5 w-5 fill-white stroke-white" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                  {language === 'bn' ? 'রক্তবন্ধু' : 'RoktoBondhu'}
                </span>
                <p className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 leading-none hidden sm:block">
                  {language === 'bn' ? 'স্বেচ্ছায় রক্তদান নেটওয়ার্ক' : 'Bangladesh Blood Network'}
                </p>
              </div>
            </button>

            {/* Quick Search */}
            <form onSubmit={handleQuickSearch} className="relative hidden lg:block ml-2">
              <div className="flex items-center rounded-full bg-slate-100 dark:bg-slate-800/80 px-3.5 py-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-500 border border-slate-200/60 dark:border-slate-700/60 transition-all">
                <Search className="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={headerSearchQuery}
                  onChange={e => setHeaderSearchQuery(e.target.value)}
                  placeholder={language === 'bn' ? 'জেলা বা রক্তের গ্রুপ লিখুন...' : 'Search group or district...'}
                  className="w-48 bg-transparent text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
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
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                  }`}
                >
                  <IconComponent className={`h-4 w-4 ${isActive ? 'text-rose-600 dark:text-rose-400' : ''}`} />
                  <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
                  {item.badge && (
                    <span className="flex h-2 w-2 rounded-full bg-rose-600 animate-ping" />
                  )}
                  {item.isChat && totalChatUnreadCount > 0 && (
                    <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-2xs">
                      {toBengaliNumber(totalChatUnreadCount)}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions: Request Button, Theme Toggle, Language, User */}
          <div className="flex items-center gap-2">
            {/* Post Emergency Request Button */}
            <button
              onClick={() => setPostRequestModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white px-3 sm:px-4 py-2 text-xs font-bold shadow-md shadow-rose-600/25 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span className="hidden sm:inline">{language === 'bn' ? 'জরুরি রক্তের অনুরোধ' : 'Request Blood'}</span>
              <span className="sm:hidden">{language === 'bn' ? 'অনুরোধ' : 'Request'}</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                title="নোটিফিকেশন"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                    {language === 'bn' ? toBengaliNumber(unreadNotifs) : unreadNotifs}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-3 py-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Bell className="h-3.5 w-3.5 text-rose-600" />
                      <span>{language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}</span>
                    </span>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-[11px] text-slate-500 hover:text-rose-600 dark:text-slate-400 transition-colors"
                      >
                        {language === 'bn' ? 'সব মুছুন' : 'Clear all'}
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-xs text-slate-500">
                        {language === 'bn' ? 'কোনো নতুন নোটিফিকেশন নেই' : 'No notifications'}
                      </p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 text-xs transition-colors cursor-pointer rounded-xl ${
                            !n.read ? 'bg-rose-50/70 dark:bg-rose-950/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="mt-1 text-slate-600 dark:text-slate-300 text-[11px]">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-400/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300/40'
              }`}
              title={
                darkMode
                  ? language === 'bn'
                    ? 'লাইট মোড চালু করুন'
                    : 'Switch to Light Mode'
                  : language === 'bn'
                  ? 'ডার্ক মোড চালু করুন'
                  : 'Switch to Dark Mode'
              }
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex h-9 px-2.5 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
              title="ভাষা পরিবর্তন"
            >
              {language === 'bn' ? 'English' : 'বাংলা'}
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white font-black text-xs shadow-xs">
                    {currentUser.bloodGroup}
                  </div>
                  <ChevronDown className="h-3 w-3 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-slate-500">{currentUser.phone}</p>
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
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2"
                      >
                        <User className="h-3.5 w-3.5 text-slate-500" />
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
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2"
                      >
                        <Shield className="h-3.5 w-3.5 text-slate-500" />
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
                className="rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3.5 py-2 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xs transition-colors flex items-center gap-1"
              >
                <span>{language === 'bn' ? 'লগইন' : 'Log In'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around h-16 px-2 shadow-lg">
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
                isActive ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <div className="relative">
                <IconComponent className="h-5 w-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                  </span>
                )}
                {item.isChat && totalChatUnreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-2xs">
                    {toBengaliNumber(totalChatUnreadCount)}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-black text-rose-600 dark:text-rose-400' : 'font-medium'}`}>
                {language === 'bn' ? item.labelBn : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};
