---
title: "Encryption in Transit for the Lakehouse: TLS for S3, Catalogs, and Engines"
meta_title: "Encryption in Transit: TLS in a Data Lakehouse | Glossary"
description: "Encryption in transit protects data moving over a network, usually with TLS. Learn where TLS applies in a lakehouse: storage, catalogs, engines, and clients."
---

## What Is Encryption in Transit?

Encryption in transit (also called encryption in motion) protects data while it moves across a network, so that anyone able to observe or tamper with the traffic cannot read or silently alter it. It complements [encryption at rest](/knowledgebase/encryption-at-rest/), which protects stored data. Systems that encrypt only at rest still send data in readable form whenever they serve it, unless the connection is encrypted.

Without it, anyone with access to a network path, such as a compromised host on the same segment or a misconfigured proxy, can capture credentials and query results with an ordinary packet capture tool.

## How TLS Works

The standard mechanism is Transport Layer Security (TLS), the successor to SSL. HTTPS is HTTP over TLS. A TLS connection does three things:

1. **Authenticates the server.** The server presents an X.509 certificate signed by a certificate authority the client trusts. The client checks the certificate chain and that the name matches the host it meant to reach, which blocks man-in-the-middle impersonation. With mutual TLS (mTLS), the client presents a certificate too.
2. **Agrees on keys.** In TLS 1.3, client and server run an ephemeral Diffie-Hellman exchange (usually elliptic curve) to derive shared session keys. Because the keys are ephemeral, recording traffic today and stealing the server's private key later does not decrypt it (forward secrecy). TLS 1.3 removed the older RSA key transport mode.
3. **Encrypts the session.** Data is protected with an authenticated symmetric cipher such as AES-GCM or ChaCha20-Poly1305, which both hides the content and detects tampering. With hardware AES support on modern CPUs, the overhead is small.

Use TLS 1.2 or 1.3 only, and disable older protocol versions.

## Where TLS Applies in a Data Lakehouse

A lakehouse has more network hops than a single database, and each one needs encryption:

| Connection | What to configure |
|---|---|
| Engines to object storage (S3, ADLS, GCS) | Use HTTPS endpoints; on S3, a bucket policy that denies requests where `aws:SecureTransport` is false |
| Engines to the catalog | Serve the [Iceberg REST catalog](/knowledgebase/rest-catalog-specification/) (Apache Polaris, Unity Catalog, Glue) over HTTPS; vended credentials and tokens travel on this connection |
| BI tools and apps to engines | Enable TLS on JDBC, ODBC, and [Arrow Flight](/knowledgebase/arrow-flight/) endpoints for Dremio, Trino, or Spark Thrift Server |
| Inside an engine cluster | Turn on internode encryption, for example Spark RPC encryption, Trino internal TLS, or a service mesh with mTLS |
| Streaming ingestion | Use TLS listeners on Kafka brokers and for Kafka Connect and Flink clients |
| Key management calls | Calls to a [key management service](/knowledgebase/key-management-service/) for table or file encryption keys must use TLS |

The catalog link deserves special attention. With credential vending, the catalog hands out short-lived storage credentials, so an unencrypted catalog connection leaks keys to the data itself. [REST Catalog Credential Vending](/blog/rest-catalog-credential-vending-secure-lakehouse-storage/) explains that flow.

## Encryption in Transit and Zero Trust

Older network designs encrypted only traffic that crossed the internet and trusted everything inside the firewall. A [zero trust architecture](/knowledgebase/zero-trust-architecture/) assumes the internal network can be compromised, so internal service-to-service traffic is also encrypted and authenticated, often with mTLS issued by an internal certificate authority. This limits what an attacker can read or impersonate after getting a foothold; it does not replace access control, auditing, or encryption at rest.

For how transit encryption fits with Parquet modular encryption and Iceberg table encryption, see [File Encryption for the Lakehouse](/blog/lakehouse-encryption-deep-dive/).

## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
