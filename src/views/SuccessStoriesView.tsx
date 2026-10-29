import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Quote, Calendar, Award, Droplet, Share2, Building2, User } from 'lucide-react';
import { toBengaliNumber } from '../utils/translations';

export const SuccessStoriesView: React.FC = () => {
  const { stories, language, setAuthModalOpen, setAuthModalTab, showToast } = useApp();
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});

  const toggleStoryLike = (id: string) => {
    setLikedStories(prev => {
      const next = !prev[id];
      if (next) {
        showToast(language === 'bn' ? 'অনুপ্রেরণামূলক গল্পটিতে ভালোবাসা জানালেন ❤️' : 'Liked story ❤️');
      }
      return { ...prev, [id]: next };
    });
  };

  const handleShareStory = (story: any) => {
    const text = `❤️ রক্তবন্ধুর মানবিক সফলতার গল্প:\n"${story.storyText}"\nরক্তদাতা: ${story.donorName} (${story.bloodGroup})\nরোগী: ${story.patientName}\nহাসপাতাল: ${story.hospital}\nরক্তবন্ধু - রক্ত দিন, জীবন বাঁচান`;
    if (navigator.share) {
      navigator.share({ title: 'রক্তবন্ধু সফলতার গল্প', text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(text);
      showToast(language === 'bn' ? 'গল্পের বিবরণ কপি হয়েছে!' : 'Story copied to clipboard!');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 px-3.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
          <Heart className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
          <span>{language === 'bn' ? 'মানবিক সফলতার গল্প' : 'Inspiring Stories'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {language === 'bn' ? 'রক্তবন্ধুদের রক্তে বাঁচা প্রাণের গল্প' : 'Inspiring Stories of Lives Saved'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {language === 'bn'
            ? 'প্রতিটি রক্তদানের পেছনে রয়েছে এক একটি বেঁচে যাওয়ার গল্প, অকৃত্রিম মানবিক ভালোবাসার গল্প।'
            : 'Real heartfelt accounts of volunteers who answered urgent calls and saved lives in critical hours.'}
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stories.map(story => {
          const isLiked = likedStories[story.id];
          const baseLikes = 45;
          const currentLikes = isLiked ? baseLikes + 1 : baseLikes;

          return (
            <div
              key={story.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all overflow-hidden hover:shadow-md"
            >
              <div>
                {/* Author Header */}
                <div className="p-4 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white font-black text-xs shadow-xs">
                      {story.bloodGroup}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {story.donorName}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {story.date}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                    রক্তদাতা
                  </span>
                </div>

                {/* Story Body */}
                <div className="p-4 space-y-3">
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic">
                    "{story.storyText}"
                  </p>

                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{language === 'bn' ? 'রোগী:' : 'Patient:'}</span>
                      <strong className="text-slate-900 dark:text-white font-bold">{story.patientName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{language === 'bn' ? 'হাসপাতাল:' : 'Hospital:'}</span>
                      <span>{story.hospital}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleStoryLike(story.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    isLiked
                      ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40'
                      : 'text-slate-600 hover:text-rose-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{toBengaliNumber(currentLikes)}</span>
                </button>

                <button
                  onClick={() => handleShareStory(story)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{language === 'bn' ? 'শেয়ার' : 'Share'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Call to Action banner */}
      <div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-700 via-rose-600 to-red-600 p-8 text-white text-center shadow-lg shadow-rose-900/10">
        <h3 className="text-xl sm:text-2xl font-black">
          {language === 'bn' ? 'পরবর্তী জীবন বাঁচানোর গল্পটি হোক আপনার!' : 'Be the Hero of the Next Life-Saving Story'}
        </h3>
        <p className="text-xs sm:text-sm text-rose-100 max-w-lg mx-auto mt-2 mb-6">
          {language === 'bn'
            ? 'আজই আপনার রক্তের গ্রুপ ও জেলা দিয়ে নিবন্ধিত হোন এবং প্রস্তুত থাকুন জরুরি ক্ষণে মানুষের পাশে দাঁড়ানোর জন্য।'
            : 'Join our voluntary donor registry today and answer the call when every second counts.'}
        </p>
        <button
          onClick={() => {
            setAuthModalTab('register');
            setAuthModalOpen(true);
          }}
          className="rounded-full bg-white px-6 py-3 text-xs font-black text-rose-700 hover:bg-rose-50 transition-colors shadow-md active:scale-95"
        >
          {language === 'bn' ? 'রক্তদাতা হিসেবে নিবন্ধন করুন' : 'Join as a Donor'}
        </button>
      </div>
    </div>
  );
};
