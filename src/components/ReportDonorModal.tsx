import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldAlert, Flag } from 'lucide-react';

export const ReportDonorModal: React.FC = () => {
  const { reportModalDonor, setReportModalDonor, reportDonor, language } = useApp();

  const [reason, setReason] = useState('নম্বর বন্ধ বা ভুল তথ্য');
  const [details, setDetails] = useState('');
  const [myPhone, setMyPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!reportModalDonor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportDonor({
      donorId: reportModalDonor.id,
      donorName: reportModalDonor.name,
      reportedByPhone: myPhone || 'গোপনীয়',
      reason,
      details: details || 'ব্যবহারকারী এই প্রোফাইলের সত্যতা নিয়ে অভিযোগ জানিয়েছেন।',
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReportModalDonor(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900 dark:border dark:border-neutral-800">
        <button
          onClick={() => setReportModalDonor(null)}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              {language === 'bn' ? 'প্রোফাইল রিপোর্ট করুন' : 'Report Profile'}
            </h3>
            <p className="text-xs text-neutral-500">
              {reportModalDonor.name} ({reportModalDonor.bloodGroup})
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="rounded-xl bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
              {language === 'bn'
                ? 'আপনার অভিযোগটি অ্যাডমিন পর্যালোচনার জন্য জমা নেওয়া হয়েছে।'
                : 'Report submitted for admin review.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'bn' ? 'রিপোর্টের কারণ' : 'Reason'}
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                <option value="নম্বর বন্ধ বা ভুল তথ্য">{language === 'bn' ? 'নম্বর বন্ধ বা ভুল তথ্য' : 'Inactive or wrong number'}</option>
                <option value="টাকা দাবি বা বাণিজ্যিক ব্যবহার">{language === 'bn' ? 'টাকা দাবি বা বাণিজ্যিক ব্যবহার' : 'Demanding money'}</option>
                <option value="অনুপযুক্ত আচরণ">{language === 'bn' ? 'অনুপযুক্ত আচরণ' : 'Inappropriate behavior'}</option>
                <option value="ভুয়া প্রোফাইল">{language === 'bn' ? 'ভুয়া প্রোফাইল' : 'Fake profile'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'bn' ? 'বিস্তারিত বিবরণ' : 'Details'}
              </label>
              <textarea
                rows={3}
                required
                placeholder={language === 'bn' ? 'সংক্ষেপে ঘটনাটি লিখুন...' : 'Provide specific details...'}
                value={details}
                onChange={e => setDetails(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'bn' ? 'আপনার মোবাইল নম্বর (ঐচ্ছিক)' : 'Your Phone (Optional)'}
              </label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={myPhone}
                onChange={e => setMyPhone(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReportModalDonor(null)}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex items-center gap-1 rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
              >
                <Flag className="h-3.5 w-3.5" />
                <span>{language === 'bn' ? 'রিপোর্ট জমা দিন' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
