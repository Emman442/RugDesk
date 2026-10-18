import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../lib/genlayer/wallet';
import { truncateCryptoAddress } from '../lib/utils/truncateCryptoAddress';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const {address: wallet, connectWallet, isConnected} = useWallet()



  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0B] border-b border-[#242428]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          className="text-base font-bold text-[#FAFAFA] tracking-tight whitespace-nowrap shrink-0 hover:text-[#FAFAFA] transition-colors"
        >
          Rug Desk
        </Link>

        {/* Zone 2: Navigation Links (Clean text, no pills, subtle hover) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
          <Link
            to="/docket"
            className={`whitespace-nowrap shrink-0 transition-colors ${
              isActive('/docket') ? 'text-[#FAFAFA]' : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
            }`}
          >
            Docket
          </Link>
          <Link
            to="/how-it-works"
            className={`whitespace-nowrap shrink-0 transition-colors ${
              isActive('/how-it-works') ? 'text-[#FAFAFA]' : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
            }`}
          >
            How it works
          </Link>
          <Link
            to="/file"
            className={`whitespace-nowrap shrink-0 transition-colors ${
              isActive('/file') ? 'text-[#FAFAFA]' : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
            }`}
          >
            File
          </Link>
          <Link
            to="/about"
            className={`whitespace-nowrap shrink-0 transition-colors ${
              isActive('/about') ? 'text-[#FAFAFA]' : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
            }`}
          >
            About
          </Link>
        </nav>

        {/* Zone 3: Wallet Connect Button (Flat, Outline style, rounded-full) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={connectWallet}
            className="px-3.5 py-1.5 text-xs font-mono tabular-nums text-[#FAFAFA] bg-transparent border border-[#242428] rounded-full hover:bg-[#17171A] transition-colors whitespace-nowrap cursor-pointer"
          >
            {isConnected ? `${truncateCryptoAddress(wallet!)}` : 'Connect wallet'}
          </button>
        </div>
      </div>
    </header>
  );
};
