# Validation Registry in ERC-8004 (Trustless Agents)

## Overview

ERC-8004 defines **three main registries** to build a trust layer for AI agents on blockchain:

1. **Identity Registry** — "Who is this agent?"
2. **Reputation Registry** — "What do others say about the agent?"
3. **Validation Registry** — "How do we know the agent actually did what it claims to have done?"

The **Validation Registry** is the third component and is considered the **most important for high-stakes tasks**.

## Main Purpose

While the Reputation Registry is based on **subjective client feedback**, the Validation Registry provides **independent, verifiable proof** that an agent actually performed its work correctly.

It answers the question:  
> “How do I know this agent truly executed the computation, inference, or service it claims to have done?”

## How It Works (Basic Flow)

1. **The agent** (or its owner/operator) requests validation:

```solidity
validationRequest(
    validatorAddress,   // address of the validator (can be a contract)
    agentId,
    requestURI,         // URI pointing to the data needed for validation
    requestHash         // hash of the request data for integrity
);
```

2. **A validator** (could be stakers, a zkML verifier, TEE oracle, or trusted judge) performs the check off-chain.

3. **The validator** submits the result on-chain:

```solidity
validationResponse(
    requestHash,
    response,           // uint8: 0–100 (can encode pass/fail or a score)
    responseURI,        // link to evidence (proof, report, attestation)
    responseHash,
    tag                 // e.g. "zkProof", "reExecution", "TEE"
);
```

4. Anyone can query the results:

- `getValidationStatus(requestHash)` → details of a specific validation
- `getSummary(agentId, validatorAddresses, tag)` → count and average score from selected validators

## Supported Validation Methods

ERC-8004 is **unopinionated** — it does not mandate any specific validation technique. It only provides a common interface. Popular methods include:

- **Staked re-execution**: Validators re-run the job; if wrong, they can be slashed.
- **zkML**: Zero-knowledge proofs for machine learning inference.
- **TEE (Trusted Execution Environment)**: Attestations from secure enclaves (e.g., Phala, Oasis, Intel SGX).
- **Trusted judges / oracles**: A reputable third party confirms the result.
- **Fraud proofs** (optimistic style).

## Key Functions (from EIP-8004)

### Requesting Validation
```solidity
function validationRequest(
    address validatorAddress,
    uint256 agentId,
    string calldata requestURI,
    bytes32 requestHash
) external;
```

### Submitting Validation Result
```solidity
function validationResponse(
    bytes32 requestHash,
    uint8 response,
    string calldata responseURI,
    bytes32 responseHash,
    string calldata tag
) external;
```

### Reading Validation Data
```solidity
function getValidationStatus(bytes32 requestHash) 
    external view 
    returns (
        address validatorAddress,
        uint256 agentId,
        uint8 response,
        bytes32 responseHash,
        string tag,
        uint256 lastUpdate
    );

function getSummary(
    uint256 agentId, 
    address[] calldata validatorAddresses, 
    string tag
) external view returns (uint64 count, uint8 averageResponse);
```

## Important Notes

- Only the **owner or operator** of the `agentId` can request validation for that agent.
- Evidence (`responseURI`) is usually stored off-chain (IPFS, HTTPS, TEE attestation, etc.).
- **Staking and slashing logic is outside the standard**. Each validator network defines its own incentives and penalties.
- The Validation Registry is still being actively refined, especially around TEE integration.

## Real-World Use Cases

1. **Financial strategy agent**  
   An agent claims “I just executed an arbitrage strategy and achieved +3.2% return.”  
   → A client can request validation before trusting or copying the strategy.

2. **Medical or legal data processing**  
   Strong cryptographic proof (zk or TEE) is needed to confirm the model ran correctly on the provided data.

3. **Agent marketplaces / hiring**  
   Before hiring an agent for an important task, clients check both its Reputation and recent Validation results.

4. **Insurance for agents**  
   Protocols can use Validation results to decide whether to pay out insurance when an agent fails.

5. **Agent-to-Agent task delegation**  
   Agent A hires Agent B to perform a sub-task. Agent A can request validation on B’s output before releasing the remaining payment.

## Comparison with Reputation Registry

| Criteria              | Reputation Registry                     | Validation Registry                          |
|-----------------------|-----------------------------------------|----------------------------------------------|
| Nature                | Subjective feedback                     | Objective / cryptographic verification      |
| Who provides it       | Clients (service users)                 | Independent validators (stakers, TEE, zk verifiers) |
| Trust level           | Low → Medium                            | High (backed by proof)                      |
| Best for              | General evaluation, quick filtering     | High-stakes tasks, insurance, critical jobs |
| Revocable?            | Yes                                     | Usually difficult or not supported          |

## Summary

The **Validation Registry** is the “hard evidence” layer that complements the Reputation Registry.  
It allows agents to request independent third parties to verify their work and record the results on-chain in a standardized way.  

This is a key enabler for agents to trust each other at a higher level, especially when dealing with important or high-value tasks.

---

**Related Standards**
- ERC-8004: Trustless Agents (EIP)
- Integrates with x402 for verifiable payments
- Works alongside session-scoped smart contract wallets (ERC-1271)
