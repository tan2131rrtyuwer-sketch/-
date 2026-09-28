import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup } from '../types';
import { ALL_DISTRICTS } from '../data/bangladeshLocations';
import { toBengaliNumber } from '../utils/translations';
import {
  AlertTriangle,
  PlusCircle,
  Phone,
  Share2,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  Filter,
  Check,
  Search,
} from 'lucide-react';

export const EmergencyRequestsView: React.FC = () => {
  const {
    requests,
    markRequestFulfilled,
    language,
    setPostRequestModalOpen,
    currentUser,
  } = useApp();

  const [filterGroup, setFilterGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [filterDistrict, setFilterDistrict] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'fulfilled'>('open');

  const bloodGroups: (BloodGroup | 'ALL')[] = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredRequests = requests.filter(req => {
    if (filterGroup !== 'ALL' && req.bloodGroup !== filterGroup) return false;
    if (filterDistrict && req.district !== filterDistrict) return false;
    if (filterStatus !== 'all' && req.status !== filterStatus) return false;
    return true;
  });

  const handleWhatsAppShare = (req: any) => {
    const text = `🚨 *জরুরি রক্তের অনুরোধ* 🚨\n\n🩸 রক্তের গ্রুপ: *${req.bloodGroup}* (${req.bagsNeeded} ব্যাগ)\n👤 রোগীর নাম: ${req.patientName}\n🏥 হাসপাতাল: ${req.hospitalName}\n📍 এলাকা: ${req.hospitalAddress}, ${req.district}\n⏱️ জরুরিতা: ${req.urgency === 'critical_today' ? 'আজই জরুরি' : 'জরুরি'}\n📞 সরাসরি কল: ${req.contactPhone} ${req.altPhone ? `(${req.altPhone})` : ''}\n\n📝 বিস্তারিত: ${req.reason}\n\n_প্ল্যাটফর্ম: রক্তবন্ধু (RoktoBondhu)_`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4" />
            <span>{language === 'bn' ? 'জরুরি রক্তের নোটিশ বোর্ড' : 'Emergency Blood Board'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
            {language === 'bn' ? 'রক্তের লাইভ আবেদনসমূহ' : 'Live Blood Requests'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {language === 'bn'
              ? 'মুহূর্তের নোটিশে রক্ত দিয়ে সংকটাপন্ন রোগীর জীবন বাঁচাতে সাহায্য করুন।'
              : 'Directly connect with families and patients in immediate need of blood transfusions.'}
          </p>
        </div>

        <button
          onClick={() => setPostRequestModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-600/30 hover:bg-rose-700 active:scale-95 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{language === 'bn' ? 'নতুন রক্তের অনুরোধ করুন' : 'Post Blood Request'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-3">
        {/* Blood Group Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mr-2">
            {language === 'bn' ? 'গ্রুপ:' : 'Group:'}
          </span>
          {bloodGroups.map(bg => (
            <button
              key={bg}
              onClick={() => setFilterGroup(bg)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                filterGroup === bg
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
            >
              {bg === 'ALL' ? (language === 'bn' ? 'সব' : 'All') : bg}
            </button>
          ))}
        </div>

        {/* District and Status */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <div className="w-full sm:w-64">
            <select
              value={filterDistrict}
              onChange={e => setFilterDistrict(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-xs focus:border-rose-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="">{language === 'bn' ? 'সকল জেলা' : 'All Districts'}</option>
              {ALL_DISTRICTS.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => setFilterStatus('open')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
                filterStatus === 'open'
                  ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white'
                  : 'text-neutral-500'
              }`}
            >
              {language === 'bn' ? '🔴 চলমান (রক্ত প্রয়োজন)' : 'Open Needs'}
            </button>
            <button
              onClick={() => setFilterStatus('fulfilled')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
                filterStatus === 'fulfilled'
                  ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white'
                  : 'text-neutral-500'
              }`}
            >
              {language === 'bn' ? '🟢 সম্পন্ন' : 'Fulfilled'}
            </button>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
                filterStatus === 'all'
                  ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white'
                  : 'text-neutral-500'
              }`}
            >
              {language === 'bn' ? 'সব' : 'All'}
            </button>
          </div>

          <span className="text-xs text-neutral-500 ml-auto">
            {language === 'bn' ? `মোট: ${toBengaliNumber(filteredRequests.length)}টি অনুরোধ` : `Total: ${filteredRequests.length} requests`}
          </span>
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center dark:border-neutral-800">
          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            {language === 'bn' ? 'এই মুহূর্তে কোনো রক্তের অনুরোধ নেই।' : 'No matching blood requests found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRequests.map(req => {
            const isCritical = req.urgency === 'critical_today';
            const isFulfilled = req.status === 'fulfilled';

            return (
              <div
                key={req.id}
                className={`relative rounded-2xl border p-5 shadow-sm transition-all flex flex-col justify-between ${
                  isFulfilled
                    ? 'border-neutral-200 bg-neutral-50/70 dark:border-neutral-800 dark:bg-neutral-900/40 opacity-75'
                    : isCritical
                    ? 'border-rose-300 bg-white dark:border-rose-900 dark:bg-neutral-900 shadow-rose-900/5'
                    : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'
                }`}
              >
                <div>
                  {/* Top: Blood badge + Patient name + Urgency */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-black text-xl shadow-md ${
                        isFulfilled
                          ? 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                          : 'bg-rose-600 text-white shadow-rose-600/30'
                      }`}>
                        {req.bloodGroup}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                          {req.patientName}
                        </h3>
                        <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                          <Building className="h-3.5 w-3.5 text-neutral-400" />
                          <span>{req.hospitalName}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {isFulfilled ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <Check className="h-3 w-3" />
                          <span>{language === 'bn' ? 'রক্তদাতা প্রাপ্ত' : 'Fulfilled'}</span>
                        </span>
                      ) : isCritical ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse">
                          🚨 {language === 'bn' ? 'আজই জরুরি' : 'Critical (Today)'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          ⏱️ {language === 'bn' ? 'জরুরি' : 'Urgent'}
                        </span>
                      )}
                      <p className="text-[11px] text-neutral-400 mt-1">
                        {language === 'bn' ? 'প্রয়োজন: ' : 'Needed: '}
                        <strong className="text-rose-600 dark:text-rose-400">{language === 'bn' ? toBengaliNumber(req.bagsNeeded) : req.bagsNeeded} ব্যাগ</strong>
                      </p>
                    </div>
                  </div>

                  {/* Location & Details */}
                  <div className="mt-4 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                      <span>{req.hospitalAddress}, {req.district}</span>
                    </p>

                    <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/60 p-3 border border-neutral-100 dark:border-neutral-800 mt-2">
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                        "{req.reason}"
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        {language === 'bn' ? 'পোস্ট করেছেন: ' : 'Posted by: '}
                        <strong>{req.postedByName}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <a
                      href={`tel:${req.contactPhone}`}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-sm"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{language === 'bn' ? 'কল করুন: ' + req.contactPhone : 'Call: ' + req.contactPhone}</span>
                    </a>

                    <button
                      onClick={() => handleWhatsAppShare(req)}
                      className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                      title="Share to WhatsApp groups"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>

                  {!isFulfilled && (
                    <button
                      onClick={() => markRequestFulfilled(req.id)}
                      className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-2 text-xs font-bold hover:bg-emerald-100 transition-colors whitespace-nowrap"
                    >
                      {language === 'bn' ? '✓ রক্তদাতা পেয়ে গেছি' : 'Mark Fulfilled'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
