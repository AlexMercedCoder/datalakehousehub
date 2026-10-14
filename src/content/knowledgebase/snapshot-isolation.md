---
canonical: "https://opendatalakehouse.com/kb/snapshot-isolation/"
title: "What is Snapshot Isolation?"
meta_title: "What is Snapshot Isolation? | Expert Data Lakehouse & AI Glossary"
description: "Snapshot isolation lets each transaction read a consistent snapshot of data, so reads and writes run at once. See how Apache Iceberg snapshots provide it."
---

## What is Snapshot Isolation?

Snapshot isolation is a transaction isolation level in which each transaction reads from a consistent snapshot of the data as of the moment it started, so readers do not block writers and writers do not block readers. 

**Snapshot Isolation** is used by many relational databases (PostgreSQL's Repeatable Read level and SQL Server's SNAPSHOT level, for example) and by open table formats such as Apache Iceberg. It lets long analytical queries run while data is being written, without seeing half-finished changes. It is weaker than full serializability: two concurrent transactions that read overlapping data and write different rows can both commit and produce an anomaly known as write skew.

## Core Architecture and Mechanics

Snapshot Isolation works through a few core behaviors:

* **Readers see a fixed version of the data.** A query reads the snapshot that was current when it started and ignores later commits, so its results are internally consistent.
* **Writers create new versions instead of overwriting.** Databases keep multiple row versions (MVCC); Iceberg writes new data files and a new metadata tree, then commits by atomically swapping the table's current metadata pointer in the catalog. Older snapshots remain readable, which also enables time travel.
* **Conflicting writes are detected at commit.** If two transactions modify the same data, one commit succeeds and the other fails or retries. Iceberg uses optimistic concurrency and lets tables choose `serializable` (the default) or `snapshot` isolation for delete, update, and merge operations.

In a lakehouse, these behaviors are what let ingestion jobs commit to [Apache Iceberg](/apache-iceberg/) tables while dashboards and dbt models query the same tables.

## Why Snapshot Isolation Matters in the Modern Data Stack

Because snapshots are defined in open table metadata, multiple engines (Spark, Trino, Dremio, Flink) can read and write the same tables concurrently and still see consistent versions, without copying data into each engine.

For teams sharing tables, Snapshot Isolation removes much of the coordination that locking would require. A long-running report does not block a nightly load, and the load does not change the report's numbers mid-query.

### Key Benefits
- **Concurrency:** Readers and writers proceed in parallel without blocking each other.
- **Consistent reads:** Each query sees one committed version of the data, never a partial write.
- **Version history:** In table formats, retained snapshots support time travel, auditing, and rollback.

## Frequently Asked Questions

### What makes a Lakehouse different from a Data Lake?
A standard data lake is just a collection of files. A lakehouse adds a metadata layer that provides warehouse-like features (transactions, schema enforcement) directly to those files. Snapshot isolation is one of the features that metadata layer adds.

### Why use an Open Table Format?
Open formats like Apache Iceberg keep your data out of a single proprietary database, so any engine that implements the format can read it, and they bring transactional guarantees such as snapshot isolation to files in object storage.

### How does Snapshot Isolation impact data governance and security?
Snapshot isolation is not a security control by itself, but retained snapshots provide a record of what the table contained at each commit, which helps with audits. Access control still comes from the catalog and engines, through mechanisms such as role-based access control (RBAC).

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
