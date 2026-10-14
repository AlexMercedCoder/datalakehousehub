---
title: "What is Iceberg Snapshot?"
meta_title: "What is Iceberg Snapshot? | Expert Data Lakehouse & AI Glossary"
description: "An Iceberg snapshot is the recorded state of an Apache Iceberg table at one point in time, listing its data files. Learn how snapshots make time travel work."
canonical: "https://iceberglakehouse.com/iceberg/iceberg-snapshot/"
---

## What is Iceberg Snapshot?

An Iceberg snapshot is the recorded state of an [Apache Iceberg](/knowledgebase/apache-iceberg/) table at a point in time: the full set of data and delete files that made up the table after a given commit. 

Every successful write to an Iceberg table (an append, overwrite, delete, or compaction) creates a new **Iceberg Snapshot**. The table metadata keeps a list of snapshots and a pointer to the current one. Readers use the current snapshot by default, which is how Iceberg gives every query a consistent view of the table while writes continue.

## Core Architecture and Mechanics

A snapshot works through a few pieces of metadata:

* **Each snapshot has an ID, a timestamp, a parent snapshot ID, and a summary of the operation.** The parent chain records the table's history of commits.
* **Each snapshot points to a manifest list.** The manifest list references manifest files, which list the data files and delete files in that snapshot along with partition values and column statistics. Unchanged manifests are reused between snapshots, so a new commit writes only new metadata.
* **Snapshots can be named.** Branches and tags are named references to snapshots, so a team can keep a tagged version for an audit or write to a branch before publishing changes to `main`.

Because older snapshots stay in metadata until they are expired, engines like Spark, Trino, Flink, and Dremio can query the table as of an earlier snapshot ID or timestamp.

## Why Iceberg Snapshot Matters in the Modern Data Stack

Snapshots are what make several core lakehouse features work: atomic commits, snapshot isolation for readers, time travel, rollback, and incremental reads that process only the changes between two snapshots.

Snapshots also need maintenance. Each one keeps its files reachable, so storage grows until old snapshots are removed with the `expire_snapshots` procedure, which deletes files no longer referenced by any retained snapshot. Teams choose a retention period that balances time travel needs against storage cost.

### Key Benefits
- **Consistent Reads:** Each query reads one complete snapshot, never a partial write.
- **Time Travel and Rollback:** Query or restore an earlier state of the table.
- **Change History:** Snapshot summaries and metadata tables show what each commit added or removed.

## Frequently Asked Questions

### What makes a Lakehouse different from a Data Lake?
A standard data lake is just a collection of files. A lakehouse adds a metadata layer that provides warehouse-like features (transactions, schema enforcement) directly to those files. In Iceberg, snapshots are the core of that metadata layer.

### Why use an Open Table Format?
Open formats like Apache Iceberg keep your data readable by many engines instead of one proprietary database. Snapshot metadata follows the public Iceberg specification, so any compliant engine can read the same snapshot history.

### How does Iceberg Snapshot impact data governance and security?
Snapshots give an audit trail of when data changed and through which operation, and tags can preserve a specific version for compliance. Keep in mind that deleted records remain in older snapshots until those snapshots expire, which matters for privacy deletion requests. Access control is handled by the catalog or engine.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
