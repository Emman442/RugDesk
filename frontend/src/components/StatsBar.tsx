import React from 'react';

interface StatsBarProps {
  totalCases: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({ totalCases }) => {
  return (
    <section className="py-8 border-b border-[#242428]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stat 1 */}
          <div className="bg-[#111113] border border-[#242428] rounded-[6px] p-5">
            <div className="text-xs text-[#A1A1AA] mb-1 font-medium">Cases filed</div>
            <div className="text-2xl font-bold text-[#FAFAFA] tabular-nums font-mono">
              {totalCases.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#71717A] mt-1">
              Active dockets across Ethereum and L2s
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-[#111113] border border-[#242428] rounded-[6px] p-5">
            <div className="text-xs text-[#A1A1AA] mb-1 font-medium">Tokens flagged</div>
            <div className="text-2xl font-bold text-[#FAFAFA] tabular-nums font-mono">
              892
            </div>
            <div className="text-[11px] text-[#71717A] mt-1">
              Contracts with confirmed forensic contradictions
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-[#111113] border border-[#242428] rounded-[6px] p-5">
            <div className="text-xs text-[#A1A1AA] mb-1 font-medium">Evidence complete %</div>
            <div className="text-2xl font-bold text-[#FAFAFA] tabular-nums font-mono">
              98.4%
            </div>
            <div className="text-[11px] text-[#71717A] mt-1">
              Verifiable cryptographic proof attached
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
