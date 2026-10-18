import React from 'react';
import { Link } from 'react-router-dom';
import { RugDeskCase } from '../lib/contracts/types';

interface CourtTickerProps {
  cases: RugDeskCase[];
}

export const CourtTicker: React.FC<CourtTickerProps> = ({ cases }) => {
  const tickerItems = cases.concat(cases); // duplicate for seamless infinite loop

  return (
    <div></div>
  );
};
