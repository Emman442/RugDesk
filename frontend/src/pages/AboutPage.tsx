import React from 'react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const points = [
    {
      title: 'Permanent',
      body: 'Stored directly against the token contract address. Once finalized by validator consensus, no team, founder, or network participant can alter or delete the verdict.'
    },
    {
      title: 'Readable by any explorer or dashboard',
      body: 'Standard smart contract view functions and indexers expose the verdict, contradiction proof hashes, and consensus scores to block explorers, DEX routers, and wallets.'
    },
    {
      title: 'No automatic refund or freeze',
      body: 'Rug Desk does not freeze liquidity pools, custody tokens, or reverse transactions. It creates a verified, public evidentiary record of broken commitments.'
    }
  ];

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="mb-10 pb-6 border-b border-[#242428]">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAFA]">
            About Rug Desk
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            An autonomous evidentiary record for Ethereum smart contract promises and broken project commitments.
          </p>
        </div>

        {/* What the Record Does */}
        <div className="space-y-6 mb-12">
          <h2 className="text-base font-bold text-[#FAFAFA]">
            What the record does
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {points.map((point) => (
              <div
                key={point.title}
                className="bg-[#111113] border border-[#242428] rounded-[6px] p-6 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm font-semibold text-[#FAFAFA] mb-2">
                    {point.title}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    {point.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Boundary of Responsibility */}
        <div className="bg-[#111113] border border-[#242428] rounded-[6px] p-6 space-y-4 mb-12">
          <h2 className="text-sm font-semibold text-[#FAFAFA]">
            Institutional Boundaries & Governance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#A1A1AA] leading-relaxed">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#2FA36B] mb-2">
                What Rug Desk Is
              </h3>
              <p>
                A decentralized evidentiary record keeping system that pairs smart contract transactions with off-chain documented commitments. It functions as a permanent court of record so downstream consumers (explorers, aggregators, wallets) have deterministic proof of developer behavior.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#D2554D] mb-2">
                What Rug Desk Is Not
              </h3>
              <p>
                Rug Desk is not an enforcement police force, not a custodian, and not an insurance protocol. It does not freeze user funds, blacklist tokens on private centralized relays, or issue financial restitution.
              </p>
            </div>
          </div>
        </div>

        {/* Integration Specs */}
        <div className="bg-[#111113] border border-[#242428] rounded-[6px] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#FAFAFA]">
            Developer & Screener Integration (Public ABI)
          </h2>
          <p className="text-xs text-[#A1A1AA]">
            Query contract verdicts directly on Ethereum Mainnet using standard view calls:
          </p>
          <pre className="p-4 bg-[#0A0A0B] border border-[#242428] rounded-[4px] text-[11px] font-mono text-[#FAFAFA] overflow-x-auto tabular-nums leading-relaxed">
{`// Sol: RugDeskRegistry.sol
interface IRugDeskRegistry {
    enum Verdict { NONE, RUG, CONTESTED, INSUFFICIENT }

    function getVerdict(address token) external view returns (
        Verdict verdict,
        uint256 evidenceCount,
        uint256 consensusBand,
        bytes32 evidenceRootHash
    );
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};
