---
title: "Spill to Disk: How Spark, Trino, Dremio, and DuckDB Handle Memory Pressure"
meta_title: "Spill to Disk in Spark, Trino, Dremio and DuckDB"
description: "Spill to disk is when a query engine writes intermediate data to local disk once memory runs out. Compare how Spark, Trino, Dremio, and DuckDB handle it."
---

## What is Spill to Disk?

Spill to disk is what a query engine does when an operator's working data no longer fits in its memory budget: it writes part of that data to local disk, keeps going, and reads it back later. The query finishes instead of failing with an out-of-memory error, but it runs slower. Disk reads and writes are much slower than RAM, and the engine also spends CPU serializing in-memory data (JVM objects or Arrow buffers) into a disk format and deserializing it when it reads the spill back.

Spilling happens in blocking operators, the ones that must see much or all of their input before they can produce output:

* **Hash joins:** the build side's hash table is partitioned, and partitions that do not fit are written to disk with the matching probe rows, then joined one partition at a time.
* **Aggregations:** partial group-by results are written out and merged later.
* **Sorts:** sorted runs are written to disk and merged (an external merge sort).
* **Window functions:** partitions of rows are buffered on disk.

Filters and projections stream rows through and rarely need to spill.

## How Lakehouse Engines Handle It

| Engine | Spilling behavior | Main settings |
|---|---|---|
| Apache Spark | Sorts, aggregations, and shuffles spill by default; the Spark UI shows "Spill (Memory)" and "Spill (Disk)" per stage | `spark.executor.memory`, `spark.memory.fraction`, `spark.local.dir` |
| Trino | Joins, aggregations, ORDER BY, and window functions can spill; the docs call spilling legacy and recommend fault-tolerant execution instead | `spiller-spill-path`, `query_max_memory_per_node` |
| Dremio | Hash aggregation spills by default; hash join spilling is on by default from version 25 | Spill paths in `dremio.conf`, query memory limits |
| DuckDB | GROUP BY, joins, ORDER BY, and windows can exceed memory by spilling to a temp directory; `list()` and `string_agg()` cannot | `memory_limit`, `temp_directory` |

## Reading Spill as a Signal

Some spill is normal for large joins and sorts. Heavy spill on queries that run often is a sign to fix the workload rather than add disk:

* **Prune earlier.** Partition and sort [Apache Iceberg](/knowledgebase/apache-iceberg/) tables on common filter columns so less data reaches the join or aggregation; see [predicate pushdown](/knowledgebase/predicate-pushdown/).
* **Pick the right join.** A [broadcast hash join](/knowledgebase/broadcast-hash-join/) of a small dimension avoids building a huge hash table. The planner picks broadcast from size estimates, so stale or missing table statistics can lead the [cost-based optimizer](/knowledgebase/cost-based-optimizer/) to broadcast a table that is too large; run `ANALYZE` or refresh statistics after big loads.
* **Handle skew.** Skewed join keys can push one task into spill while the rest sit idle. In Spark, Adaptive Query Execution (on by default since 3.2) splits skewed sort-merge join partitions when `spark.sql.adaptive.skewJoin.enabled` is true; in other engines, salting the hot key spreads its rows across tasks.
* **Pre-aggregate.** Materialize frequent rollups as gold tables or materialized views so dashboards do not re-aggregate raw facts.
* **Use fast local disk.** When spill is unavoidable, NVMe instance storage spills far faster than network-attached volumes.

For the mechanics behind this, read [Buffer Pools, Caches, and the Memory Hierarchy](/blog/2026-04-29-query-engine-optimization-07-memory-and-caching/) and [Hash, Sort-Merge, Broadcast: How Distributed Joins Work](/blog/2026-04-29-query-engine-optimization-09-distributed-joins/).

## Frequently Asked Questions

### Is spilling to disk bad?
It is a safety valve. It keeps large queries from failing, at the cost of speed. Occasional spill is fine; constant spill on routine queries means memory, data layout, or query design needs attention.

### Is spilling the same as swapping?
No. Swapping is the operating system paging process memory to disk without the engine knowing. Spilling is controlled by the engine, which chooses what to write and reads it back in an efficient order.

### Does spilling affect data security?
Spill files hold intermediate query data on local disk. Some engines, such as Trino, can encrypt spill files; otherwise rely on encrypted local volumes.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
