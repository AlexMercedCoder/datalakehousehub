---
title: "Change Data Capture (CDC) into Apache Iceberg: Methods, Tools, and Trade-offs"
meta_title: "Change Data Capture (CDC) into Apache Iceberg | Glossary"
description: "Change data capture streams inserts, updates, and deletes from a source database to other systems. Compare query and log-based CDC and the paths into Iceberg."
---

Change Data Capture (CDC) is a set of techniques for detecting and replicating row-level changes (INSERTs, UPDATEs, and DELETEs) from an operational database to a downstream system, such as a [data lakehouse](/knowledgebase/data-lakehouse/), a cloud data warehouse, or an event streaming platform like Apache Kafka.

Analytical dashboards often need fresh data. The older approach was a nightly batch extract against the production database, such as `SELECT * FROM orders WHERE updated_at >= :yesterday`. That approach has two problems: the large query adds load to the operational database, and the dashboards are up to a day behind. CDC replaces the nightly extract with a continuous, low-impact stream of changes.

## Query-Based vs Log-Based CDC

There are two main ways to implement CDC.

### 1. Query-Based CDC
Query-based CDC is the simplest to implement. A job polls the database on a schedule (e.g., every 5 minutes) and selects rows whose `last_modified` timestamp or version column changed since the last run.

Its main limitation is deletes. A row that is physically deleted no longer exists to be selected, so the downstream copy keeps it unless the application uses soft deletes or a separate audit table. It also misses intermediate changes between polls, and frequent polling queries add load to the source. For sources where log access is not possible, see [Change Data Capture (CDC) when there is no CDC](/blog/2024-10-cdc-when-there-is-no-cdc/).

### 2. Log-Based CDC
Log-based CDC, implemented by open-source tools such as [Debezium](/knowledgebase/debezium/) and Flink CDC, does not query the tables. It reads the database's transaction log: the write-ahead log (WAL) in PostgreSQL, the binary log in MySQL, the redo log in Oracle. Databases write every committed change to that log for recovery and replication.

The CDC tool reads the log through the database's replication interface, converts each change into a structured event (often JSON or Avro, with before and after values), and publishes it to a stream such as Kafka.

## Resolving Hard Deletions and Schema Changes

Because log-based CDC reads the transaction log, it captures `DELETE` operations as events carrying the deleted row's primary key. A downstream lakehouse table built on [Apache Iceberg](/knowledgebase/apache-iceberg/) or Delta Lake can apply those events as deletes, keeping the analytical copy in step with the source.

Schema changes are handled with more variation. Debezium tracks schema history for MySQL and publishes schema changes, while PostgreSQL logical decoding does not emit DDL, so changes are detected when the shape of new rows changes. Pairing CDC with a [schema registry](/knowledgebase/schema-registry/) and a sink that supports [schema evolution](/knowledgebase/schema-evolution/) keeps pipelines from failing when a column is added upstream.

## Streaming Ingestion and Real-Time Architectures

Publishing changes to Kafka decouples the source from consumers. The operational database is read once, and many downstream systems, from a Flink fraud detection job to a warehouse reporting table, can consume the same change stream at their own pace.

## Paths from CDC into Apache Iceberg

| Path | How changes are applied | Notes |
|---|---|---|
| Debezium, Kafka, and the Iceberg Kafka Connect sink | Upserts and deletes per configured commit interval | Open source; you run Kafka Connect |
| Flink CDC to Iceberg | Flink job writes upserts, typically as equality deletes, committed on checkpoint | Low latency; equality deletes need regular compaction |
| Raw change log table, then periodic `MERGE INTO` | Land every event in a bronze table, merge into a current-state table in batches | Simple to reason about; keeps full change history |
| Managed ingestion tools (Fivetran, Airbyte, others) | Vendor-managed CDC into Iceberg destinations | Less to operate; usage-based pricing |

Iceberg's newer spec versions change the trade-offs: v3 adds deletion vectors, which make row-level deletes cheaper to read, and row lineage, which helps downstream jobs consume only changed rows. For details, read [The Lakehouse Ingestion Tool Landscape: Fivetran, Airbyte, dlt, and CDC vs Batch](/blog/lakehouse-ingestion-tools/) and [CDC Without Complexity Using Iceberg v3 Row Lineage](/blog/iceberg-v3-row-lineage-cdc/).

## Summary of Technical Value

Change Data Capture moves row-level changes from operational databases to analytical systems continuously instead of in nightly batches. Log-based CDC captures deletes and puts little load on the source, which makes it the usual choice for feeding Kafka and Iceberg tables. The design decisions that remain are how changes are applied to Iceberg (equality deletes, merges, or both) and how often tables are compacted.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
