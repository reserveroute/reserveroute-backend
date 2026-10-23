# ReserveRoute connected workspace

Five MIT-licensed components: engine, backend, frontend, CLI and fixtures. This project uses Stellar classic operations; no custom smart contract is necessary.

## Setup

Node.js 24+ is required (built-in SQLite). Clone as siblings:

```bash
mkdir reserveroute-workspace
cd reserveroute-workspace
for repo in engine backend frontend cli fixtures; do
  git clone https://github.com/reserveroute/reserveroute-$repo.git
done
cd reserveroute-backend
npm ci
cd ../reserveroute-frontend
npm run dev
```

Open http://127.0.0.1:4340. Backend: http://127.0.0.1:4341. Load the sample and compare removal (blocked) with transfer to sponsor-b (ready). Synthetic identifiers cannot be encoded as real XDR. Inspect captured testnet evidence separately. You may capture explicit public testnet G-accounts, plan their selected sponsored credit trustlines and build unsigned XDR after a live refresh. No route signs or submits.

Ctrl-C stops both dev processes. dev.mjs uses fixed ports and does not load .env files. For customized startup, use separate npm start commands with .env.example settings; the backend currently allows browser origins on ports 4340/4341 only. Set the same optional API_TOKEN in both services; the proxy keeps it out of browser JavaScript.

## Flow and trust

Frontend → loopback proxy → backend → engine. CLI reuses backend capture/XDR adapters and the engine. Fixtures exercise exact reserve boundaries. The backend persists plans atomically in SQLite. A snapshot's fingerprint includes account sequence/balance/liabilities/reserve counters, selected entry sponsors and base reserve/fee. A build refreshes these inputs and refuses changed state. State can still change after that check. Signer thresholds/keys are not resolved: reports name required authorizing accounts only.

The first release supports sponsored credit trustlines and explicit account sets (max 20 accounts, 30 entries/actions). It is not a complete sponsorship inventory, account-merging tool, fee-bump service or transaction submitter. Offers, signers, account-base reserves, liquidity-pool shares and claimable balances need separate adapters; unsupported entry types remain blocked. Claimable-balance sponsorship cannot simply be removed. Fees are base-fee estimates, not guaranteed inclusion bids. Arithmetic uses integer stroops and includes native selling liabilities and cumulative obligations.

Horizon account reads span recorded ledger bounds and are not atomic snapshots or independent consensus proofs. Missing accounts/providers and malformed state are errors. Testnet resets and RPC retention can invalidate live checks. No mainnet wallet or customer assets were used in the pilot.

## Contributor and release checks

Each repository has npm test. Backend npm ci is also needed before testing frontend or CLI because they import its SDK adapter. CI checks out the sibling dependencies and installs that backend lockfile. Current CI follows sibling main; pin commit SHAs for a release. Read TESTNET.md in the backend for public evidence and a fresh disposable pilot. Keep node_modules/, data/, .env and .private/ outside Git and archives. No production multi-tenant access model, migrations or deployment is supplied.
