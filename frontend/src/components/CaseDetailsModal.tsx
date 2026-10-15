import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import { RugDeskCase } from '../lib/contracts/types';


interface CaseDetailsModalProps {
  caseItem: RugDeskCase | null;
  onClose: () => void;
}

export const CaseDetailsModal: React.FC<CaseDetailsModalProps> = ({ caseItem, onClose }) => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedFiler, setCopiedFiler] = useState(false);

  if (!caseItem) return null;

  const copyAddress = () => {
    navigator.clipboard.writeText(caseItem.token_address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const copyFiler = () => {
    navigator.clipboard.writeText(caseItem.filer);
    setCopiedFiler(true);
    setTimeout(() => setCopiedFiler(false), 2000);
  };

  const getVerdictBadge = () => {
    const v = caseItem.verdict?.toLowerCase();
    switch (v) {
      case 'rug':
        return (
          <span className="px-2 py-0.5 bg-[#D2554D] text-[#FAFAFA] rounded-[4px] text-xs font-medium tabular-nums">
            Rug
          </span>
        );
      case 'contested':
        return (
          <span className="px-2 py-0.5 bg-[#C9932B] text-[#FAFAFA] rounded-[4px] text-xs font-medium tabular-nums">
            Contested
          </span>
        );
      case 'insufficient':
        return (
          <span className="px-2 py-0.5 bg-[#71717A] text-[#FAFAFA] rounded-[4px] text-xs font-medium tabular-nums">
            Insufficient
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-[#3F3F46] text-[#A1A1AA] rounded-[4px] text-xs font-medium">
            Pending
          </span>
        );
    }
  };

  const formatDate = (raw: string) => {
    if (!raw) return '—';
    try {
      return new Date(raw).toLocaleString();
    } catch {
      return raw;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#111113] border border-[#242428] rounded-[6px] overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#17171A] border-b border-[#242428] shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tabular-nums text-[#71717A]">
              {caseItem.case_id}
            </span>
            <span className="text-sm font-bold text-[#FAFAFA]">
              {caseItem.symbol || 'Unknown'} 
            </span>
            {getVerdictBadge()}
          </div>
          <button
            onClick={onClose}
            className="text-[#71717A] hover:text-[#FAFAFA] transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0A0A0B] border border-[#242428] rounded-[4px] p-3.5 font-mono text-[11px]">
            <div>
              <div className="text-[#71717A]">Token Address</div>
              <div className="flex items-center gap-2 mt-0.5 text-[#FAFAFA]">
                <span className="truncate tabular-nums">{caseItem.token_address}</span>
                <button
                  onClick={copyAddress}
                  className="text-[#A1A1AA] hover:text-[#FAFAFA]"
                  title="Copy address"
                >
                  {copiedAddress ? <Check className="w-3 h-3 text-[#2FA36B]" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div>
              <div className="text-[#71717A]">Filer</div>
              <div className="flex items-center gap-2 mt-0.5 text-[#FAFAFA]">
                <span className="truncate tabular-nums">{caseItem.filer}</span>
                <button
                  onClick={copyFiler}
                  className="text-[#A1A1AA] hover:text-[#FAFAFA]"
                  title="Copy filer"
                >
                  {copiedFiler ? <Check className="w-3 h-3 text-[#2FA36B]" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div>
              <div className="text-[#71717A]">Status</div>
              <div className="mt-0.5 text-[#FAFAFA] capitalize">
                {caseItem.status}
              </div>
            </div>

            <div>
              <div className="text-[#71717A]">Filed</div>
              <div className="mt-0.5 text-[#FAFAFA] tabular-nums">
                {formatDate(caseItem.created_at)}
              </div>
            </div>

            {caseItem.reviewed_at && (
              <div>
                <div className="text-[#71717A]">Reviewed</div>
                <div className="mt-0.5 text-[#FAFAFA] tabular-nums">
                  {formatDate(caseItem.reviewed_at)}
                </div>
              </div>
            )}

            {caseItem.finalized_at && (
              <div>
                <div className="text-[#71717A]">Finalized</div>
                <div className="mt-0.5 text-[#FAFAFA] tabular-nums">
                  {formatDate(caseItem.finalized_at)}
                </div>
              </div>
            )}
          </div>

          {/* Claim */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono uppercase text-[#71717A] tracking-wider">
              Claim
            </div>
            <div className="text-sm text-[#FAFAFA] leading-relaxed">
              {caseItem.claim}
            </div>
          </div>

          {/* Defense (if any) */}
          {caseItem.defense && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono uppercase text-[#71717A] tracking-wider">
                Defense
              </div>
              <div className="text-sm text-[#A1A1AA] leading-relaxed">
                {caseItem.defense}
              </div>
            </div>
          )}

          {/* Reasoning (if reviewed) */}
          {caseItem.reasoning && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono uppercase text-[#71717A] tracking-wider">
                Validator Reasoning
              </div>
              <div className="text-sm text-[#A1A1AA] leading-relaxed">
                {caseItem.reasoning}
              </div>
            </div>
          )}

          {/* Evidence URLs */}
          {caseItem.evidence_urls.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase text-[#71717A] tracking-wider">
                Evidence Links ({caseItem.evidence_urls.length})
              </div>
              <div className="space-y-1.5">
                {caseItem.evidence_urls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#3B6CFF] hover:underline font-mono text-[11px] truncate"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Defense URLs */}
          {caseItem.defense_urls.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase text-[#71717A] tracking-wider">
                Defense Links ({caseItem.defense_urls.length})
              </div>
              <div className="space-y-1.5">
                {caseItem.defense_urls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#3B6CFF] hover:underline font-mono text-[11px] truncate"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Digests */}
          {caseItem.evidence_digests.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase text-[#71717A] tracking-wider">
                Evidence Digests
              </div>
              <div className="space-y-1.5 font-mono text-[10px] text-[#71717A]">
                {caseItem.evidence_digests.map((d, i) => (
                  <div key={i} className="bg-[#0A0A0B] border border-[#242428] rounded p-2 break-all">
                    <div className="text-[#A1A1AA] truncate">{d.url}</div>
                    <div>SHA256: {d.digest.slice(0, 16)}… ({d.chars} chars)</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#17171A] border-t border-[#242428] flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-[#FAFAFA] bg-transparent border border-[#242428] hover:bg-[#111113] rounded-full transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};