"""Direct-mode tests for RugDesk"""

import json
import pytest

CONTRACT = "contracts/rugdesk.py"  # adjust path if needed


def deploy(direct_vm, direct_deploy, admin, fee_bps=0):
    direct_vm.sender = admin
    direct_vm.value = 0
    return direct_deploy(
        CONTRACT,
        str(admin),          # admin_address
        fee_bps,             # protocol_fee_bps
        sdk_version="v0.2.16",
    )

def mock_review(direct_vm, verdict="rug", reasoning="Clear contradiction"):
    """Mock web fetches + LLM for review_case."""
    direct_vm.mock_web(
        r".*",
        {"status": 200, "body": "Public evidence page content for the claim."},
    )
    direct_vm.mock_llm(
        r"You are a neutral court",  # Updated regex to match prompt start reliably
        json.dumps({"verdict": verdict, "reasoning": reasoning}),
    )
    
    
def file_basic(contract, direct_vm, token="0x" + "a" * 40, claim="Liquidity was removed 3 days after launch despite lock promise.", urls=None, symbol="TEST"):
    if urls is None:
        urls = ["https://example.com/evidence"]
    return contract.file_case(
        token,
        claim,
        json.dumps(urls),
        symbol,
    )


# ─────────────────────────────────────────────────────────────
# Constructor
# ─────────────────────────────────────────────────────────────

def test_constructor_rejects_bad_fee(direct_vm, direct_deploy, direct_owner):
    direct_vm.sender = direct_owner
    with pytest.raises((AssertionError, Exception), match="fee must be 0-1000"):
        direct_deploy(CONTRACT, str(direct_owner), 1001, sdk_version="v0.2.16")
    with pytest.raises((AssertionError, Exception), match="fee must be 0-1000"):
        direct_deploy(CONTRACT, str(direct_owner), -1, sdk_version="v0.2.16")


def test_constructor_sets_admin_and_fee(direct_vm, direct_deploy, direct_owner):
    contract = deploy(direct_vm, direct_deploy, direct_owner, 50)
    assert contract.get_admin() == str(direct_owner).lower()
    assert int(contract.get_total_cases()) == 0


# ─────────────────────────────────────────────────────────────
# file_case
# ─────────────────────────────────────────────────────────────

def test_file_case_basic(direct_vm, direct_deploy, direct_owner, direct_alice):
    contract = deploy(direct_vm, direct_deploy, direct_owner)
    direct_vm.sender = direct_alice

    case_id = file_basic(contract, direct_vm, symbol="RUG")
    assert case_id == "case_000001"  # Updated to match zero-padded ID format

    raw = contract.get_case(case_id)
    row = json.loads(raw)
    assert row["found"] is True
    assert row["case_id"] == "case_000001"
    assert row["status"] == "open"
    assert row["symbol"] == "RUG"
    assert row["filer"] == str(direct_alice)
    assert row["token_address"] == "0x" + "a" * 40
    assert int(contract.get_total_cases()) == 1

def test_file_case_rejects_bad_inputs(direct_vm, direct_deploy, direct_owner, direct_alice):
    contract = deploy(direct_vm, direct_deploy, direct_owner)
    direct_vm.sender = direct_alice

    # bad address
    with pytest.raises((AssertionError, Exception), match="token_address must be a 0x address"):
        contract.file_case("notanaddress", "A claim that is long enough to pass the length check here.", "[]", "")

    # claim too short
    with pytest.raises((AssertionError, Exception), match="claim too short"):
        contract.file_case("0x" + "a" * 40, "short", json.dumps(["https://example.com"]), "")

    # bad url
    with pytest.raises((AssertionError, Exception), match="invalid evidence url"):
        contract.file_case(
            "0x" + "a" * 40,
            "A sufficiently long claim about the project behavior.",
            json.dumps(["http://not-https.com"]),
            "",
        )

    # no urls
    with pytest.raises((AssertionError, Exception), match="1-5 evidence urls required"):
        contract.file_case(
            "0x" + "a" * 40,
            "A sufficiently long claim about the project behavior.",
            "[]",
            "",
        )


def test_file_case_optional_symbol(direct_vm, direct_deploy, direct_owner, direct_alice):
    contract = deploy(direct_vm, direct_deploy, direct_owner)
    direct_vm.sender = direct_alice

    case_id = contract.file_case(
        "0x" + "b" * 40,
        "Liquidity removed without notice after the promised lock period.",
        json.dumps(["https://example.com/tx"]),
        "",  # empty symbol
    )
    row = json.loads(contract.get_case(case_id))
    assert row["symbol"] == ""


# ─────────────────────────────────────────────────────────────
# add_defense
# ─────────────────────────────────────────────────────────────

def test_add_defense(direct_vm, direct_deploy, direct_owner, direct_alice):
    contract = deploy(direct_vm, direct_deploy, direct_owner)
    direct_vm.sender = direct_alice
    case_id = file_basic(contract, direct_vm)

    contract.add_defense(case_id, "Liquidity was locked as shown in the proof.", json.dumps(["https://example.com/lock"]))

    row = json.loads(contract.get_case(case_id))
    assert row["status"] == "defended"
    assert "locked" in row["defense"]
    assert len(row["defense_urls"]) == 1


def test_add_defense_rejects_closed_or_missing(direct_vm, direct_deploy, direct_owner, direct_alice):
    contract = deploy(direct_vm, direct_deploy, direct_owner)
    direct_vm.sender = direct_alice
    case_id = file_basic(contract, direct_vm)

    # missing case
    with pytest.raises((AssertionError, Exception), match="case not found"):
        contract.add_defense("case_999", "defense text here", "[]")

    # already not open (simulate by reviewing first)
    mock_review(direct_vm)
    contract.review_case(case_id)
    with pytest.raises((AssertionError, Exception), match="case not open"):
        contract.add_defense(case_id, "too late defense", "[]")


# ─────────────────────────────────────────────────────────────
# review_case (nondet)
# ─────────────────────────────────────────────────────────────

def test_review_case_rug(direct_vm, direct_deploy, direct_owner, direct_alice):
    contract = deploy(direct_vm, direct_deploy, direct_owner)
    direct_vm.sender = direct_alice
    case_id = file_basic(contract, direct_vm)

    mock_review(direct_vm, "rug", "Liquidity removed contrary to lock promise")
    result_raw = contract.review_case(case_id)
    result = json.loads(result_raw)

    assert result["verdict"] == "rug"
    assert "Liquidity" in result["reasoning"]

    row = json.loads(contract.get_case(case_id))
    assert row["status"] == "reviewed"
    assert row["verdict"] == "rug"
    assert len(row["evidence_digests"]) >= 1


def test_review_case_contested_and_insufficient(direct_vm, direct_deploy, direct_owner, direct_alice):
    contract = deploy(direct_vm, direct_deploy, direct_owner)
    direct_vm.sender = direct_alice

    # contested
    cid1 = file_basic(contract, direct_vm, token="0x" + "c" * 40)
    direct_vm.clear_mocks()
    mock_review(direct_vm, "contested", "Defense provides plausible lock evidence")
    contract.review_case(cid1)
    assert json.loads(contract.get_case(cid1))["verdict"] == "contested"

    # insufficient
    cid2 = file_basic(contract, direct_vm, token="0x" + "d" * 40)
    direct_vm.clear_mocks()
    mock_review(direct_vm, "insufficient", "Links do not settle the claim")
    contract.review_case(cid2)
    assert json.loads(contract.get_case(cid2))["verdict"] == "insufficient"


def test_review_rejects_wrong_status(direct_vm, direct_deploy, direct_owner, direct_alice):
    contract = deploy(direct_vm, direct_deploy, direct_owner)
    direct_vm.sender = direct_alice
    case_id = file_basic(contract, direct_vm)

    mock_review(direct_vm)
    contract.review_case(case_id)
    contract.finalize_case(case_id)

    with pytest.raises((AssertionError, Exception), match="case not reviewable"):
        contract.review_case(case_id)


# ─────────────────────────────────────────────────────────────
# finalize_case
# ─────────────────────────────────────────────────────────────

def test_finalize_case(direct_vm, direct_deploy, direct_owner, direct_alice):
    contract = deploy(direct_vm, direct_deploy, direct_owner)
    direct_vm.sender = direct_alice
    case_id = file_basic(contract, direct_vm)

    mock_review(direct_vm, "rug")
    contract.review_case(case_id)
    contract.finalize_case(case_id)

    row = json.loads(contract.get_case(case_id))
    assert row["status"] == "finalized"
    assert row["finalized_at"] != ""


def test_finalize_rejects_not_reviewed(direct_vm, direct_deploy, direct_owner, direct_alice):
    contract = deploy(direct_vm, direct_deploy, direct_owner)
    direct_vm.sender = direct_alice
    case_id = file_basic(contract, direct_vm)

    with pytest.raises((AssertionError, Exception), match="case not reviewed"):
        contract.finalize_case(case_id)


# ─────────────────────────────────────────────────────────────
# Views
# ─────────────────────────────────────────────────────────────

def test_get_cases_by_token_and_list(direct_vm, direct_deploy, direct_owner, direct_alice):
    contract = deploy(direct_vm, direct_deploy, direct_owner)
    direct_vm.sender = direct_alice

    token_a = "0x" + "a" * 40
    token_b = "0x" + "b" * 40

    file_basic(contract, direct_vm, token=token_a, symbol="AAA")
    file_basic(contract, direct_vm, token=token_a, symbol="AAA")
    file_basic(contract, direct_vm, token=token_b, symbol="BBB")

    by_a = json.loads(contract.get_cases_by_token(token_a))
    by_b = json.loads(contract.get_cases_by_token(token_b))
    ids = json.loads(contract.list_case_ids())

    assert len(by_a) == 2
    assert len(by_b) == 1
    assert len(ids) == 3
    assert all(c["symbol"] == "AAA" for c in by_a)
    assert by_b[0]["symbol"] == "BBB"


def test_get_case_missing(direct_vm, direct_deploy, direct_owner):
    contract = deploy(direct_vm, direct_deploy, direct_owner)
    raw = contract.get_case("case_999")
    row = json.loads(raw)
    assert row["found"] is False
    assert row["case_id"] == "case_999"


# ─────────────────────────────────────────────────────────────
# Full flow
# ─────────────────────────────────────────────────────────────

def test_full_flow_file_defend_review_finalize(direct_vm, direct_deploy, direct_owner, direct_alice):
    contract = deploy(direct_vm, direct_deploy, direct_owner)
    direct_vm.sender = direct_alice

    case_id = file_basic(
        contract,
        direct_vm,
        token="0x" + "f" * 40,
        claim="Team wallet dumped 40% of supply two days after launch against the published vesting schedule.",
        urls=["https://etherscan.io/tx/0xabc", "https://archive.is/roadmap"],
        symbol="DUMP",
    )

    contract.add_defense(
        case_id,
        "The dump was a planned OTC deal disclosed in the docs.",
        json.dumps(["https://docs.example.com/vesting"]),
    )

    mock_review(direct_vm, "contested", "Defense provides a plausible explanation of the transfer")
    contract.review_case(case_id)
    contract.finalize_case(case_id)

    row = json.loads(contract.get_case(case_id))
    assert row["status"] == "finalized"
    assert row["verdict"] == "contested"
    assert row["symbol"] == "DUMP"
    assert len(row["evidence_urls"]) == 2
    assert len(row["defense_urls"]) == 1
    assert int(contract.get_total_cases()) == 1