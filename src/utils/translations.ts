// Bengali numbers & date utilities
export const toBengaliNumber = (num: number | string | undefined | null): string => {
  if (num === undefined || num === null) return '০';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, w => bnDigits[+w]);
};

export const getDaysDifference = (fromDate?: string | null): number => {
  if (!fromDate) return 999;
  try {
    const from = new Date(fromDate);
    if (isNaN(from.getTime())) return 999;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - from.getTime());
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return isNaN(days) ? 999 : days;
  } catch {
    return 999;
  }
};

export const isEligibleToDonate = (lastDonationDate?: string): { eligible: boolean; daysRemaining: number; daysPassed: number } => {
  if (!lastDonationDate) {
    return { eligible: true, daysRemaining: 0, daysPassed: 999 };
  }
  const daysPassed = getDaysDifference(lastDonationDate);
  const requiredCooldown = 90; // 3 months in days
  if (daysPassed >= requiredCooldown) {
    return { eligible: true, daysRemaining: 0, daysPassed };
  } else {
    return { eligible: false, daysRemaining: Math.max(0, requiredCooldown - daysPassed), daysPassed };
  }
};

export const getBadgeDetails = (badge: 'platinum' | 'gold' | 'silver' | 'bronze', lang: 'bn' | 'en') => {
  switch (badge) {
    case 'platinum':
      return {
        label: lang === 'bn' ? 'প্লাটিনাম ডোনার (২০+ বার)' : 'Platinum Donor (20+)',
        color: 'from-purple-600 to-indigo-600 text-white',
        border: 'border-purple-200 dark:border-purple-800',
        bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300',
      };
    case 'gold':
      return {
        label: lang === 'bn' ? 'গোল্ড ডোনার (১০+ বার)' : 'Gold Donor (10+)',
        color: 'from-amber-500 to-yellow-600 text-white',
        border: 'border-amber-200 dark:border-amber-800',
        bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
      };
    case 'silver':
      return {
        label: lang === 'bn' ? 'সিলভার ডোনার (৪-৯ বার)' : 'Silver Donor (4-9)',
        color: 'from-slate-400 to-slate-600 text-white',
        border: 'border-slate-200 dark:border-slate-800',
        bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      };
    case 'bronze':
    default:
      return {
        label: lang === 'bn' ? 'ব্রোঞ্জ ডোনার (১-৩ বার)' : 'Bronze Donor (1-3)',
        color: 'from-orange-600 to-amber-700 text-white',
        border: 'border-orange-200 dark:border-orange-800',
        bg: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300',
      };
  }
};
