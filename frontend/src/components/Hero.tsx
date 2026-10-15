import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { EvidenceCard } from './EvidenceCard';

export const Hero: React.FC = () => {
  return (
    <section className="pt-10 sm:pt-14 pb-12 sm:pb-16 border-b border-[#242428]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#D2554D] rounded-full inline-block" />
                <span>Autonomous On-Chain Courtroom</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAFAFA]">
                Rug Desk
              </h1>
              <h2 className="text-xl sm:text-2xl font-medium text-[#FAFAFA] tracking-tight">
                Put broken crypto promises on record.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-xl">
              A holder files after liquidity is pulled or a team dumps. Validators fetch the public evidence and write a permanent verdict against the token contract.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/file"
                className="px-6 py-2.5 text-xs font-semibold text-[#FAFAFA] bg-[#3B6CFF] hover:bg-[#325bd9] rounded-full transition-colors whitespace-nowrap cursor-pointer"
              >
                File a case
              </Link>
              <Link
                to="/docket"
                className="px-6 py-2.5 text-xs font-semibold text-[#FAFAFA] bg-transparent border border-[#242428] hover:bg-[#17171A] rounded-full transition-colors whitespace-nowrap cursor-pointer"
              >
                View the docket
              </Link>
            </div>
          </motion.div>

          {/* Right Column: High-Precision Explorer Evidence Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 w-full"
          >
            <EvidenceCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
