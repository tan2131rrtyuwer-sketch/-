import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { toBengaliNumber } from '../utils/translations';
import {
  Shield,
  Users,
  AlertTriangle,
  Flag,
  CheckCircle,
  XCircle,
  Trash2,
  Lock,
  Unlock,
  Check,
  Building,
  Phone,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    donors,
    requests,
    reports,
    resolveReport,
    deleteRequest,
    markRequestFulfilled,
    language,
    logoutAdmin,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'requests' | 'reports'>('users');
  const [userSearch, setUserSearch] = useState('');

  const totalDonors = donors.length;
  const activeRequests = requests.filter(r => r.status === 'open').length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const blockedUsers = donors.filter(d => d.isBlocked).length;

  const filteredUsers = donors.filter(d => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.phone.includes(q) || d.district.toLowerCase().includes(q);
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
              {language === 'bn' ? 'রক্তবন্ধু অ্যাডমিন কন্ট্রোল প্যানেল' : 'RoktoBondhu Admin Panel'}
            </h1>
            <p className="text-xs text-neutral-500">
              {language === 'bn'
                ? 'সিস্টেম স্ট্যাটিসটিক্স, ইউজার মডারেশন ও ফেক প্রোফাইল রিপোর্ট হ্যান্ডলিং।'
                : 'Platform monitoring, urgent request moderation, and report resolution.'}
            </p>
          </div>
        </div>

        <button
          onClick={logoutAdmin}
          className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 self-start sm:self-auto"
        >
          {language === 'bn' ? 'অ্যাডমিন থেকে বের হন' : 'Exit Admin'}
        </button>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">{language === 'bn' ? 'মোট নিবন্ধিত রক্তদাতা' : 'Total Donors'}</span>
          <p className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-white tabular-nums">
            {language === 'bn' ? toBengaliNumber(totalDonors) : totalDonors}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">{language === 'bn' ? 'সক্রিয় রক্তের অনুরোধ' : 'Active Requests'}</span>
          <p className="mt-1 text-2xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
            {language === 'bn' ? toBengaliNumber(activeRequests) : activeRequests}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">{language === 'bn' ? 'অমীমাংসিত রিপোর্ট' : 'Pending Reports'}</span>
          <p className="mt-1 text-2xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
            {language === 'bn' ? toBengaliNumber(pendingReports) : pendingReports}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">{language === 'bn' ? 'স্থগিতকৃত অ্যাকাউন্ট' : 'Blocked Users'}</span>
          <p className="mt-1 text-2xl font-extrabold text-neutral-600 dark:text-neutral-400 tabular-nums">
            {language === 'bn' ? toBengaliNumber(blockedUsers) : blockedUsers}
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-4">
        <button
          onClick={() => setActiveAdminTab('users')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeAdminTab === 'users'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
          }`}
        >
          {language === 'bn' ? 'রক্তদাতা ইউজার ম্যানেজমেন্ট' : 'Manage Donors'} ({donors.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('requests')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeAdminTab === 'requests'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
          }`}
        >
          {language === 'bn' ? 'জরুরি পোস্ট মডারেশন' : 'Moderate Requests'} ({requests.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('reports')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeAdminTab === 'reports'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
          }`}
        >
          {language === 'bn' ? 'ফেক রিপোর্ট কিউ' : 'Fraud Reports'} ({reports.length})
        </button>
      </div>

      {/* TAB 1: USERS TABLE */}
      {activeAdminTab === 'users' && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              {language === 'bn' ? 'নিবন্ধিত রক্তদাতাদের তালিকা' : 'Registered Donor Registry'}
            </h3>
            <input
              type="text"
              placeholder={language === 'bn' ? 'নাম, মোবাইল বা জেলা দিয়ে খুঁজুন...' : 'Filter users...'}
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs w-64 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400">
                <tr>
                  <th className="px-3 py-2 font-semibold">নাম ও যোগাযোগ</th>
                  <th className="px-3 py-2 font-semibold">রক্তের গ্রুপ</th>
                  <th className="px-3 py-2 font-semibold">জেলা/এলাকা</th>
                  <th className="px-3 py-2 font-semibold">রক্তদান সংখ্যা</th>
                  <th className="px-3 py-2 font-semibold">স্ট্যাটাস</th>
                  <th className="px-3 py-2 font-semibold">রিপোর্ট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                    <td className="px-3 py-2.5">
                      <p className="font-bold text-neutral-900 dark:text-white">{u.name}</p>
                      <p className="text-[11px] text-neutral-500">{u.phone}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="font-bold text-rose-600 dark:text-rose-400">{u.bloodGroup}</span>
                    </td>
                    <td className="px-3 py-2.5 text-neutral-600 dark:text-neutral-300">
                      {u.upazila}, {u.district}
                    </td>
                    <td className="px-3 py-2.5 font-bold tabular-nums">
                      {language === 'bn' ? toBengaliNumber(u.totalDonations) : u.totalDonations} বার
                    </td>
                    <td className="px-3 py-2.5">
                      {u.isBlocked ? (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">
                          স্থগিত
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                          সক্রিয়
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      {u.reportCount > 0 ? (
                        <span className="text-rose-600 font-bold">{u.reportCount}টি</span>
                      ) : (
                        <span className="text-neutral-400">০</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: REQUESTS MODERATION */}
      {activeAdminTab === 'requests' && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            {language === 'bn' ? 'জরুরি রক্তের অনুরোধ মডারেশন' : 'Manage Blood Requests'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800/50">
                <tr>
                  <th className="px-3 py-2 font-semibold">রোগীর নাম</th>
                  <th className="px-3 py-2 font-semibold">গ্রুপ ও ব্যাগ</th>
                  <th className="px-3 py-2 font-semibold">হাসপাতাল ও জেলা</th>
                  <th className="px-3 py-2 font-semibold">যোগাযোগ</th>
                  <th className="px-3 py-2 font-semibold">স্ট্যাটাস</th>
                  <th className="px-3 py-2 font-semibold text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {requests.map(r => (
                  <tr key={r.id}>
                    <td className="px-3 py-2.5 font-bold text-neutral-900 dark:text-white">
                      {r.patientName}
                    </td>
                    <td className="px-3 py-2.5 font-bold text-rose-600">
                      {r.bloodGroup} ({r.bagsNeeded} ব্যাগ)
                    </td>
                    <td className="px-3 py-2.5 text-neutral-600 dark:text-neutral-300">
                      {r.hospitalName}, {r.district}
                    </td>
                    <td className="px-3 py-2.5">{r.contactPhone}</td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {r.status === 'fulfilled' ? 'সম্পন্ন' : 'সক্রিয়'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right space-x-2">
                      {r.status === 'open' && (
                        <button
                          onClick={() => markRequestFulfilled(r.id)}
                          className="px-2 py-1 text-[11px] rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        >
                          সম্পন্ন
                        </button>
                      )}
                      <button
                        onClick={() => deleteRequest(r.id)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REPORTS */}
      {activeAdminTab === 'reports' && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            {language === 'bn' ? 'ফেক প্রোফাইল ও রিপোর্ট নিষ্পত্তি' : 'Fraud Report Queue'}
          </h3>

          {reports.length === 0 ? (
            <p className="text-xs text-neutral-500 py-6 text-center">কোনো অমীমাংসিত রিপোর্ট নেই।</p>
          ) : (
            <div className="space-y-3">
              {reports.map(rep => (
                <div key={rep.id} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-neutral-900 dark:text-white">
                        অভিযুক্ত: {rep.donorName}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                        {rep.reason}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">"{rep.details}"</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">অভিযোগকারী: {rep.reportedByPhone}</p>
                  </div>

                  {rep.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => resolveReport(rep.id, 'dismiss')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        খারিজ করুন
                      </button>
                      <button
                        onClick={() => resolveReport(rep.id, 'block')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                      >
                        প্রোফাইল ব্লক করুন
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600">মীমাংসিত ({rep.status})</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
