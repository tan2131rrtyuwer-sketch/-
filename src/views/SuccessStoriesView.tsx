import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Quote, Calendar, Award, Droplet } from 'lucide-react';
import { toBengaliNumber } from '../utils/translations';

export const SuccessStoriesView: React.FC = () => {
  const { stories, language, setAuthModalOpen, setAuthModalTab } = useApp();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 dark:bg-rose-950 px-3 py-1 text-xs font-bold text-rose-700 dark:text-rose-300">
          <Heart className="h-3.5 w-3.5 fill-rose-500" />
          <span>{language === 'bn' ? 'মানবতার বিজয়গাথা' : 'Lives Saved'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
          {language === 'bn' ? 'রক্তবন্ধুদের রক্তে বাঁচা প্রাণের গল্প' : 'Inspiring Stories of Lives Saved'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          {language === 'bn'
            ? 'প্রতিটি রক্তদানের পেছনে রয়েছে এক একটি বেঁচে যাওয়ার গল্প, ভালোবাসার গল্প।'
            : 'Real heartfelt accounts of volunteers who answered urgent calls and saved lives in critical hours.'}
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stories.map(story => (
          <div
            key={story.id}
            className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 hover:border-rose-300 dark:hover:border-rose-900 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-extrabold text-sm">
                  {story.bloodGroup}
                </span>
                <span className="text-[11px] text-neutral-400">{story.date}</span>
              </div>

              <Quote className="h-6 w-6 text-rose-400 mb-2 opacity-60" />
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                "{story.storyText}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">{language === 'bn' ? 'রোগী:' : 'Patient:'}</span>
                <strong className="text-neutral-900 dark:text-white">{story.patientName}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">{language === 'bn' ? 'স্বেচ্ছাসেবী রক্তদাতা:' : 'Donor:'}</span>
                <strong className="text-rose-600 dark:text-rose-400">{story.donorName}</strong>
              </div>
              <p className="text-[11px] text-neutral-400 text-right">{story.hospital}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Motivational Call to Action banner */}
      <div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-600 to-red-600 p-8 text-white text-center shadow-lg">
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
          className="rounded-xl bg-white px-6 py-3 text-xs font-bold text-rose-700 hover:bg-neutral-100 transition-colors shadow"
        >
          {language === 'bn' ? 'রক্তদাতা হিসেবে নিবন্ধন করুন' : 'Join as a Donor'}
        </button>
      </div>
    </div>
  );
};
