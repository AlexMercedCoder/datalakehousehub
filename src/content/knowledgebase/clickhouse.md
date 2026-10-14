---
title: "What is ClickHouse?"
meta_title: "What is ClickHouse? | Expert Data Lakehouse & AI Glossary"
description: "ClickHouse is an open-source, column-oriented database for real-time analytical queries. Learn how vectorized execution works and how it fits near a lakehouse."
---

## What is ClickHouse?

An open-source, column-oriented database management system designed for real-time analytical queries and reports.

**ClickHouse** was originally developed at Yandex to power its web analytics service, Yandex.Metrica, and was released as open source under the Apache 2.0 license in 2016. It is now developed primarily by ClickHouse, Inc., which also offers a managed cloud service. ClickHouse is widely used for log analytics, observability, product analytics, and user-facing dashboards that need fast aggregations over large tables.

## Core Architecture and Mechanics

To understand how ClickHouse delivers fast analytics, it helps to look at a few core design choices:

* **Stores data by column in MergeTree tables.** Data is written in sorted, immutable parts that are merged in the background, and a sparse primary index lets queries skip large ranges of rows that cannot match a filter.
* **Uses vectorized execution to process columns in batches rather than one row at a time.** This makes good use of CPU caches and SIMD instructions, which speeds up scans and aggregations.
* **Scales out through sharding and replication.** A distributed table fans a query out to shards in parallel and merges the partial results.

ClickHouse can also query external data, including [Apache Iceberg](/apache-iceberg/) tables through its Iceberg table engine and table function, and it is commonly used alongside tools such as dbt.

## Why ClickHouse Matters in the Modern Data Stack

Columnar storage, data skipping, and parallel execution let ClickHouse aggregate large volumes of data quickly, which suits workloads where many users or applications run analytical queries with low latency expectations.

For data teams, ClickHouse is often used as a serving layer: data lands in the lakehouse or arrives from streams such as Kafka, and ClickHouse holds the hot, frequently queried subset for dashboards and APIs. It is open source, so teams can self-host it or use a managed service.

### Key Benefits
- **Fast Aggregations:** Columnar storage and vectorized execution make large `GROUP BY` queries fast.
- **Open Source:** Available under the Apache 2.0 license, with self-managed and managed deployment options.
- **Enhanced Observability:** System tables expose query logs, metrics, and part information so engineers can monitor and tune workloads.

## Frequently Asked Questions

### Do distributed engines store the data?
Some do (like ClickHouse and Snowflake, which manage their own storage formats), while others (like Trino or Presto) provide only the compute layer and query data directly from open lakehouse storage. This distinction matters when evaluating total architecture costs and performance.

### What is vectorized execution?
It is an optimization that processes data in column batches sized to fit CPU caches, rather than one row at a time, which speeds up analytical operations.

### How does ClickHouse impact data governance and security?
ClickHouse provides SQL-based access control, including users, roles, grants, and row policies, along with query logging in system tables. These features help teams control and audit who can access which data.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
