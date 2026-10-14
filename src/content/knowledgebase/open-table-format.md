---
title: "What is Open Table Format?"
meta_title: "What is Open Table Format? | Expert Data Lakehouse & AI Glossary"
description: "An open table format is a metadata spec that lets many engines read and write the same table safely. See how formats like Apache Iceberg add ACID to data lakes."
---

## What is Open Table Format?

An open table format is a public specification for the metadata that turns a collection of data files (usually Parquet) into a table that multiple processing engines can read and write. Apache Iceberg, Delta Lake, and Apache Hudi are the best-known examples. 

An **Open Table Format** is what makes a data lakehouse possible. Without one, a directory of files has no reliable notion of which files belong to the table, what the schema is, or how to change data safely. With one, engines like Spark, Flink, Trino, and Dremio can treat those files as a database table with transactions, schema evolution, and time travel.

## Core Architecture and Mechanics

Open table formats share a few core mechanisms:

* **Provides ACID transactions on top of cloud object storage.** Each write creates a new table version through an atomic commit, so readers never see a half-finished write.
* **Tracks table state in metadata.** Iceberg uses a tree of metadata files, manifest lists, and manifests; Delta Lake uses a transaction log. Because earlier versions are kept until they expire, engines can query past versions (time travel).
* **Separates the physical storage layout from the logical table.** Features like Iceberg's [hidden partitioning](/knowledgebase/hidden-partitioning/) and partition evolution let the layout change without changing how users query the table.

Because the specification is public, any engine that implements it can work with the same tables. [Apache Iceberg](/knowledgebase/apache-iceberg/) in particular is supported by a wide range of engines and catalogs.

## Why Open Table Format Matters in the Modern Data Stack

An open table format reduces vendor lock-in and storage duplication, because any compatible engine can query the same data in place instead of copying it into each tool.

For organizations with many teams, this means each team can pick the engine that suits its workload, such as Spark for batch pipelines, Flink for streaming, and Dremio or Trino for interactive SQL, while sharing one copy of the data.

### Key Benefits
- **Transactions on the Lake:** Safe concurrent reads and writes, plus `UPDATE`, `DELETE`, and `MERGE` on object storage.
- **Vendor Neutrality:** Data stays in an open specification that many engines support.
- **History and Auditability:** Snapshot or commit history supports time travel, rollback, and auditing of changes.

## Frequently Asked Questions

### What makes a Lakehouse different from a Data Lake?
A standard data lake is just a collection of files. A lakehouse adds a metadata layer that provides warehouse-like features (transactions, schema enforcement) directly to those files. That metadata layer is the open table format.

### Why use an Open Table Format?
Open formats like Apache Iceberg keep your data readable by many engines instead of one proprietary database. The specification evolves through versioned releases (Iceberg format versions 1, 2, and 3), so engines know which features a table uses.

### How does Open Table Format impact data governance and security?
The format's commit history gives an audit trail of changes, and row-level deletes support compliance tasks like removing a customer's records. Access control is usually enforced by the catalog (for example Apache Polaris) or the query engine rather than the format itself.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
