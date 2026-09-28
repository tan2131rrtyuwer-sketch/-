import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_DISTRICTS } from '../data/bangladeshLocations';
import hospitalBloodBankImg from '../assets/images/hospital_blood_bank_1790381916367.jpg';
import {
  Building2,
  PhoneCall,
  MapPin,
  Clock,
  Search,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const HospitalDirectoryView: React.FC = () => {
  const { hospitals, language } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [only24x7, setOnly24x7] = useState(false);

  const filteredHospitals = hospitals.filter(h => {
    if (selectedDistrict && h.district !== selectedDistrict) return false;
    if (only24x7 && !h.is24x7) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = h.name.toLowerCase().includes(q) || h.nameEn.toLowerCase().includes(q);
      const matchAddress = h.address.toLowerCase().includes(q);
      if (!matchName && !matchAddress) return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner with generated blood bank image */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 shadow-md">
        <div className="absolute inset-0">
          <img
            src={hospitalBloodBankImg}
            alt="Blood Bank Laboratory"
            className="w-full h-full object-cover opacity-35"
          />
        </div>
        <div className="relative p-6 sm:p-10 max-w-2xl text-white space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/80 backdrop-blur-xs text-xs font-bold uppercase tracking-wider text-white">
            <Building2 className="h-3.5 w-3.5" />
            <span>{language === 'bn' ? 'জাতীয় স্বাস্থ্য কেন্দ্র ডিরেক্টরি' : 'Hospital & Blood Bank Directory'}</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'bn' ? 'জরুরি ব্লাড ব্যাংক ও হাসপাতাল তালিকা' : 'Verified Blood Banks & Transfusion Centers'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {language === 'bn'
              ? 'সন্ধানী, রেড ক্রিসেন্ট, কোয়ান্টাম এবং সরকারি মেডিকেল কলেজগুলোর সার্বক্ষণিক জরুরি হটলাইন ও যোগাযোগ নম্বর।'
              : 'Direct 24/7 hotline numbers and verified contacts for Sandhani, Quantum, Red Crescent and major medical centers.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder={language === 'bn' ? 'ব্লাড ব্যাংক বা হাসপাতালের নাম লিখুন...' : 'Search blood banks...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 pl-9 pr-3 py-2 text-xs focus:border-rose-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="">{language === 'bn' ? 'সকল জেলা' : 'All Districts'}</option>
              {ALL_DISTRICTS.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              <input
                type="checkbox"
                checked={only24x7}
                onChange={e => setOnly24x7(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-rose-600 focus:ring-rose-500"
              />
              <span>{language === 'bn' ? 'শুধুমাত্র ২৪/৭ জরুরি সেবা' : '24/7 Service Only'}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHospitals.map(h => (
          <div
            key={h.id}
            className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 hover:border-rose-300 dark:hover:border-rose-900 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    {language === 'bn' ? h.name : h.nameEn}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 flex items-start gap-1">
                    <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{h.address}</span>
                  </p>
                </div>
                {h.is24x7 && (
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    ২৪/৭
                  </span>
                )}
              </div>

              {/* Services badges */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {h.services.map(s => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[11px] font-medium text-neutral-600 dark:text-neutral-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Hotlines */}
            <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
              <a
                href={`tel:${h.emergencyHotline}`}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-sm"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                <span>{language === 'bn' ? 'জরুরি হটলাইন: ' + h.emergencyHotline : 'Hotline: ' + h.emergencyHotline}</span>
              </a>

              {h.phone && (
                <p className="text-center text-[11px] text-neutral-400">
                  {language === 'bn' ? 'সাধারণ সংযোগ: ' : 'General line: '} {h.phone}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
