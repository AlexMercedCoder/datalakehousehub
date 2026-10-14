---
title: "PII in the Data Lakehouse: How to Find, Mask, and Truly Delete It in Iceberg"
meta_title: "PII in a Data Lakehouse: Detect, Mask, and Delete"
description: "PII is any data that can identify a specific person, alone or combined. Learn how lakehouse teams detect, mask, and fully delete PII from Iceberg tables."
---

Personally Identifiable Information (PII) is any data, or combination of data points, that can be used to identify a specific person. Legal definitions vary: GDPR uses the broader term "personal data", and U.S. laws such as CCPA and HIPAA define their own categories. PII is among the most regulated and most targeted classes of data an organization holds.

A leaked table of shoe sizes and favorite colors is an embarrassment. A leaked table that adds Social Security Numbers, home addresses, and card numbers exposes people to identity theft and the organization to regulatory penalties and lawsuits.

Protecting PII is a core requirement of data architecture, not an afterthought.

## Direct vs. Indirect PII

Data engineers protect two broad classes of PII.

### 1. Direct PII
Data that identifies a person on its own:
* Social Security Numbers, passport numbers, driver's license numbers.
* Biometric data (fingerprints, face templates).
* Email addresses and phone numbers.

### 2. Indirect (Quasi-Identifier) PII
Data that does not identify anyone by itself but can when combined with other fields. It is often overlooked.
* **ZIP code**
* **Gender**
* **Date of birth**

None of these identifies a person alone. But Latanya Sweeney's research estimated that about 87% of the U.S. population could be uniquely identified by the combination of five-digit ZIP code, gender, and full date of birth. Governance has to consider combinations of columns, not only individual fields. See [data anonymization](/knowledgebase/data-anonymization/) and [differential privacy](/knowledgebase/differential-privacy/) for techniques that address this.

## Architectural Defense Mechanisms

Modern data lakehouses use several layers of defense.

### 1. Automated Discovery and Tagging
When large volumes of raw data land in the [data lakehouse](/knowledgebase/data-lakehouse/), nobody can inspect it all by hand. Automated scanners help: Amazon Macie, for example, inspects objects in S3 (including Parquet and Avro files) for sensitive data patterns, and catalog and governance tools run similar classifiers. When a column matches a pattern such as a Social Security Number (`XXX-XX-XXXX`), the finding is used to tag the column as sensitive in the data catalog. See [data classification](/knowledgebase/data-classification/).

### 2. Column-Level Security and Masking
Once a column is tagged, the query engine (such as Dremio or Snowflake) enforces column-level policies.
An HR administrator with the right role sees the real Social Security Number.
A marketing analyst running the same query against the same table gets a masked value such as `***-**-8932`, because a masking policy tied to the column or tag rewrites the result for their role. See [data masking](/knowledgebase/data-masking/) and [column-level security](/knowledgebase/column-level-security/).

### 3. Tokenization
For the most sensitive fields, such as card numbers, many architectures keep the real values out of the analytical lakehouse entirely. The ingestion pipeline sends the value to a tokenization service, which stores it in a secured vault and returns a token (e.g., `TOKEN_9948X`) that is written to the lakehouse instead. A breach of the lakehouse then exposes tokens rather than card numbers, though the vault itself must be protected. See [data tokenization](/knowledgebase/data-tokenization/).

## Deleting PII from Iceberg Tables

Right-to-erasure requests under laws like [GDPR](/knowledgebase/gdpr/) and [CCPA](/knowledgebase/ccpa/) expose a lakehouse-specific trap. On an [Apache Iceberg](/knowledgebase/apache-iceberg/) table, `DELETE FROM customers WHERE customer_id = 42` creates a new snapshot without the row, but the old data files are still referenced by earlier snapshots and remain readable through [time travel](/knowledgebase/time-travel/).

| Step | What it does |
|---|---|
| `DELETE` or `MERGE` | Removes the row from the current snapshot (copy-on-write rewrites files; merge-on-read adds delete files or deletion vectors) |
| Compaction (`rewrite_data_files`) | For merge-on-read tables, rewrites data files so the deleted rows are physically gone from current files |
| Expire snapshots | Drops old snapshots so the files holding the deleted row are no longer referenced |
| Remove orphan files | Cleans up any unreferenced files left behind |
| Check branches and tags | Snapshots retained by a branch or tag are not expired until those references are removed |

A deletion is complete only after these steps run, so erasure requests need a defined maintenance schedule and a retention policy short enough to meet the legal deadline. For how teams automate these policies, read [Governance-as-Code for the Lakehouse](/blog/governance-as-code-lakehouse-rest-catalog/) and [Securing Apache Iceberg Tables with Fine-Grained Row and Column Level Access Control](/blog/iceberg-row-column-access-control/).

## Summary of Technical Value

PII is data that can identify a person directly or through combinations of fields. Lakehouse teams protect it by discovering and tagging it automatically, masking or filtering it at query time, tokenizing the most sensitive values before they land, and running the snapshot expiration and cleanup that Iceberg needs before a deletion is truly complete.

## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
