export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type DonorBadge = 'platinum' | 'gold' | 'silver' | 'bronze';

export interface Donor {
  id: string;
  name: string;
  phone: string;
  email: string;
  bloodGroup: BloodGroup;
  division: string;
  district: string;
  upazila: string;
  address: string;
  lastDonationDate: string; // YYYY-MM-DD
  isAvailable: boolean; // willing to donate now
  isVerified: boolean;
  avatarUrl?: string;
  totalDonations: number;
  badge: DonorBadge;
  joinedDate: string;
  bio?: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  reportCount: number;
  isBlocked?: boolean;
}

export type UrgencyLevel = 'critical_today' | 'within_24h' | 'normal';

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  bagsNeeded: number;
  hospitalName: string;
  hospitalAddress: string;
  district: string;
  upazila: string;
  urgency: UrgencyLevel;
  contactPhone: string;
  altPhone?: string;
  reason: string;
  createdAt: string;
  status: 'open' | 'fulfilled' | 'cancelled';
  postedByUserId?: string;
  postedByName: string;
  isVerified: boolean;
}

export interface DonationRecord {
  id: string;
  donorId: string;
  date: string;
  hospital: string;
  recipientName: string;
  units: number;
  notes?: string;
}

export interface Hospital {
  id: string;
  name: string;
  nameEn: string;
  type: 'hospital' | 'blood_bank' | 'red_crescent' | 'quantum';
  district: string;
  address: string;
  phone: string;
  emergencyHotline: string;
  is24x7: boolean;
  services: string[];
}

export interface SuccessStory {
  id: string;
  patientName: string;
  donorName: string;
  bloodGroup: BloodGroup;
  hospital: string;
  district: string;
  date: string;
  storyText: string;
  unitsGiven: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'urgent_request' | 'reminder' | 'system' | 'badge';
  linkTarget?: string;
}

export interface ReportItem {
  id: string;
  donorId: string;
  donorName: string;
  reportedByPhone: string;
  reason: string;
  details: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}
