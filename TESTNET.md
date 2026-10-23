# Reproduce ReserveRoute’s Stellar testnet milestone

Captured 23 October 2026 using official Stellar JS SDK 17.3.0, testnet only. No custom contract is deployed: sponsorship uses Stellar's native operations.

## Read-only reproduction

```bash
npm ci
node replay-testnet.mjs
node verify-testnet.mjs
```

Offline replay recomputes planner outputs and decodes the exact transaction result XDR, including low_reserve. Live verification checks testnet identity, receipt status/ledger/envelope/result, and the current trustline sponsor through RPC and Horizon. It needs no secret. Testnet resets, ledger changes and provider retention can prevent future reproduction. These are TLS-provider reads, not independent consensus verification.

## Actual outcome

Two fresh sponsors were funded by Friendbot. The old sponsor created a zero-balance beneficiary and sponsored its account base reserve plus a zero-balance RTEST credit trustline. The planner blocked removing trustline sponsorship because the beneficiary lacked reserve capacity. A deliberately submitted testnet removal failed with the exact low_reserve result. A correctly authorized transfer then succeeded, and the owner’s sponsor field and all affected reserve counters were read back.

- setup: SUCCESS, `1f594ecdbe5bea512dcda1f0c5a63199a685a446f7f94a0d50476148f4b09bcd`, ledger 5347884.
- blocked-removal: FAILED, `c0ddc7914aed7618797c10e5627e8b6416ee8214ffb13ec3d35a91197499975a`, ledger 5347886.
- transfer: SUCCESS, `c56edde072c1cf12d1624c9173cd5828d9bb61cbe3b2f4642e51d2f3afcdb9b1`, ledger 5347891.

Accounts:
- oldSponsor: `GCI6YDSXCICIUELEMCVLDT5URIP2KD3QX4Y6U6YTXOKWUM4U6HRGWXM2`
- newSponsor: `GCWKT3MWN6EHZW5R5S7LOQNEABZMXO3ECXV2U5GGEO2JCA3SBNT5Z6NL`
- beneficiary: `GADTQ3J4VRTL7T4AHVSOTLYYUFPMZC33HTLFTWHMFH36OFNVFFZ4QQKR`

## Fresh disposable pilot

```bash
npm ci
node pilot-testnet.mjs
```

This explicit CLI creates testnet keys in ignored .private/ (0600), requests Friendbot funding, performs setup, deliberately tests the blocked removal, then signs and submits a sponsorship transfer. It never uses an existing wallet or mainnet. It writes a new root testnet-evidence.json; keep the published capture if you need to compare runs, and review new public evidence before committing. Never commit .private/. RTEST holds zero balance; no customer tokens are moved. Testnet fees are consumed by the pilot, including the deliberately failed transaction.

## Limits

Credit-trustline sponsorship only; no full-ledger discovery or signer-key resolution. Required authorizing accounts are listed, not actual threshold/signature combinations. Plan fees are base-fee estimates. Snapshot account requests span recorded ledger bounds and are non-atomic. Refresh can identify changed input fields but cannot guarantee unchanged state at inclusion. Every unsigned envelope has finite timebounds and requires external review/signing. Claimable balances, offers, signers and account-base sponsorship require their own adapters and are not claimed as supported.
