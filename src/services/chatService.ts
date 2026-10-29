import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { ChatMessage, Conversation, ChatUser, ChatReportData } from '../types/chat';

export const chatService = {
  /**
   * Sync or create user's public profile in Firestore
   */
  async syncUserProfile(user: ChatUser): Promise<void> {
    const path = `users/${user.userId}`;
    try {
      const userRef = doc(db, 'users', user.userId);
      const dataToSave = {
        userId: user.userId,
        name: user.name || 'Anonymous User',
        bloodGroup: user.bloodGroup || 'O+',
        district: user.district || 'ঢাকা',
        upazila: user.upazila || '',
        avatarUrl: user.avatarUrl || '',
        isAvailable: user.isAvailable !== false,
        isOnline: true,
        lastSeen: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdAt: user.createdAt || new Date().toISOString(),
      };
      await setDoc(userRef, dataToSave, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Update online presence
   */
  async updateOnlinePresence(userId: string, isOnline: boolean): Promise<void> {
    if (!userId) return;
    const path = `users/${userId}`;
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isOnline,
        lastSeen: new Date().toISOString(),
      });
    } catch {
      // Non-critical presence update
    }
  },

  /**
   * Get or create a 1-to-1 conversation with deterministic ID to prevent duplicates
   */
  async getOrCreateConversation(
    currentUserId: string,
    targetUserId: string,
    targetProfile?: ChatUser
  ): Promise<string> {
    if (currentUserId === targetUserId) {
      throw new Error('You cannot start a chat with yourself.');
    }

    // Deterministic canonical conversation ID
    const conversationId = [currentUserId, targetUserId].sort().join('_');
    const path = `conversations/${conversationId}`;

    try {
      const convRef = doc(db, 'conversations', conversationId);
      const existingDoc = await getDoc(convRef);

      if (!existingDoc.exists()) {
        const newConversation: Conversation = {
          id: conversationId,
          participantIds: [currentUserId, targetUserId],
          lastMessage: '',
          lastMessageSenderId: '',
          lastMessageAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          unreadCounts: {
            [currentUserId]: 0,
            [targetUserId]: 0,
          },
          blockedBy: null,
        };
        await setDoc(convRef, newConversation);
      }

      return conversationId;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      return conversationId;
    }
  },

  /**
   * Real-time listener for user's conversations
   */
  subscribeToConversations(
    userId: string,
    onUpdate: (conversations: Conversation[]) => void
  ): () => void {
    const path = 'conversations';
    try {
      const convQuery = query(
        collection(db, path),
        where('participantIds', 'array-contains', userId)
      );

      return onSnapshot(
        convQuery,
        async snapshot => {
          const list: Conversation[] = [];
          for (const docSnap of snapshot.docs) {
            const data = docSnap.data() as Conversation;
            list.push({
              ...data,
              id: docSnap.id,
            });
          }
          // Sort conversations by most recent message
          list.sort((a, b) => {
            const timeA = new Date(a.updatedAt || a.lastMessageAt || a.createdAt).getTime();
            const timeB = new Date(b.updatedAt || b.lastMessageAt || b.createdAt).getTime();
            return timeB - timeA;
          });
          onUpdate(list);
        },
        error => {
          handleFirestoreError(error, OperationType.GET, path);
        }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return () => {};
    }
  },

  /**
   * Real-time listener for messages in a conversation
   */
  subscribeToMessages(
    conversationId: string,
    onUpdate: (messages: ChatMessage[]) => void
  ): () => void {
    const path = `conversations/${conversationId}/messages`;
    try {
      const msgsQuery = query(
        collection(db, path),
        orderBy('createdAt', 'asc'),
        limit(150)
      );

      return onSnapshot(
        msgsQuery,
        snapshot => {
          const messages: ChatMessage[] = [];
          snapshot.forEach(docSnap => {
            messages.push({
              id: docSnap.id,
              ...(docSnap.data() as Omit<ChatMessage, 'id'>),
            });
          });
          onUpdate(messages);
        },
        error => {
          handleFirestoreError(error, OperationType.GET, path);
        }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return () => {};
    }
  },

  /**
   * Send a new message
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    recipientId: string,
    text: string,
    messageType: 'text' | 'emergency' | 'location' = 'text'
  ): Promise<string> {
    const cleanText = text.trim();
    if (!cleanText) return '';

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const messagePath = `conversations/${conversationId}/messages/${messageId}`;
    const convPath = `conversations/${conversationId}`;

    try {
      const convRef = doc(db, 'conversations', conversationId);
      const convSnap = await getDoc(convRef);
      if (convSnap.exists()) {
        const convData = convSnap.data() as Conversation;
        if (convData.blockedBy) {
          throw new Error('এই কথোপকথনটি বর্তমানে ব্লক করা রয়েছে। নতুন বার্তা পাঠানো সম্ভব নয়।');
        }
      }

      const now = new Date().toISOString();
      const messageDoc: ChatMessage = {
        id: messageId,
        conversationId,
        senderId,
        senderName: senderName || 'Donor',
        text: cleanText.substring(0, 2000), // Max 2000 chars guard
        messageType,
        status: 'sent',
        createdAt: now,
      };

      // 1. Write the message document
      const msgRef = doc(db, `conversations/${conversationId}/messages`, messageId);
      await setDoc(msgRef, messageDoc);

      // 2. Update parent conversation metadata
      const currentUnread = convSnap.exists()
        ? convSnap.data().unreadCounts?.[recipientId] || 0
        : 0;

      await updateDoc(convRef, {
        lastMessage: cleanText.substring(0, 200),
        lastMessageSenderId: senderId,
        lastMessageAt: now,
        updatedAt: now,
        [`unreadCounts.${recipientId}`]: currentUnread + 1,
      });

      return messageId;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, messagePath);
      return '';
    }
  },

  /**
   * Mark received messages as read
   */
  async markMessagesAsRead(
    conversationId: string,
    currentUserId: string,
    unreadMessages: ChatMessage[]
  ): Promise<void> {
    if (!unreadMessages || unreadMessages.length === 0) return;

    try {
      const now = new Date().toISOString();

      // Update message read status
      for (const msg of unreadMessages) {
        if (msg.senderId !== currentUserId && msg.status !== 'read') {
          const msgRef = doc(db, `conversations/${conversationId}/messages`, msg.id);
          await updateDoc(msgRef, {
            status: 'read',
            readAt: now,
          });
        }
      }

      // Reset unread count for current user
      const convRef = doc(db, 'conversations', conversationId);
      await updateDoc(convRef, {
        [`unreadCounts.${currentUserId}`]: 0,
      });
    } catch {
      // Non-blocking read receipt update
    }
  },

  /**
   * Search users for initiating chat
   */
  async searchUsers(queryStr: string): Promise<ChatUser[]> {
    const path = 'users';
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(query(usersRef, limit(50)));
      const results: ChatUser[] = [];
      const cleanQ = queryStr.toLowerCase().trim();

      snapshot.forEach(docSnap => {
        const u = docSnap.data() as ChatUser;
        if (!cleanQ) {
          results.push(u);
        } else {
          const matchName = u.name?.toLowerCase().includes(cleanQ);
          const matchBlood = u.bloodGroup?.toLowerCase().includes(cleanQ);
          const matchDistrict = u.district?.toLowerCase().includes(cleanQ);
          if (matchName || matchBlood || matchDistrict) {
            results.push(u);
          }
        }
      });

      return results;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  },

  /**
   * Fetch single user profile
   */
  async getUserProfile(userId: string): Promise<ChatUser | null> {
    const path = `users/${userId}`;
    try {
      const docSnap = await getDoc(doc(db, 'users', userId));
      if (docSnap.exists()) {
        return docSnap.data() as ChatUser;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  /**
   * Block / Unblock user in a conversation
   */
  async toggleBlockConversation(conversationId: string, blockerId: string | null): Promise<void> {
    const path = `conversations/${conversationId}`;
    try {
      const convRef = doc(db, 'conversations', conversationId);
      await updateDoc(convRef, {
        blockedBy: blockerId,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Submit report
   */
  async submitReport(reportData: ChatReportData): Promise<void> {
    const reportId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const path = `reports/${reportId}`;
    try {
      await setDoc(doc(db, 'reports', reportId), {
        id: reportId,
        reporterId: reportData.reporterId,
        reportedUserId: reportData.reportedUserId,
        reason: reportData.reason.substring(0, 200),
        details: (reportData.details || '').substring(0, 1000),
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
};
