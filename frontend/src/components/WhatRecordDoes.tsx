import React from 'react';

export const WhatRecordDoes: React.FC = () => {
  const points = [
    {
      title: 'Permanent',
      body: 'Stored directly against the token contract address. Once finalized by validator consensus, no team, founder, or network participant can alter or delete the verdict.'
    },
    {
      title: 'Readable by any explorer or dashboard',
      body: 'Standard smart contract view functions and indexers expose the verdict, contradiction proof hashes, and consensus scores to block explorers, DEX routers, and wallets.'
    },
    {
      title: 'No automatic refund or freeze',
      body: 'Rug Desk does not freeze liquidity pools, custody tokens, or reverse transactions. It creates a verified, public evidentiary record of broken commitments.'
    }
  ];

  return (
    <section id="record" className="py-12 sm:py-16 border-b border-[#242428]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAFAFA]">
            What the record does
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Scope, technical architecture, and enforcement boundaries of Rug Desk verdicts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {points.map((point) => (
            <div
              key={point.title}
              className="bg-[#111113] border border-[#242428] rounded-[6px] p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base font-semibold text-[#FAFAFA] mb-2">
                  {point.title}
                </h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  {point.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
