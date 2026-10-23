# Security and trust boundaries

ReserveRoute is a local testnet planning MVP. No HTTP route signs or submits a transaction. The explicit pilot CLI alone creates fresh faucet-funded testnet keys in ignored .private/ files (mode 0600). Never use production seeds or publish that directory. The application names authorizing accounts, not their actual signer/threshold configuration. A ready reserve plan is not a guarantee that the transaction will execute.

Services bind to loopback with Host/Origin gates and optional API_TOKEN. SQLite may hold imported private operational data; choose retention and access controls before hosting. Account reads are non-atomic and provider-reported. Snapshot refresh reduces stale-state errors but cannot prevent changes before signing/inclusion. Network fees, source sequence, timebounds, signatures and other protocol checks remain external responsibilities. No security audit is claimed.

Report vulnerabilities privately to the organization owner through GitHub profile contact. Never paste seeds or sensitive customer data in an issue.
