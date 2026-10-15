import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy, Check, ChevronLeft, ExternalLink } from 'lucide-react';
import { CaseVerdict, RugDeskCase } from '../lib/contracts/types';
import { useRugDeskCase } from '../lib/hooks/useRugDesk';

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isPending, data: caseItem } = useRugDeskCase(id);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedFiler, setCopiedFiler] = useState(false);

  if (isPending) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 text-center text-xs text-[#71717A]">
        Loading case…
      </div>
    );
  }

  if (!caseItem || !caseItem.found) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="text-base font-semibold text-[#FAFAFA] mb-2">
          Case Not Found
        </div>
        <p className="text-xs text-[#A1A1AA] mb-6">
          The requested case ID "{id}" does not exist.
        </p>
        <Link
          to="/docket"
          className="px-5 py-2 text-xs font-semibold text-[#FAFAFA] bg-[#3B6CFF] hover:bg-[#325bd9] rounded-full transition-colors inline-block"
        >
          Return to docket
        </Link>
      </div>
    );
  }

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

  const getVerdictBadge = (verdict: CaseVerdict) => {
    const v = verdict?.toLowerCase();
    switch (v) {
      case 'rug':
        return (
          <span className="px-2.5 py-1 bg-[#D2554D] text-[#FAFAFA] rounded-[4px] text-xs font-medium tabular-nums whitespace-nowrap">
            Verdict: Rug
          </span>
        );
      case 'contested':
        return (
          <span className="px-2.5 py-1 bg-[#C9932B] text-[#FAFAFA] rounded-[4px] text-xs font-medium tabular-nums whitespace-nowrap">
            Verdict: Contested
          </span>
        );
      case 'insufficient':
        return (
          <span className="px-2.5 py-1 bg-[#71717A] text-[#FAFAFA] rounded-[4px] text-xs font-medium tabular-nums whitespace-nowrap">
            Verdict: Insufficient
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-[#3F3F46] text-[#A1A1AA] rounded-[4px] text-xs font-medium whitespace-nowrap">
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
    <div className="py-8 sm:py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#71717A] mb-6">
          <Link to="/docket" className="hover:text-[#FAFAFA] transition-colors flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Docket</span>
          </Link>
          <span>/</span>
          <span className="text-[#A1A1AA] tabular-nums">{caseItem.case_id}</span>
        </div>

        {/* Title Card */}
        <div className="bg-[#111113] border border-[#242428] rounded-[6px] p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#242428]">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-mono tabular-nums text-[#71717A]">
                  {caseItem.case_id}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-[#FAFAFA]">
                  {caseItem.symbol || 'Unknown Token'}
                </span>
                {getVerdictBadge(caseItem.verdict)}
              </div>
              <p className="text-xs text-[#A1A1AA]">
                Filed {formatDate(caseItem.created_at)}
                {caseItem.reviewed_at && ` · Reviewed ${formatDate(caseItem.reviewed_at)}`}
                {caseItem.finalized_at && ` · Finalized ${formatDate(caseItem.finalized_at)}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#17171A] border border-[#242428] text-[#A1A1AA] rounded-[4px] text-xs font-mono capitalize">
                Status: {caseItem.status}
              </span>
            </div>
          </div>

          {/* Quick Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 text-xs font-mono">
            <div>
              <div className="text-[11px] text-[#71717A]">Token Address</div>
              <div className="flex items-center gap-2 mt-1 text-[#FAFAFA]">
                <span className="truncate tabular-nums">{caseItem.token_address}</span>
                <button
                  onClick={copyAddress}
                  className="text-[#A1A1AA] hover:text-[#FAFAFA] p-0.5"
                  title="Copy address"
                >
                  {copiedAddress ? <Check className="w-3.5 h-3.5 text-[#2FA36B]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-[#71717A]">Filer</div>
              <div className="flex items-center gap-2 mt-1 text-[#FAFAFA]">
                <span className="truncate tabular-nums">{caseItem.filer}</span>
                <button
                  onClick={copyFiler}
                  className="text-[#A1A1AA] hover:text-[#FAFAFA] p-0.5"
                  title="Copy filer"
                >
                  {copiedFiler ? <Check className="w-3.5 h-3.5 text-[#2FA36B]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-[#71717A]">Evidence Links</div>
              <div className="mt-1 text-[#FAFAFA] tabular-nums">
                {caseItem.evidence_urls.length} filed
                {caseItem.defense_urls.length > 0 && ` · ${caseItem.defense_urls.length} defense`}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Claim + Defense + Reasoning */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#111113] border border-[#242428] rounded-[6px] p-6 space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#71717A]">
                Claim
              </h2>
              <div className="text-base font-semibold text-[#FAFAFA] leading-relaxed">
                {caseItem.claim}
              </div>
            </div>

            {caseItem.defense && (
              <div className="bg-[#111113] border border-[#242428] rounded-[6px] p-6 space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[#71717A]">
                  Defense
                </h2>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  {caseItem.defense}
                </p>
              </div>
            )}

            {caseItem.reasoning && (
              <div className="bg-[#111113] border border-[#242428] rounded-[6px] p-6 space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[#71717A]">
                  Validator Reasoning
                </h2>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  {caseItem.reasoning}
                </p>
              </div>
            )}
          </div>

          {/* Right: Evidence Links + Digests */}
          <div className="lg:col-span-5 space-y-6">
            {caseItem.evidence_urls.length > 0 && (
              <div className="bg-[#111113] border border-[#242428] rounded-[6px] p-6 space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[#71717A]">
                  Evidence Links
                </h2>
                <div className="space-y-2">
                  {caseItem.evidence_urls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#3B6CFF] hover:underline font-mono text-[11px] break-all"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span>{url}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {caseItem.defense_urls.length > 0 && (
              <div className="bg-[#111113] border border-[#242428] rounded-[6px] p-6 space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[#71717A]">
                  Defense Links
                </h2>
                <div className="space-y-2">
                  {caseItem.defense_urls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#3B6CFF] hover:underline font-mono text-[11px] break-all"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span>{url}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {caseItem.evidence_digests.length > 0 && (
              <div className="bg-[#111113] border border-[#242428] rounded-[6px] p-6 space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[#71717A]">
                  Evidence Digests
                </h2>
                <div className="space-y-2 font-mono text-[10px] text-[#71717A]">
                  {caseItem.evidence_digests.map((d, i) => (
                    <div key={i} className="bg-[#0A0A0B] border border-[#242428] rounded p-2 break-all">
                      <div className="text-[#A1A1AA] truncate">{d.url}</div>
                      <div>SHA256: {d.digest.slice(0, 20)}… ({d.chars} chars)</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/file"
                className="w-full text-center block px-4 py-2 text-xs font-semibold text-[#FAFAFA] bg-transparent border border-[#242428] hover:bg-[#17171A] rounded-full transition-colors"
              >
                File another case
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
