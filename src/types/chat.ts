import { BloodGroup } from './index';

export type MessageStatus = 'sent' | 'delivered' | 'read';
export type MessageType = 'text' | 'emergency' | 'location';

export interface ChatUser {
  userId: string;
  name: string;
  phone?: string;
  bloodGroup: BloodGroup | string;
  district: string;
  upazila?: string;
  avatarUrl?: string;
  isAvailable?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  messageType?: MessageType;
  status: MessageStatus;
  createdAt: string; // ISO string
  readAt?: string; // ISO string
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: string;
  lastMessageSenderId?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
  unreadCounts?: Record<string, number>;
  blockedBy?: string | null;
  // Computed / cached for UI display:
  otherUser?: ChatUser;
}

export interface ChatReportData {
  reporterId: string;
  reportedUserId: string;
  reason: string;
  details?: string;
}
