---
title: "Key Management Service (KMS): How Lakehouse Encryption Keys Work"
meta_title: "Key Management Service (KMS) for Lakehouse Encryption"
description: "A key management service (KMS) creates, stores, and controls the keys that encrypt data. See how S3, Parquet, and Iceberg encryption use KMS envelope keys."
---

A Key Management Service (KMS) is a centralized service that creates, stores, rotates, and controls access to the cryptographic keys used to encrypt and decrypt data. Cloud examples include AWS KMS, Google Cloud KMS, and Azure Key Vault; self-hosted options include HashiCorp Vault and dedicated HSM appliances.

Encryption only protects data as well as its keys are protected. If an organization enables [encryption at rest](/knowledgebase/encryption-at-rest/) across its [data lakehouse](/knowledgebase/data-lakehouse/) but an engineer commits the key to a public Git repository, the encryption no longer protects anything. Attackers usually go after keys, credentials, and misconfigurations rather than the encryption algorithm itself. A KMS keeps master keys inside the service, so applications and people use keys through authenticated API calls instead of handling raw key material.

## Hardware Security Modules

Many KMS offerings protect keys with Hardware Security Modules (HSMs): dedicated devices designed to resist tampering and to keep key material from leaving in plaintext. When an HSM detects physical tampering, it is designed to erase (zeroize) the keys it holds.

Protection levels vary by product and tier. AWS KMS states that its HSMs are FIPS 140-3 Security Level 3 validated or in the process of validation. Google Cloud KMS offers both software and HSM protection levels, and Azure Key Vault offers software-protected keys in its Standard tier and HSM-protected keys in Premium and Managed HSM. Check which level a given key uses rather than assuming every KMS key lives in hardware.

## Envelope Encryption

A KMS rarely encrypts bulk data itself. Sending a terabyte of Parquet files to a KMS API would be slow, and services cap request sizes. Instead, systems use envelope encryption:

1. **Request a data key:** The writer (for example, a Spark job) asks the KMS for a data key. With AWS KMS, `GenerateDataKey` returns the key twice: once in plaintext and once encrypted under a KMS key.
2. **Encrypt locally:** The writer uses the plaintext data key to encrypt the file in memory, then discards the plaintext key.
3. **Store the envelope:** The encrypted data key is stored next to the encrypted data, in object metadata or file footer metadata.
4. **Decrypt on read:** A reader sends the encrypted data key to the KMS. If the reader's IAM identity is allowed to use that KMS key, the KMS returns the plaintext data key and the reader decrypts the file.

If an attacker copies the files, they get ciphertext and an encrypted data key. Without permission to call the KMS with that key, they cannot unwrap the data key. Every KMS call is also logged (for AWS, in CloudTrail), which gives an audit trail of who decrypted what.

## Rotation and Crypto-Shredding

* **Key rotation:** AWS KMS can rotate the key material of a customer managed key automatically. The default period is 365 days and it can be set to a custom period; AWS managed keys rotate every year. Old key material is retained so existing ciphertext stays readable, and rotation does not re-encrypt data keys that were already issued.
* **Crypto-shredding:** Destroying a key makes everything encrypted under it unreadable, which can be faster to prove than deleting every file. KMS services build in safeguards against accidental loss: AWS KMS requires a waiting period of 7 to 30 days (30 by default) before a key is deleted, and the key cannot be used while deletion is pending. Plan this together with backups and snapshot retention, because a deleted key also makes old backups unreadable.

## KMS in an Iceberg Lakehouse

A lakehouse uses a KMS at several layers:

| Layer | Example | What the KMS protects |
|---|---|---|
| Object storage | S3 SSE-KMS, GCS and ADLS customer-managed keys | Whole objects at rest; any caller allowed to read the bucket and use the key gets plaintext |
| File format | [Apache Parquet](/knowledgebase/apache-parquet/) modular encryption | Individual columns and footers, wrapped by keys from a KMS client |
| Table format | [Apache Iceberg](/knowledgebase/apache-iceberg/) table encryption (shipped in Iceberg 1.11, May 2026) | Data files, delete files, and manifests, each with its own data key, under a table master key held in the KMS |

Storage-level encryption is the common baseline and is often enough to satisfy "encryption at rest with customer-managed keys" requirements. Format and table encryption matter when a leaked bucket credential must not expose data, or when different engines and roles should be able to decrypt different columns. Every engine that reads the table (Spark, Flink, Dremio, Trino, PyIceberg) must support the same encryption spec and be able to reach the KMS, so check engine coverage before enabling it. For a full walk-through of these options, see [File Encryption for the Lakehouse](/blog/lakehouse-encryption-deep-dive/). Related topics: [encryption in transit](/knowledgebase/encryption-in-transit/) and [zero trust architecture](/knowledgebase/zero-trust-architecture/).

## Summary

A KMS keeps master keys inside a controlled service, often backed by HSMs, and lets applications encrypt data through envelope encryption without handling those keys directly. It ties decryption to IAM permissions, logs every use, and supports rotation and crypto-shredding. In a lakehouse it sits behind storage encryption, Parquet modular encryption, and Iceberg table encryption.

## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
