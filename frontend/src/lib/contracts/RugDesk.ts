
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";
import type {
  RugDeskCase,
  CaseVerdict,
  ReviewCaseResult,
  TransactionReceipt,
} from "./types";

const MAX_LINKS = 5;
const MAX_CLAIM_LENGTH = 2000;
const MAX_URL_LENGTH = 300;

function asRecord(value: unknown): Record<string, unknocwn> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function toStringValue(value: unknown, fallback = ""): string {
  if (value === undefined || value === null) return fallback;
  return String(value);
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "bigint") {
    return Number(value);
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function parseJson<T>(value: unknown, label: string): T {
  if (typeof value !== "string") {
    return value as T;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    throw new Error(`Failed to parse ${label} returned by RugDesk`);
  }
}

function normalizeVerdict(value: unknown): CaseVerdict | "" {
  if (
    value === "rug" ||
    value === "contested" ||
    value === "insufficient"
  ) {
    return value;
  }

  return "";
}

function normalizeCase(raw: unknown): RugDeskCase {
  const data = asRecord(raw);

  const found = Boolean(data.found);

  return {
    case_id: toStringValue(data.case_id),
    filer: toStringValue(data.filer),
    token_address: toStringValue(data.token_address),
    claim: toStringValue(data.claim),

    evidence_urls: Array.isArray(data.evidence_urls)
      ? data.evidence_urls.map(String)
      : [],

    defense: toStringValue(data.defense),

    defense_urls: Array.isArray(data.defense_urls)
      ? data.defense_urls.map(String)
      : [],

    status: (
      ["open", "defended", "reviewed", "finalized"].includes(
        toStringValue(data.status)
      )
        ? data.status
        : "open"
    ) as RugDeskCase["status"],

    verdict: normalizeVerdict(data.verdict),
    reasoning: toStringValue(data.reasoning),

    evidence_digests: Array.isArray(data.evidence_digests)
      ? data.evidence_digests.map((item) => {
          const digest = asRecord(item);

          return {
            url: toStringValue(digest.url),
            digest: toStringValue(digest.digest),
            chars: toNumber(digest.chars),
          };
        })
      : [],

    created_at: toStringValue(data.created_at),
    reviewed_at: toStringValue(data.reviewed_at),
    finalized_at: toStringValue(data.finalized_at),
    found,
  };
}

function validateCaseId(caseId: string): void {
  if (!caseId.trim()) {
    throw new Error("Case ID is required");
  }
}

function validateClaim(claim: string): void {
  const cleaned = claim.trim();

  if (cleaned.length < 20) {
    throw new Error("Claim must contain at least 20 characters");
  }

  if (cleaned.length > MAX_CLAIM_LENGTH) {
    throw new Error(
      `Claim cannot exceed ${MAX_CLAIM_LENGTH} characters`
    );
  }
}

function validateUrl(url: string): void {
  const cleaned = url.trim();

  if (
    !cleaned.startsWith("https://") ||
    cleaned.length > MAX_URL_LENGTH ||
    /localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.|10\./i.test(cleaned)
  ) {
    throw new Error(`Invalid HTTPS URL: ${url}`);
  }
}

function validateEvidenceUrls(urls: string[]): void {
  if (
    !Array.isArray(urls) ||
    urls.length < 1 ||
    urls.length > MAX_LINKS
  ) {
    throw new Error(
      `Provide between 1 and ${MAX_LINKS} evidence URLs`
    );
  }

  urls.forEach(validateUrl);
}

function validateDefenseUrls(urls: string[]): void {
  if (!Array.isArray(urls) || urls.length > MAX_LINKS) {
    throw new Error(
      `Provide no more than ${MAX_LINKS} defense URLs`
    );
  }

  urls.forEach(validateUrl);
}

class RugDesk {
  private contractAddress: `0x${string}`;
  private client: ReturnType<typeof createClient>;

  constructor(
    contractAddress: string,
    address?: string | null,
    studioUrl?: string
  ) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
      throw new Error("Invalid RugDesk contract address");
    }

    this.contractAddress = contractAddress as `0x${string}`;

    const config: Record<string, unknown> = {
      chain: studionet,
    };

    if (address) {
      config.account = address as `0x${string}`;
    }

    if (studioUrl) {
      config.endpoint = studioUrl;
    }

    this.client = createClient(config as Parameters<typeof createClient>[0]);
  }

  updateAccount(address: string): void {
    this.client = createClient({
      chain: studionet,
      account: address as `0x${string}`,
    });
  }

  private async read<T>(
    functionName: string,
    args: unknown[] = []
  ): Promise<T> {
    return (await this.client.readContract({
      address: this.contractAddress,
      functionName,
      args,
    })) as T;
  }

  private async write(
    functionName: string,
    args: unknown[] = []
  ): Promise<TransactionReceipt> {
    await this.client.connect("studionet");

    const txHash = await this.client.writeContract({
      address: this.contractAddress,
      functionName,
      args,
    });

    const receipt = await this.client.waitForTransactionReceipt({
      hash: txHash,
      status: TransactionStatus.ACCEPTED,
      retries: 48,
      interval: 5000,
    });

    return receipt as TransactionReceipt;
  }

  /**
   * File a new rug-pull review case.
   * Contract: file_case(token_address, claim, evidence_urls_json)
   */
  async fileCase(
    tokenAddress: string,
    claim: string,
    evidenceUrls: string[],
    tokenSymbol: string
  ): Promise<TransactionReceipt> {
    if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
      throw new Error("Token address must be a valid 0x address");
    }

    validateClaim(claim);
    validateEvidenceUrls(evidenceUrls);

    return this.write("file_case", [
      tokenAddress.trim(),
      claim.trim(),
      JSON.stringify(evidenceUrls),
      tokenSymbol
    ]);
  }

  /**
   * Submit a project's defense.
   * Contract: add_defense(case_id, defense, defense_urls_json)
   */
  async addDefense(
    caseId: string,
    defense: string,
    defenseUrls: string[] = []
  ): Promise<TransactionReceipt> {
    validateCaseId(caseId);

    if (defense.trim().length < 10) {
      throw new Error(
        "Defense must contain at least 10 characters"
      );
    }

    if (defense.trim().length > MAX_CLAIM_LENGTH) {
      throw new Error(
        `Defense cannot exceed ${MAX_CLAIM_LENGTH} characters`
      );
    }

    validateDefenseUrls(defenseUrls);

    return this.write("add_defense", [
      caseId.trim(),
      defense.trim(),
      JSON.stringify(defenseUrls),
    ]);
  }

  /**
   * Run the nondeterministic evidence review.
   * Contract: review_case(case_id)
   */
  async reviewCase(
    caseId: string
  ): Promise<TransactionReceipt> {
    validateCaseId(caseId);
    return this.write("review_case", [caseId.trim()]);
  }

  /**
   * Finalize a reviewed case.
   * Contract: finalize_case(case_id)
   */
  async finalizeCase(
    caseId: string
  ): Promise<TransactionReceipt> {
    validateCaseId(caseId);
    return this.write("finalize_case", [caseId.trim()]);
  }

  /**
   * Get one case by its ID.
   * Returns found=false when the case does not exist.
   */
  async getCase(caseId: string): Promise<RugDeskCase> {
    validateCaseId(caseId);

    const raw = await this.read<string>("get_case", [
      caseId.trim(),
    ]);

    return normalizeCase(parseJson<unknown>(raw, "get_case"));
  }

  /**
   * Get all cases associated with a token address.
   */
  async getCasesByToken(
    tokenAddress: string
  ): Promise<RugDeskCase[]> {
    if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
      throw new Error("Token address must be a valid 0x address");
    }

    const raw = await this.read<string>("get_cases_by_token", [
      tokenAddress.trim(),
    ]);

    const rows = parseJson<unknown>(
      raw,
      "get_cases_by_token"
    );

    return Array.isArray(rows) ? rows.map(normalizeCase) : [];
  }

  /**
   * List every case ID.
   */
  async listCaseIds(): Promise<string[]> {
    const raw = await this.read<string>("list_case_ids");
    const result = parseJson<unknown>(raw, "list_case_ids");

    return Array.isArray(result)
      ? result.map(String)
      : [];
  }

  /**
   * Get the contract administrator address.
   */
  async getAdmin(): Promise<string> {
    const raw = await this.read<unknown>("get_admin");
    return toStringValue(raw);
  }

  /**
   * Get the total number of cases created.
   */
  async getTotalCases(): Promise<number> {
    const raw = await this.read<unknown>("get_total_cases");
    return toNumber(raw);
  }
}

export default RugDesk;
