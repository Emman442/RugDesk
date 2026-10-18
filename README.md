# RugDesk

**Evidence-based crypto investigations powered by GenLayer.**

RugDesk is a decentralized investigation and dispute platform designed to help crypto communities assess potential rug pulls and suspicious token activity. Built with GenLayer's intelligent smart contracts, it provides a structured workflow for submitting allegations, attaching public evidence, responding with defenses, reviewing claims, and finalizing investigation records.

Instead of treating every suspicious transaction as proof of fraud, RugDesk evaluates the available evidence and returns a verdict with supporting reasoning.

## Overview

Crypto users often struggle to distinguish legitimate projects from projects involved in suspicious activity. Liquidity withdrawals, abandoned roadmaps, misleading claims, and conflicting reports can make investigations difficult, especially when information is scattered across blockchain explorers, project websites, announcements, and independent research.

RugDesk organizes this process into a transparent case lifecycle. Each case records the allegation, the token address, the submitted evidence links, any defense provided, and the result of the review.

The platform uses GenLayer's intelligent smart contract execution to assess submitted evidence and produce a structured verdict.

### Key features

- **Case filing:** Submit a token address, an allegation, and supporting evidence URLs.
- **Evidence-based review:** Evaluate submitted public sources and generate a verdict with reasoning.
- **Defense submissions:** Allow a response to be attached before the case is reviewed.
- **Structured verdicts:** Return one of three verdicts: `rug`, `contested`, or `insufficient`.
- **Evidence digests:** Record evidence URLs, SHA-256 digests, and the number of characters processed during review.
- **Case finalization:** Finalize a case after its review has been completed.
- **Token investigation history:** Retrieve cases associated with a token address.
- **Case discovery:** List case IDs and retrieve individual case records.
- **Transparent records:** Store investigation details and lifecycle status through the smart contract.

## How it works

RugDesk follows a four-stage investigation lifecycle.

### 1. File a case

A user submits:
- The token's contract address.
- A written claim describing the suspected activity.
- One or more public evidence URLs.

The contract validates the input, creates a unique case ID, records the filer, and initializes the case with an `open` status.

### 2. Submit a defense

A defense can be submitted while the case is still open. The response may include a written explanation and additional evidence URLs.

After a successful defense submission, the case status becomes `defended`.

### 3. Review the evidence

The review process fetches the submitted evidence and evaluates the available information through GenLayer's intelligent execution.

The review produces a verdict, a written explanation, and evidence digests. The case moves to `reviewed`.

The verdicts are:

| Verdict | Meaning |
| --- | --- |
| `rug` | The available evidence supports the rug-pull allegation. |
| `contested` | The evidence presents conflicting claims or findings. |
| `insufficient` | The available evidence is not sufficient to support a stronger conclusion. |

These verdicts represent the assessment produced by the contract's review logic. They are not guarantees of fraud, innocence, or legal liability.

### 4. Finalize the case

After review, a case can be finalized. The contract records the finalization timestamp and changes the status to `finalized`.

The lifecycle is:

`open` → `defended` → `reviewed` → `finalized`

A case may also move directly from `open` to `reviewed` if no defense is submitted.

## Architecture

RugDesk consists of two main parts.

### Smart contract

The Python smart contract runs through GenLayer and manages case creation, defense submissions, evidence review, case retrieval, and finalization.

It maintains:
- The administrator address.
- The case collection.
- A case counter.
- A configured protocol fee in basis points.

The contract stores case records as JSON-serialized data and exposes methods for interacting with them.

### Frontend

The frontend provides the user interface for creating and viewing cases, submitting defenses, initiating reviews, and finalizing investigations.

The frontend integration uses TypeScript, React hooks, wallet connectivity, and a RugDesk contract client to interact with the deployed contract.

The contract client handles reads, writes, transaction receipt waiting, and parsing returned JSON values.

## Smart contract interface

The contract exposes the following methods.

| Method | Purpose |
| --- | --- |
| `file_case(token_address, claim, evidence_urls_json)` | Creates a new investigation case. |
| `add_defense(case_id, defense, defense_urls_json)` | Attaches a defense and supporting links. |
| `review_case(case_id)` | Evaluates the available evidence and returns the review result. |
| `finalize_case(case_id)` | Finalizes a reviewed case. |
| `get_case(case_id)` | Retrieves an individual case as a JSON string. |
| `get_cases_by_token(token_address)` | Retrieves cases associated with a token address. |
| `list_case_ids()` | Returns the available case IDs. |
| `get_admin()` | Returns the configured administrator address. |
| `get_total_cases()` | Returns the total number of cases created. |

### Case data structure

A case contains the following fields:

| Field | Description |
| --- | --- |
| `case_id` | Unique case identifier, such as `case_000002`. |
| `filer` | Address of the user who filed the case. |
| `token_address` | Token contract address being investigated. |
| `claim` | Description of the alleged activity. |
| `evidence_urls` | Evidence links submitted with the original claim. |
| `defense` | Written response, if one has been submitted. |
| `defense_urls` | Evidence links submitted with the defense. |
| `status` | Current lifecycle status. |
| `verdict` | Review outcome, if available. |
| `reasoning` | Explanation generated by the review process. |
| `evidence_digests` | Evidence URL, SHA-256 digest, and processed character count. |
| `created_at` | Case creation timestamp. |
| `reviewed_at` | Review timestamp. |
| `finalized_at` | Finalization timestamp. |
| `found` | Indicates whether the requested case was found. |

## Technology stack

- **GenLayer:** Intelligent smart contract execution and case management.
- **Python:** Smart contract implementation.
- **TypeScript:** Frontend contract integration and application types.
- **React:** Frontend user interface.
- **GenLayer JavaScript SDK:** Contract reads, writes, and transaction handling.
- **Wallet integration:** Connects the user's wallet for contract interactions.
- **React Query:** Manages asynchronous data fetching, caching, and query invalidation.

The exact deployment configuration depends on the network where the contract is deployed.

## Getting started

### Prerequisites

Before running the project, make sure you have:

- Node.js and npm installed.
- Python and the dependencies required by the GenLayer contract environment.
- A compatible wallet configured for the target GenLayer network.
- Access to GenLayer Studio or the appropriate deployed network.
- The deployed RugDesk contract address.

### 1. Clone the repository

Replace the placeholder URL with your repository URL.

```bash
git clone https://github.com/Emman442/RugDesk
cd RugDesk
```

### 2. Install frontend dependencies

```bash
npm install
```

If your frontend is located in a subdirectory, navigate into that directory before installing dependencies.

### 3. Configure environment variables

Create the appropriate environment file for your frontend.

For a Vite application, the contract address can be configured as:

```env
VITE_CONTRACT_ADDRESS=<YOUR_DEPLOYED_CONTRACT_ADDRESS>
```

Add any additional network configuration required by your existing contract client, including the correct RPC endpoint and chain configuration.

Use the network configuration supported by your installed GenLayer SDK. Do not assume that StudioNet, Studio Devnet, and other GenLayer environments use interchangeable chain IDs or endpoints.

**Security note:** Never expose private keys, wallet seed phrases, or other secrets through frontend environment variables. Vite variables prefixed with `VITE_` are exposed to client-side code.

### 4. Run the frontend

For a Vite project using the standard development script:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

If your repository uses a different development command, follow the script defined in its `package.json`.

### 5. Deploy or connect to the contract

Deploy the RugDesk Python contract using the appropriate GenLayer development environment, or configure the frontend to connect to an existing deployment.

Verify the following before testing:

- The contract address is correct.
- The wallet is connected to the intended network.
- The deployed contract exposes the expected RugDesk methods.
- The frontend SDK configuration matches the deployment environment.

## Testing RugDesk

A useful end-to-end test should exercise the complete case lifecycle.

### Test 1: Create a case

Submit a valid token address, a claim of at least 20 characters, and between one and five HTTPS evidence URLs.

Confirm that:
- The transaction is accepted.
- A case ID is returned or becomes available through the case list.
- The case status is `open`.
- The submitted claim and evidence URLs are stored correctly.

### Test 2: Submit a defense

Open the newly created case and submit a defense of at least 10 characters. Include up to five valid HTTPS evidence URLs.

Confirm that the case status changes to `defended`.

### Test 3: Review a case

Run the review method on a case with status `open` or `defended`.

Confirm that:
- The review returns a valid verdict.
- The reasoning is populated.
- Evidence digests are recorded.
- The case status changes to `reviewed`.

The verdict depends on the evidence that the contract can retrieve and evaluate. Do not assume a particular result in advance.

### Test 4: Finalize a case

Call `finalize_case` after the review has completed.

Confirm that the status becomes `finalized` and the finalization timestamp is recorded.

### Test 5: Verify retrieval

Test the following read methods:

- `get_case(case_id)`
- `get_cases_by_token(token_address)`
- `list_case_ids()`
- `get_admin()`
- `get_total_cases()`

Refresh the frontend and confirm that previously created cases remain available.

### Example test scenario

For a historical investigation, you could use public reporting about the AnubisDAO incident and its related on-chain transactions.

Treat this as an investigation exercise, not as an assertion that the contract's verdict is guaranteed to be correct. Confirm that each supplied URL is accessible and that the content supports the specific claim being tested.

## Evidence and review limitations

RugDesk depends on the quality, relevance, and availability of its submitted sources.

- A transaction can demonstrate on-chain activity without establishing the identity or intent of the person responsible.
- A token address alone does not prove that a token is fraudulent.
- A missing or inaccessible webpage may leave the reviewer with incomplete evidence.
- Public reporting can be incomplete, outdated, or disputed.
- A verdict can be affected by the content retrieved and the review process.
- An evidence digest helps record the content processed during a review, but does not independently establish the truth of that content.
- Review results should be independently verified before being used for consequential decisions.

RugDesk is intended to support structured investigations, not replace independent due diligence or professional legal advice.
