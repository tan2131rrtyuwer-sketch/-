import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup, UrgencyLevel } from '../types';
import { BANGLADESH_DIVISIONS } from '../data/bangladeshLocations';
import { X, AlertTriangle, Building, Phone, Droplet, User, MapPin } from 'lucide-react';

export const PostRequestModal: React.FC = () => {
  const {
    postRequestModalOpen,
    setPostRequestModalOpen,
    postBloodRequest,
    currentUser,
    language,
    setActiveTab,
  } = useApp();

  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('A+');
  const [bagsNeeded, setBagsNeeded] = useState(1);
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [division, setDivision] = useState('ঢাকা');
  const [district, setDistrict] = useState('ঢাকা');
  const [upazila, setUpazila] = useState('শাহবাগ');
  const [urgency, setUrgency] = useState<UrgencyLevel>('critical_today');
  const [contactPhone, setContactPhone] = useState(currentUser ? currentUser.phone : '');
  const [altPhone, setAltPhone] = useState('');
  const [reason, setReason] = useState('');
  const [postedByName, setPostedByName] = useState(currentUser ? currentUser.name : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!postRequestModalOpen) return null;

  const currentDivisionData = BANGLADESH_DIVISIONS.find(d => d.division === division) || BANGLADESH_DIVISIONS[0];
  const currentDistrictData = currentDivisionData.districts.find(d => d.name === district) || currentDivisionData.districts[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !hospitalName || !contactPhone) {
      alert(language === 'bn' ? 'রোগীর নাম, হাসপাতাল এবং ফোন নম্বর দিন' : 'Please fill patient name, hospital, and phone');
      return;
    }

    setIsSubmitting(true);
    postBloodRequest({
      patientName,
      bloodGroup,
      bagsNeeded: Number(bagsNeeded) || 1,
      hospitalName,
      hospitalAddress: hospitalAddress || `${hospitalName}, ${district}`,
      district,
      upazila,
      urgency,
      contactPhone,
      altPhone,
      reason: reason || (language === 'bn' ? 'জরুরি রক্তের প্রয়োজন।' : 'Urgent blood needed.'),
      postedByName: postedByName || (language === 'bn' ? 'স্বজন' : 'Relative'),
    });

    setIsSubmitting(false);
    setPostRequestModalOpen(false);
    setActiveTab('requests');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900 dark:border dark:border-neutral-800 transition-all">
        <button
          onClick={() => setPostRequestModalOpen(false)}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {language === 'bn' ? 'জরুরি রক্তের অনুরোধ প্রকাশ করুন' : 'Post Urgent Blood Request'}
            </h3>
            <p className="text-xs text-neutral-500">
              {language === 'bn'
                ? 'অনুরোধটি তাৎক্ষণিকভাবে কাছাকাছি ম্যাচিং ডোনারদের দৃষ্টিগোচর হবে।'
                : 'Will instantly alert matching voluntary donors.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 max-h-[80vh] overflow-y-auto pr-1">
          {/* Blood Group & Bags Needed */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'bn' ? 'প্রয়োজনীয় রক্তের গ্রুপ' : 'Required Blood Group'} *
              </label>
              <select
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-bold text-rose-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-rose-400"
              >
                {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map(bg => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'bn' ? 'কত ব্যাগ লাগবে?' : 'Bags Needed'} *
              </label>
              <input
                type="number"
                min={1}
                max={10}
                required
                value={bagsNeeded}
                onChange={e => setBagsNeeded(Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {language === 'bn' ? 'জরুরিতার মাত্রা' : 'Urgency Level'} *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUrgency('critical_today')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                  urgency === 'critical_today'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                🚨 {language === 'bn' ? 'আজই জরুরি' : 'Critical (Today)'}
              </button>
              <button
                type="button"
                onClick={() => setUrgency('within_24h')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                  urgency === 'within_24h'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                ⏱️ {language === 'bn' ? '২৪ ঘণ্টার মধ্যে' : 'Within 24h'}
              </button>
              <button
                type="button"
                onClick={() => setUrgency('normal')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                  urgency === 'normal'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                🗓️ {language === 'bn' ? 'পরিকল্পিত' : 'Scheduled'}
              </button>
            </div>
          </div>

          {/* Patient name & Posted by */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'bn' ? 'রোগীর নাম' : 'Patient Name'} *
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: সালমা বেগম"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'bn' ? 'যোগাযোগকারীর নাম' : 'Your Name'}
              </label>
              <input
                type="text"
                placeholder="যেমন: রফিক (ভাই)"
                value={postedByName}
                onChange={e => setPostedByName(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
          </div>

          {/* Hospital & Address */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {language === 'bn' ? 'হাসপাতালের নাম' : 'Hospital Name'} *
            </label>
            <input
              type="text"
              required
              placeholder="যেমন: ঢাকা মেডিকেল কলেজ হাসপাতাল"
              value={hospitalName}
              onChange={e => setHospitalName(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          {/* Division & District */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'bn' ? 'বিভাগ' : 'Division'}
              </label>
              <select
                value={division}
                onChange={e => {
                  const div = e.target.value;
                  setDivision(div);
                  const match = BANGLADESH_DIVISIONS.find(d => d.division === div);
                  if (match && match.districts.length > 0) {
                    setDistrict(match.districts[0].name);
                    setUpazila(match.districts[0].upazilas[0] || '');
                  }
                }}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                {BANGLADESH_DIVISIONS.map(d => (
                  <option key={d.division} value={d.division}>
                    {d.division}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'bn' ? 'জেলা' : 'District'}
              </label>
              <select
                value={district}
                onChange={e => {
                  const dist = e.target.value;
                  setDistrict(dist);
                  const matchDist = currentDivisionData.districts.find(d => d.name === dist);
                  if (matchDist && matchDist.upazilas.length > 0) {
                    setUpazila(matchDist.upazilas[0]);
                  }
                }}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                {currentDivisionData.districts.map(d => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {language === 'bn' ? 'ওয়ার্ড / কেবিন ও বিস্তারিত অবস্থান' : 'Ward / Cabin / Exact Location'}
            </label>
            <input
              type="text"
              placeholder="যেমন: ৩য় তলা, আইসিইউ বেড নং ৪"
              value={hospitalAddress}
              onChange={e => setHospitalAddress(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          {/* Contact Numbers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'bn' ? 'যোগাযোগ নম্বর' : 'Primary Phone'} *
              </label>
              <input
                type="tel"
                required
                placeholder="017XXXXXXXX"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'bn' ? 'বিকল্প নম্বর (যদি থাকে)' : 'Alternative Phone'}
              </label>
              <input
                type="tel"
                placeholder="018XXXXXXXX"
                value={altPhone}
                onChange={e => setAltPhone(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
          </div>

          {/* Reason / Details */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {language === 'bn' ? 'রক্তের প্রয়োজন ও অতিরিক্ত তথ্য' : 'Medical Details / Notes'}
            </label>
            <textarea
              rows={2}
              placeholder="যেমন: সিজারিয়ান অপারেশনের জন্য আজ বিকেলে রক্ত প্রয়োজন..."
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-rose-600 py-3 text-sm font-bold text-white hover:bg-rose-700 active:scale-98 transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2"
            >
              <Droplet className="h-4 w-4 fill-white" />
              <span>{language === 'bn' ? 'অনুরোধটি পোস্ট করুন' : 'Broadcast Blood Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
