---
title: "What is Data Compaction?"
meta_title: "What is Data Compaction? | Expert Data Lakehouse & AI Glossary"
description: "Data compaction is the maintenance job that rewrites many small files into fewer larger ones, keeping open table formats like Apache Iceberg efficient to query."
---

Data compaction is a table maintenance operation that rewrites many small data files into fewer, larger ones without changing the table's contents. In lakehouse tables built on open table formats like [Apache Iceberg](/knowledgebase/apache-iceberg/), Delta Lake, and Apache Hudi, compaction can also merge accumulated delete files into the data files and reorder rows so queries skip more data. The result is a table that is cheaper and faster to read.

## Why Small Files Appear

Every write to a table creates at least one new file. Streaming ingestion that commits every minute, frequent small batch loads, and row-level updates using [merge-on-read](/knowledgebase/merge-on-read/) all add files steadily. Over time a table can accumulate many small files and delete files, which hurts in several ways:

* Each file costs an object storage request and file open, so per-file overhead dominates scan time.
* Table metadata grows, so query planning slows down.
* Delete files must be applied at read time, adding work to every query.
* Column statistics are spread across many files, so engines skip less data.

## How Compaction Works

A compaction job selects candidate files, reads them, writes new files near a target size, and commits the swap atomically. In Iceberg, the commit creates a new snapshot that replaces the old files with the new ones, so readers see either the before or after state, never a mix. Old files stay available for [time travel](/knowledgebase/time-travel/) until snapshots are expired.

Common strategies:

| Strategy | What it does | When to use |
|---|---|---|
| Bin-pack | Combines small files toward a target size, no reordering | Default choice, streaming tables, quick runs |
| Sort | Rewrites files sorted by chosen columns | Queries filter on a few known columns |
| Z-order or Hilbert | Clusters rows on several columns together | Queries filter on varying combinations of columns |
| Delete file rewrite | Applies or consolidates position deletes | Tables with frequent row-level updates |

## Compaction Across Engines

* **Apache Spark:** Iceberg's `rewrite_data_files` procedure supports `binpack` (the default) and `sort` strategies, with `zorder(...)` or `hilbert(...)` sort orders. Its default target file size is 512 MB, taken from the table's `write.target-file-size-bytes` property. It accepts a `where` filter to limit the rewrite and a `partial-progress.enabled` option to commit file groups as they finish. Related procedures include `rewrite_position_delete_files` and `rewrite_manifests`.
* **Trino:** `ALTER TABLE ... EXECUTE optimize` merges files smaller than `file_size_threshold` (100 MB by default), partition by partition.
* **Dremio:** `OPTIMIZE TABLE` rewrites data files using bin-packing and can separately rewrite manifests. Dremio Cloud also offers automatic table maintenance for catalog tables, so compaction runs without hand-written schedules.

Compaction is one part of a maintenance routine. Expiring old snapshots and removing orphan files reclaims the storage that compaction frees, since rewritten files remain referenced by older snapshots until those expire.

## Compaction in the Lakehouse

Compaction matters most at the Bronze and Silver layers of a [medallion architecture](/knowledgebase/medallion-architecture/), where streaming and CDC writes create files fastest. Teams usually schedule it per partition, compacting recent partitions after they stop receiving writes. Running compaction concurrently with streaming writes can cause commit conflicts under Iceberg's [optimistic concurrency](/knowledgebase/optimistic-concurrency-control/), so limiting compaction to partitions that are no longer active helps. Choosing a sort or Z-order strategy is a query-performance decision as much as a maintenance one, and pairs with [partitioning](/knowledgebase/partitioning/) and [Z-ordering](/knowledgebase/z-ordering/).

The Hub covers this in depth in [The Basics of Compaction: Bin Packing Your Data for Efficiency](/blog/iceberg-optimization-compaction-basics/), [Optimizing Compaction for Streaming Workloads in Apache Iceberg](/blog/iceberg-streaming-compaction/), and [Automating Table Maintenance Before Small Files Accumulate](/blog/2026-05-automating-table-maintenance/).

## Summary

Data compaction rewrites small files and accumulated deletes into well-sized, optionally sorted files through an atomic commit. Spark, Trino, and Dremio all provide it for Iceberg tables, and running it regularly, along with snapshot expiration, keeps lakehouse queries fast as tables grow.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
