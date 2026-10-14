---
canonical: "https://opendatalakehouse.com/kb/mpp/"
title: "What is MPP Architecture?"
meta_title: "What is MPP Architecture? | Expert Data Lakehouse & AI Glossary"
description: "MPP architecture is a parallel database design where one query is split across many compute nodes that run at once, using vectorized execution and pushdown."
---

## What is MPP Architecture?

Massively Parallel Processing (MPP) is an architecture that splits analytical work across many servers, each with its own CPU and memory, which process their portions of the data at the same time and combine the results.

In data engineering, **MPP Architecture** is the basis of most analytical databases and query engines built for large datasets. Classic MPP data warehouses such as Teradata, Netezza, and Greenplum used a shared-nothing design, with each node owning a slice of the data on local disks. Cloud data warehouses and lakehouse query engines (such as Amazon Redshift, Snowflake, Trino, and Dremio) apply the same parallel execution ideas, and many of them separate compute from storage.

## Core Architecture and Mechanics

To understand the practical application of MPP Architecture, it helps to look at its main behaviors:

* **Distributes query execution plans across a cluster of nodes.** A leader or coordinator node plans the query and assigns fragments to worker nodes, which scan, join, and aggregate their share of the data in parallel.
* **Often uses columnar storage and vectorized execution.** Processing batches of column values rather than individual rows makes better use of CPU caches and SIMD instructions.
* **Pushes filters and projections down toward storage to reduce data movement.** Data that is not needed is skipped as early as possible, and data is redistributed between nodes (shuffled) only when a join or aggregation requires it.

Modern MPP engines can query open table formats like [Apache Iceberg](/apache-iceberg/) and often run transformations defined in tools like dbt.

## Why MPP Architecture Matters in the Modern Data Stack

MPP engines provide the parallelism that makes it practical to aggregate and analyze very large datasets in reasonable time.

For enterprises with many teams, MPP systems can serve large numbers of concurrent queries, and cloud versions can add or remove compute as demand changes. The main design challenges are data skew (one node getting far more work than the others) and the cost of shuffling data between nodes for large joins.

### Key Benefits
- **Horizontal Scalability:** Adding nodes increases the data volume and concurrency the system can handle.
- **Vendor Neutrality:** MPP engines that read open formats like Iceberg and Parquet let you change engines without migrating data.
- **Observability:** Query plans and profiles show how work was split across nodes, which helps engineers find skew and other bottlenecks.

## Frequently Asked Questions

### Do distributed engines store the data?
Some do (like Snowflake, which manages its own storage), while others (like Trino or Presto) provide only the compute layer and query data where it lives, such as in open lakehouse storage.

### What is vectorized execution?
It is an optimization that processes data in column batches sized to fit CPU caches, rather than one row at a time, which speeds up analytical operations like scans, filters, and aggregations.

### How does MPP Architecture impact data governance and security?
MPP systems usually enforce access through their own role-based access control (RBAC), row and column policies, and query logging, or through an external catalog or policy service. Governance still has to be configured; the architecture itself does not provide it.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
