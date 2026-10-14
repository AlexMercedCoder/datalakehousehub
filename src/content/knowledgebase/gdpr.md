---
title: "What is GDPR?"
meta_title: "What is GDPR? | Expert Data Lakehouse Architecture Guide"
description: "GDPR is the EU law that governs how organizations collect, store, and process personal data. See how it shapes data residency and row-level deletes on the lake."
---

# What is GDPR (General Data Protection Regulation)?

The General Data Protection Regulation (GDPR) is the European Union's data protection law. It was adopted in 2016 and has applied since 25 May 2018. It sets the rules for how organizations collect, store, process, and secure the personal data of people in the EU, and it applies to organizations outside the EU when they offer goods or services to, or monitor the behavior of, people in the EU. For the most serious infringements, regulators can impose fines of up to 20 million euros or 4% of a company's worldwide annual turnover, whichever is higher (Article 83).

GDPR is a legal text, but several of its requirements land directly on data architecture: where data is stored and transferred, how individual records can be found and erased, and how personal data is protected inside pipelines.

## The Architectural Impact of GDPR

### 1. International Transfers and Data Residency
GDPR does not require that all personal data stay inside the EU. It restricts transfers of personal data to countries outside the European Economic Area (Chapter V) unless a legal mechanism applies, such as an adequacy decision by the European Commission, Standard Contractual Clauses, or Binding Corporate Rules. Some organizations choose to keep EU personal data in EU regions to simplify compliance, and some sectors and member states add their own localization rules.

That choice affects lakehouse design. A team that keeps EU data in an EU region and other data elsewhere ends up with more than one storage location. A federated query engine (such as Dremio or [Trino](/knowledgebase/trino/)) can query each location in place and return only aggregated results to a central report, which can reduce how much raw personal data moves between regions. Whether a given design satisfies GDPR is a legal question for each organization, not a property of the engine.

### 2. The Right to Erasure (Article 17)
Article 17 gives individuals the right to have their personal data erased "without undue delay" when certain grounds apply, for example when the data is no longer needed or when consent is withdrawn. The right has limits: Article 17(3) lists exceptions, such as compliance with a legal obligation or the defense of legal claims.

On a data lake built from immutable Parquet files in Hive-style partitioned directories, erasing one person's records means finding every file that contains them and rewriting those files. That work is slow and expensive at scale, and classic Hive tables could not make those rewrites atomic for readers.

Open table formats made this practical. [Apache Iceberg](/knowledgebase/apache-iceberg/) did not start as a GDPR project: it began at Netflix to fix correctness and performance problems with Hive tables, and was donated to the Apache Software Foundation in 2018. Delta Lake came out of Databricks. Both track table state in metadata, which lets engines run row-level `DELETE` statements as atomic commits, either by rewriting the affected files ([copy-on-write](/knowledgebase/copy-on-write/)) or by writing delete files that readers apply ([merge-on-read](/knowledgebase/merge-on-read/)). Row-level deletes are one reason these formats became useful for privacy compliance.

Erasure on a table format also needs follow-through. Older snapshots still reference the deleted rows until they are expired, and delete files leave the original data files in place until compaction rewrites them. A deletion process for GDPR should include snapshot expiration, compaction, and cleanup of orphan files on a schedule that matches the organization's erasure commitments.

### 3. Data Protection by Design and by Default (Article 25)
Article 25 requires controllers to build appropriate technical and organizational measures into processing from the start. In data pipelines, that often means pseudonymizing or [masking](/knowledgebase/data-masking/) personal data early, limiting who can see raw identifiers, and keeping only the fields a use case needs. Pseudonymized data is still personal data under GDPR, so these measures reduce risk rather than take data out of scope.

## Summary of Technical Value

GDPR turned privacy requirements into engineering requirements: knowing where personal data lives and where it is transferred, being able to find and erase an individual's records, and protecting personal data throughout its lifecycle. Open table formats with row-level deletes, catalogs with fine-grained access control, and federated query engines are some of the tools teams use to meet those requirements on an open [data lakehouse](/knowledgebase/data-lakehouse/).

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
