---
title: "Apache Spark SQL on Iceberg: Catalyst, Tungsten, and MERGE INTO"
meta_title: "Apache Spark SQL for Iceberg Tables: How It Works | Glossary"
description: "Apache Spark SQL is Spark's module for structured data, SQL, and DataFrames. Learn how Catalyst plans queries and how Spark SQL writes Iceberg tables."
---

## What Apache Spark SQL Is

Apache Spark SQL is the module of [Apache Spark](/knowledgebase/apache-spark/) that processes structured and semi-structured data. It provides a SQL interface and the DataFrame and Dataset APIs (in Scala, Java, Python, and R), and it plans every one of them through the same optimizer. Most modern Spark code, including PySpark DataFrame code, runs through Spark SQL rather than the low-level RDD API.

In a [data lakehouse](/knowledgebase/data-lakehouse/), Spark SQL is a common engine for batch ingestion, transformations between medallion layers, and table maintenance on [Apache Iceberg](/knowledgebase/apache-iceberg/), Delta Lake, and Apache Hudi tables.

## The Catalyst Optimizer

Catalyst turns a query into an execution plan in four phases:

1. **Analysis.** Resolve table and column names against the catalog (a Hive Metastore, an Iceberg REST catalog, AWS Glue) and check types.
2. **Logical optimization.** Apply rule-based rewrites such as predicate pushdown, column pruning, and constant folding. A filter written after a join is moved before it when that is safe, which cuts how much data gets shuffled.
3. **Physical planning.** Choose join strategies and other physical operators, for example a [broadcast hash join](/knowledgebase/broadcast-hash-join/) when one side is small or a [sort-merge join](/knowledgebase/sort-merge-join/) for two large inputs. The [cost-based optimizer](/knowledgebase/cost-based-optimizer/) uses table and column statistics when they are available.
4. **Code generation.** Compile parts of the plan into Java bytecode at runtime.

Since Spark 3.2, Adaptive Query Execution (AQE) is on by default. It re-optimizes the plan at stage boundaries using real shuffle statistics: coalescing small partitions, switching to a broadcast join when one side turns out small, and splitting skewed partitions.

## Project Tungsten

Tungsten is Spark's work on memory and CPU efficiency. It stores rows in a compact binary format (`UnsafeRow`) instead of one Java object per value, can manage memory off the garbage-collected heap for shuffle and sort buffers, and uses whole-stage code generation to fuse a chain of operators into one generated function. These changes reduce object overhead and garbage collection pressure. They do not remove the JVM: Spark still runs on it, and wide scans can still spend real time in garbage collection, which is the problem native accelerators like DataFusion Comet target. See [DataFusion Comet 1.0 and Spark on Iceberg](/blog/datafusion-comet-1-spark-iceberg/).

## Spark SQL with Apache Iceberg

With the Iceberg runtime JAR and Iceberg's SQL extensions enabled, Spark SQL gains row-level DML and maintenance procedures on Iceberg tables:

```sql
MERGE INTO lake.sales.orders t
USING updates u
ON t.order_id = u.order_id
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;

CALL lake.system.rewrite_data_files(table => 'sales.orders');
CALL lake.system.expire_snapshots(table => 'sales.orders', older_than => TIMESTAMP '2026-09-01 00:00:00');
```

Spark SQL also reads Iceberg metadata tables (`orders.snapshots`, `orders.files`) and supports [time travel](/knowledgebase/time-travel/) with `VERSION AS OF` and `TIMESTAMP AS OF`. For a hands-on setup with an open catalog, see [Intro to Apache Iceberg with Apache Polaris and Apache Spark](/blog/2025-10-intro-to-apache-iceberg-with-apache-polaris-and-apache-spark/).

## Spark SQL vs Other Iceberg Engines

| | Spark SQL | Trino | Dremio | DuckDB |
|---|---|---|---|---|
| Best fit | Large batch ETL, streaming writes, table maintenance | Interactive SQL across many sources | Interactive BI and federation with acceleration | Local and single-node analysis |
| Startup cost | Cluster or session spin-up | Long-running cluster | Long-running service | In-process, instant |
| Iceberg writes and procedures | Full, including CALL procedures | Writes and some procedures | Writes and table optimization | Growing support |

Many lakehouses use Spark SQL for heavy writes and maintenance and a separate engine such as [Trino](/knowledgebase/trino/), Dremio, or [DuckDB](/knowledgebase/duckdb/) for interactive reads, all sharing one Iceberg catalog.

## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
