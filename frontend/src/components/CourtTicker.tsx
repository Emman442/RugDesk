import React from 'react';
import { Link } from 'react-router-dom';
import { RugDeskCase } from '../lib/contracts/types';

interface CourtTickerProps {
  cases: RugDeskCase[];
}

export const CourtTicker: React.FC<CourtTickerProps> = ({ cases }) => {
  const tickerItems = cases.concat(cases); // duplicate for seamless infinite loop

  return (
    <div className="w-full bg-[#111113] border-b border-[#242428] overflow-hidden py-2.5 text-xs font-mono select-none">
      <div className="flex items-center">
        <div className="shrink-0 px-4 text-[#71717A] text-[11px] uppercase tracking-wider font-semibold border-r border-[#242428] flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#D2554D] rounded-full inline-block" />
          <span>Live Record</span>
        </div>

        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="animate-marquee flex items-center gap-8 pl-4">
            {tickerItems.map((item, index) => {
              const verdictBg =
                item.verdict === 'rug'
                  ? 'bg-[#D2554D]'
                  : item.verdict === 'contested'
                  ? 'bg-[#C9932B]'
                  : 'bg-[#71717A]';

              return (
                <Link
                  key={`${item.case_id}-${index}`}
                  to={`/docket/${item.case_id}`}
                  className="flex items-center gap-2 text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors shrink-0 group"
                >
                  <span className="text-[#71717A] tabular-nums font-medium">
                    [{item.case_id}]
                  </span>
                  <span className="text-[#FAFAFA] font-semibold">
                    {item.symbol}
                  </span>
                  <span className="text-[#71717A]">·</span>
                  <span className="truncate max-w-[200px] sm:max-w-xs font-sans text-xs">
                    {item.claim}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 text-[10px] ${verdictBg} text-[#FAFAFA] rounded-[3px] font-sans font-medium tabular-nums ml-1`}
                  >
                    {item.verdict.toUpperCase()}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
