---
title: "What is Delta Lake?"
meta_title: "What is Delta Lake? | Expert Data Lakehouse Architecture Guide"
description: "Delta Lake is an open table format that adds ACID transactions to Parquet data lakes. Covers the Delta log, schema enforcement, time travel, and UniForm."
---

# What is Delta Lake?

Delta Lake is an open-source storage layer that brings reliability, performance, and transactional integrity to data lakes. Originally developed by Databricks, Delta Lake enables organizations to build a "Lakehouse" architecture, combining the scalability and flexibility of a data lake with data management features historically found in traditional enterprise data warehouses.

Before the introduction of open table formats like Delta Lake, organizations building data lakes on cloud object storage (such as Amazon S3 or Azure Data Lake Storage) faced serious limitations. If a data engineering pipeline failed halfway through writing a large batch of records, the data lake was left in a corrupted, partially updated state. Concurrent reading and writing were unsafe, and there was no native mechanism to enforce data quality or schema constraints. Delta Lake addresses these issues by providing ACID (Atomicity, Consistency, Isolation, Durability) transactions directly on top of raw Parquet files.

## The Delta Log: The Core Architecture

The Delta Lake architecture is built on a mechanism called the DeltaLog (often referred to as the transaction log). When a processing engine like Apache Spark reads a Delta table, it does not simply scan the raw data files. Instead, it consults the DeltaLog.

### Ordered JSON Commits
Every transaction executed against a Delta table, whether it is an `INSERT`, `UPDATE`, `DELETE`, or schema change, is recorded as a discrete JSON file within the `_delta_log` directory. These JSON files are sequentially numbered (e.g., `00000000000000000000.json`, `00000000000000000001.json`). They contain metadata detailing which physical Parquet files were added or removed during that specific transaction.

### Parquet Checkpoints
As the table receives thousands of updates, reading thousands of individual JSON files to determine the current table state would become expensive. To solve this, Delta Lake periodically writes a "Checkpoint" file (every 10 commits by default). A Checkpoint is a Parquet file that consolidates the state of the transaction log up to that point. When a query engine needs to determine the current state of a large Delta table, it reads the most recent Parquet Checkpoint and applies the remaining JSON commits that occurred after it, which is much faster than replaying the full log.

### Optimistic Concurrency Control
Because the transaction log provides an ordered, sequential history, Delta Lake can safely support concurrent writers. It uses Optimistic Concurrency Control. Multiple pipelines can attempt to write to the table simultaneously. Before committing the final transaction, Delta Lake checks the log to ensure no other process has modified the specific data files it intends to alter. If the concurrent changes do not conflict, Delta Lake retries the commit; if they do conflict, the transaction fails with a concurrent modification error.

## Unifying Batch and Streaming Workloads

Historically, data engineering required maintaining two separate architectures: a slow batch processing system for historical analytics (often running nightly), and a complex, fragile streaming system for real-time operational metrics. This dual setup, known as the Lambda Architecture, was difficult to maintain.

Delta Lake unifies batch and streaming processing. Because Delta provides ACID guarantees, a streaming job can append new records to a Delta table at the same time a batch analytics query is reading from it. Readers see a consistent snapshot of the data, unaffected by the incomplete streaming writes occurring in the background. Furthermore, a Delta table can act as both a continuous source and a sink for Apache Spark Structured Streaming workloads, simplifying the pipeline.

## Schema Enforcement and Evolution

Data quality is a major concern in analytics. In raw data lakes, it was possible for an upstream application to start writing STRING values into an INTEGER column, breaking downstream dashboards and machine learning models.

Delta Lake prevents this through Schema Enforcement. When data is written to a Delta table, the engine checks the incoming records against the defined table schema stored in the transaction log. If the data types do not match, or if an unexpected column is present, Delta Lake rejects the write, protecting the integrity of the data lake.

Conversely, as businesses evolve, data structures must adapt. Delta Lake supports safe Schema Evolution. Data engineers can declare that a new schema is acceptable using the `mergeSchema` option. Delta Lake updates the table schema in the transaction log and begins accepting the new data structure, without requiring manual table rebuilds.

## Time Travel and Data Versioning

Because the DeltaLog keeps a historical record of every modification, Delta Lake supports data versioning, often referred to as "Time Travel." 

Engineers and analysts can query previous states of the table, as long as the older data files have not been removed by `VACUUM`. This is useful for reproducing the dataset used to train a machine learning model months ago, or for executing a fast rollback if corrupted data is accidentally ingested into production.

```sql
-- Querying the Delta table as it existed at version 45
SELECT * 
FROM delta_table 
VERSION AS OF 45;

-- Querying the Delta table based on a specific historical timestamp
SELECT * 
FROM delta_table 
TIMESTAMP AS OF '2026-05-10 14:00:00';
```

## Delta Universal Format (UniForm)

As the open table format ecosystem matured, fragmentation grew between organizations adopting [Apache Iceberg](/apache-iceberg/), Apache Hudi, and Delta Lake. To solve this interoperability challenge, the Delta Lake community introduced Delta Universal Format (UniForm).

UniForm allows a Delta Lake table to be read by Iceberg or Hudi clients. When data is written to a Delta table, UniForm asynchronously generates the necessary metadata files required by the Iceberg and Hudi specifications. This means an organization can write data using Delta Lake's Spark integrations, while a separate team using Dremio or Trino queries the same data as Iceberg tables through a catalog that exposes them. UniForm reduces format lock-in and helps bridge competing open standards.

## Summary of Technical Value

Delta Lake turned raw cloud storage into a structured, reliable Lakehouse. By implementing a transactional log alongside Parquet storage files, Delta Lake provides ACID guarantees during concurrent workloads, simplifies complex streaming pipelines, and provides governance features like schema enforcement and time travel. It remains a foundational technology for organizations scaling their data engineering and AI operations.

### Frequently Asked Questions

**Is Delta Lake only compatible with Apache Spark?**
No. While it was originally built to integrate tightly with Spark, Delta Lake provides standalone reader and writer APIs (such as delta-rs, written in Rust) allowing engines like Dremio, Trino, Presto, and DuckDB to interact with Delta tables.

**Does Delta Lake lock my data into Databricks?**
No. Delta Lake is an open-source project governed by the Linux Foundation. Your data remains stored in open Parquet files in your own cloud buckets (S3, ADLS, GCS), and the transaction log is open and transparent.

**How does Delta Lake handle data deletions for privacy compliance (GDPR)?**
Delta Lake supports explicit `DELETE` and `UPDATE` statements. When you delete a record to comply with GDPR, Delta Lake rewrites the affected Parquet files without that row (or, when deletion vectors are enabled, marks the row as deleted) and commits the modification to the log. With deletion vectors, run `REORG TABLE ... APPLY (PURGE)` to rewrite the files. You must then run a `VACUUM` command after the retention period to remove the old historical files containing the deleted data from physical storage.

---

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
