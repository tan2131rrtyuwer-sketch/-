import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { chatService } from '../services/chatService';
import { ChatMessage, Conversation, ChatUser } from '../types/chat';
import {
  MessageSquare,
  Search,
  Send,
  ArrowLeft,
  MoreVertical,
  ShieldAlert,
  Ban,
  Smile,
  Check,
  CheckCheck,
  Clock,
  Droplet,
  MapPin,
  Phone,
  AlertCircle,
  Users,
  X,
  AlertTriangle,
} from 'lucide-react';
import { toBengaliNumber } from '../utils/translations';

const QUICK_EMOJIS = ['❤️', '🩸', '👍', '🙏', '😊', '🚑', '🏥', '👏', '🤝', '💪'];

const EMERGENCY_TEMPLATES = [
  '🩸 আসসালামু আলাইকুম, আপনার রক্তের গ্রুপ কি এই মুহূর্তে এভেইলেবল আছে?',
  '🏥 রোগী হাসপাতালে ভর্তি আছেন, রক্তদান করতে কি আসতে পারবেন?',
  '📞 সরাসরি বিস্তারিত কথা বলতে অনুগ্রহ করে আপনার সচল নম্বরে একটু কল দিন।',
  '✅ আলহামদুলিল্লাহ, রক্তদাতার ব্যবস্থা হয়ে গেছে। ধন্যবাদ!',
];

export const ChatView: React.FC = () => {
  const {
    currentUser,
    firebaseUser,
    language,
    activeChatPartner,
    setActiveChatPartner,
    showToast,
    donors,
  } = useApp();

  const currentUserId = firebaseUser?.uid || currentUser?.id || 'guest_user';
  const currentUserName = currentUser?.name || firebaseUser?.displayName || 'রক্তবন্ধু ইউজার';

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activePartnerProfile, setActivePartnerProfile] = useState<ChatUser | null>(activeChatPartner);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('ভুল বা বিভ্রান্তিকর তথ্য');
  const [reportDetails, setReportDetails] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync current user profile to Firestore
  useEffect(() => {
    if (currentUserId && currentUser) {
      chatService.syncUserProfile({
        userId: currentUserId,
        name: currentUser.name,
        bloodGroup: currentUser.bloodGroup,
        district: currentUser.district,
        upazila: currentUser.upazila,
        isAvailable: currentUser.isAvailable,
        isOnline: true,
      });

      return () => {
        chatService.updateOnlinePresence(currentUserId, false);
      };
    }
  }, [currentUserId, currentUser]);

  // Subscribe to real-time conversations list
  useEffect(() => {
    if (!currentUserId) return;

    const unsubscribe = chatService.subscribeToConversations(currentUserId, convList => {
      setConversations(convList);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  // Handle activeChatPartner passed from donor card
  useEffect(() => {
    if (activeChatPartner && activeChatPartner.userId !== currentUserId) {
      startChatWithUser(activeChatPartner);
    }
  }, [activeChatPartner]);

  // Real-time messages listener when activeConversationId changes
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    setIsLoadingMessages(true);
    const unsubscribe = chatService.subscribeToMessages(activeConversationId, msgs => {
      setMessages(msgs);
      setIsLoadingMessages(false);

      // Auto-mark unread messages as read
      const unreads = msgs.filter(m => m.senderId !== currentUserId && m.status !== 'read');
      if (unreads.length > 0) {
        chatService.markMessagesAsRead(activeConversationId, currentUserId, unreads);
      }
    });

    return () => unsubscribe();
  }, [activeConversationId, currentUserId]);

  // Auto-scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start chat with user
  const startChatWithUser = async (partner: ChatUser) => {
    if (partner.userId === currentUserId) return;
    try {
      setActivePartnerProfile(partner);
      const convId = await chatService.getOrCreateConversation(
        currentUserId,
        partner.userId,
        partner
      );
      setActiveConversationId(convId);
      setIsSearching(false);
      setSearchQuery('');
    } catch (err: any) {
      showToast(err.message || 'চ্যাট শুরু করতে সমস্যা হয়েছে', 'error');
    }
  };

  // User Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const firestoreUsers = await chatService.searchUsers(searchQuery);
        // Also fallback search in registered donors
        const donorMatches: ChatUser[] = donors
          .filter(
            d =>
              d.id !== currentUserId &&
              (d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.district.toLowerCase().includes(searchQuery.toLowerCase()))
          )
          .map(d => ({
            userId: d.id,
            name: d.name,
            bloodGroup: d.bloodGroup,
            district: d.district,
            upazila: d.upazila,
            isAvailable: d.isAvailable,
          }));

        // Merge without duplicate userIds
        const mergedMap = new Map<string, ChatUser>();
        firestoreUsers.forEach(u => u.userId !== currentUserId && mergedMap.set(u.userId, u));
        donorMatches.forEach(u => !mergedMap.has(u.userId) && mergedMap.set(u.userId, u));

        setSearchResults(Array.from(mergedMap.values()));
      } catch {
        // search error fallback
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, currentUserId, donors]);

  // Send message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || !activeConversationId || !activePartnerProfile) return;

    const recipientId = activePartnerProfile.userId;
    setInputText('');
    setShowEmojiPicker(false);

    try {
      await chatService.sendMessage(
        activeConversationId,
        currentUserId,
        currentUserName,
        recipientId,
        textToSend
      );
    } catch (err: any) {
      showToast(err.message || 'মেসেজ পাঠানো যায়নি', 'error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Block / Unblock conversation
  const currentConv = conversations.find(c => c.id === activeConversationId);
  const isBlocked = Boolean(currentConv?.blockedBy);
  const isBlockedByMe = currentConv?.blockedBy === currentUserId;

  const handleToggleBlock = async () => {
    if (!activeConversationId) return;
    try {
      if (isBlockedByMe) {
        await chatService.toggleBlockConversation(activeConversationId, null);
        showToast(language === 'bn' ? 'ইউজার আনব্লক করা হয়েছে।' : 'User unblocked.');
      } else {
        await chatService.toggleBlockConversation(activeConversationId, currentUserId);
        showToast(language === 'bn' ? 'ইউজার সাময়িকভাবে ব্লক করা হয়েছে।' : 'User blocked.');
      }
      setShowMenu(false);
    } catch {
      showToast('ব্লক অ্যাকশন ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleSendReport = async () => {
    if (!activePartnerProfile) return;
    try {
      await chatService.submitReport({
        reporterId: currentUserId,
        reportedUserId: activePartnerProfile.userId,
        reason: reportReason,
        details: reportDetails,
      });
      setReportModalOpen(false);
      setReportDetails('');
      showToast(language === 'bn' ? 'রিপোর্ট সফলভাবে জমা হয়েছে। প্রশাসন পর্যালোচনা করবে।' : 'Report submitted.');
    } catch {
      showToast('রিপোর্ট পাঠাতে সমস্যা হয়েছে', 'error');
    }
  };

  // Format message time (e.g. 10:45 PM)
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? (language === 'bn' ? 'অপরাহ্ন' : 'PM') : (language === 'bn' ? 'পূর্বাহ্ন' : 'AM');
    hours = hours % 12 || 12;
    const minuteStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return language === 'bn'
      ? `${toBengaliNumber(hours)}:${toBengaliNumber(minuteStr)} ${ampm}`
      : `${hours}:${minuteStr} ${ampm}`;
  };

  // Format date headers
  const formatDateHeader = (isoString: string) => {
    const d = new Date(isoString);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    if (isToday) return language === 'bn' ? 'আজ' : 'Today';
    if (isYesterday) return language === 'bn' ? 'গতকাল' : 'Yesterday';
    return d.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-3 sm:py-6">
      <div className="h-[calc(100vh-145px)] sm:h-[calc(100vh-160px)] min-h-[500px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* ================= LEFT PANEL: CONVERSATIONS LIST ================= */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50 ${
            activeConversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 text-white shadow-md shadow-rose-600/20">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {language === 'bn' ? 'রক্তবন্ধু চ্যাট' : 'RoktoBondhu Chat'}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? 'নিরাপদ প্রাইভেট বার্তালাপ' : 'Real-time private messaging'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSearching(!isSearching)}
              className={`p-2 rounded-xl transition-colors ${
                isSearching
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                  : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
              title={language === 'bn' ? 'নতুন রক্তদাতা বা ইউজার খুঁজুন' : 'Search user or donor'}
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? 'নাম, গ্রুপ বা জেলা দিয়ে খুঁজুন...' : 'Search donor by name, group, area...'}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Search Results Dropdown/List */}
          {searchQuery ? (
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'bn' ? 'রক্তদাতা ও ইউজার অনুসন্ধান ফলাফল' : 'Search Results'}
              </div>
              {searchResults.length === 0 ? (
                <p className="p-6 text-center text-xs text-slate-400">
                  {language === 'bn' ? 'কোনো রক্তদাতা পাওয়া যায়নি' : 'No donors found'}
                </p>
              ) : (
                searchResults.map(user => (
                  <button
                    key={user.userId}
                    onClick={() => startChatWithUser(user)}
                    className="w-full text-left p-3 rounded-2xl hover:bg-rose-50 dark:hover:bg-slate-800/80 flex items-center gap-3 transition-colors group"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 text-white font-black text-xs shadow-xs">
                      {user.bloodGroup || '🩸'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-rose-600 dark:group-hover:text-rose-400">
                          {user.name}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold shrink-0">
                          {user.bloodGroup}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span>{user.district}</span>
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            /* Active Conversations List */
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2 space-y-1">
              {conversations.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {language === 'bn' ? 'কোনো পূর্ববর্তী চ্যাট নেই' : 'No conversations yet'}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {language === 'bn'
                        ? 'উপরের সার্চ বারে রক্তদাতার নাম লিখে অথবা যেকোনো ডোনার প্রোফাইল থেকে চ্যাট শুরু করুন।'
                        : 'Search for a donor above to start a conversation.'}
                    </p>
                  </div>
                </div>
              ) : (
                conversations.map(conv => {
                  const partnerId = conv.participantIds.find(id => id !== currentUserId) || '';
                  const partnerDonor = donors.find(d => d.id === partnerId);
                  const partnerName = partnerDonor?.name || (language === 'bn' ? 'রক্তবন্ধু স্বেচ্ছাসেবী' : 'Blood Donor');
                  const partnerBlood = partnerDonor?.bloodGroup || '🩸';
                  const partnerDistrict = partnerDonor?.district || 'বাংলাদেশ';
                  const unreadCount = conv.unreadCounts?.[currentUserId] || 0;
                  const isSelected = activeConversationId === conv.id;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setActiveConversationId(conv.id);
                        setActivePartnerProfile({
                          userId: partnerId,
                          name: partnerName,
                          bloodGroup: partnerBlood,
                          district: partnerDistrict,
                        });
                      }}
                      className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'bg-rose-50 text-slate-900 dark:bg-rose-950/40 dark:text-white border border-rose-200 dark:border-rose-900/60 shadow-xs'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {/* Avatar with Blood Group */}
                      <div className="relative">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 text-white font-black text-xs shadow-xs">
                          {partnerBlood}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {partnerName}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {conv.lastMessageAt ? formatTime(conv.lastMessageAt) : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-xs truncate ${unreadCount > 0 ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                            {conv.lastMessage || (language === 'bn' ? 'বার্তা পাঠান...' : 'Start a chat...')}
                          </p>
                          {unreadCount > 0 && (
                            <span className="flex h-4 min-w-4 px-1.5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shrink-0">
                              {toBengaliNumber(unreadCount)}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* ================= RIGHT PANEL: CONVERSATION VIEW ================= */}
        <div
          className={`flex-1 flex flex-col bg-white dark:bg-slate-900 ${
            !activeConversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConversationId && activePartnerProfile ? (
            <>
              {/* Conversation Top Header */}
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => {
                      setActiveConversationId(null);
                      setActiveChatPartner(null);
                    }}
                    className="md:hidden p-1.5 -ml-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  {/* Partner Avatar */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 text-white font-black text-xs shadow-xs">
                    {activePartnerProfile.bloodGroup || '🩸'}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {activePartnerProfile.name}
                      </h3>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold">
                        {activePartnerProfile.bloodGroup}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>{language === 'bn' ? 'সক্রিয় রক্তদাতা' : 'Active Donor'}</span>
                      <span>•</span>
                      <span>{activePartnerProfile.district}</span>
                    </p>
                  </div>
                </div>

                {/* Header Actions Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 text-xs">
                      <button
                        onClick={handleToggleBlock}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Ban className="h-3.5 w-3.5 text-amber-500" />
                        <span>{isBlockedByMe ? 'আনব্লক করুন' : 'ইউজার ব্লক করুন'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setReportModalOpen(true);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                      >
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>রিপোর্ট করুন</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Blocked Notice */}
              {isBlocked && (
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between px-4 border-b border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{language === 'bn' ? 'এই কথোপকথনটি বর্তমানে ব্লক করা রয়েছে।' : 'This conversation is blocked.'}</span>
                  </div>
                  {isBlockedByMe && (
                    <button
                      onClick={handleToggleBlock}
                      className="font-bold underline ml-2"
                    >
                      আনব্লক
                    </button>
                  )}
                </div>
              )}

              {/* Quick Emergency Templates Bar */}
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 overflow-x-auto flex items-center gap-1.5 no-scrollbar text-xs">
                <span className="text-[10px] font-bold text-slate-400 shrink-0">
                  ⚡ {language === 'bn' ? 'দ্রুত বার্তা:' : 'Quick:'}
                </span>
                {EMERGENCY_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    disabled={isBlocked}
                    onClick={() => handleSendMessage(tmpl)}
                    className="shrink-0 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 hover:text-rose-600 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50"
                  >
                    {tmpl.substring(0, 24)}...
                  </button>
                ))}
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/30 dark:bg-slate-950/30">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full text-xs text-slate-400">
                    <Clock className="h-4 w-4 animate-spin mr-2" />
                    <span>মেসেজ লোড হচ্ছে...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-rose-50 dark:bg-rose-950/50 text-rose-600">
                      <Droplet className="h-7 w-7" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {activePartnerProfile.name}-এর সাথে চ্যাট শুরু করুন
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm">
                      {language === 'bn'
                        ? 'জরুরি রক্তের আবেদন, রক্তদানের সময়সূচি বা হাসপাতালের লোকেশন শেয়ার করুন।'
                        : 'Communicate privately regarding blood donation and hospital details.'}
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUserId;
                    const prevMsg = index > 0 ? messages[index - 1] : null;
                    const showDateHeader =
                      !prevMsg ||
                      new Date(prevMsg.createdAt).toDateString() !== new Date(msg.createdAt).toDateString();

                    return (
                      <React.Fragment key={msg.id}>
                        {showDateHeader && (
                          <div className="flex items-center justify-center my-3">
                            <span className="px-3 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 shadow-2xs">
                              {formatDateHeader(msg.createdAt)}
                            </span>
                          </div>
                        )}

                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`relative max-w-[82%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                              isMe
                                ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-br-xs'
                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                            
                            <div
                              className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                                isMe ? 'text-rose-100' : 'text-slate-400'
                              }`}
                            >
                              <span>{formatTime(msg.createdAt)}</span>
                              {isMe && (
                                <span>
                                  {msg.status === 'read' ? (
                                    <span title="পড়েছেন"><CheckCheck className="h-3 w-3 text-cyan-200" /></span>
                                  ) : msg.status === 'delivered' ? (
                                    <span title="পৌঁছেছে"><CheckCheck className="h-3 w-3 text-rose-200" /></span>
                                  ) : (
                                    <span title="পাঠানো হয়েছে"><Check className="h-3 w-3 text-rose-200" /></span>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Emoji bar popover */}
              {showEmojiPicker && (
                <div className="px-4 py-2 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-2 animate-in fade-in">
                  {QUICK_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setInputText(prev => prev + emoji)}
                      className="text-lg hover:scale-125 transition-transform p-1"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Message Input Bottom Area */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2 rounded-xl transition-colors ${
                    showEmojiPicker
                      ? 'text-rose-600 bg-rose-50 dark:bg-rose-950'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                  title="ইমোজি"
                >
                  <Smile className="h-5 w-5" />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  disabled={isBlocked}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isBlocked
                      ? (language === 'bn' ? 'কথোপকথন ব্লক থাকায় মেসেজ পাঠানো সম্ভব নয়' : 'Chat is blocked')
                      : (language === 'bn' ? 'বার্তা লিখুন...' : 'Write a message...')
                  }
                  className="flex-1 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-slate-800 disabled:opacity-50"
                />

                <button
                  type="button"
                  disabled={!inputText.trim() || isBlocked}
                  onClick={() => handleSendMessage()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-600/20 hover:from-rose-700 hover:to-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                  title="পাঠান"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            /* Empty State when no conversation is selected */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 shadow-sm">
                <MessageSquare className="h-8 w-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {language === 'bn' ? 'মেসেঞ্জারের মতো সরাসরি কথা বলুন' : 'Direct Real-Time Chat'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {language === 'bn'
                    ? 'বাম পাশের তালিকা থেকে যেকোনো রক্তদাতার নাম সিলেক্ট করুন অথবা রক্তদাতা তালিকা থেকে "মেসেজ পাঠান" বাটনে ক্লিক করে চ্যাট শুরু করুন।'
                    : 'Select a conversation from the list or search for any donor to chat in real-time.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-600" />
                <span>রিপোর্ট বা অভিযোগ দাখিল করুন</span>
              </h3>
              <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  অভিযোগের কারণ
                </label>
                <select
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                >
                  <option value="ভুল বা বিভ্রান্তিকর তথ্য">ভুল বা বিভ্রান্তিকর তথ্য প্রদান</option>
                  <option value="অনুপযুক্ত বা অপমানজনক বার্তা">অনুপযুক্ত বা অপমানজনক বার্তা</option>
                  <option value="রক্তের বিনিময়ে টাকা দাবি">রক্তের বিনিময়ে অবৈধ টাকা দাবি</option>
                  <option value="স্প্যাম বা ফেক প্রোফাইল">স্প্যাম বা ফেক প্রোফাইল</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  বিস্তারিত তথ্য (ঐচ্ছিক)
                </label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={e => setReportDetails(e.target.value)}
                  placeholder="ঘটনা সম্পর্কে সংক্ষেপে লিখুন..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                বাতিল
              </button>
              <button
                onClick={handleSendReport}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-xs"
              >
                রিপোর্ট জমা দিন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
