/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DocketPage } from './pages/DocketPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { FileCasePage } from './pages/FileCasePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { WalletProvider } from './lib/genlayer/WalletProvider';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2000,
        refetchOnWindowFocus: false,
      },
    },
  });
  return (

    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-[#0A0A0B] text-[#FAFAFA] flex flex-col font-sans selection:bg-[#3B6CFF] selection:text-[#FAFAFA]">
            {/* Sticky Top Navigation */}
            <Navbar />

            {/* Main Routed Page Content */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/docket" element={<DocketPage />} />
                <Route path="/docket/:id" element={<CaseDetailPage />} />
                <Route path="/file" element={<FileCasePage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/about" element={<AboutPage />} />
                {/* Fallback route back to home */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </WalletProvider>
    </QueryClientProvider>
  );
}
