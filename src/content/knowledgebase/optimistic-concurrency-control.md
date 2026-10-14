---
title: "What is Optimistic Concurrency Control?"
meta_title: "What is Optimistic Concurrency Control? | Expert Data Lakehouse & AI Glossary"
description: "Optimistic concurrency control lets writers proceed without locks and checks for conflicts at commit time. Learn how Apache Iceberg uses it for ACID writes."
---

## What is Optimistic Concurrency Control?

Optimistic concurrency control (OCC) is a transaction strategy that assumes conflicts between writers are uncommon, lets them work without locks, and checks for conflicts only when each writer tries to commit. 

Pessimistic approaches lock data before changing it, so other writers wait. In a lakehouse, where many independent engines write to tables in object storage, a shared lock manager is hard to run. **Optimistic Concurrency Control** avoids that. Apache Iceberg and Delta Lake both use it: each writer prepares new data and metadata files on its own, then tries to commit, and the commit succeeds only if no conflicting change was committed in the meantime.

## Core Architecture and Mechanics

In Apache Iceberg, OCC works like this:

* **Writers start from a known snapshot.** A writer reads the table's current metadata and writes new data files and a new metadata file based on it.
* **The commit is an atomic swap in the catalog.** The catalog replaces the table's current metadata pointer only if it still points to the metadata the writer started from (a compare-and-swap).
* **On conflict, the writer retries.** If another commit landed first, the writer refreshes to the new snapshot, checks whether its changes still apply (for example, that the files it deletes were not already removed), and tries again. If the changes truly conflict, the operation fails.

Because the only coordination point is the catalog's atomic pointer swap, engines like Spark, Flink, Trino, and Dremio can all write to the same [Apache Iceberg](/knowledgebase/apache-iceberg/) table safely.

## Why Optimistic Concurrency Control Matters in the Modern Data Stack

OCC is what makes multi-engine writes to open tables workable. Without it, two jobs could overwrite each other's commits, or readers could see a mix of old and new files.

OCC works best when conflicts are rare, such as appends from several jobs or writes to different partitions. When many writers frequently change the same files, for example a streaming job and a compaction job on the same partitions, retries and failed commits increase, so teams schedule maintenance and design write patterns to reduce overlap.

### Key Benefits
- **No Lock Manager:** Writers do not hold locks while they work.
- **Multi-Engine Writes:** Any engine that follows the table format's commit protocol can write safely.
- **Readers Never Block:** Readers keep using their snapshot while writers commit new ones.

## Frequently Asked Questions

### What makes a Lakehouse different from a Data Lake?
A standard data lake is just a collection of files. A lakehouse adds a metadata layer that provides warehouse-like features (transactions, schema enforcement) directly to those files. Optimistic concurrency control is how that layer keeps concurrent transactions safe.

### Why use an Open Table Format?
Open formats like Apache Iceberg keep your data readable by many engines instead of one proprietary database. Their commit protocols, including OCC, are part of the public specification, so every engine follows the same rules.

### How does Optimistic Concurrency Control impact data governance and security?
OCC guarantees that each commit is applied in full or not at all, and the resulting snapshot history records every change. Access control is handled separately, by the catalog or query engine.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
