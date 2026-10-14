---
title: "StarRocks and Iceberg: How It Compares to Apache Doris"
meta_title: "StarRocks vs Apache Doris for Iceberg | Lakehouse Glossary"
description: "StarRocks is an open source MPP engine for sub-second analytics on its own tables and lakehouse data. See how it queries Iceberg and compares to Apache Doris."
---

## What is StarRocks?

StarRocks is an open source, MPP analytical database and query engine built for sub-second, ad hoc analytics, both on its own tables and directly on data lakehouse tables. It is a Linux Foundation project licensed under Apache 2.0. StarRocks began in 2020 as a fork of Apache Doris and has since rewritten most of that original codebase; CelerData, the company behind it, contributed the project to the Linux Foundation in 2023.

StarRocks is compatible with the MySQL protocol, so MySQL clients and BI tools connect to it directly, and it supports ANSI SQL including the full TPC-H and TPC-DS query sets.

## Architecture and Core Features

* **Frontend and Backend nodes:** Frontend (FE) nodes hold metadata and plan queries; Backend (BE) nodes store data and execute queries. Both scale horizontally and replicate metadata and data.
* **Shared-data mode:** since version 3.0, StarRocks can run with data on object storage and stateless compute nodes, separating storage from compute.
* **Vectorized execution and a cost-based optimizer:** columns are processed in batches, and the CBO chooses join orders and plans for complex multi-table queries.
* **Primary key tables:** support real-time upserts and deletes while still serving queries, which suits CDC pipelines.
* **Materialized views:** asynchronous materialized views can be selected automatically at query time to answer queries faster.

## Querying the Lakehouse

StarRocks reads Apache Hive, [Apache Iceberg](/knowledgebase/apache-iceberg/), Delta Lake, and Apache Hudi tables in place through external catalogs, without loading the data first. The Iceberg catalog has been supported since v2.4. From v3.1, StarRocks can also create Iceberg databases and tables and write Parquet data into them with INSERT INTO and INSERT OVERWRITE.

## StarRocks vs Apache Doris on Iceberg

The two projects share ancestry and target the same workloads, so the practical differences are in governance and feature details. Based on each project's documentation:

| | StarRocks | Apache Doris |
|---|---|---|
| Governance | Linux Foundation project | Apache Software Foundation top-level project |
| Separated storage and compute | Shared-data mode (v3.0+) | Compute-storage decoupled mode |
| Iceberg writes | CREATE TABLE, INSERT INTO / OVERWRITE into Parquet tables (v3.1+) | INSERT and INSERT OVERWRITE; current docs also list UPDATE, DELETE, MERGE INTO |
| Iceberg materialized views | Async MVs (v2.5+), partition-level incremental refresh (v3.2+) | Async MVs over Iceberg, partition-level refresh in 3.1 |
| Fluss integration | Listed as planned by Apache Fluss | Not listed |

In an open lakehouse, StarRocks fits as a low-latency serving engine beside the tools that manage your tables. A common layout keeps Iceberg tables in an open catalog such as [Apache Polaris](/knowledgebase/apache-polaris/), uses Spark or [Dremio](/knowledgebase/dremio-cloud/) for transformation and broad SQL access, and points StarRocks at the same catalog for dashboards that need sub-second response under high concurrency. Test both engines on your own data before choosing; vendor benchmarks rarely match real workloads. See the [Apache Doris entry](/knowledgebase/apache-doris/) for more detail on Doris.

## Frequently Asked Questions

### Does StarRocks store its own data?
Yes, it can. StarRocks has native tables on local disk or object storage, and it can also act as a pure query engine over Iceberg, Hive, Hudi, and Delta Lake tables.

### Is StarRocks the same as Apache Doris?
No. StarRocks forked from Doris in 2020, and the two have evolved separately since, with different governance, release cycles, and feature sets.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
