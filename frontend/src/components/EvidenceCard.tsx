import React, { useState } from 'react';
import { Copy, Check, Eye, FileText} from 'lucide-react';

export const EvidenceCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courtroom' | 'trace'>('courtroom');
  const [copied, setCopied] = useState(false);

  const copyHash = () => {
    navigator.clipboard.writeText('0x9c42b107e997db831ef7806fa498ec15');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#111113] border border-[#242428] rounded-[6px] overflow-hidden">
      {/* Evidence View Mode Switcher Header */}
      <div className="bg-[#17171A] border-b border-[#242428] px-3.5 py-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('courtroom')}
            className={`px-2.5 py-1 rounded-[4px] text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'courtroom'
                ? 'bg-[#111113] text-[#FAFAFA] border border-[#242428]'
                : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
            }`}
          >
            <Eye className="w-3 h-3 text-[#3B6CFF]" />
            <span>Courtroom Evidence</span>
          </button>
          <button
            onClick={() => setActiveTab('trace')}
            className={`px-2.5 py-1 rounded-[4px] text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'trace'
                ? 'bg-[#111113] text-[#FAFAFA] border border-[#242428]'
                : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
            }`}
          >
            <FileText className="w-3 h-3 text-[#A1A1AA]" />
            <span>On-Chain Trace</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'trace' && (
            <button
              onClick={copyHash}
              className="flex items-center gap-1.5 px-2 py-0.5 text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors rounded-[4px] bg-[#111113] border border-[#242428]"
              title="Copy transaction hash"
            >
              {copied ? <Check className="w-3 h-3 text-[#2FA36B]" /> : <Copy className="w-3 h-3" />}
              <span className="text-[11px] tabular-nums">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
          <span className="text-[10px] text-[#71717A] tabular-nums hidden sm:inline">
            RD-EXHIBIT #0482
          </span>
        </div>
      </div>

      {/* Tab 1: Courtroom Photographic Evidence */}
      {activeTab === 'courtroom' && (
        <div className="space-y-0">
          <div className="relative aspect-16/9 w-full bg-[#0A0A0B] overflow-hidden">
            <img
              src="/src/assets/images/court_evidence_docket_1791978786619.jpg"
              alt="Forensic courtroom evidence desk with smart contract trace inspection monitor and contradiction exhibits marked with case file stamps"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Subtle judicial stamp banner */}
            <div className="absolute top-2.5 left-2.5 bg-[#0A0A0B]/90 border border-[#242428] px-2 py-1 rounded-[4px] text-[10px] font-mono text-[#FAFAFA] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#D2554D] rounded-full inline-block" />
              <span>JUDICIAL EVIDENCE DESK · CASE NO. 2026-ETH-007</span>
            </div>
          </div>

          {/* Under-Image Metadata Strip */}
          <div className="p-3.5 bg-[#111113] border-t border-[#242428] space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#A1A1AA]">
                Exhibit B: Smart Contract Conflict Log & Unauthorized Disbursement
              </span>
              <span className="px-1.5 py-0.5 bg-[#D2554D] text-[#FAFAFA] rounded-[4px] font-sans font-medium text-[10px]">
                ADMITTED · VERDICT: RUG
              </span>
            </div>
            <div className="text-[11px] text-[#71717A] leading-relaxed">
              Forensic evidence desk during token trace deliberation. Opcode execution traces confirm private key deployer executed an unauthorized drain contradicting archived lock documentation.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: On-Chain Explorer Screenshot View */}
      {activeTab === 'trace' && (
        <div className="p-4 sm:p-5 text-xs font-mono space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#242428] pb-2.5">
            <div className="text-[#A1A1AA] text-xs">Transaction Details (Etherscan Verified)</div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#2FA36B] text-[#FAFAFA] rounded-[4px] font-sans font-medium text-[11px]">
                Success
              </span>
              <span className="text-[#71717A] tabular-nums">Block 19842109</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 text-[11px] sm:text-xs">
            <span className="text-[#71717A]">Transaction Hash:</span>
            <span className="sm:col-span-2 text-[#FAFAFA] truncate tabular-nums">
              0x9c42b107e997db831ef7806fa498ec15
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 text-[11px] sm:text-xs">
            <span className="text-[#71717A]">Timestamp:</span>
            <span className="sm:col-span-2 text-[#A1A1AA] tabular-nums">
              Sep-02-2026 14:22:04 UTC (42 days ago)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 text-[11px] sm:text-xs">
            <span className="text-[#71717A]">From:</span>
            <span className="sm:col-span-2 text-[#FAFAFA] truncate tabular-nums">
              Deployer (0x7a31b490d18204b1e8471b8e4e8b)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 text-[11px] sm:text-xs">
            <span className="text-[#71717A]">Interacted With:</span>
            <span className="sm:col-span-2 text-[#A1A1AA] truncate tabular-nums">
              Uniswap V2: Router 2 (0x7a250d5630b4cf539739df2c5dacb4c659f2488d)
            </span>
          </div>

          {/* Highlighted Liquidity Removal Event */}
          <div className="p-3 bg-[#17171A] border border-[#D2554D] rounded-[4px] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#D2554D] font-medium tracking-wide">
                LIQUIDITY REMOVAL EVENT (CALL)
              </span>
              <span className="text-[#FAFAFA] font-medium tabular-nums">
                -412.85 ETH
              </span>
            </div>

            <div className="text-[11px] text-[#A1A1AA] leading-relaxed">
              <span className="text-[#FAFAFA]">Method:</span> removeLiquidityETHWithPermit
              <br />
              <span className="text-[#FAFAFA]">Burned:</span> 850,000,000 $ASTRAL-LP (100% of pair)
              <br />
              <span className="text-[#FAFAFA]">Withdrawn to:</span> Deployer Wallet
              <span className="text-[#D2554D] ml-1 tabular-nums">($1,385,210.00 USD)</span>
            </div>
          </div>

          {/* Inset Panel: Road Map Promise Contradiction Evidence */}
          <div className="p-3 bg-[#17171A] border border-[#242428] rounded-[4px] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#71717A] tracking-wider uppercase font-semibold text-[10px]">
                Exhibit 01 · Contradicted Promise
              </span>
              <span className="px-1.5 py-0.5 bg-[#D2554D] text-[#FAFAFA] rounded-[4px] font-sans font-medium text-[10px] tracking-wide">
                CONTRADICTED
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-[#71717A] line-through">
                “Liquidity locked for 12 months in Unicrypt vault upon launch”
              </div>
              <div className="text-[10px] text-[#A1A1AA] font-sans">
                Source: Official documentation & Discord announcements (Archived 2026-08-28)
              </div>
            </div>

            <div className="pt-1.5 border-t border-[#242428] flex items-center justify-between text-[10px] text-[#71717A]">
              <span>Rug Desk Record #RD-2026-0482</span>
              <span className="text-[#FAFAFA] font-medium">Verdict: Rug</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
