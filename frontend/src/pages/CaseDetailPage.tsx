
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Copy,
  Check,
  ChevronLeft,
  ExternalLink,
  LockKeyhole,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import type { RugDeskCase, CaseVerdict } from '../lib/contracts/types';
import {
  useRugDeskCase,
  useAddRugDeskDefense,
  useReviewRugDeskCase,
  useFinalizeRugDeskCase,
} from '../lib/hooks/useRugDesk';

const inputClass =
  'w-full bg-[#0A0A0B] border border-[#242428] rounded-md px-3 py-2.5 text-sm text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:border-[#3B6CFF]';

const buttonClass =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    isPending,
    isError,
    error,
    data: caseItem,
    refetch,
  } = useRugDeskCase(id);

  const addDefense = useAddRugDeskDefense();
  const reviewCase = useReviewRugDeskCase();
  const finalizeCase = useFinalizeRugDeskCase();

  const [defense, setDefense] = useState('');
  const [defenseUrlsText, setDefenseUrlsText] = useState('');
  const [copied, setCopied] = useState<'address' | 'filer' | null>(null);
  const [actionError, setActionError] = useState('');

  const isSubmitting =
    addDefense.isPending ||
    reviewCase.isPending ||
    finalizeCase.isPending;

  const copyText = async (
    value: string,
    field: 'address' | 'filer',
  ) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(field);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setActionError('Could not copy to clipboard. Please copy the value manually.');
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return 'Not yet recorded';

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString();
  };

  const shortenAddress = (value: string) => {
    if (!value) return 'Unavailable';
    if (value.length <= 14) return value;

    return `${value.slice(0, 8)}...${value.slice(-6)}`;
  };

  const getVerdictBadge = (verdict: CaseVerdict | '') => {
    switch (verdict) {
      case 'rug':
        return (
          <span className="px-2.5 py-1 bg-[#D2554D] text-white rounded text-xs font-medium">
            Verdict: Rug
          </span>
        );

      case 'contested':
        return (
          <span className="px-2.5 py-1 bg-[#C9932B] text-white rounded text-xs font-medium">
            Verdict: Contested
          </span>
        );

      case 'insufficient':
        return (
          <span className="px-2.5 py-1 bg-[#71717A] text-white rounded text-xs font-medium">
            Verdict: Insufficient evidence
          </span>
        );

      default:
        return (
          <span className="px-2.5 py-1 bg-[#3F3F46] text-[#D4D4D8] rounded text-xs font-medium">
            Awaiting review
          </span>
        );
    }
  };

  const handleAddDefense = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setActionError('');

    if (!id) {
      setActionError('The case ID is missing from the URL.');
      return;
    }

    const urls = defenseUrlsText
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean);

    if (defense.trim().length < 10) {
      setActionError('Your defense must contain at least 10 characters.');
      return;
    }

    if (urls.length > 5) {
      setActionError('You can submit a maximum of 5 defense URLs.');
      return;
    }

    if (urls.some((url) => !/^https:\/\//i.test(url))) {
      setActionError('Every defense URL must start with https://.');
      return;
    }

    try {
      await addDefense.mutateAsync({
        caseId: id,
        defense: defense.trim(),
        defenseUrls: urls,
        tokenAddress: caseItem?.token_address,
      });

      setDefense('');
      setDefenseUrlsText('');
      await refetch();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Failed to submit defense.',
      );
    }
  };

  const handleReview = async () => {
    if (!id) return;

    setActionError('');

    try {
      await reviewCase.mutateAsync({
        caseId: id,
        tokenAddress: caseItem?.token_address,
      });

      await refetch();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Case review failed.',
      );
    }
  };

  const handleFinalize = async () => {
    if (!id) return;

    setActionError('');

    try {
      await finalizeCase.mutateAsync({
        caseId: id,
        tokenAddress: caseItem?.token_address,
      });

      await refetch();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Failed to finalize case.',
      );
    }
  };

  if (isPending) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-20 text-center text-sm text-[#A1A1AA]">
        <Loader2 className="w-5 h-5 animate-spin mx-auto mb-3" />
        Loading case from RugDesk...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-[700px] mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-8 h-8 text-[#D2554D] mx-auto mb-3" />
        <h1 className="text-lg font-bold text-[#FAFAFA]">
          Unable to load case
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-2 mb-6">
          {error instanceof Error
            ? error.message
            : 'A contract or network error occurred.'}
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className={`${buttonClass} bg-[#3B6CFF] text-white`}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!caseItem || !caseItem.found) {
    return (
      <div className="max-w-[700px] mx-auto px-4 py-20 text-center">
        <h1 className="text-lg font-bold text-[#FAFAFA] mb-2">
          Case not found
        </h1>
        <p className="text-sm text-[#A1A1AA] mb-6">
          No case was returned for ID {id ?? 'unknown'}.
        </p>
        <Link
          to="/docket"
          className={`${buttonClass} bg-[#3B6CFF] text-white`}
        >
          Return to docket
        </Link>
      </div>
    );
  }

  const evidenceUrls = caseItem.evidence_urls ?? [];
  const defenseUrls = caseItem.defense_urls ?? [];
  const digests = caseItem.evidence_digests ?? [];

  const canDefend = caseItem.status === 'open';
  const canReview =
    caseItem.status === 'open' || caseItem.status === 'defended';
  const canFinalize = caseItem.status === 'reviewed';

  return (
    <main className="py-8 sm:py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#71717A] mb-6">
          <Link
            to="/docket"
            className="hover:text-white flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Docket
          </Link>
          <span>/</span>
          <span className="text-[#A1A1AA]">{caseItem.case_id}</span>
        </div>

        {actionError && (
          <div className="flex items-start gap-2 mb-6 p-4 bg-[#D2554D]/10 border border-[#D2554D]/40 rounded-md text-sm text-[#FCA5A5]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">{actionError}</div>
            <button
              type="button"
              onClick={() => setActionError('')}
              className="text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <section className="bg-[#111113] border border-[#242428] rounded-md p-5 sm:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-[#242428]">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-mono text-[#71717A]">
                  {caseItem.case_id}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Token case
                </h1>
                {getVerdictBadge(caseItem.verdict)}
              </div>

              <p className="text-xs text-[#A1A1AA] mt-2">
                Filed {formatDate(caseItem.created_at)}
              </p>

              {caseItem.reviewed_at && (
                <p className="text-xs text-[#71717A] mt-1">
                  Reviewed {formatDate(caseItem.reviewed_at)}
                </p>
              )}

              {caseItem.finalized_at && (
                <p className="text-xs text-[#71717A] mt-1">
                  Finalized {formatDate(caseItem.finalized_at)}
                </p>
              )}
            </div>

            <span className="px-3 py-2 bg-[#17171A] border border-[#242428] text-[#A1A1AA] rounded text-xs font-mono capitalize">
              Status: {caseItem.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-5 text-xs">
            <div>
              <p className="text-[11px] text-[#71717A] mb-2">
                Token address
              </p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-white break-all">
                  {shortenAddress(caseItem.token_address)}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    void copyText(caseItem.token_address, 'address')
                  }
                  title="Copy token address"
                  className="text-[#A1A1AA] hover:text-white"
                >
                  {copied === 'address' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <p className="text-[11px] text-[#71717A] mb-2">Filer</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-white break-all">
                  {shortenAddress(caseItem.filer)}
                </span>
                <button
                  type="button"
                  onClick={() => void copyText(caseItem.filer, 'filer')}
                  title="Copy filer address"
                  className="text-[#A1A1AA] hover:text-white"
                >
                  {copied === 'filer' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <p className="text-[11px] text-[#71717A] mb-2">
                Evidence submitted
              </p>
              <p className="font-mono text-white">
                {evidenceUrls.length} evidence link(s)
                {defenseUrls.length > 0 &&
                  ` · ${defenseUrls.length} defense link(s)`}
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <section className="bg-[#111113] border border-[#242428] rounded-md p-6">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#71717A] mb-4">
                Claim
              </h2>
              <p className="text-base font-semibold text-white leading-relaxed whitespace-pre-wrap">
                {caseItem.claim}
              </p>
            </section>

            {caseItem.defense && (
              <section className="bg-[#111113] border border-[#242428] rounded-md p-6">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[#71717A] mb-4">
                  Submitted defense
                </h2>
                <p className="text-sm text-[#D4D4D8] leading-relaxed whitespace-pre-wrap">
                  {caseItem.defense}
                </p>
              </section>
            )}

            {caseItem.reasoning && (
              <section className="bg-[#111113] border border-[#242428] rounded-md p-6">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[#71717A] mb-4">
                  Review reasoning
                </h2>
                <p className="text-sm text-[#D4D4D8] leading-relaxed whitespace-pre-wrap">
                  {caseItem.reasoning}
                </p>
              </section>
            )}

            {evidenceUrls.length > 0 && (
              <section className="bg-[#111113] border border-[#242428] rounded-md p-6">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[#71717A] mb-4">
                  Evidence links
                </h2>
                <div className="space-y-3">
                  {evidenceUrls.map((url, index) => (
                    <a
                      key={`${url}-${index}`}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-[#3B6CFF] hover:underline text-xs break-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      {url}
                    </a>
                  ))}
                </div>
              </section>
            )}

            {defenseUrls.length > 0 && (
              <section className="bg-[#111113] border border-[#242428] rounded-md p-6">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[#71717A] mb-4">
                  Defense links
                </h2>
                <div className="space-y-3">
                  {defenseUrls.map((url, index) => (
                    <a
                      key={`${url}-${index}`}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-[#3B6CFF] hover:underline text-xs break-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      {url}
                    </a>
                  ))}
                </div>
              </section>
            )}

            {digests.length > 0 && (
              <section className="bg-[#111113] border border-[#242428] rounded-md p-6">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[#71717A] mb-4">
                  Evidence digests
                </h2>
                <div className="space-y-3">
                  {digests.map((digest, index) => (
                    <div
                      key={`${digest.url}-${index}`}
                      className="bg-[#0A0A0B] border border-[#242428] rounded p-3 text-[11px] font-mono"
                    >
                      <p className="text-[#A1A1AA] break-all">
                        {digest.url}
                      </p>
                      <p className="text-[#71717A] mt-2 break-all">
                        SHA256: {digest.digest}
                      </p>
                      <p className="text-[#71717A] mt-1">
                        {digest.chars} characters
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="lg:col-span-5 space-y-6">
            <section className="bg-[#111113] border border-[#242428] rounded-md p-6">
              <h2 className="text-sm font-bold text-white mb-2">
                Case actions
              </h2>
              <p className="text-xs text-[#A1A1AA] leading-relaxed mb-5">
                Progress this case through its on-chain lifecycle. Each action
                requires a connected wallet and a successful contract
                transaction.
              </p>

              {canDefend && (
                <form onSubmit={handleAddDefense} className="space-y-4">
                  <div>
                    <label
                      htmlFor="defense"
                      className="block text-xs text-[#D4D4D8] mb-2"
                    >
                      Submit a defense
                    </label>
                    <textarea
                      id="defense"
                      value={defense}
                      onChange={(event) => setDefense(event.target.value)}
                      minLength={10}
                      required
                      rows={5}
                      placeholder="Explain the project's response to the claim..."
                      className={inputClass}
                    />
                    <p className="text-[11px] text-[#71717A] mt-1">
                      Minimum 10 characters.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="defenseUrls"
                      className="block text-xs text-[#D4D4D8] mb-2"
                    >
                      Defense evidence URLs
                    </label>
                    <textarea
                      id="defenseUrls"
                      value={defenseUrlsText}
                      onChange={(event) =>
                        setDefenseUrlsText(event.target.value)
                      }
                      rows={3}
                      placeholder={'https://example.com/response\nhttps://example.com/audit'}
                      className={inputClass}
                    />
                    <p className="text-[11px] text-[#71717A] mt-1">
                      Optional. One HTTPS URL per line, up to 5.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${buttonClass} w-full bg-[#242428] hover:bg-[#303036] text-white`}
                  >
                    {addDefense.isPending
                      ? 'Submitting defense...'
                      : 'Submit defense'}
                  </button>
                </form>
              )}

              {canReview && (
                <div className={canDefend ? 'mt-6 pt-5 border-t border-[#242428]' : ''}>
                  <h3 className="text-xs font-semibold text-white mb-2">
                    Review case
                  </h3>
                  <p className="text-xs text-[#A1A1AA] mb-3 leading-relaxed">
                    Ask the contract to evaluate the evidence and record a
                    verdict. This action may take time to reach an accepted
                    transaction status.
                  </p>

                  <button
                    type="button"
                    onClick={() => void handleReview()}
                    disabled={isSubmitting}
                    className={`${buttonClass} w-full bg-[#3B6CFF] hover:bg-[#325bd9] text-white`}
                  >
                    {reviewCase.isPending
                      ? 'Reviewing case...'
                      : 'Run case review'}
                  </button>
                </div>
              )}

              {canFinalize && (
                <div className="mt-5 pt-5 border-t border-[#242428]">
                  <h3 className="text-xs font-semibold text-white mb-2">
                    Finalize case
                  </h3>
                  <p className="text-xs text-[#A1A1AA] mb-3 leading-relaxed">
                    Mark the reviewed case as finalized. The recorded verdict
                    and reasoning will remain available.
                  </p>

                  <button
                    type="button"
                    onClick={() => void handleFinalize()}
                    disabled={isSubmitting}
                    className={`${buttonClass} w-full bg-[#242428] hover:bg-[#303036] text-white`}
                  >
                    {finalizeCase.isPending
                      ? 'Finalizing...'
                      : 'Finalize case'}
                  </button>
                </div>
              )}

              {caseItem.status === 'finalized' && (
                <div className="p-4 bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-md">
                  <p className="text-sm font-semibold text-[#4ADE80]">
                    Case finalized
                  </p>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    No further actions are available in this workflow.
                  </p>
                </div>
              )}
            </section>

            <Link
              to="/file"
              className={`${buttonClass} w-full border border-[#242428] hover:bg-[#17171A] text-white`}
            >
              File another case
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
};
