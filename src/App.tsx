import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { PostRequestModal } from './components/PostRequestModal';
import { DonorCertificateModal } from './components/DonorCertificateModal';
import { ReportDonorModal } from './components/ReportDonorModal';
import { ToastNotification } from './components/ToastNotification';
import { HomeView } from './views/HomeView';
import { SearchDonorsView } from './views/SearchDonorsView';
import { EmergencyRequestsView } from './views/EmergencyRequestsView';
import { DashboardView } from './views/DashboardView';
import { HospitalDirectoryView } from './views/HospitalDirectoryView';
import { SuccessStoriesView } from './views/SuccessStoriesView';
import { AdminView } from './views/AdminView';
import { ChatView } from './views/ChatView';

const MainContent: React.FC = () => {
  const { activeTab, darkMode } = useApp();

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      <Navbar />

      <main className="flex-1 pb-20 md:pb-6">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'search' && <SearchDonorsView />}
        {activeTab === 'requests' && <EmergencyRequestsView />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'hospitals' && <HospitalDirectoryView />}
        {activeTab === 'stories' && <SuccessStoriesView />}
        {activeTab === 'admin' && <AdminView />}
      </main>

      <Footer />

      {/* Global Toast */}
      <ToastNotification />

      {/* Global Modals */}
      <AuthModal />
      <PostRequestModal />
      <DonorCertificateModal />
      <ReportDonorModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
