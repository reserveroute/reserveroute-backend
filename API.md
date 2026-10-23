# Local API

Loopback only; Host/Origin gates and optional Bearer API_TOKEN. JSON request limit 1 MiB. Reads at most 20 explicit accounts and 30 supported entries/actions. No signing endpoint.

- GET /api/health: local mode, signing=false.
- GET /api/sample: synthetic normalized snapshot.
- POST /api/capture: {accountIds:[G-address,...]}; read only from fixed official Horizon testnet. Returns explicit-scope, non-atomic capture with ledger bounds.
- POST /api/plan: {snapshot,actions}; evaluate exact reserve feasibility and atomically save snapshot/actions/report; returns 201 with ID.
- POST /api/build: {snapshot,actions}; re-capture from fixed testnet, compare state fingerprint, refuse drift, and return finite-timebound unsigned XDR. Does not sign or submit. Changed state returns 409; invalid or unavailable inputs return 422.
- GET /api/runs and GET /api/runs/{id}: latest 100 saved plans and full details.
- GET /api/evidence: static captured testnet milestone, not a live check.

Invalid JSON/schema/actions: 422; oversized input: 413; forbidden Host/Origin: 403; missing token: 401; unknown run: 404. A ready result is reserve feasibility under the selected adapter, not a simulation or inclusion guarantee. No hosted multi-user authentication is implemented.
