import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Award, Printer, Heart, Droplet, ShieldCheck } from 'lucide-react';
import { toBengaliNumber } from '../utils/translations';

export const DonorCertificateModal: React.FC = () => {
  const { certificateModalDonor, setCertificateModalDonor, language } = useApp();

  if (!certificateModalDonor) return null;

  const donor = certificateModalDonor;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-neutral-900 dark:border dark:border-neutral-800 transition-all">
        <button
          onClick={() => setCertificateModalDonor(null)}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 transition-colors print:hidden"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Certificate Frame */}
        <div className="relative border-4 border-double border-rose-600/40 p-6 sm:p-8 rounded-xl bg-gradient-to-b from-rose-50/30 to-amber-50/20 dark:from-neutral-900 dark:to-neutral-900 text-center">
          {/* Header watermark crest */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/30 mb-4">
            <Award className="h-8 w-8" />
          </div>

          <span className="text-xs font-bold tracking-widest text-rose-600 dark:text-rose-400 uppercase">
            {language === 'bn' ? 'রক্তবন্ধু জাতীয় মানবতা স্বীকৃতি' : 'RoktoBondhu Humanitarian Recognition'}
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 mb-2 tracking-tight">
            {language === 'bn' ? 'স্বেচ্ছাসেবী রক্তদাতা সম্মাননা সনদ' : 'Certificate of Voluntary Blood Donation'}
          </h2>

          <p className="text-xs text-neutral-500 max-w-md mx-auto mb-6">
            {language === 'bn'
              ? 'নিঃস্বার্থভাবে জীবন রক্ষাকারী রক্তদান করে মানবতার কল্যাণে অসামান্য অবদান রাখার স্বীকৃতিস্বরূপ'
              : 'In grateful recognition of humanitarian service and selfless commitment to saving lives through voluntary blood donation.'}
          </p>

          {/* Recipient Name */}
          <div className="border-b-2 border-neutral-300 dark:border-neutral-700 pb-2 mb-4 max-w-md mx-auto">
            <p className="text-xl sm:text-2xl font-bold text-rose-700 dark:text-rose-400">
              {donor.name}
            </p>
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-6 max-w-lg mx-auto leading-relaxed">
            {language === 'bn'
              ? `রক্তের গ্রুপ: ${donor.bloodGroup} | মোট রক্তদান: ${toBengaliNumber(donor.totalDonations)} বার | অবস্থান: ${donor.district}, বাংলাদেশ। আপনি সমাজের এক অবিসংবাদিত বীর।`
              : `Blood Group: ${donor.bloodGroup} | Total Donations: ${donor.totalDonations} times | Location: ${donor.district}, Bangladesh. A true community hero.`}
          </p>

          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
            <div>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                {new Date().toLocaleDateString('bn-BD')}
              </p>
              <p>{language === 'bn' ? 'ইস্যুর তারিখ' : 'Issue Date'}</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-rose-600 font-semibold">
                <ShieldCheck className="h-4 w-4" />
                <span>{language === 'bn' ? 'যাচাইকৃত রক্তবন্ধু সনদ' : 'Verified RoktoBondhu Seal'}</span>
              </div>
              <p>{language === 'bn' ? 'আইডি: ' + donor.id : 'ID: ' + donor.id}</p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-5 flex justify-end gap-3 print:hidden">
          <button
            onClick={() => setCertificateModalDonor(null)}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm"
          >
            <Printer className="h-4 w-4" />
            <span>{language === 'bn' ? 'সনদ প্রিন্ট / সেভ করুন' : 'Print / Save PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
