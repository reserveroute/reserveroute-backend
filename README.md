# ReserveRoute — backend

Open-source planning for Stellar sponsored-reserve transfers and removals. The first adapter supports credit trustlines, with explicit blockers and unsigned transaction preparation.

Run npm ci, npm test, npm start, node replay-testnet.mjs and optionally node verify-testnet.mjs. API.md documents routes. TESTNET.md documents the captured milestone and fresh disposable pilot. HTTP routes never sign or submit.

Read [INTEGRATION.md](INTEGRATION.md) for the connected setup, trust boundaries and supported scope. Components: [engine](https://github.com/reserveroute/reserveroute-engine), [backend](https://github.com/reserveroute/reserveroute-backend), [frontend](https://github.com/reserveroute/reserveroute-frontend), [cli](https://github.com/reserveroute/reserveroute-cli), [fixtures](https://github.com/reserveroute/reserveroute-fixtures).

MIT licensed. Local testnet MVP, not a complete sponsorship inventory or production signing service.
