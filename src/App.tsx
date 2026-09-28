import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { PostRequestModal } from './components/PostRequestModal';
import { DonorCertificateModal } from './components/DonorCertificateModal';
import { ReportDonorModal } from './components/ReportDonorModal';
import { HomeView } from './views/HomeView';
import { SearchDonorsView } from './views/SearchDonorsView';
import { EmergencyRequestsView } from './views/EmergencyRequestsView';
import { DashboardView } from './views/DashboardView';
import { HospitalDirectoryView } from './views/HospitalDirectoryView';
import { SuccessStoriesView } from './views/SuccessStoriesView';
import { AdminView } from './views/AdminView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'search' && <SearchDonorsView />}
        {activeTab === 'requests' && <EmergencyRequestsView />}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'hospitals' && <HospitalDirectoryView />}
        {activeTab === 'stories' && <SuccessStoriesView />}
        {activeTab === 'admin' && <AdminView />}
      </main>

      <Footer />

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
