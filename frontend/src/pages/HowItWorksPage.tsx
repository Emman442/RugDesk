import React from 'react';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  const phases = [
    {
      num: '01',
      title: 'File',
      summary: 'Token address + claim + evidence URLs',
      details: [
        'A holder, investigator, or community member submits the target smart contract address.',
        'The filer selects the breach classification (liquidity extraction, unannounced founder dump, unauthorized mint, or deceptive lock).',
        'Filer submits documentary proof: block explorer transaction hashes, bytecode decompilation links, and time-stamped archival URLs (archive.is, IPFS, or Wayback Machine) capturing the team’s original promises.'
      ]
    },
    {
      num: '02',
      title: 'Defend',
      summary: 'Project may respond with its own links',
      details: [
        'A formal 72-hour defense window begins upon docket registration.',
        'The deploying address or authorized team multisig may file verified counter-evidence (e.g. proof of external whitehat compromise, hardware exploit post-mortem, or planned treasury migration announcement).',
        'Counter-claims are added directly as formal Exhibits into the case dossier without editing the original filing.'
      ]
    },
    {
      num: '03',
      title: 'Review',
      summary: 'Validators fetch the sources and agree on a band',
      details: [
        'Independent decentralized validator nodes fetch the submitted cryptographic and archival sources.',
        'Nodes execute call-trace replay against Ethereum mainnet historical state to verify the exact balance movements and caller authority.',
        'Validators score the correlation between the documented promise and executed transaction, voting into a consensus band.'
      ]
    },
    {
      num: '04',
      title: 'Record',
      summary: 'Verdict (Rug / Contested / Insufficient) stored against the token contract',
      details: [
        'Upon reaching quorum threshold (66.7%+), the definitive verdict is inscribed on-chain into the Rug Desk registry.',
        'Possible verdicts are strictly defined: Rug (breach confirmed), Contested (disputed with counter-evidence), or Insufficient (lacking proof).',
        'The record is permanent and non-expiring, instantly accessible to any block explorer, DEX interface, or automated wallet warning provider.'
      ]
    }
  ];

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="mb-10 pb-6 border-b border-[#242428]">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAFA]">
            How a Case Runs
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            The four-phase court lifecycle from initial filing to immutable on-chain record.
          </p>
        </div>

        <div className="space-y-6">
          {phases.map((phase) => (
            <div
              key={phase.num}
              className="bg-[#111113] border border-[#242428] rounded-[6px] p-6 space-y-4"
            >
              <div className="flex items-center gap-3 border-b border-[#242428] pb-3">
                <span className="text-xs font-mono tabular-nums text-[#71717A]">
                  Phase {phase.num}
                </span>
                <h2 className="text-lg font-bold text-[#FAFAFA]">
                  {phase.title}
                </h2>
                <span className="text-xs text-[#A1A1AA] font-mono">
                  — {phase.summary}
                </span>
              </div>

              <ul className="space-y-2 text-xs text-[#A1A1AA] leading-relaxed">
                {phase.details.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#3B6CFF] font-mono tabular-nums shrink-0 mt-0.5">·</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Strip */}
        <div className="mt-10 p-6 bg-[#17171A] border border-[#242428] rounded-[6px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#FAFAFA]">
              Ready to file evidence against a broken contract?
            </h3>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Submit your claim, transaction hashes, and archival proofs to the court.
            </p>
          </div>
          <Link
            to="/file"
            className="px-5 py-2 text-xs font-semibold text-[#FAFAFA] bg-[#3B6CFF] hover:bg-[#325bd9] rounded-full transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            File a case now
          </Link>
        </div>
      </div>
    </div>
  );
};
