---
title: "Apache Hive and the Hive Metastore vs Apache Iceberg"
meta_title: "Apache Hive vs Iceberg: Metastore, Tables, Migration"
description: "Apache Hive is a SQL data warehouse system for HDFS and object storage, known for its Metastore. Compare Hive tables with Iceberg and learn how to migrate."
---

Apache Hive is a data warehouse system that runs SQL (HiveQL) over large datasets in distributed storage such as HDFS and cloud object storage. Facebook built it and open-sourced it in 2008, and it became an Apache top-level project in 2010. The project is still active: the 4.x line is current, with 4.2.1 released in August 2026.

Before Hive, analyzing data on a Hadoop cluster meant writing Java MapReduce programs. Hive let analysts write `SELECT`, `JOIN`, and `GROUP BY` instead, and compiled those queries into MapReduce jobs. That opened Hadoop data to far more people.

## Hive's Execution Engines

### MapReduce
Early Hive compiled each query into a chain of MapReduce jobs. Each stage wrote intermediate results to disk before the next stage read them, which made jobs fault tolerant but slow. Queries often took minutes, fine for overnight batch reports and poor for interactive BI.

### Tez and LLAP
Hive later adopted Apache Tez, which runs a query as a single directed acyclic graph (DAG) of tasks and avoids many intermediate disk writes. LLAP (Live Long and Process) added long-running daemons with in-memory caching for lower latency. In the 4.x line, the project encourages users to move workloads to Tez. Many organizations now run their SQL on Spark, Trino, Dremio, or Impala instead, while still using Hive's metadata layer.

## The Hive Metastore (HMS)

The Hive Metastore is the part of Hive with the longest reach. It is a service backed by a relational database (often MySQL or PostgreSQL) that stores database and table names, schemas, column types, and the storage location of each table and partition, for example `s3://data-lake/sales/year=2026/month=05`. Spark, Presto, Trino, Impala, and many other engines used HMS as their shared catalog for years. Since Hive 4.1, the Metastore can be deployed as a standalone component.

### Where Hive Tables Struggle
A Hive table is defined by directories. HMS knows which partition directories exist, but not which files are in them, so engines list directories at query time. On object storage, listing is slow and was historically not consistent, and a table with many partitions can spend more time planning than reading. Hive tables also lack atomic multi-file commits outside of Hive's own ACID tables, so readers can see partial writes. These limits drove the design of [Apache Iceberg](/knowledgebase/apache-iceberg/), Delta Lake, and Apache Hudi.

## Hive Tables vs Iceberg Tables

| | Hive table | Iceberg table |
|---|---|---|
| What defines the table | Directories and partitions registered in HMS | Metadata files, manifest lists, and manifests listing every data file |
| Query planning | List partition directories | Read manifests; prune with file-level statistics |
| Partitioning | Explicit partition columns users must filter on | [Hidden partitioning](/knowledgebase/hidden-partitioning/) with transforms; partition evolution without rewrites |
| Commits | Directory-level, not atomic across files (except Hive ACID tables) | Atomic snapshot commits with optimistic concurrency |
| Time travel | No | Yes, through snapshots |
| Engine support | Broad, through HMS | Broad: Spark, Flink, Trino, Dremio, DuckDB, Hive 4, and others |

HMS did not disappear with Iceberg. Iceberg's Hive catalog uses HMS to store a pointer to each table's current metadata file, and many teams run Iceberg tables in HMS before moving to a REST catalog such as Apache Polaris. Hive itself now creates and queries Iceberg tables, and Hive 4.2 adds an Iceberg REST catalog client.

## Migrating from Hive to Iceberg

Iceberg provides Spark procedures for moving Hive tables without copying data: `snapshot` creates a test Iceberg table over the existing files, `migrate` converts the table in place, and `add_files` registers existing files into an Iceberg table. A full rewrite with `CREATE TABLE AS SELECT` costs more but lets you fix file sizes and partitioning. For the tradeoffs, read [Migrating Into Iceberg Without Moving Data](/blog/iceberg-in-place-migration/) and [Migrating to Apache Iceberg: Strategies for Every Source System](/blog/2026-04-29-apache-iceberg-masterclass-15-migrating-to-iceberg/). See also the [Hive Metastore](/knowledgebase/hive-metastore/) glossary entry.

## Summary

Apache Hive brought SQL to Hadoop, and its Metastore became the shared catalog of the data lake era. Directory-based Hive tables hit limits at object storage scale, which led to Iceberg's file-level metadata. Today Hive, HMS, and Iceberg coexist: HMS can catalog Iceberg tables, Hive 4 works with Iceberg, and in-place procedures make migration incremental.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
