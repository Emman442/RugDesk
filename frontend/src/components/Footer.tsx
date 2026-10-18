import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 bg-[#0A0A0B] text-center text-xs text-[#71717A] font-mono">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <p className="tabular-nums">
          Rug Desk · Public on-chain court for smart contract promises · Verified against Ethereum contract registry
        </p>
      </div>
    </footer>
  );
};
