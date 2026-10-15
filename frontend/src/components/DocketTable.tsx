
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import type { RugDeskCase, CaseVerdict } from '../lib/contracts/types';

interface DocketTableProps {
  cases: RugDeskCase[];
  isCompact?: boolean;
}

export const DocketTable: React.FC<DocketTableProps> = ({
  cases = [],
  isCompact = false,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerdict, setFilterVerdict] = useState<
    'all' | CaseVerdict
  >('all');

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCases = cases.filter((item) => {
    const searchableText = [
      item.case_id,
      item.token_address,
      item.claim,
      item.filer,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesSearch = searchableText.includes(normalizedSearch);

    const matchesVerdict =
      filterVerdict === 'all' || item.verdict === filterVerdict;

    return matchesSearch && matchesVerdict;
  });

  const displayedCases = isCompact
    ? filteredCases.slice(0, 5)
    : filteredCases;

  const getVerdictBadge = (verdict: CaseVerdict | '') => {
    switch (verdict) {
      case 'rug':
        return (
          <span className="inline-block px-2 py-0.5 bg-[#D2554D] text-[#FAFAFA] rounded-[4px] text-[11px] font-medium whitespace-nowrap">
            Rug
          </span>
        );

      case 'contested':
        return (
          <span className="inline-block px-2 py-0.5 bg-[#C9932B] text-[#FAFAFA] rounded-[4px] text-[11px] font-medium whitespace-nowrap">
            Contested
          </span>
        );

      case 'insufficient':
        return (
          <span className="inline-block px-2 py-0.5 bg-[#71717A] text-[#FAFAFA] rounded-[4px] text-[11px] font-medium whitespace-nowrap">
            Insufficient
          </span>
        );

      default:
        return (
          <span className="inline-block px-2 py-0.5 bg-[#17171A] border border-[#242428] text-[#71717A] rounded-[4px] text-[11px] whitespace-nowrap">
            Pending
          </span>
        );
    }
  };

  const getStatusBadge = (status: RugDeskCase['status']) => {
    const styles: Record<RugDeskCase['status'], string> = {
      open: 'text-[#3B6CFF]',
      defended: 'text-[#C9932B]',
      reviewed: 'text-[#A1A1AA]',
      finalized: 'text-[#4ADE80]',
    };

    return (
      <span
        className={`inline-block px-2 py-0.5 bg-[#17171A] border border-[#242428] ${styles[status]} rounded-[4px] text-[11px] font-mono whitespace-nowrap`}
      >
        {status}
      </span>
    );
  };

  const truncateAddress = (address: string) => {
    if (!address) return 'Address unavailable';
    if (address.length <= 14) return address;

    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <section
      id="docket"
      className="py-12 sm:py-16 border-b border-[#242428]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAFAFA]">
              {isCompact ? 'Public docket preview' : 'Public Docket'}
            </h2>

            <p className="text-xs text-[#A1A1AA] mt-1">
              Review submitted claims, evidence links, case statuses and
              recorded verdicts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search address, case ID or claim..."
                aria-label="Search docket cases"
                className="bg-[#111113] border border-[#242428] text-xs text-[#FAFAFA] placeholder-[#71717A] rounded-[4px] pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#3B6CFF] w-56 sm:w-64"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#111113] border border-[#242428] p-0.5 rounded-[4px]">
              {(['all', 'rug', 'contested', 'insufficient'] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFilterVerdict(tab)}
                    aria-pressed={filterVerdict === tab}
                    className={`px-2.5 py-1 text-xs rounded-[4px] transition-colors whitespace-nowrap capitalize ${
                      filterVerdict === tab
                        ? 'bg-[#17171A] text-[#FAFAFA]'
                        : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
                    }`}
                  >
                    {tab === 'all' ? 'All' : tab}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#111113] border border-[#242428] rounded-[6px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#242428] bg-[#17171A] text-[11px] font-mono text-[#71717A]">
                  <th className="py-3 px-4 font-normal">Token contract</th>
                  <th className="py-3 px-4 font-normal">Claim</th>
                  <th className="py-3 px-4 font-normal">Status</th>
                  <th className="py-3 px-4 font-normal">Verdict</th>
                  <th className="py-3 px-4 font-normal text-right">
                    Evidence
                  </th>
                  <th className="py-3 px-3 font-normal text-center w-10">
                    <span className="sr-only">Open case</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#242428] text-xs">
                {displayedCases?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 px-4 text-center text-[#71717A] text-xs font-mono"
                    >
                      {cases?.length === 0
                        ? 'No cases have been filed yet.'
                        : 'No cases match your search or verdict filter.'}
                    </td>
                  </tr>
                ) : (
                  displayedCases.map((item) => (
                    <tr
                      key={item.case_id}
                      onClick={() =>
                        navigate(
                          `/docket/${encodeURIComponent(item.case_id)}`,
                        )
                      }
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          navigate(
                            `/docket/${encodeURIComponent(item.case_id)}`,
                          );
                        }
                      }}
                      tabIndex={0}
                      role="link"
                      aria-label={`View case ${item.case_id}`}
                      className="hover:bg-[#17171A] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#3B6CFF] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-[#FAFAFA]">
                            {truncateAddress(item.token_address)}
                          </span>

                          <span className="text-[11px] font-mono text-[#71717A]">
                            {item.case_id}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#A1A1AA] max-w-xs sm:max-w-md">
                        <div
                          className="truncate font-sans"
                          title={item.claim}
                        >
                          {item.claim || 'No claim description'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getVerdictBadge(item.verdict)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#FAFAFA]">
                        {item.evidence_urls?.length}
                      </td>

                      <td className="py-3.5 px-3 text-center text-[#71717A] group-hover:text-[#FAFAFA] transition-colors">
                        <ChevronRight className="w-3.5 h-3.5 mx-auto" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 bg-[#17171A] border-t border-[#242428] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#71717A]">
            <span className="tabular-nums">
              Displaying {displayedCases.length} of {filteredCases.length}{' '}
              filtered records · {cases.length} total loaded
            </span>

            <div className="flex items-center gap-4">
              {isCompact && (
                <Link
                  to="/docket"
                  className="text-[#A1A1AA] hover:text-[#FAFAFA] font-sans font-medium"
                >
                  View full docket →
                </Link>
              )}

              <Link
                to="/file"
                onClick={(event) => event.stopPropagation()}
                className="text-[#3B6CFF] hover:underline whitespace-nowrap font-sans font-medium"
              >
                + File a new breach claim
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
