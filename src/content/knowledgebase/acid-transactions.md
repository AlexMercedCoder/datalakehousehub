---
title: "ACID Transactions in the Data Lakehouse: How Iceberg, Delta Lake, and Hudi Commit"
meta_title: "ACID Transactions on Iceberg, Delta and Hudi | Glossary"
description: "ACID transactions guarantee atomicity, consistency, isolation, and durability. See how Iceberg, Delta Lake, and Hudi provide them on object storage."
---

ACID stands for Atomicity, Consistency, Isolation, and Durability, the four properties that make database transactions reliable even when jobs crash, machines fail, or many users write at once.

For decades these guarantees belonged to operational databases such as PostgreSQL and Oracle and to data warehouses such as Teradata. Early Hadoop data lakes and raw object storage gave them up in exchange for cheap, scalable storage. Updating or deleting data meant rewriting directories by hand, and a failed job could leave readers looking at half-written results.

Open table formats ([Apache Iceberg](/knowledgebase/apache-iceberg/), [Delta Lake](/knowledgebase/delta-lake/), and [Apache Hudi](/knowledgebase/apache-hudi/)) added a metadata layer and an atomic commit step on top of object storage. That is the core of the [data lakehouse](/knowledgebase/data-lakehouse/).

## The Four Properties

### 1. Atomicity (All or Nothing)
A transaction either fully happens or does not happen at all.

Say a Spark job merging 500,000 sales records into an Iceberg table crashes halfway through. Some new data files are already in the bucket. In a plain data lake, readers that list the directory would see them. In an Iceberg table, readers only see files referenced by the current snapshot, and the new snapshot was never committed. The table looks exactly as it did before the job started. The stranded files are invisible orphans that a maintenance job such as `remove_orphan_files` cleans up later.

### 2. Consistency
A transaction moves the table from one valid state to another. In a lakehouse this mainly means schema enforcement: a writer cannot put the string `"Unknown"` into a column the table defines as an integer. Unlike relational databases, table formats generally do not enforce foreign keys or unique primary keys, so those rules belong in pipeline tests or tools such as [data contracts](/knowledgebase/data-contracts/).

### 3. Isolation
Concurrent transactions do not see each other's partial work. A Flink job can append to a table while an engineer runs a `DELETE` and a dashboard queries the same table. Under [snapshot isolation](/knowledgebase/snapshot-isolation/), the dashboard reads the snapshot that was current when its query started and never sees half-applied changes. Concurrent writers use [optimistic concurrency control](/knowledgebase/optimistic-concurrency-control/): each prepares its changes, and at commit time the format checks for conflicts and retries or fails the loser.

### 4. Durability
Once committed, a change survives failures. In a lakehouse, data files and metadata are written to object storage before the commit is acknowledged, so durability comes from the storage layer. Amazon S3, for example, is designed for 99.999999999% (eleven nines) object durability.

## How Each Table Format Commits

| | Apache Iceberg | Delta Lake | Apache Hudi |
|---|---|---|---|
| Source of truth | Catalog pointer to the current `metadata.json` | Ordered JSON commits in `_delta_log` | Timeline of instants in `.hoodie` |
| Atomic step | Catalog swaps the metadata pointer (compare-and-swap) | Writing the next numbered log entry only if it does not exist | Completing an instant on the timeline |
| Concurrency | Optimistic, with conflict checks and retries | Optimistic, with conflict detection | Optimistic with a lock provider, plus non-blocking options in newer releases |
| Isolation for readers | Snapshot isolation; serializable checks available for writes | Snapshot reads; serializable and write-serializable write levels | Snapshot isolation |

Because Iceberg's atomic step lives in the catalog, the catalog you choose ([Apache Polaris](/knowledgebase/apache-polaris/), [Project Nessie](/knowledgebase/project-nessie/), [AWS Glue](/knowledgebase/aws-glue/), or another REST catalog) is part of your transaction guarantee. For the step-by-step commit path, read [Writing to an Apache Iceberg Table: How Commits and ACID Actually Work](/blog/2026-04-29-apache-iceberg-masterclass-06-writing-to-iceberg/) and [ACID Guarantees and Apache Iceberg](/blog/2024-8-acid-guarantees-and-apache-iceberg/).

## Summary

ACID transactions are what let a lakehouse take updates, deletes, and concurrent writers without corrupting what readers see. Open table formats provide them through immutable data files, snapshots, and a single atomic commit step, which brings warehouse-style reliability to data stored in open formats on object storage.


## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
