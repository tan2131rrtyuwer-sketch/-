import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Droplet,
  Search,
  AlertCircle,
  Building2,
  Heart,
  User,
  Shield,
  Sun,
  Moon,
  Globe,
  Bell,
  Menu,
  X,
  LogOut,
  PlusCircle,
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
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'home', labelBn: 'হোম', labelEn: 'Home', icon: Heart },
    { id: 'search', labelBn: 'রক্তদাতা খুঁজুন', labelEn: 'Find Donors', icon: Search },
    { id: 'requests', labelBn: 'জরুরি অনুরোধ', labelEn: 'Urgent Requests', icon: AlertCircle, badge: true },
    { id: 'hospitals', labelBn: 'ব্লাড ব্যাংক', labelEn: 'Blood Banks', icon: Building2 },
    { id: 'stories', labelBn: 'সফলতার গল্প', labelEn: 'Stories', icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-2 text-left focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Droplet className="h-6 w-6 fill-white stroke-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-1">
                {language === 'bn' ? 'রক্তবন্ধু' : 'RoktoBondhu'}
              </span>
              <span className="block text-[11px] font-medium text-rose-600 dark:text-rose-400 -mt-1">
                {language === 'bn' ? 'সামাজিক রক্তদান নেটওয়ার্ক' : 'Blood Donor Network'}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'text-rose-600 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/40'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
                {item.badge && (
                  <span className="inline-block h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Post Blood Request CTA */}
          <button
            onClick={() => setPostRequestModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 active:scale-95 transition-all whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{language === 'bn' ? 'রক্তের অনুরোধ' : 'Request Blood'}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1 rounded-lg border border-neutral-200 dark:border-neutral-800 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Change language"
          >
            <Globe className="h-3.5 w-3.5 text-neutral-500" />
            <span>{language === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="rounded-lg p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative rounded-lg p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                  {language === 'bn' ? toBengaliNumber(unreadNotifs) : unreadNotifs}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 z-50">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 px-3 py-2">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                    {language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}
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
                        className={`p-2.5 text-xs transition-colors cursor-pointer rounded-lg ${
                          !n.read ? 'bg-rose-50/60 dark:bg-rose-950/20' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-neutral-900 dark:text-neutral-100">{n.title}</span>
                          <span className="text-[10px] text-neutral-400">{n.timestamp}</span>
                        </div>
                        <p className="mt-1 text-neutral-600 dark:text-neutral-300">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account or Login / Register */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200 font-bold text-xs">
                  {currentUser.bloodGroup}
                </div>
                <span className="hidden lg:inline text-xs font-semibold text-neutral-900 dark:text-white max-w-[100px] truncate">
                  {currentUser.name}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 z-50">
                  <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                    <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-neutral-500">{currentUser.phone}</p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold">
                      {currentUser.bloodGroup} ডোনার
                    </span>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg flex items-center gap-2"
                    >
                      <User className="h-3.5 w-3.5 text-neutral-500" />
                      <span>{language === 'bn' ? 'আমার ড্যাশবোর্ড' : 'My Dashboard'}</span>
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
                      className="w-full text-left px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg flex items-center gap-2"
                    >
                      <Shield className="h-3.5 w-3.5 text-neutral-500" />
                      <span>{isAdmin ? (language === 'bn' ? 'অ্যাডমিন থেকে প্রস্থান' : 'Exit Admin') : (language === 'bn' ? 'অ্যাডমিন মোড চালু' : 'Admin Console')}</span>
                    </button>
                    <button
                      onClick={() => {
                        logoutUser();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg flex items-center gap-2"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>{language === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setAuthModalTab('login');
                  setAuthModalOpen(true);
                }}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {language === 'bn' ? 'লগইন' : 'Login'}
              </button>
              <button
                onClick={() => {
                  setAuthModalTab('register');
                  setAuthModalOpen(true);
                }}
                className="rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
              >
                {language === 'bn' ? 'রক্তদাতা হোন' : 'Join as Donor'}
              </button>
            </div>
          )}

          {/* Admin link shortcut if admin is active */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className="hidden xl:inline-flex items-center gap-1 rounded-md bg-amber-100 dark:bg-amber-950/60 px-2 py-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300"
            >
              <Shield className="h-3 w-3" />
              <span>Admin</span>
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-200 bg-white px-4 py-4 md:hidden dark:border-neutral-800 dark:bg-neutral-900 space-y-2">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-left ${
                  isActive
                    ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                    {language === 'bn' ? 'জরুরি' : 'Urgent'}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
            <button
              onClick={() => {
                setPostRequestModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{language === 'bn' ? 'জরুরি রক্তের অনুরোধ করুন' : 'Request Urgent Blood'}</span>
            </button>
            {currentUser && (
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
              >
                <User className="h-4 w-4 text-neutral-500" />
                <span>{language === 'bn' ? 'আমার ড্যাশবোর্ড' : 'My Dashboard'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
