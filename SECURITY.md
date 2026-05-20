# Security Policy

## Supported Versions

Currently, the `main` branch (latest deployment) is the only supported version receiving security updates.

## Trust Architecture & Threat Model

**In Case** relies on a zero-knowledge architecture. The server acts as a blind courier. Our threat model assumes that the database could be fully compromised, but even under these conditions, the payloads should remain mathematically unreadable due to client-side encryption (AES-256-GCM and RSA-OAEP).

If you find a vulnerability that circumvents this zero-knowledge guarantee—whether through a flaw in the cryptographic implementation, key generation, or the recipient handshake—we consider this a critical severity issue.

## Reporting a Vulnerability

**Do not file a public issue.** 

To report a security vulnerability, please email the maintainer directly at **sodiqamuhammed@gmail.com**. Please include:

- A description of the vulnerability.
- Steps to reproduce the issue.
- Proof of Concept (PoC) code or instructions.
- Potential impact under the application's threat model.

We will acknowledge receipt of your vulnerability report within 48 hours and strive to send you regular updates about our progress. 

Thank you for keeping this infrastructure safe.
