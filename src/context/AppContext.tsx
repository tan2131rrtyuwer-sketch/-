import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Donor,
  BloodRequest,
  Hospital,
  SuccessStory,
  NotificationItem,
  ReportItem,
  BloodGroup,
  DonationRecord,
} from '../types';
import {
  INITIAL_DONORS,
  INITIAL_REQUESTS,
  INITIAL_HOSPITALS,
  INITIAL_STORIES,
} from '../data/mockData';
import { safeStorage } from '../utils/storage';

interface AppContextType {
  donors: Donor[];
  requests: BloodRequest[];
  hospitals: Hospital[];
  stories: SuccessStory[];
  currentUser: Donor | null;
  isAdmin: boolean;
  language: 'bn' | 'en';
  darkMode: boolean;
  notifications: NotificationItem[];
  reports: ReportItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setLanguage: (lang: 'bn' | 'en') => void;
  toggleDarkMode: () => void;
  loginUser: (phone: string) => boolean;
  logoutUser: () => void;
  loginAsAdmin: () => void;
  logoutAdmin: () => void;
  registerDonor: (donorData: Omit<Donor, 'id' | 'joinedDate' | 'badge' | 'totalDonations' | 'reportCount' | 'isVerified'>) => Donor;
  updateProfile: (updatedData: Partial<Donor>) => void;
  toggleAvailability: () => void;
  postBloodRequest: (reqData: Omit<BloodRequest, 'id' | 'createdAt' | 'status' | 'isVerified'>) => void;
  markRequestFulfilled: (id: string) => void;
  deleteRequest: (id: string) => void;
  reportDonor: (report: Omit<ReportItem, 'id' | 'createdAt' | 'status'>) => void;
  resolveReport: (id: string, action: 'dismiss' | 'block') => void;
  addDonationRecord: (record: Omit<DonationRecord, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  // Modal states
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  postRequestModalOpen: boolean;
  setPostRequestModalOpen: (open: boolean) => void;
  certificateModalDonor: Donor | null;
  setCertificateModalDonor: (donor: Donor | null) => void;
  reportModalDonor: Donor | null;
  setReportModalDonor: (donor: Donor | null) => void;
  // Quick Search filters transferred from Home to Search view
  presetBloodGroup: BloodGroup | '';
  setPresetBloodGroup: (bg: BloodGroup | '') => void;
  presetDistrict: string;
  setPresetDistrict: (dist: string) => void;
  navigateToSearchWithFilters: (bloodGroup?: BloodGroup | '', district?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'roktobondhu_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language
  const [language, setLanguageState] = useState<'bn' | 'en'>(() => {
    const saved = safeStorage.getItem<'bn' | 'en'>(LOCAL_STORAGE_PREFIX + 'lang', 'bn');
    return saved === 'en' ? 'en' : 'bn';
  });

  const setLanguage = (lang: 'bn' | 'en') => {
    setLanguageState(lang);
    safeStorage.setItem(LOCAL_STORAGE_PREFIX + 'lang', lang);
  };

  // 2. Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return safeStorage.getItem<string>(LOCAL_STORAGE_PREFIX + 'theme', 'light') === 'dark';
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        safeStorage.setItem(LOCAL_STORAGE_PREFIX + 'theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        safeStorage.setItem(LOCAL_STORAGE_PREFIX + 'theme', 'light');
      }
    } catch {
      // ignore
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // 3. Donors
  const [donors, setDonors] = useState<Donor[]>(() => {
    const saved = safeStorage.getItem<Donor[]>(LOCAL_STORAGE_PREFIX + 'donors', null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    return INITIAL_DONORS;
  });

  useEffect(() => {
    safeStorage.setItem(LOCAL_STORAGE_PREFIX + 'donors', donors);
  }, [donors]);

  // 4. Requests
  const [requests, setRequests] = useState<BloodRequest[]>(() => {
    const saved = safeStorage.getItem<BloodRequest[]>(LOCAL_STORAGE_PREFIX + 'requests', null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    return INITIAL_REQUESTS;
  });

  useEffect(() => {
    safeStorage.setItem(LOCAL_STORAGE_PREFIX + 'requests', requests);
  }, [requests]);

  // 5. Current User
  const [currentUser, setCurrentUser] = useState<Donor | null>(() => {
    const saved = safeStorage.getItem<Donor>(LOCAL_STORAGE_PREFIX + 'current_user', null);
    if (saved && typeof saved === 'object' && saved.id) {
      return saved;
    }
    // Default to pre-seeded donor-1 for great initial demo experience
    return INITIAL_DONORS[0];
  });

  useEffect(() => {
    if (currentUser) {
      safeStorage.setItem(LOCAL_STORAGE_PREFIX + 'current_user', currentUser);
    } else {
      safeStorage.removeItem(LOCAL_STORAGE_PREFIX + 'current_user');
    }
  }, [currentUser]);

  // 6. Admin
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return safeStorage.getItem<string>(LOCAL_STORAGE_PREFIX + 'is_admin', 'false') === 'true';
  });

  const loginAsAdmin = () => {
    setIsAdmin(true);
    safeStorage.setItem(LOCAL_STORAGE_PREFIX + 'is_admin', 'true');
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    safeStorage.removeItem(LOCAL_STORAGE_PREFIX + 'is_admin');
  };

  // 7. Active Tab
  const [activeTab, setActiveTab] = useState<string>('home');

  // 8. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'জরুরি রক্তের অনুরোধ!',
      message: 'ঢাকা মেডিকেল কলেজ হাসপাতালে ২ ব্যাগ B+ রক্তের জরুরি প্রয়োজন।',
      timestamp: '১০ মিনিট আগে',
      read: false,
      type: 'urgent_request',
    },
    {
      id: 'notif-2',
      title: 'রক্তদান রিমাইন্ডার',
      message: 'আপনার শেষ রক্তদানের ৯০ দিন অতিক্রান্ত হয়েছে। আপনি এখন সম্পূর্ণ রক্তদানে উপযুক্ত!',
      timestamp: '১ দিন আগে',
      read: false,
      type: 'reminder',
    },
    {
      id: 'notif-3',
      title: 'রক্তবন্ধু ব্যাজ অর্জন',
      message: 'অভিনন্দন! আপনি ১০ বারের বেশি রক্তদান করে "গোল্ড ডোনার" ব্যাজ পেয়েছেন।',
      timestamp: '৩ দিন আগে',
      read: true,
      type: 'badge',
    },
  ]);

  // 9. Reports
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: 'rep-1',
      donorId: 'donor-6',
      donorName: 'মাহমুদুল করিম',
      reportedByPhone: '01700112233',
      reason: 'মোবাইল নম্বর বন্ধ পাওয়া যাচ্ছে',
      details: 'জরুরি প্রয়োজনে কল দিয়ে সংযোগ পাওয়া যায়নি। নম্বরটি যাচাই করা প্রয়োজন।',
      createdAt: '2026-09-24T10:00:00Z',
      status: 'pending',
    },
  ]);

  // 10. Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [postRequestModalOpen, setPostRequestModalOpen] = useState(false);
  const [certificateModalDonor, setCertificateModalDonor] = useState<Donor | null>(null);
  const [reportModalDonor, setReportModalDonor] = useState<Donor | null>(null);

  // Preset search filters
  const [presetBloodGroup, setPresetBloodGroup] = useState<BloodGroup | ''>('');
  const [presetDistrict, setPresetDistrict] = useState<string>('');

  const navigateToSearchWithFilters = (bg?: BloodGroup | '', dist?: string) => {
    if (bg !== undefined) setPresetBloodGroup(bg);
    if (dist !== undefined) setPresetDistrict(dist || '');
    setActiveTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User Actions
  const loginUser = (phone: string): boolean => {
    const cleanPhone = phone.trim().replace(/^(\+88)/, '');
    const found = donors.find(d => d.phone.endsWith(cleanPhone) || d.phone === phone.trim());
    if (found) {
      if (found.isBlocked) {
        alert(language === 'bn' ? 'এই অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে।' : 'This account is suspended.');
        return false;
      }
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const registerDonor = (
    donorData: Omit<Donor, 'id' | 'joinedDate' | 'badge' | 'totalDonations' | 'reportCount' | 'isVerified'>
  ): Donor => {
    const newId = `donor-${Date.now()}`;
    const newDonor: Donor = {
      ...donorData,
      id: newId,
      joinedDate: new Date().toISOString().split('T')[0],
      badge: 'bronze',
      totalDonations: donorData.lastDonationDate ? 1 : 0,
      reportCount: 0,
      isVerified: true, // verified through our simulated OTP!
    };

    setDonors(prev => [newDonor, ...prev]);
    setCurrentUser(newDonor);

    // Add welcome notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: language === 'bn' ? 'স্বাগতম রক্তবন্ধুতে!' : 'Welcome to RoktoBondhu!',
        message:
          language === 'bn'
            ? `আপনার প্রোফাইল সফলভাবে তৈরি হয়েছে। আপনার রক্তের গ্রুপ: ${newDonor.bloodGroup}`
            : `Your profile was created successfully. Blood group: ${newDonor.bloodGroup}`,
        timestamp: 'এইমাত্র',
        read: false,
        type: 'system',
      },
      ...prev,
    ]);

    return newDonor;
  };

  const updateProfile = (updatedData: Partial<Donor>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setDonors(prev => prev.map(d => (d.id === updated.id ? updated : d)));
  };

  const toggleAvailability = () => {
    if (!currentUser) return;
    const updated = { ...currentUser, isAvailable: !currentUser.isAvailable };
    setCurrentUser(updated);
    setDonors(prev => prev.map(d => (d.id === updated.id ? updated : d)));
  };

  const postBloodRequest = (
    reqData: Omit<BloodRequest, 'id' | 'createdAt' | 'status' | 'isVerified'>
  ) => {
    const newReq: BloodRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'open',
      isVerified: true,
      postedByUserId: currentUser ? currentUser.id : undefined,
    };

    setRequests(prev => [newReq, ...prev]);

    // Send broadcast simulated notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `নতুন জরুরি রক্তের অনুরোধ (${newReq.bloodGroup})`,
        message: `${newReq.hospitalName}, ${newReq.district}-এ ${newReq.bagsNeeded} ব্যাগ ${newReq.bloodGroup} রক্ত প্রয়োজন।`,
        timestamp: 'এইমাত্র',
        read: false,
        type: 'urgent_request',
      },
      ...prev,
    ]);
  };

  const markRequestFulfilled = (id: string) => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'fulfilled' as const } : r))
    );
  };

  const deleteRequest = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const reportDonor = (report: Omit<ReportItem, 'id' | 'createdAt' | 'status'>) => {
    const newRep: ReportItem = {
      ...report,
      id: `rep-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setReports(prev => [newRep, ...prev]);
    setDonors(prev =>
      prev.map(d => (d.id === report.donorId ? { ...d, reportCount: d.reportCount + 1 } : d))
    );
  };

  const resolveReport = (id: string, action: 'dismiss' | 'block') => {
    setReports(prev =>
      prev.map(r => (r.id === id ? { ...r, status: action === 'block' ? 'resolved' : 'dismissed' } : r))
    );
    if (action === 'block') {
      const rep = reports.find(r => r.id === id);
      if (rep) {
        setDonors(prev =>
          prev.map(d => (d.id === rep.donorId ? { ...d, isBlocked: true, isAvailable: false } : d))
        );
      }
    }
  };

  const addDonationRecord = (record: Omit<DonationRecord, 'id'>) => {
    if (!currentUser) return;
    const newTotal = currentUser.totalDonations + record.units;
    let newBadge = currentUser.badge;
    if (newTotal >= 20) newBadge = 'platinum';
    else if (newTotal >= 10) newBadge = 'gold';
    else if (newTotal >= 4) newBadge = 'silver';
    else newBadge = 'bronze';

    const updatedUser: Donor = {
      ...currentUser,
      lastDonationDate: record.date,
      totalDonations: newTotal,
      badge: newBadge,
      isAvailable: false, // After donation, donor enters cooldown
    };

    setCurrentUser(updatedUser);
    setDonors(prev => prev.map(d => (d.id === currentUser.id ? updatedUser : d)));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: language === 'bn' ? 'রক্তদান সম্পন্ন হয়েছে' : 'Donation Logged',
        message:
          language === 'bn'
            ? `ধন্যবাদ! আপনার রক্তদান রেকর্ড সংরক্ষণ করা হয়েছে। মোট রক্তদান: ${newTotal} বার।`
            : `Thank you! Your donation was recorded. Total donations: ${newTotal} times.`,
        timestamp: 'এইমাত্র',
        read: false,
        type: 'system',
      },
      ...prev,
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        donors,
        requests,
        hospitals: INITIAL_HOSPITALS,
        stories: INITIAL_STORIES,
        currentUser,
        isAdmin,
        language,
        darkMode,
        notifications,
        reports,
        activeTab,
        setActiveTab,
        setLanguage,
        toggleDarkMode,
        loginUser,
        logoutUser,
        loginAsAdmin,
        logoutAdmin,
        registerDonor,
        updateProfile,
        toggleAvailability,
        postBloodRequest,
        markRequestFulfilled,
        deleteRequest,
        reportDonor,
        resolveReport,
        addDonationRecord,
        markNotificationRead,
        clearNotifications,
        authModalOpen,
        setAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        postRequestModalOpen,
        setPostRequestModalOpen,
        certificateModalDonor,
        setCertificateModalDonor,
        reportModalDonor,
        setReportModalDonor,
        presetBloodGroup,
        setPresetBloodGroup,
        presetDistrict,
        setPresetDistrict,
        navigateToSearchWithFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
