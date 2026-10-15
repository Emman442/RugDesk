import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const FileCasePage: React.FC = () => {
  const navigate = useNavigate();

  const [symbol, setSymbol] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [claim, setClaim] = useState('');
  const [evidenceUrl1, setEvidenceUrl1] = useState('');
  const [evidenceUrl2, setEvidenceUrl2] = useState('');
  const [evidenceUrl3, setEvidenceUrl3] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const addr = tokenAddress.trim();
    const claimText = claim.trim();

    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      setError('Token address must be a valid 0x address (42 characters).');
      return;
    }
    if (claimText.length < 20) {
      setError('Claim must be at least 20 characters.');
      return;
    }

    const urls = [evidenceUrl1, evidenceUrl2, evidenceUrl3]
      .map((u) => u.trim())
      .filter(Boolean);

    if (urls.length === 0) {
      setError('At least one evidence URL is required.');
      return;
    }
    for (const u of urls) {
      if (!u.startsWith('https://') || u.length > 300) {
        setError(`Invalid evidence URL: ${u}`);
        return;
      }
    }

    const evidenceUrlsJson = JSON.stringify(urls);
    const cleanSymbol = symbol.trim().replace(/^\$/, '').slice(0, 32);

    setSubmitting(true);
    try {
      // TODO: Replace with your GenLayer client / wallet call
      // Example (pseudo):
      // const caseId = await rugDesk.write.file_case(
      //   addr,
      //   claimText,
      //   evidenceUrlsJson,
      //   cleanSymbol
      // );
      // navigate(`/docket/${caseId}`);

      console.log('Would call file_case with:', {
        token_address: addr,
        claim: claimText,
        evidence_urls_json: evidenceUrlsJson,
        symbol: cleanSymbol,
      });

      // Temporary mock until you wire the contract call
      alert('Contract call not wired yet. Check console for payload.');
      // navigate('/docket');
    } catch (err: any) {
      setError(err?.message || 'Failed to file case');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <div className="mb-8 pb-6 border-b border-[#242428]">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAFA]">
            File a Case
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Submit a token contract address, a specific claim, and evidence links. The record is stored permanently against the token address.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111113] border border-[#242428] rounded-[6px] p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                Token Symbol (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. TOKEN or $TOKEN"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                maxLength={32}
                className="w-full bg-[#0A0A0B] border border-[#242428] text-xs text-[#FAFAFA] placeholder-[#71717A] rounded-[4px] px-3.5 py-2.5 focus:outline-none focus:border-[#3B6CFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                Token Contract Address *
              </label>
              <input
                type="text"
                required
                placeholder="0x..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#242428] text-xs font-mono tabular-nums text-[#FAFAFA] placeholder-[#71717A] rounded-[4px] px-3.5 py-2.5 focus:outline-none focus:border-[#3B6CFF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Claim * (min 20 characters)
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Liquidity was removed 3 days after launch despite the roadmap promising a 6-month lock."
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              maxLength={2000}
              className="w-full bg-[#0A0A0B] border border-[#242428] text-xs text-[#FAFAFA] placeholder-[#71717A] rounded-[4px] px-3.5 py-2.5 focus:outline-none focus:border-[#3B6CFF] resize-none"
            />
            <div className="text-[10px] text-[#71717A] mt-1 text-right">
              {claim.length}/2000
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-medium text-[#A1A1AA]">
              Evidence URLs * (1–5 HTTPS links)
            </label>
            <input
              type="url"
              placeholder="https://explorer.example/tx/0x..."
              value={evidenceUrl1}
              onChange={(e) => setEvidenceUrl1(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-[#242428] text-xs font-mono text-[#FAFAFA] placeholder-[#71717A] rounded-[4px] px-3.5 py-2.5 focus:outline-none focus:border-[#3B6CFF]"
            />
            <input
              type="url"
              placeholder="https://archive.is/... or roadmap snapshot"
              value={evidenceUrl2}
              onChange={(e) => setEvidenceUrl2(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-[#242428] text-xs font-mono text-[#FAFAFA] placeholder-[#71717A] rounded-[4px] px-3.5 py-2.5 focus:outline-none focus:border-[#3B6CFF]"
            />
            <input
              type="url"
              placeholder="https://... (optional third link)"
              value={evidenceUrl3}
              onChange={(e) => setEvidenceUrl3(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-[#242428] text-xs font-mono text-[#FAFAFA] placeholder-[#71717A] rounded-[4px] px-3.5 py-2.5 focus:outline-none focus:border-[#3B6CFF]"
            />
          </div>

          {error && (
            <div className="p-3 bg-[#3F1D1D] border border-[#D2554D] rounded-[4px] text-xs text-[#FAFAFA]">
              {error}
            </div>
          )}

          <div className="p-4 bg-[#17171A] border border-[#242428] rounded-[4px] text-xs text-[#A1A1AA] space-y-1">
            <div className="font-semibold text-[#FAFAFA]">Notice</div>
            <p>
              Filing creates a permanent public record against the token address. Validators will fetch the evidence URLs and compare them to your claim. Silence from the project is allowed and does not auto-convict.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/docket')}
              className="px-5 py-2.5 text-xs font-medium text-[#FAFAFA] bg-transparent border border-[#242428] hover:bg-[#17171A] rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-semibold text-[#FAFAFA] bg-[#3B6CFF] hover:bg-[#325bd9] rounded-full transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Submitting…' : 'File Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};