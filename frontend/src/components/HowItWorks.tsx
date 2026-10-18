import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'File',
      description: 'Token address + claim + evidence URLs.',
      detail: 'Any holder submits the verified contract address, specifies the promise breached, and provides links to archives or call logs.'
    },
    {
      step: '02',
      title: 'Defend',
      description: 'Project may respond with its own links.',
      detail: 'Deployer or team has a 72-hour window to submit counter-evidence, audited multisig records, or explanatory post-mortems.'
    },
    {
      step: '03',
      title: 'Review',
      description: 'Validators fetch the sources and agree on a band.',
      detail: 'Independent evidentiary nodes reproduce the call traces, verify IPFS archives, and attest on-chain consensus.'
    },
    {
      step: '04',
      title: 'Record',
      description: 'Verdict (Rug / Contested / Insufficient) stored against the token contract.',
      detail: 'The final disposition is written to the immutable registry, callable by any block explorer, screener, or DEX interface.'
    }
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 border-b border-[#242428]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAFAFA]">
            How a case runs
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Four evidentiary phases from initial filing to on-chain recording.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-[#111113] border border-[#242428] rounded-[6px] p-5 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-mono tabular-nums text-[#71717A] mb-3">
                  {item.step}
                </div>
                <h3 className="text-base font-semibold text-[#FAFAFA] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs font-medium text-[#FAFAFA] mb-2 leading-snug">
                  {item.description}
                </p>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
