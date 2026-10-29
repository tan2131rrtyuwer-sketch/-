import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, XCircle, RefreshCw, Heart, Sparkles, ArrowRight } from 'lucide-react';

interface Question {
  id: number;
  textBn: string;
  textEn: string;
  subBn: string;
  subEn: string;
  expectedYes: boolean; // true = "Yes" is eligible, false = "No" is eligible
  tipBn: string;
  tipEn: string;
}

export const EligibilityQuizCard: React.FC = () => {
  const { language, setAuthModalOpen, setAuthModalTab } = useApp();

  const questions: Question[] = [
    {
      id: 1,
      textBn: 'আপনার বয়স কি ১৮ থেকে ৬৫ বছরের মধ্যে?',
      textEn: 'Is your age between 18 and 65 years?',
      subBn: 'রক্তদানের জন্য প্রাপ্তবয়স্ক ও শারীরিকভাবে সক্ষম হওয়া জরুরি।',
      subEn: 'Adult age is required for safe blood donation.',
      expectedYes: true,
      tipBn: '১৮ বছরের কম বা ৬৫ বছরের বেশি হলে রক্তদান চিকিৎসাগতভাবে নিরুৎসাহিত।',
      tipEn: 'Donation is only recommended between 18 and 65 years.',
    },
    {
      id: 2,
      textBn: 'আপনার ওজন কি ৫০ কেজি বা তার বেশি?',
      textEn: 'Is your body weight at least 50 kg (45 kg for females)?',
      subBn: 'মহিলাদের ক্ষেত্রে ন্যূনতম ওজন ৪৫ কেজি।',
      subEn: 'Minimum 45 kg required for females.',
      expectedYes: true,
      tipBn: 'নিরাপদ রক্ত পরিমাণের জন্য সর্বনিম্ন ওজন ৫০ কেজি বজায় রাখা উচিত।',
      tipEn: 'Adequate body weight ensures no weakness after blood donation.',
    },
    {
      id: 3,
      textBn: 'গত ৯০ দিনে (৩ মাসে) কি আপনি রক্ত দিয়েছেন?',
      textEn: 'Have you donated blood in the last 90 days?',
      subBn: 'দেহকোষ ও আয়রন পূরণের জন্য ৩ মাস বিরতি আবশ্যক।',
      subEn: 'A 90-day recovery interval protects your red cell count.',
      expectedYes: false, // "NO" is required to be eligible right now
      tipBn: 'সর্বশেষ রক্তদানের পর ৩ মাস পূর্ণ হলে তবেই পুনরায় রক্ত দেওয়া যায়।',
      tipEn: 'You must wait 90 days after your last donation.',
    },
    {
      id: 4,
      textBn: 'আজ আপনি কি শারীরিকভাবে সুস্থ এবং কোনো অ্যান্টিবায়োটিক সেবন করছেন না?',
      textEn: 'Are you feeling healthy today with no active fever or antibiotic intake?',
      subBn: 'জ্বর, ঠান্ডা বা অ্যান্টিবায়োটিক কোর্স চলাকালীন রক্তদান নিষেধ।',
      subEn: 'Donation requires being symptom-free with good vitality.',
      expectedYes: true,
      tipBn: 'অ্যান্টিবায়োটিক শেষ হওয়ার পর অন্তত ৭ দিন সুস্থ থাকার পর রক্তদান করবেন।',
      tipEn: 'Wait at least 7 days after completing antibiotics.',
    },
  ];

  const [answers, setAnswers] = useState<Record<number, boolean | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const handleAnswer = (qId: number, val: boolean) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleReset = () => {
    setAnswers({ 1: null, 2: null, 3: null, 4: null });
  };

  const answeredCount = Object.values(answers).filter(v => v !== null).length;
  const isComplete = answeredCount === questions.length;

  // Evaluate eligibility
  const isEligible =
    isComplete &&
    questions.every(q => answers[q.id] === q.expectedYes);

  return (
    <div className="rounded-3xl border border-rose-200/80 bg-gradient-to-br from-white via-rose-50/30 to-white dark:border-neutral-800 dark:from-[#242526] dark:via-[#1e2021] dark:to-[#242526] p-5 sm:p-7 shadow-lg shadow-rose-950/5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 dark:border-neutral-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            <Sparkles className="h-4 w-4 text-rose-600" />
            <span>{language === 'bn' ? 'স্বেচ্ছায় রক্তদান যোগ্যতা পরীক্ষা' : 'Donor Eligibility Self-Check'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1">
            {language === 'bn' ? 'আমি কি আজ রক্ত দিতে পারব? (২ মিনিটের কুইজ)' : 'Am I Eligible to Donate Blood Today?'}
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            {language === 'bn'
              ? 'খুব সাধারণ ৪টি প্রশ্নের উত্তর দিয়ে নিজেই জেনে নিন আপনি রক্তদানের উপযুক্ত কি না।'
              : 'Answer 4 quick yes/no questions to check your medical eligibility instantly.'}
          </p>
        </div>

        {answeredCount > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 self-start sm:self-center transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
          </button>
        )}
      </div>

      {/* Questions List */}
      <div className="mt-5 space-y-3.5">
        {questions.map((q, idx) => {
          const currentAns = answers[q.id];
          const hasAnswered = currentAns !== null;
          const isCorrect = hasAnswered && currentAns === q.expectedYes;

          return (
            <div
              key={q.id}
              className={`rounded-2xl p-4 transition-all border ${
                hasAnswered
                  ? isCorrect
                    ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/60'
                    : 'bg-amber-50/60 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/60'
                  : 'bg-white dark:bg-neutral-800/50 border-neutral-200/80 dark:border-neutral-700/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-extrabold text-xs">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {language === 'bn' ? q.textBn : q.textEn}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {language === 'bn' ? q.subBn : q.subEn}
                    </p>
                  </div>
                </div>

                {/* Yes / No Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleAnswer(q.id, true)}
                    className={`min-h-[40px] px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentAns === true
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                    }`}
                  >
                    {language === 'bn' ? 'হ্যাঁ (Yes)' : 'Yes'}
                  </button>
                  <button
                    onClick={() => handleAnswer(q.id, false)}
                    className={`min-h-[40px] px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentAns === false
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                    }`}
                  >
                    {language === 'bn' ? 'না (No)' : 'No'}
                  </button>
                </div>
              </div>

              {/* Specific feedback if answered */}
              {hasAnswered && !isCorrect && (
                <div className="mt-2.5 pt-2 border-t border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>{language === 'bn' ? q.tipBn : q.tipEn}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Result Card when complete */}
      {isComplete && (
        <div className="mt-6 rounded-2xl p-5 transition-all border animate-in fade-in">
          {isEligible ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-black text-emerald-900 dark:text-emerald-100">
                    {language === 'bn'
                      ? '🎉 অভিনন্দন! আপনি আজই রক্তদানের জন্য সম্পূর্ণ উপযুক্ত!'
                      : '🎉 Congratulations! You are eligible to donate blood today!'}
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                    {language === 'bn'
                      ? 'আপনার রক্ত এক বা একাধিক মুমূর্ষু রোগীর জীবন বাঁচাতে পারে। রক্তবন্ধু প্ল্যাটফর্মে নিবন্ধন করে আজই মানবিক যোদ্ধা হিসেবে পাশে দাঁড়ান।'
                      : 'Your voluntary donation can save up to 3 lives. Register now to be available for emergency calls in your district.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setAuthModalTab('register');
                  setAuthModalOpen(true);
                }}
                className="shrink-0 flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm px-5 py-3 shadow-md transition-all active:scale-95"
              >
                <span>{language === 'bn' ? 'রক্তদাতা হিসেবে নিবন্ধন করুন' : 'Register as Donor'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Heart className="h-8 w-8 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-black text-amber-900 dark:text-amber-100">
                    {language === 'bn'
                      ? 'আপাতত আপনি রক্তদানের উপযুক্ত নন, তবে হতাশ হবেন না!'
                      : 'You are currently not eligible, but you can still help!'}
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                    {language === 'bn'
                      ? 'শরীরের বিশ্রাম ও সুস্থতা সবার আগে। প্রয়োজনীয় বিরতি শেষে বা সুস্থ হলে আপনি পুনরায় রক্ত দিতে পারবেন। এছাড়া রক্তবন্ধুর আবেদনগুলো বন্ধুদের সাথে শেয়ার করেও রোগী বাঁচাতে ভূমিকা রাখতে পারেন।'
                      : 'Health and recovery always come first. You can still save lives by sharing urgent requests on Facebook and WhatsApp.'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="shrink-0 flex items-center justify-center gap-1.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs px-4 py-2.5 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>{language === 'bn' ? 'আবার শুরু করুন' : 'Try Again'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
