---
title: "What is Apache Paimon?"
meta_title: "What is Apache Paimon? | Expert Data Lakehouse Architecture Guide"
description: "Apache Paimon is an open table format built for streaming that uses an LSM-tree to handle real-time updates with primary keys and changelogs, often with Flink."
---

# What is Apache Paimon?

Apache Paimon is an open table format designed to bring real-time streaming updates and batch analytics together in the open [Data Lakehouse](/data-lakehouse/). It began as Flink Table Store inside the Apache Flink project and became an Apache Software Foundation top-level project. While [Apache Iceberg](/apache-iceberg/) is widely used for large-scale batch analytics and data warehousing, Paimon was designed from the start as a close storage companion for Apache Flink, with a focus on low-latency streaming ingestion and frequent updates.

In traditional architectures, data engineers often built separate systems (the Lambda Architecture). They used Apache Kafka for real-time streaming and Amazon S3 with Apache Parquet for historical analytics. Combining the two for a single dashboard required complex synchronization pipelines. Apache Paimon reduces this complexity by offering one table format that supports continuous streaming ingestion while storing data in columnar files that work well for historical SQL queries.

## The Architecture of the LSM-Tree

Paimon's streaming update performance comes from its use of the Log-Structured Merge-Tree (LSM-Tree), a storage structure also used by databases and storage engines such as RocksDB and Cassandra.

### The Problem with Real-Time Updates
If a Flink pipeline tried to apply a high rate of row-level `UPDATE` commands by rewriting Parquet files directly, every update would mean rewriting large files, and the pipeline could not keep up. Parquet files are immutable, so changing a row means writing a new file.

### The Paimon Solution
Paimon avoids rewriting historical files on every update. When Flink sends updates for a primary key table:
1. **The Write Buffer:** Paimon first collects incoming records in memory and sorts them by key.
2. **The Flush (Level 0):** When the buffer fills or a checkpoint occurs, Paimon writes the records to storage as small sorted files.
3. **Compaction:** Paimon periodically merges these small files, resolving `UPDATE` and `DELETE` records by key and writing larger, consolidated columnar files (ORC or Parquet) at deeper levels of the LSM-Tree. Compaction can run inline with the writer or as a separate dedicated job.

This design lets Paimon absorb a continuous stream of `INSERT`, `UPDATE`, and `DELETE` events without rewriting whole tables for each change.

## Primary Key Enforcement and Changelogs

Paimon supports primary key tables natively.

When a streaming pipeline ingests data, Paimon uses the primary key and a configurable merge engine (such as deduplicate, partial-update, or aggregation) to decide how records with the same key combine. Paimon can also produce a changelog of row-level changes, which lets downstream Flink jobs consume a Paimon table as a stream, reacting to changes instead of rescanning the whole table.

## Summary of Technical Value

Apache Paimon combines streaming-style updates with lakehouse-style storage. By using an LSM-Tree to absorb high-frequency changes and compacting data into columnar files in the background, Paimon lets organizations run low-latency streaming and historical batch analytics on the same tables in an open Data Lakehouse.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
