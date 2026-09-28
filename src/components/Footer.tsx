import React from 'react';
import { useApp } from '../context/AppContext';
import { Droplet, PhoneCall, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setActiveTab } = useApp();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-900 text-neutral-300 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white">
                <Droplet className="h-5 w-5 fill-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {language === 'bn' ? 'রক্তবন্ধু' : 'RoktoBondhu'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {language === 'bn'
                ? 'একটি অলাভজনক সামাজিক উদ্যোগ। জরুরি সময়ে রক্তের সংকট মেটাতে এবং স্বেচ্ছায় রক্তদানে মানুষকে উৎসাহিত করতে আমরা প্রতিশ্রুতিবদ্ধ।'
                : 'A humanitarian voluntary blood donation initiative in Bangladesh connecting life-saving donors with urgent patients.'}
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-rose-400">
              <PhoneCall className="h-4 w-4" />
              <span className="font-semibold">হটলাইন: 01712-475286 (২৪/৭)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              {language === 'bn' ? 'দ্রুত নেভিগেশন' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('search');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  {language === 'bn' ? 'রক্তদাতা খুঁজুন' : 'Find Blood Donors'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('requests');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  {language === 'bn' ? 'জরুরি রক্তের অনুরোধ' : 'Urgent Blood Requests'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('hospitals');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  {language === 'bn' ? 'হাসপাতাল ও ব্লাড ব্যাংক' : 'Hospital & Blood Bank Directory'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('stories');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  {language === 'bn' ? 'সফলতার গল্প' : 'Inspiring Stories'}
                </button>
              </li>
            </ul>
          </div>

          {/* Blood Groups */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              {language === 'bn' ? 'সব রক্তের গ্রুপ' : 'Blood Groups'}
            </h4>
            <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-bold">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <div
                  key={bg}
                  className="rounded bg-neutral-800 py-1 text-rose-400 border border-neutral-700/50"
                >
                  {bg}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-neutral-500">
              {language === 'bn'
                ? 'স্বেচ্ছায় রক্তদান সম্পূর্ণ নিরাপদ ও রোগমুক্তির সহায়ক।'
                : 'Safe voluntary donation saves precious lives every single day.'}
            </p>
          </div>

          {/* Safety & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              {language === 'bn' ? 'নিরাপত্তা ও নিয়মাবলি' : 'Safety & Ethics'}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {language === 'bn'
                ? 'রক্তবন্ধু সম্পূর্ণ বিনামূল্যে পরিচালিত। রক্ত কেনাবেচা আইনত দণ্ডনীয় অপরাধ। ভুয়া বা আর্থিক লেনদেনের অভিযোগ পেলে রিপোর্ট করুন।'
                : 'Blood buying and selling is illegal. This directory is strictly voluntary. Please report any fraudulent activity.'}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>{language === 'bn' ? '১০০% পরীক্ষিত ও সুরক্ষিত' : '100% Free & Verified Community'}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} রক্তবন্ধু (RoktoBondhu). {language === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-1 text-neutral-400">
            <span>{language === 'bn' ? 'মানবতার সেবায় নিবেদিত' : 'Dedicated to Humanity'}</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
