---
canonical: "https://opendatalakehouse.com/kb/hive-metastore/"
title: "Hive Metastore (HMS): How It Works and How It Compares to Iceberg Catalogs"
meta_title: "Hive Metastore vs Iceberg REST Catalogs | Glossary"
description: "The Hive Metastore (HMS) is the catalog service that maps Hive tables to files. See how it compares to Iceberg REST catalogs like Polaris, Glue, and Nessie."
---

The Hive Metastore (HMS) is a service that stores table and partition metadata for data lakes. It was built for Apache Hive in the Hadoop era and became the shared catalog that Spark, Presto, Trino, Impala, and many other engines used to find tables in HDFS and later in object storage. It is part of Apache Hive, which remains an active Apache top-level project, and since Hive 4.1 it ships as a standalone component with its own binary and Docker image.

A data lake on its own is a set of files. If you write a million Parquet files to S3, an engine has no way to know which files form a table, what the columns are, or how the data is partitioned. HMS provides that map.

## The Architecture of the Catalog

HMS is a Thrift service backed by a relational database, usually MySQL or PostgreSQL. You can run several HMS instances for availability, but they share that one backing database.

It stores:
* **Table definitions:** a logical name such as `prod.sales` mapped to a storage location such as `s3://data-lake/sales/`.
* **Schemas:** column names and types, plus the file format and SerDe used to read them.
* **Partitions:** one row per partition directory (for example `dt=2026-10-14`), which lets an engine skip directories that do not match a filter.
* **Statistics and transactions:** column statistics for the optimizer and, for Hive ACID tables, the transaction and lock state.

When a user runs `SELECT * FROM prod.sales WHERE dt = '2026-10-14'`, the engine asks HMS for the table and the matching partitions, then lists the files in those directories and reads them.

## Where HMS Struggles

* **Partition counts:** every partition is a row in the backing database, and planning a query over a table with hundreds of thousands of partitions means large metastore calls plus directory listings in object storage.
* **File tracking:** HMS tracks directories, not files. Engines must list storage to find files, which is slow on S3 and gives no snapshot of exactly which files make up a version of the table.
* **Transactions:** ACID guarantees exist only for Hive's own transactional tables. Plain external tables written by Spark or other engines have no commit protocol, so concurrent writers can step on each other.

## Hive Metastore vs Iceberg Catalogs

[Apache Iceberg](/knowledgebase/apache-iceberg/) moves file-level tracking out of the catalog and into metadata files (JSON table metadata plus Avro manifest lists and manifests) stored next to the data. The catalog only has to hold a pointer to the current metadata file and swap it atomically on commit.

| | Hive Metastore (Hive tables) | HMS as Iceberg catalog | Iceberg REST catalog (Polaris, Glue, Nessie, Unity Catalog OSS) |
|---|---|---|---|
| What the catalog tracks | Tables, partitions, directories | Pointer to current metadata file | Pointer to current metadata file, plus access control in most implementations |
| File listing at query time | Yes | No, manifests list files | No, manifests list files |
| Multi-engine commits | Not for external tables | Atomic pointer swap with locks | Atomic commit through the REST API |
| Client protocol | Thrift | Thrift (Iceberg HiveCatalog) | HTTP REST spec, language neutral |

HMS has adapted: the Iceberg `HiveCatalog` uses it as a pointer store, and recent Hive releases expose an Iceberg REST catalog endpoint backed by HMS. That makes it a reasonable bridge for teams with existing Hive tables. New lakehouse deployments usually choose a REST catalog such as [Apache Polaris](/knowledgebase/apache-polaris/), [AWS Glue](/knowledgebase/aws-glue/), or [Project Nessie](/knowledgebase/project-nessie/) for credential vending and engine neutrality. To move Hive tables into Iceberg without rewriting data, see [Migrating Into Iceberg Without Moving Data](/blog/iceberg-in-place-migration/) and [Migrating to Apache Iceberg: Strategies for Every Source System](/blog/2026-04-29-apache-iceberg-masterclass-15-migrating-to-iceberg/). For the catalog landscape, read [What Are Lakehouse Catalogs?](/blog/2026-04-29-apache-iceberg-masterclass-07-lakehouse-catalogs/).

## Summary

The Hive Metastore defined the idea of a catalog that sits apart from storage and is shared by many engines. Its directory-based model limits it at large partition counts and gives no multi-engine transactions for plain tables, which is why the [data lakehouse](/knowledgebase/data-lakehouse/) moved file tracking into Iceberg metadata and the catalog role toward REST catalogs.

## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
