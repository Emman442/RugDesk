
"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";

import RugDesk from "../contracts/RugDesk";
import { getContractAddress, getStudioUrl } from "../genlayer/client";
import { useWallet } from "../genlayer/wallet";
import { success, error, configError } from "../utils/toast";
import type {
  RugDeskCase,
  TransactionReceipt,
} from "../contracts/types";

/**
 * Query keys shared by RugDesk hooks.
 */
export const rugDeskKeys = {
  all: ["rugDesk"] as const,
  caseIds: () => [...rugDeskKeys.all, "caseIds"] as const,
  totalCases: () => [...rugDeskKeys.all, "totalCases"] as const,
  admin: () => [...rugDeskKeys.all, "admin"] as const,
  case: (caseId: string) =>
    [...rugDeskKeys.all, "case", caseId] as const,
  tokenCases: (tokenAddress: string) =>
    [...rugDeskKeys.all, "tokenCases", tokenAddress.toLowerCase()] as const,
};

/**
 * Get the RugDesk contract instance.
 *
 * Returns null when the contract address is not configured.
 * Read operations can work without a connected wallet.
 * Write operations require a connected wallet.
 */
export function useRugDeskContract(): RugDesk | null {
  const { address } = useWallet();
  const contractAddress = getContractAddress();
  const studioUrl = getStudioUrl();

  return useMemo(() => {
    if (!contractAddress) {
      configError(
        "Setup Required",
        "Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in your .env file.",
        {
          label: "Setup Guide",
          onClick: () => window.open("/docs/setup", "_blank"),
        }
      );

      return null;
    }

    return new RugDesk(contractAddress, address, studioUrl);
  }, [contractAddress, address, studioUrl]);
}

/**
 * Fetch a case by ID.
 */
export function useRugDeskCase(caseId: string | null | undefined) {
  const contract = useRugDeskContract();

  return useQuery<RugDeskCase, Error>({
    queryKey: rugDeskKeys.case(caseId ?? ""),
    queryFn: async () => {
      if (!contract) {
        throw new Error("RugDesk contract is not configured.");
      }

      if (!caseId) {
        throw new Error("Case ID is required.");
      }

      return contract.getCase(caseId);
    },
    enabled: Boolean(contract && caseId),
    refetchOnWindowFocus: true,
    staleTime: 2000,
  });
}

/**
 * Fetch every case ID.
 */
export function useRugDeskCaseIds() {
  const contract = useRugDeskContract();

  return useQuery<string[], Error>({
    queryKey: rugDeskKeys.caseIds(),
    queryFn: async () => {
      if (!contract) {
        throw new Error("RugDesk contract is not configured.");
      }

      return contract.listCaseIds();
    },
    enabled: Boolean(contract),
    refetchOnWindowFocus: true,
    staleTime: 2000,
  });
}

/**
 * Fetch cases associated with a token address.
 */
export function useRugDeskTokenCases(
  tokenAddress: string | null | undefined
) {
  const contract = useRugDeskContract();

  return useQuery<RugDeskCase[], Error>({
    queryKey: rugDeskKeys.tokenCases(tokenAddress ?? ""),
    queryFn: async () => {
      if (!contract) {
        throw new Error("RugDesk contract is not configured.");
      }

      if (!tokenAddress) {
        throw new Error("Token address is required.");
      }

      return contract.getCasesByToken(tokenAddress);
    },
    enabled: Boolean(contract && tokenAddress),
    refetchOnWindowFocus: true,
    staleTime: 2000,
  });
}

/**
 * Fetch the total number of cases.
 */
export function useRugDeskTotalCases() {
  const contract = useRugDeskContract();

  return useQuery<number, Error>({
    queryKey: rugDeskKeys.totalCases(),
    queryFn: async () => {
      if (!contract) {
        throw new Error("RugDesk contract is not configured.");
      }

      return contract.getTotalCases();
    },
    enabled: Boolean(contract),
    refetchOnWindowFocus: true,
    staleTime: 2000,
  });
}

/**
 * Fetch the contract administrator.
 */
export function useRugDeskAdmin() {
  const contract = useRugDeskContract();

  return useQuery<string, Error>({
    queryKey: rugDeskKeys.admin(),
    queryFn: async () => {
      if (!contract) {
        throw new Error("RugDesk contract is not configured.");
      }

      return contract.getAdmin();
    },
    enabled: Boolean(contract),
    refetchOnWindowFocus: true,
    staleTime: 10_000,
  });
}

/**
 * Shared cache invalidation after a case changes.
 */
function invalidateRugDeskQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  caseId?: string,
  tokenAddress?: string
) {
  queryClient.invalidateQueries({
    queryKey: rugDeskKeys.caseIds(),
  });

  queryClient.invalidateQueries({
    queryKey: rugDeskKeys.totalCases(),
  });

  if (caseId) {
    queryClient.invalidateQueries({
      queryKey: rugDeskKeys.case(caseId),
    });
  }

  if (tokenAddress) {
    queryClient.invalidateQueries({
      queryKey: rugDeskKeys.tokenCases(tokenAddress),
    });
  }

  // Refresh all cached RugDesk case details and token-case lists.
  queryClient.invalidateQueries({
    queryKey: rugDeskKeys.all,
  });
}

/**
 * File a new rug-pull review case.
 */
export function useFileRugDeskCase() {
  const contract = useRugDeskContract();
  const { address } = useWallet();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    TransactionReceipt,
    Error,
    {
      tokenAddress: string;
      claim: string;
      evidenceUrls: string[];
      tokenSymbol: string
    }
  >({
    mutationFn: async ({
      tokenAddress,
      claim,
      evidenceUrls,
      tokenSymbol
    }) => {
      if (!contract) {
        throw new Error("RugDesk contract is not configured.");
      }

      if (!address) {
        throw new Error(
          "Wallet not connected. Connect your wallet to file a case."
        );
      }

      return contract.fileCase(tokenAddress, claim, evidenceUrls, tokenSymbol);
    },
    onSuccess: () => {
      invalidateRugDeskQueries(queryClient);

      success("Case filed successfully!", {
        description: "Your case filing transaction was accepted.",
      });
    },
    onError: (err) => {
      console.error("Error filing RugDesk case:", err);

      error("Failed to file case", {
        description: err.message || "Please try again.",
      });
    },
  });

  return {
    ...mutation,
    fileCase: mutation.mutate,
    fileCaseAsync: mutation.mutateAsync,
    isFiling: mutation.isPending,
  };
}

/**
 * Submit a project's defense.
 */
export function useAddRugDeskDefense() {
  const contract = useRugDeskContract();
  const { address } = useWallet();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    TransactionReceipt,
    Error,
    {
      caseId: string;
      defense: string;
      defenseUrls?: string[];
      tokenAddress?: string;
    }
  >({
    mutationFn: async ({
      caseId,
      defense,
      defenseUrls = [],
    }) => {
      if (!contract) {
        throw new Error("RugDesk contract is not configured.");
      }

      if (!address) {
        throw new Error(
          "Wallet not connected. Connect your wallet to submit a defense."
        );
      }

      return contract.addDefense(caseId, defense, defenseUrls);
    },
    onSuccess: (_receipt, variables) => {
      invalidateRugDeskQueries(
        queryClient,
        variables.caseId,
        variables.tokenAddress
      );

      success("Defense submitted!", {
        description: "The defense transaction was accepted.",
      });
    },
    onError: (err) => {
      console.error("Error submitting defense:", err);

      error("Failed to submit defense", {
        description: err.message || "Please try again.",
      });
    },
  });

  return {
    ...mutation,
    addDefense: mutation.mutate,
    addDefenseAsync: mutation.mutateAsync,
    isSubmittingDefense: mutation.isPending,
  };
}

/**
 * Request an evidence review.
 *
 * The contract performs nondeterministic review execution.
 * The receipt alone does not prove that the case reached "reviewed".
 */
export function useReviewRugDeskCase() {
  const contract = useRugDeskContract();
  const { address } = useWallet();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    TransactionReceipt,
    Error,
    {
      caseId: string;
      tokenAddress?: string;
    }
  >({
    mutationFn: async ({ caseId }) => {
      if (!contract) {
        throw new Error("RugDesk contract is not configured.");
      }

      if (!address) {
        throw new Error(
          "Wallet not connected. Connect your wallet to request a review."
        );
      }

      return contract.reviewCase(caseId);
    },
    onSuccess: (_receipt, variables) => {
      invalidateRugDeskQueries(
        queryClient,
        variables.caseId,
        variables.tokenAddress
      );

      success("Review transaction accepted", {
        description:
          "Check the case status and verdict to confirm the review completed.",
      });
    },
    onError: (err) => {
      console.error("Error reviewing RugDesk case:", err);

      error("Review failed", {
        description: err.message || "Please try again.",
      });
    },
  });

  return {
    ...mutation,
    reviewCase: mutation.mutate,
    reviewCaseAsync: mutation.mutateAsync,
    isReviewing: mutation.isPending,
  };
}

/**
 * Finalize a case that has already been reviewed.
 */
export function useFinalizeRugDeskCase() {
  const contract = useRugDeskContract();
  const { address } = useWallet();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    TransactionReceipt,
    Error,
    {
      caseId: string;
      tokenAddress?: string;
    }
  >({
    mutationFn: async ({ caseId }) => {
      if (!contract) {
        throw new Error("RugDesk contract is not configured.");
      }

      if (!address) {
        throw new Error(
          "Wallet not connected. Connect your wallet to finalize a case."
        );
      }

      return contract.finalizeCase(caseId);
    },
    onSuccess: (_receipt, variables) => {
      invalidateRugDeskQueries(
        queryClient,
        variables.caseId,
        variables.tokenAddress
      );

      success("Finalization transaction accepted", {
        description:
          "Refresh the case status to confirm finalization.",
      });
    },
    onError: (err) => {
      console.error("Error finalizing RugDesk case:", err);

      error("Failed to finalize case", {
        description: err.message || "Please try again.",
      });
    },
  });

  return {
    ...mutation,
    finalizeCase: mutation.mutate,
    finalizeCaseAsync: mutation.mutateAsync,
    isFinalizing: mutation.isPending,
  };
}
