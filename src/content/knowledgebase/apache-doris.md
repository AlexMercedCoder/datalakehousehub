---
title: "Apache Doris and Iceberg: How It Compares to StarRocks"
meta_title: "Apache Doris vs StarRocks on Iceberg | Lakehouse Glossary"
description: "Apache Doris is an open source MPP database for real-time, high-concurrency analytics. See how it reads and writes Iceberg tables and compares to StarRocks."
---

Apache Doris is an open source, real-time analytical database built on a Massively Parallel Processing (MPP) architecture. It started at Baidu as an advertising reporting system and is now an Apache Software Foundation top-level project. Doris is designed to return sub-second results for both high-concurrency point queries and complex aggregations over large datasets.

Distributed engines like Apache Spark or Trino are strong at large data lake transformations and federated queries, but customer-facing dashboards with thousands of concurrent users need lower latency than most lake engines deliver. That is the niche Doris targets, alongside databases such as StarRocks and ClickHouse. Doris speaks the MySQL protocol, so standard MySQL clients and BI tools connect to it without special drivers.

## Architecture

In its classic deployment Doris runs only two process types and does not depend on external services such as ZooKeeper or HDFS:

* **Frontend (FE):** manages metadata and cluster state, parses SQL, plans distributed queries, and routes work. Production clusters run several FEs for high availability.
* **Backend (BE):** stores data with multiple replicas, runs vectorized query execution, and handles background compaction.

Newer releases also offer a compute-storage decoupled mode, where data lives on shared storage such as S3 or HDFS and independent compute groups scale separately.

## Storage, Indexing, and Execution

Doris stores data in its own columnar format, sorted by key columns. It builds a sorted prefix index plus Min/Max statistics, and it supports BloomFilter, inverted, and vector indexes. These let a query skip blocks that cannot match a filter instead of scanning them. Once data is in memory, a vectorized engine processes columns in batches, which keeps CPU caches busy and allows SIMD instructions.

## Data Models for Real-Time Ingestion

Data commonly arrives through Stream Load, Routine Load from Apache Kafka, or Apache Flink connectors. Doris offers three table models:

* **Duplicate model:** keeps every row as written, suited to logs and event streams.
* **Unique model:** keeps the latest row per key and supports row-level updates, which fits CDC replication from operational databases.
* **Aggregate model:** pre-aggregates metrics (such as SUM or MAX) per key as data loads, so reports read fewer rows.

## Apache Doris on Iceberg vs StarRocks

Doris queries external data through its multi-catalog feature, including [Apache Iceberg](/knowledgebase/apache-iceberg/), Hive, Hudi, Paimon, and JDBC sources. StarRocks, which began in 2020 as a fork of Apache Doris and has since been largely rewritten, covers a similar lakehouse use case. Here is how the two compare for Iceberg work, based on each project's documentation:

| | Apache Doris | StarRocks |
|---|---|---|
| Governance | Apache Software Foundation top-level project | Linux Foundation project, Apache 2.0 license |
| Iceberg catalogs | Hive Metastore, REST, Glue, Hadoop/filesystem, JDBC, DLF, S3 Tables | Hive Metastore, Glue, REST, and others (Iceberg catalog since v2.4) |
| Reads | Parquet and ORC data files, position and equality deletes, time travel, branches and tags | Parquet and ORC data files, time travel |
| Writes | INSERT and INSERT OVERWRITE; current docs also list UPDATE, DELETE, and MERGE INTO | CREATE TABLE plus INSERT INTO / INSERT OVERWRITE into Parquet Iceberg tables (v3.1+) |
| Acceleration | Async materialized views over Iceberg, with query rewrite you enable per session | Async materialized views over Iceberg (v2.5+), partition-level refresh (v3.2+) |

Both engines work best as a serving layer: keep the governed tables in Iceberg behind an open catalog such as [Apache Polaris](/knowledgebase/apache-polaris/), let engines like [Dremio](/knowledgebase/dremio-cloud/), Spark, or [Trino](/knowledgebase/trino/) share them, and use Doris or StarRocks materialized views for the dashboards that need the lowest latency. The choice between them usually comes down to which write features you need on Iceberg, your existing operational familiarity, and benchmarks on your own data. See the [StarRocks entry](/knowledgebase/starrocks/) for the other side.

## Summary

Apache Doris gives teams a simple-to-operate, MySQL-compatible engine for real-time, high-concurrency analytics. In a lakehouse it sits next to Iceberg rather than replacing it: reading and writing Iceberg tables through standard catalogs, and caching hot results in its own storage when latency matters most.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
