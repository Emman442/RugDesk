
import React from "react";
import { Link } from "react-router-dom";
import { DocketTable } from "../components/DocketTable";
import {
  useRugDeskCaseIds,
  useRugDeskTotalCases,
  useRugDeskCase,
} from "../lib/hooks/useRugDesk";
import type { RugDeskCase } from "../lib/contracts/types";

const CaseRow: React.FC<{
  caseId: string;
  onLoaded: (caseData: RugDeskCase | null) => void;
}> = ({ caseId, onLoaded }) => {
  const { data, isPending, isError } = useRugDeskCase(caseId);

  React.useEffect(() => {
    if (data) {
      onLoaded(data.found ? data : null);
    } else if (isError) {
      onLoaded(null);
    }
  }, [data, isError, onLoaded]);

  return null;
};

export const DocketPage: React.FC = () => {
  const {
    data: caseIds,
    isPending: isFetchingIds,
    isError: isIdsError,
    error: idsError,
    refetch: refetchIds,
  } = useRugDeskCaseIds();

  const {
    data: totalCases,
    isError: isTotalError,
  } = useRugDeskTotalCases();

  const [loadedCases, setLoadedCases] = React.useState<
    Record<string, RugDeskCase | null>
  >({});

  const handleLoadedCase = React.useCallback(
    (caseId: string, caseData: RugDeskCase | null) => {
      setLoadedCases((previous) => {
        if (previous[caseId] === caseData) return previous;

        return {
          ...previous,
          [caseId]: caseData,
        };
      });
    },
    []
  );

  React.useEffect(() => {
    setLoadedCases({});
  }, [caseIds?.join("|")]);

  const cases = React.useMemo(() => {
    if (!caseIds) return [];

    return caseIds
      .filter((id) => Object.prototype.hasOwnProperty.call(loadedCases, id))
      .map((id) => loadedCases[id])
      .filter(
        (item): item is RugDeskCase =>
          item !== null && item !== undefined && item.found
      );
  }, [caseIds, loadedCases]);

  const failedCaseIds = React.useMemo(
    () =>
      (caseIds ?? []).filter(
        (id) =>
          Object.prototype.hasOwnProperty.call(loadedCases, id) &&
          loadedCases[id] === null
      ),
    [caseIds, loadedCases]
  );

  const isLoadingCases =
    isFetchingIds ||
    Boolean(
      caseIds?.some(
        (id) => !Object.prototype.hasOwnProperty.call(loadedCases, id)
      )
    );

  const hasCases = Boolean(caseIds && caseIds.length > 0);

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#242428]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAFA]">
              Court Docket
            </h1>
            <p className="text-xs text-[#A1A1AA] mt-1">
              Public ledger of filed cases, evidence trails, and review
              dispositions across token contracts.
            </p>
            {!isFetchingIds && !isIdsError && (
              <p className="text-xs text-[#71717A] mt-2">
                {totalCases !== undefined
                  ? `${totalCases} total case${totalCases === 1 ? "" : "s"} recorded`
                  : `${caseIds?.length ?? 0} case IDs retrieved`}
                {isTotalError && " · Total count temporarily unavailable"}
              </p>
            )}
          </div>

          <Link
            to="/file"
            className="px-5 py-2 text-xs font-semibold text-[#FAFAFA] bg-[#3B6CFF] hover:bg-[#325bd9] rounded-full transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            + File a case
          </Link>
        </div>
      </div>

      {/* Load individual cases using their IDs. */}
      {hasCases &&
        caseIds?.map((caseId) => (
          <CaseRow
            key={caseId}
            caseId={caseId}
            onLoaded={(caseData) => handleLoadedCase(caseId, caseData)}
          />
        ))}

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {isFetchingIds && (
          <div
            className="rounded-md border border-[#242428] bg-[#111113] p-8 text-center"
            role="status"
          >
            <div className="text-sm text-[#FAFAFA]">
              Loading court docket...
            </div>
            <p className="text-xs text-[#A1A1AA] mt-2">
              Fetching recorded case IDs from the contract.
            </p>
          </div>
        )}

        {isIdsError && (
          <div
            className="rounded-md border border-red-900/50 bg-[#111113] p-6"
            role="alert"
          >
            <h2 className="text-sm font-semibold text-[#FAFAFA]">
              Unable to load the docket
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-2 break-words">
              {idsError?.message ||
                "The contract could not return the case records. Check your network and contract configuration."}
            </p>
            <button
              type="button"
              onClick={() => refetchIds()}
              className="mt-4 rounded-full bg-[#3B6CFF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#325bd9]"
            >
              Try again
            </button>
          </div>
        )}

        {!isFetchingIds && !isIdsError && !hasCases && (
          <div className="rounded-md border border-[#242428] bg-[#111113] p-10 text-center">
            <h2 className="text-base font-semibold text-[#FAFAFA]">
              No cases filed yet
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#A1A1AA]">
              The docket is empty. Be the first to submit a claim for review.
            </p>
            <Link
              to="/file"
              className="inline-block mt-5 rounded-full bg-[#3B6CFF] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#325bd9]"
            >
              File the first case
            </Link>
          </div>
        )}

        {!isIdsError && hasCases && cases.length > 0 && (
          <DocketTable cases={cases} isCompact={false} />
        )}

        {!isIdsError &&
          hasCases &&
          isLoadingCases &&
          cases.length === 0 && (
            <div className="rounded-md border border-[#242428] bg-[#111113] p-6 text-center">
              <p className="text-sm text-[#FAFAFA]">
                Loading case details...
              </p>
              <p className="mt-2 text-xs text-[#A1A1AA]">
                The docket contains case IDs, but their records are still
                being retrieved.
              </p>
            </div>
          )}

        {!isIdsError &&
          hasCases &&
          !isLoadingCases &&
          cases.length === 0 && (
            <div
              className="rounded-md border border-amber-900/50 bg-[#111113] p-6"
              role="alert"
            >
              <h2 className="text-sm font-semibold text-[#FAFAFA]">
                Case details unavailable
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#A1A1AA]">
                Case IDs were found, but none of their records could be
                loaded. Some records may be missing or the contract reads
                may have failed.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLoadedCases({});
                  refetchIds();
                }}
                className="mt-4 rounded-full bg-[#3B6CFF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#325bd9]"
              >
                Retry loading
              </button>
            </div>
          )}

        {!isIdsError &&
          hasCases &&
          failedCaseIds.length > 0 &&
          cases.length > 0 && (
            <p className="mt-4 text-xs text-amber-400" role="status">
              {failedCaseIds.length} case record
              {failedCaseIds.length === 1 ? "" : "s"} could not be loaded.
              The remaining cases are displayed.
            </p>
          )}
      </div>

      {/* Docket standards */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-12">
        <div className="bg-[#111113] border border-[#242428] rounded-[6px] p-6 text-xs space-y-3">
          <h2 className="text-sm font-semibold text-[#FAFAFA]">
            Evidentiary Standards & Record Invariants
          </h2>
          <p className="text-[#A1A1AA] leading-relaxed">
            Each case stores its claim, submitted evidence links, any
            project defense, the review verdict, and evidence digests.
            Review outcomes are recorded through the RugDesk contract.
          </p>
          <div className="pt-2 text-[11px] font-mono text-[#71717A]">
            Registry contract:{" "}
            <span className="text-[#FAFAFA] tabular-nums">
              Configured contract address
            </span>
            {" · "}
            Verdicts:{" "}
            <span className="text-[#FAFAFA]">
              rug / contested / insufficient
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
