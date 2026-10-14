---
title: "Sort-Merge Join vs Hash Join in Spark, Trino, and Iceberg"
meta_title: "Sort-Merge Join vs Hash Join in Spark and Trino | Glossary"
description: "A sort-merge join shuffles and sorts both inputs on the join key, then merges. Learn when Spark picks it over hash joins and how Iceberg can skip the shuffle."
---

A sort-merge join is a join algorithm that sorts both inputs on the join key and then walks through them together, matching rows in a single pass. In distributed engines it is preceded by a shuffle that sends rows with the same key to the same worker. Apache Spark uses it as its default strategy for equi-joins between two large tables, where a [broadcast hash join](/knowledgebase/broadcast-hash-join/) is not possible because neither side fits in each executor's memory.

Not every engine uses it. Trino's documentation states that it uses a hash-based join algorithm, choosing between partitioned and broadcast distribution. Spark exposes sort-merge, shuffled hash, and broadcast hash joins, and its optimizer picks among them based on table size estimates, hints, and settings like `spark.sql.join.preferSortMergeJoin`.

## The Three Phases

### Phase 1: Shuffle
Each worker reads its portion of both tables and hashes the join key (for example `transaction_id`) to decide which partition each row belongs to. Rows are sent across the network so that all rows with the same key, from both tables, land in the same partition. This [shuffle](/knowledgebase/shuffle-partitioning/) is usually the most expensive step because it moves both tables over the network.

### Phase 2: Sort
Each partition is sorted by the join key. The sort runs in memory when it can and [spills to disk](/knowledgebase/spill-to-disk/) when the partition is larger than available memory, which is why sort-merge joins degrade gracefully instead of failing with out-of-memory errors.

### Phase 3: Merge
With both sides sorted, the worker keeps a pointer into each. If the keys match, it emits joined rows. If one side's key is lower, it advances that pointer. Each side is read sequentially once, apart from re-reading runs of duplicate keys, so the merge itself needs little memory.

## Sort-Merge Join vs Hash Joins

| | Sort-merge join | Shuffled hash join | Broadcast hash join |
|---|---|---|---|
| Shuffle needed | Both sides | Both sides | None; small side copied to every worker |
| Memory need | Low; sorts spill to disk | Hash table of one side per partition | Whole small table on every worker |
| Best for | Two large tables | Large tables where one side's partitions fit in memory | One large and one small table |
| Used by | Spark (default for large equi-joins) | Spark, Trino, Dremio | Spark, Trino, Dremio |

## Avoiding the Shuffle on a Lakehouse

The shuffle and sort can be skipped when the data is already laid out by the join key. In Spark, bucketed Hive tables have long allowed this. With [Apache Iceberg](/knowledgebase/apache-iceberg/), Spark 3.3 and later can perform storage-partitioned joins: if both tables are partitioned with the same `bucket(N, key)` transform and the right settings are enabled (including `spark.sql.sources.v2.bucketing.enabled`), Spark joins matching buckets directly with no exchange step. You can confirm it with `EXPLAIN` by checking that no Exchange node appears on either side.

Sorting files by the join key, or [Z-ordering](/knowledgebase/z-ordering/), improves file skipping for filters but does not by itself remove the shuffle. Matching bucket layouts on both tables is what does that. For a full walkthrough, read [Storage-Partitioned Joins and the Bucket Transform](/blog/storage-partitioned-joins-and-the-bucket-transform/) and [Hash, Sort-Merge, Broadcast: How Distributed Joins Work](/blog/2026-04-29-query-engine-optimization-09-distributed-joins/).

## Summary of Technical Value

The sort-merge join lets Spark join two large tables without holding either in memory, at the cost of a full shuffle and sort. Knowing when your engine picks it, and laying out Iceberg tables with matching bucket transforms on common join keys, lets you remove that shuffle for your most frequent large joins.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
