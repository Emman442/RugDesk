import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useFileRugDeskCase } from '../lib/hooks/useRugDesk';

interface FileCaseModalProps {
  isOpen: boolean;
  onClose: () => void;

}

export const FileCaseModal: React.FC<FileCaseModalProps> = ({ isOpen, onClose }) => {
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [claimType, setClaimType] = useState('Liquidity removal without lock');
  const [claimSummary, setClaimSummary] = useState('');
  const [txHash, setTxHash] = useState('');
  const [roadmapPromise, setRoadmapPromise] = useState('');
  const [archiveUrl, setArchiveUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { isPending: isFilingCase, mutate: fileCase } = useFileRugDeskCase();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractAddress || !claimSummary) return;

    const newCase = {
      tokenAddress: contractAddress.trim(),
      claim: claimSummary,
      evidenceUrls: archiveUrl ? [archiveUrl.trim()] : [],
      tokenSymbol
    };
    fileCase(newCase);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="relative w-full max-w-xl bg-[#111113] border border-[#242428] rounded-[6px] overflow-hidden text-xs">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#17171A] border-b border-[#242428]">
          <div>
            <h3 className="text-sm font-semibold text-[#FAFAFA]">File a Case</h3>
            <p className="text-[11px] text-[#A1A1AA]">
              Submit token contract address and documentary contradiction proof.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#71717A] hover:text-[#FAFAFA] transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        {submitted ? (
          <div className="p-8 text-center space-y-3 font-mono">
            <div className="w-8 h-8 rounded-full bg-[#2FA36B] text-[#FAFAFA] flex items-center justify-center mx-auto">
              <Check className="w-4 h-4" />
            </div>
            <div className="text-sm font-semibold text-[#FAFAFA]">Case Entered to Docket</div>
            <p className="text-xs text-[#A1A1AA]">
              Record assigned to independent validators for evidence replication and trace consensus.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#A1A1AA] mb-1">
                  Token Symbol
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. $TOKEN"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#242428] text-xs text-[#FAFAFA] placeholder-[#71717A] rounded-[4px] px-3 py-2 focus:outline-none focus:border-[#3B6CFF]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#A1A1AA] mb-1">
                  Token Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Project Name"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#242428] text-xs text-[#FAFAFA] placeholder-[#71717A] rounded-[4px] px-3 py-2 focus:outline-none focus:border-[#3B6CFF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#A1A1AA] mb-1">
                Token Contract Address (0x...)
              </label>
              <input
                type="text"
                required
                placeholder="0x..."
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#242428] text-xs font-mono tabular-nums text-[#FAFAFA] placeholder-[#71717A] rounded-[4px] px-3 py-2 focus:outline-none focus:border-[#3B6CFF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#A1A1AA] mb-1">
                  Claim Category
                </label>
                <select
                  value={claimType}
                  onChange={(e) => setClaimType(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#242428] text-xs text-[#FAFAFA] rounded-[4px] px-3 py-2 focus:outline-none focus:border-[#3B6CFF]"
                >
                  <option value="Liquidity removal without lock">Liquidity removal without lock</option>
                  <option value="Undisclosed founder / team dump">Undisclosed founder / team dump</option>
                  <option value="Hidden backdoor or owner mint">Hidden backdoor or owner mint</option>
                  <option value="Malicious contract upgrade">Malicious contract upgrade</option>
                  <option value="Fake lock contradiction">Fake lock contradiction</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#A1A1AA] mb-1">
                  Primary Breach Tx Hash (Optional)
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#242428] text-xs font-mono tabular-nums text-[#FAFAFA] placeholder-[#71717A] rounded-[4px] px-3 py-2 focus:outline-none focus:border-[#3B6CFF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#A1A1AA] mb-1">
                Claim Summary
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Liquidity pulled 6 hrs post-launch despite 1-year lock commitment"
                value={claimSummary}
                onChange={(e) => setClaimSummary(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#242428] text-xs text-[#FAFAFA] placeholder-[#71717A] rounded-[4px] px-3 py-2 focus:outline-none focus:border-[#3B6CFF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#A1A1AA] mb-1">
                Breached Promise Statement (e.g. quote from roadmap or docs)
              </label>
              <input
                type="text"
                placeholder="e.g. “Liquidity locked for 12 months in Unicrypt”"
                value={roadmapPromise}
                onChange={(e) => setRoadmapPromise(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#242428] text-xs text-[#FAFAFA] placeholder-[#71717A] rounded-[4px] px-3 py-2 focus:outline-none focus:border-[#3B6CFF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#A1A1AA] mb-1">
                Evidence URL (Archive link, IPFS, or explorer log)
              </label>
              <input
                type="url"
                placeholder="https://archive.is/... or https://ipfs.io/..."
                value={archiveUrl}
                onChange={(e) => setArchiveUrl(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#242428] text-xs font-mono text-[#FAFAFA] placeholder-[#71717A] rounded-[4px] px-3 py-2 focus:outline-none focus:border-[#3B6CFF]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#242428]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#FAFAFA] bg-transparent border border-[#242428] hover:bg-[#17171A] rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-[#FAFAFA] bg-[#3B6CFF] hover:bg-[#325bd9] rounded-full transition-colors"
              >
                Submit to docket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
