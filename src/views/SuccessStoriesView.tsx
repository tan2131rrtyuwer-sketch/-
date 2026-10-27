import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Quote, Calendar, Award, Droplet } from 'lucide-react';
import { toBengaliNumber } from '../utils/translations';
import {
  FbLike,
  FbComment,
  FbShare,
  FbDots,
  FbPublic,
  FbVerified,
  FbReactionLike,
  FbReactionLove,
  FbReactionCare,
  FbLogo,
} from '../components/FacebookIcons';

export const SuccessStoriesView: React.FC = () => {
  const { stories, language, setAuthModalOpen, setAuthModalTab } = useApp();
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});

  const toggleStoryLike = (id: string) => {
    setLikedStories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShareStory = (story: any) => {
    const text = `❤️ রক্তবন্ধুর সফলতার গল্প:\n"${story.storyText}"\nরক্তদাতা: ${story.donorName} (${story.bloodGroup})\nরোগী: ${story.patientName}\nহাসপাতাল: ${story.hospital}`;
    if (navigator.share) {
      navigator.share({ title: 'রক্তবন্ধু সফলতার গল্প', text }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950 px-3.5 py-1 text-xs font-bold text-[#1877F2]">
          <FbLogo size={14} />
          <span>{language === 'bn' ? 'ফেসবুক কমিউনিটি স্টোরিজ' : 'Facebook Community Feed'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
          {language === 'bn' ? 'রক্তবন্ধুদের রক্তে বাঁচা প্রাণের গল্প' : 'Inspiring Stories of Lives Saved'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          {language === 'bn'
            ? 'প্রতিটি রক্তদানের পেছনে রয়েছে এক একটি বেঁচে যাওয়ার গল্প, অকৃত্রিম মানবিক ভালোবাসার গল্প।'
            : 'Real heartfelt accounts of volunteers who answered urgent calls and saved lives in critical hours.'}
        </p>
      </div>

      {/* Stories Grid Styled like Facebook Posts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stories.map(story => {
          const isLiked = likedStories[story.id];
          const likeCount = isLiked ? 68 : 67;

          return (
            <div
              key={story.id}
              className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all overflow-hidden"
            >
              <div>
                {/* Facebook Post Author Header */}
                <div className="p-4 pb-3 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-[#1877F2] text-white font-black text-xs shadow-xs">
                      {story.bloodGroup}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                          {story.donorName}
                        </h4>
                        <FbVerified className="w-3 h-3 text-[#1877F2]" />
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400 mt-0.5">
                        <span>{story.date}</span>
                        <span>•</span>
                        <FbPublic className="w-2.5 h-2.5 text-neutral-400 inline" />
                      </div>
                    </div>
                  </div>
                  <FbDots size={16} className="text-neutral-400" />
                </div>

                {/* Story Body */}
                <div className="p-4 space-y-3">
                  <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed italic">
                    "{story.storyText}"
                  </p>

                  <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-2.5 border border-neutral-100 dark:border-neutral-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">{language === 'bn' ? 'রোগী:' : 'Patient:'}</span>
                      <strong className="text-neutral-900 dark:text-white">{story.patientName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
                      <span>{language === 'bn' ? 'হাসপাতাল:' : 'Hospital:'}</span>
                      <span>{story.hospital}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {/* Facebook Reactions Counter */}
                <div className="px-4 py-1.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      <FbReactionLove size={16} className="z-20" />
                      <FbReactionLike size={16} className="-ml-1 z-10" />
                      <FbReactionCare size={16} className="-ml-1" />
                    </div>
                    <span className="text-xs font-semibold ml-0.5">{toBengaliNumber(likeCount)}</span>
                  </div>
                  <span>{toBengaliNumber(14)} টি মন্তব্য</span>
                </div>

                {/* Facebook 3-Button Action Bar */}
                <div className="px-2 py-1 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-3 gap-1 text-xs text-neutral-600 dark:text-neutral-300">
                  <button
                    onClick={() => toggleStoryLike(story.id)}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold transition-colors ${
                      isLiked ? 'text-[#1877F2] bg-blue-50/50 dark:bg-blue-950/30' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <FbLike size={16} active={isLiked} />
                    <span>{isLiked ? 'লাইকড' : 'লাইক'}</span>
                  </button>

                  <button
                    onClick={() => handleShareStory(story)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <FbComment size={16} />
                    <span>মন্তব্য</span>
                  </button>

                  <button
                    onClick={() => handleShareStory(story)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <FbShare size={16} />
                    <span>শেয়ার</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Call to Action banner */}
      <div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-600 via-rose-500 to-[#1877F2] p-8 text-white text-center shadow-lg">
        <h3 className="text-xl sm:text-2xl font-bold">
          {language === 'bn' ? 'পরবর্তী জীবন বাঁচানোর গল্পটি হোক আপনার!' : 'Be the Hero of the Next Life-Saving Story'}
        </h3>
        <p className="text-xs sm:text-sm text-rose-100 max-w-lg mx-auto mt-2 mb-6">
          {language === 'bn'
            ? 'আজই আপনার রক্তের গ্রুপ ও অবস্থান নিবন্ধিত করে প্রস্তুত থাকুন জরুরি ক্ষণে মানুষের পাশে দাঁড়ানোর জন্য।'
            : 'Join our voluntary donor registry today and answer the call when every second counts.'}
        </p>
        <button
          onClick={() => {
            setAuthModalTab('register');
            setAuthModalOpen(true);
          }}
          className="rounded-full bg-white px-6 py-3 text-xs font-bold text-rose-700 hover:bg-neutral-100 transition-colors shadow"
        >
          {language === 'bn' ? 'রক্তদাতা হিসেবে নিবন্ধন করুন' : 'Join as a Donor'}
        </button>
      </div>
    </div>
  );
};
