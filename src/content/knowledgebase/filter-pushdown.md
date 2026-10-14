---
title: "Filter Pushdown: How Iceberg, Parquet, and Lakehouse Engines Skip Data"
meta_title: "Filter Pushdown in Apache Iceberg and Parquet | Glossary"
description: "Filter pushdown moves a query's WHERE conditions down to the storage or source layer so less data is read. Here is how it works with Iceberg and Parquet."
---

## What is Filter Pushdown?

Filter pushdown is a query optimization that moves a query's filter conditions (the `WHERE` clause) as close to the data as possible, so the engine reads and transfers only the data that might match. Instead of loading a whole table and filtering in memory, the engine hands the filter to the layer below it: a table format's metadata, a file reader, or a remote database.

The term is used almost interchangeably with [predicate pushdown](/knowledgebase/predicate-pushdown/). "Predicate" is the formal name for a condition like `order_date >= '2026-01-01'`; "filter" is the everyday name.

## Where Filters Get Pushed on a Lakehouse

On an [Apache Iceberg](/knowledgebase/apache-iceberg/) lakehouse, a filter like `WHERE region = 'EU' AND order_date >= '2026-10-01'` is applied at several levels, each skipping more data before any rows are decoded.

| Level | What gets skipped | Information used |
|---|---|---|
| Iceberg manifest list | Whole manifest files | Partition value ranges summarized per manifest |
| Iceberg manifests | Individual data files | Partition values plus per-file column stats (lower/upper bounds, null counts) |
| Parquet row groups | Row groups inside a file | Row group min/max statistics, dictionary pages, optional bloom filters |
| Parquet pages | Individual pages | Page index (column index and offset index) |
| Rows | Remaining non-matching rows | Vectorized filter evaluation in the engine |
| Federated sources | Rows in a remote database | Filters translated to SQL and run by the source (for example over JDBC) |

Iceberg's hidden partitioning helps here: a filter on `order_date` can prune partitions defined as `day(order_ts)` without the query naming a partition column. With the REST catalog's scan planning API, a catalog server can do the manifest-level work and return the file list to the engine.

Engines such as Dremio, Trino, Apache Spark, Apache Flink, and DuckDB all push filters into Iceberg and Parquet scans. In federated queries, engines like Dremio and Trino also push filters (and sometimes joins and aggregations) into source systems such as PostgreSQL or SQL Server, so only matching rows cross the network.

## Making Pushdown Effective

* **Partition on columns you filter by**, at a sensible granularity, so partition pruning removes most files.
* **Sort or cluster data** within files on frequently filtered columns. Sorted data gives tight min/max ranges, so statistics actually exclude files and row groups. Compaction with a sort order in Iceberg applies this at scale.
* **Write bloom filters** for high-cardinality equality lookups (for example `user_id = ...`), where min/max ranges are too wide to help.
* **Keep filters sargable.** Wrapping a column in a function, such as `CAST(order_ts AS VARCHAR) LIKE '2026%'`, can stop an engine from using statistics. Compare the raw column to a literal instead.
* **Check the plan.** `EXPLAIN` output and query profiles show whether filters reached the scan and how many files were skipped.

For more detail, see [Parquet Page Indexes and the Last Mile of Pruning in Apache Iceberg](/blog/parquet-page-index-pruning-iceberg/), [The Catalog Can Now Plan Your Iceberg Query: Inside REST Scan Planning](/blog/inside-iceberg-rest-scan-planning/), and [Inside the Query Optimizer: How Engines Pick a Plan](/blog/2026-04-29-query-engine-optimization-05-query-optimizer/).

## Frequently Asked Questions

### What is the difference between filter pushdown and partition pruning?
Partition pruning is one form of filter pushdown: it uses the filter to skip entire partitions. Filter pushdown also covers file-level, row-group, and page-level skipping, and pushing filters to remote sources.

### Does filter pushdown work with CSV or JSON files?
Only in a limited way. Those formats have no embedded statistics, so engines usually must read every byte. Columnar formats like [Apache Parquet](/knowledgebase/apache-parquet/) and [Apache ORC](/knowledgebase/apache-orc/) are what make deep pushdown possible.

### Does filter pushdown affect security?
Indirectly. Row-level security policies are often implemented as filters, and engines can push those filters down like any other, so secured queries do not need to read data the user cannot see.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
