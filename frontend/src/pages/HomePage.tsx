import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Hero } from '../components/Hero';
import { CourtTicker } from '../components/CourtTicker';
import { StatsBar } from '../components/StatsBar';
import { HowItWorks } from '../components/HowItWorks';
import { DocketTable } from '../components/DocketTable';
import { WhatRecordDoes } from '../components/WhatRecordDoes';
import { RugDeskCase } from '../lib/contracts/types';
import { useRugDeskCase, useRugDeskCaseIds } from '../lib/hooks/useRugDesk';

const CaseRow: React.FC<{
  caseId: string;
  onLoaded: (caseId: string, caseData: RugDeskCase | null) => void;
}> = ({ caseId, onLoaded }) => {
  const { data, isError } = useRugDeskCase(caseId);

  useEffect(() => {
    if (data) onLoaded(caseId, data.found ? data : null);
    else if (isError) onLoaded(caseId, null);
  }, [caseId, data, isError, onLoaded]);

  return null;
};

export const HomePage: React.FC = () => {
  const { data: caseIds, isPending: loadingIds } = useRugDeskCaseIds();
  const [loadedCases, setLoadedCases] = useState<Record<string, RugDeskCase | null>>({});

  useEffect(() => {
    setLoadedCases({});
  }, [caseIds?.join('|')]);

  const handleLoadedCase = useCallback((caseId: string, caseData: RugDeskCase | null) => {
    setLoadedCases((previous) => ({ ...previous, [caseId]: caseData }));
  }, []);

  const cases = useMemo(() => (caseIds ?? [])
    .filter((id) => Object.prototype.hasOwnProperty.call(loadedCases, id))
    .map((id) => loadedCases[id])
    .filter((item): item is RugDeskCase => Boolean(item?.found)), [caseIds, loadedCases]);
  const loading = loadingIds || Boolean(caseIds?.some((id) => !Object.prototype.hasOwnProperty.call(loadedCases, id)));

  return (
    <div>
      {caseIds?.map((caseId) => (
        <CaseRow key={caseId} caseId={caseId} onLoaded={handleLoadedCase} />
      ))}
      <CourtTicker cases={cases} />

      <Hero />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <StatsBar totalCases={cases.length} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <HowItWorks />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {loading ? (
          <div className="py-12 text-center text-xs text-[#71717A]">Loading docket…</div>
        ) : (
          <DocketTable cases={cases} isCompact={true} />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <WhatRecordDoes />
      </motion.div>
    </div>
  );
};
