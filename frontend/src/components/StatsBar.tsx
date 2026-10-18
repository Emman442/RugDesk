import React from 'react';

interface StatsBarProps {
  totalCases: number;
  uniqueTokens?: number;          // unique token_address values that have at least one case
  reviewedPercent?: number;       // % of cases that have been reviewed or finalized (have evidence digests / verdict)
}

export const StatsBar: React.FC<StatsBarProps> = ({
  totalCases,
  uniqueTokens = 0,
  reviewedPercent = 0,
}) => {
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
              Public records opened against token contracts
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-[#111113] border border-[#242428] rounded-[6px] p-5">
            <div className="text-xs text-[#A1A1AA] mb-1 font-medium">Tokens with cases</div>
            <div className="text-2xl font-bold text-[#FAFAFA] tabular-nums font-mono">
              {uniqueTokens.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#71717A] mt-1">
              Unique token addresses with at least one case
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-[#111113] border border-[#242428] rounded-[6px] p-5">
            <div className="text-xs text-[#A1A1AA] mb-1 font-medium">Reviewed</div>
            <div className="text-2xl font-bold text-[#FAFAFA] tabular-nums font-mono">
              {reviewedPercent.toFixed(1)}%
            </div>
            <div className="text-[11px] text-[#71717A] mt-1">
              Cases that reached a validator verdict
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};