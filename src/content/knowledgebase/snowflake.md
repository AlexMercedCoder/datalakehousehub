---
title: "Snowflake and Apache Iceberg: How the Warehouse Fits an Open Lakehouse"
meta_title: "Snowflake and Apache Iceberg in a Lakehouse | Glossary"
description: "Snowflake is a managed cloud data platform that separates storage from compute. See how its Iceberg tables and catalogs fit an open, multi-engine lakehouse."
---

Snowflake is a fully managed cloud data platform for data warehousing and analytics, founded in 2012 and run as a service on AWS, Azure, and Google Cloud. Users do not provision servers, tune indexes, or run vacuum jobs. They load data, size compute, and write SQL.

For lakehouse teams the more interesting question is how Snowflake works with open data. Snowflake now reads and writes [Apache Iceberg](/knowledgebase/apache-iceberg/) tables and exposes them to other engines through Iceberg REST catalogs, so it can act as one engine among several rather than the only place your data lives.

## The Three-Layer Architecture

Snowflake describes its design as a hybrid of shared-disk and shared-nothing architectures, organized into three layers.

### 1. Storage
Native Snowflake tables are stored in a proprietary compressed columnar format on cloud object storage. Snowflake manages the files; users only see tables. Semi-structured data such as JSON, Avro, and Parquet can be loaded into the `VARIANT` type.

### 2. Compute (Virtual Warehouses)
Queries run on virtual warehouses, which are independent compute clusters. Several warehouses can read the same tables at once without competing for resources, so a heavy month-end finance job does not slow a marketing dashboard running on a separate warehouse. Multi-cluster warehouses add clusters automatically when concurrency rises.

### 3. Cloud Services
The control plane handles authentication, metadata, query optimization, and transactions. It knows which files hold which data, so compute reads only what a query needs.

## Micro-Partitions and Pruning

Snowflake splits table data into micro-partitions of roughly 50 MB to 500 MB of uncompressed data and records metadata for each one, including the minimum and maximum values of every column. A filter such as `WHERE order_date = '2026-05-14'` is checked against that metadata first, and partitions that cannot match are skipped. This replaces most manual indexing. For very large tables, an optional clustering key keeps related rows together so pruning works better.

## Secure Data Sharing

Snowflake lets one account grant another account read access to selected tables without copying files. The consumer queries the shared data with its own warehouses and sees changes as soon as the provider commits them. Within Snowflake this works well; sharing with engines outside Snowflake is where Iceberg comes in.

## Snowflake in an Open Lakehouse

Snowflake supports Iceberg tables stored as Parquet files in your own cloud bucket (an "external volume") or in Snowflake-managed storage. There are three main ways to set them up:

| Option | Who owns the catalog | What other engines get |
|---|---|---|
| Snowflake as the Iceberg catalog | Snowflake (Horizon) | Spark, Trino, Dremio, and others can read, and with limits write, through the Horizon Iceberg REST Catalog API |
| External catalog via catalog integration | AWS Glue, Snowflake Open Catalog, or another Iceberg REST catalog | The external catalog stays the source of truth; Snowflake reads and writes but does not manage table maintenance |
| Catalog-linked database | A remote Iceberg REST catalog | Snowflake discovers and syncs namespaces and tables from that catalog automatically |

Snowflake Open Catalog is Snowflake's managed service based on [Apache Polaris](/knowledgebase/apache-polaris/), which Snowflake and Dremio co-created and donated to the Apache Software Foundation. Polaris became a top-level Apache project in February 2026.

A typical pattern: raw and Silver data land as Iceberg tables in your bucket, registered in Polaris or Glue. Snowflake serves BI workloads that need its features, while Spark handles heavy transformation and [Dremio](/knowledgebase/dremio-cloud/) or [Trino](/knowledgebase/trino/) serve other teams from the same files. The tradeoff to plan for is that Snowflake-managed native tables still get the fullest feature set, and Iceberg tables owned by an external catalog get more limited platform support.

For production lessons and setup details, see [Snowflake Interoperable Lakehouse Lessons](/blog/snowflake-interoperable-lakehouse-production-lessons/), [Bidirectional Iceberg Writes with Horizon Catalog](/blog/snowflake-horizon-catalog-bidirectional-iceberg-writes/), and [Connect Snowflake to Dremio Cloud](/blog/2026-03-connect-snowflake-dremio/).

## Summary

Snowflake is a managed warehouse built on separated storage and compute, micro-partition pruning, and in-platform data sharing. Its Iceberg support lets it share tables with other engines through open catalogs, which makes it a workable part of a multi-engine lakehouse as long as you decide up front which catalog owns each table.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
