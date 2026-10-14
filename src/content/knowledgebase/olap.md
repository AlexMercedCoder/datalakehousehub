---
title: "OLAP vs OLTP on a Data Lakehouse: Columnar Engines on Iceberg"
meta_title: "OLAP vs OLTP on a Data Lakehouse | Glossary"
description: "OLAP (Online Analytical Processing) covers systems built for large aggregation queries over historical data. See how OLAP and OLTP map onto a data lakehouse."
---

OLAP stands for Online Analytical Processing: systems designed to answer large analytical queries over historical data, such as totals, trends, and comparisons across many dimensions. Its counterpart, [OLTP](/knowledgebase/oltp/) (Online Transaction Processing), handles the many small reads and writes that run an application, like placing an order or updating an address.

OLAP workloads run on warehouses such as Snowflake, BigQuery, and Redshift, on real-time OLAP databases such as ClickHouse, Apache Druid, and Apache Pinot, and on [data lakehouse](/knowledgebase/data-lakehouse/) engines such as Dremio, Trino, and Spark SQL querying Apache Iceberg tables.

Running a question like "total revenue by product category across all European stores for five years" against the production OLTP database scans huge numbers of rows and competes with live transactions for CPU and I/O. OLAP systems exist so that heavy analysis runs on a separate copy of the data, laid out for scanning.

## Columnar Storage

Most modern OLAP engines store data by column. In a row store, a 50-column `sales` table keeps each row's values together, so `SUM(revenue)` still reads all 50 columns from disk. A column store keeps all `revenue` values together, so the same query reads one column and skips the other 49. Column files such as Apache Parquet, which lakehouse tables use, also keep min and max statistics per row group so engines can skip blocks that cannot match a filter.

Columnar is the common approach today, not the only one. Classic MOLAP systems pre-computed multidimensional cubes, and that idea lives on in materialized aggregates and Dremio Reflections.

## Denormalization and Star Schemas

OLAP models favor fast reads over fast updates. Data is often organized as a [star schema](/knowledgebase/star-schema/): a central fact table of events or transactions surrounded by dimension tables such as customer, product, and date. Fewer joins and wider tables make queries simpler and faster, at the cost of duplicated attributes. Engines often use broadcast hash joins when a dimension table is small enough to copy to every worker.

## Compression and Vectorized Execution

Values of one type stored together compress well with run-length and dictionary encoding. Engines then process data in batches of values rather than one row at a time, a technique called [vectorized execution](/knowledgebase/vectorized-execution/), often on [Apache Arrow](/knowledgebase/apache-arrow/) memory buffers. Tight loops over arrays make good use of CPU caches and SIMD instructions.

## OLAP vs OLTP on a Data Lakehouse

| | OLTP | OLAP |
|---|---|---|
| Typical query | Read or change a few rows by key | Scan and aggregate millions or billions of rows |
| Storage layout | Row-oriented | Column-oriented |
| Schema style | Normalized (3NF) | Denormalized (star or wide tables) |
| Concurrency | Thousands of small transactions | Fewer, heavier queries plus BI dashboards |
| Lakehouse role | Source systems (PostgreSQL, MySQL, app databases) | Iceberg tables on object storage queried by Dremio, Trino, Spark, DuckDB |
| How data moves | Changes captured with CDC or batch extracts | Lands in Bronze, refined into Silver and Gold tables |

In a lakehouse, OLTP stays in operational databases and the OLAP side becomes open tables shared by several engines, instead of a copy locked inside one warehouse. Acceleration features such as materialized views, caching, and Reflections close the gap for low-latency dashboards. For the storage side in depth, read [Row vs. Column: How Storage Layout Shapes Everything](/blog/2026-04-29-query-engine-optimization-02-row-vs-column-storage/). For dashboard latency on Iceberg, see [Real-Time BI on Apache Iceberg Data Lakehouses](/blog/real-time-bi-iceberg-lakehouse/), and for modeling, [Star Schema vs. Snowflake Schema](/blog/2026-02-data-modeling-03-star-schema-vs-snowflake/).

## Summary

OLAP systems answer large analytical questions by storing data in columns, compressing it, modeling it for reads, and processing it in vectorized batches. On a lakehouse, OLTP databases remain the sources and Iceberg tables become the shared OLAP layer that any compatible engine can query.

## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
