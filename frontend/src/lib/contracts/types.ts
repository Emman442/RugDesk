/**
 * TypeScript types for the GenLayer RugDesk contract.
 */

export type CaseStatus =
  | "open"
  | "defended"
  | "reviewed"
  | "finalized";

export type CaseVerdict =
  | "rug"
  | "contested"
  | "insufficient"
  | "";

export interface EvidenceDigest {
  url: string;
  digest: string;
  chars: number;
}

export interface RugDeskCase {
  case_id: string;
  filer: string;
  token_address: string;
  symbol: string;                 // ← added
  claim: string;
  evidence_urls: string[];
  defense: string;
  defense_urls: string[];
  status: CaseStatus;
  verdict: CaseVerdict;
  reasoning: string;
  evidence_digests: EvidenceDigest[];
  created_at: string;
  reviewed_at: string;
  finalized_at: string;
  found: boolean;
}

export interface ReviewCaseResult {
  case_id: string;
  verdict: CaseVerdict;
  reasoning: string;
}

export interface FileCaseParams {
  token_address: string;
  claim: string;
  evidence_urls: string[];
  symbol?: string;                // ← added (optional)
}

export interface AddDefenseParams {
  case_id: string;
  defense: string;
  defense_urls: string[];
}

export interface ReviewCaseParams {
  case_id: string;
}

export interface FinalizeCaseParams {
  case_id: string;
}

export interface CaseFilters {
  status?: CaseStatus;
  verdict?: CaseVerdict;
  filer?: string;
  token_address?: string;
  symbol?: string;
}

export interface TransactionReceipt {
  status: string;
  hash: string;
  blockNumber?: number;
  [key: string]: unknown;
}

export type GetCaseResult = RugDeskCase;
export type GetCasesByTokenResult = RugDeskCase[];
export type ListCaseIdsResult = string[];
export type RawContractString = string;