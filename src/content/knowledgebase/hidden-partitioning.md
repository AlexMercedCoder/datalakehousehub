---
title: "Iceberg Hidden Partitioning vs Hive Partitioning, Explained"
meta_title: "Iceberg Hidden Partitioning vs Hive Partitions | Glossary"
description: "Hidden partitioning is how Apache Iceberg derives partition values from column transforms. See how it compares to Hive directories and Delta generated columns."
---

Hidden partitioning is a feature of [Apache Iceberg](/knowledgebase/apache-iceberg/) in which the table derives partition values from a source column using a transform, such as `days(event_ts)` or `bucket(16, user_id)`, and tracks them in metadata. Users filter on the original column and never reference partition columns directly. It was designed to fix the usability problems of the Apache Hive partitioning model.

[Partitioning](/knowledgebase/partitioning/) groups data files so that a query can skip files that cannot match its filter. If a table stores years of server logs, partitioning by day lets a query for one day read only that day's files. How the table tracks those partitions decides how easy the table is to query and to change.

## The Problems with Hive Partitioning

Hive implemented partitioning as physical directories, for example `s3://data/logs/year=2026/month=05/day=14/`, with partition columns stored as separate, explicit columns.

### The Analyst Burden
If a table is partitioned by `year`, `month`, and `day`, the analyst has to know that to query it efficiently. A query like `SELECT * FROM logs WHERE event_timestamp = '2026-05-14 12:00:00'` does not filter on any partition column, so Hive scans every partition.

To get a fast query, the analyst must add the partition columns by hand:
`SELECT * FROM logs WHERE year = 2026 AND month = 5 AND day = 14 AND event_timestamp = '2026-05-14 12:00:00'`. Forgetting them, or deriving them wrongly, causes a full scan or wrong results.

### The Engineering Burden
Changing the partition scheme, for example from daily to hourly, requires a new table layout. In Hive that usually means rewriting all historical data into new directories with a large Spark job.

## How Hidden Partitioning Works

Iceberg records which files belong to which partition in its manifest files rather than relying on directory names. The partition spec is stored in table metadata.

### Automatic Pruning
When creating the table, the engineer declares a transform:
`PARTITIONED BY (days(event_timestamp))`

When an analyst runs `SELECT * FROM logs WHERE event_timestamp = '2026-05-14 12:00:00'`, the engine applies the same `days()` transform to the filter value and prunes to the matching files. The analyst writes ordinary SQL, and the engine handles the file pruning. Iceberg supports identity, year, month, day, hour, bucket, and truncate transforms.

### Partition Evolution
Because partitions are tracked in metadata, the partition spec can change with an `ALTER TABLE` statement. New data is written with the new spec, while existing files keep the old one. Queries plan across both specs without rewriting old data. If you later want the old data in the new layout, you can rewrite it with compaction on your own schedule.

## Hive vs Iceberg vs Delta Lake

| | Hive partitioning | Iceberg hidden partitioning | Delta Lake |
|---|---|---|---|
| Where partitions are tracked | Directory paths and the metastore | Manifest files in table metadata | Transaction log |
| Partition values | Explicit columns the writer must fill | Derived from a source column by a transform | Explicit columns; generated columns can derive them |
| User must filter on partition column | Yes | No | No, when using generated columns |
| Change partition scheme | Rewrite the table | `ALTER TABLE`; old files keep old spec | Rewrite the table, or use liquid clustering instead |
| Bucketing | Separate bucketing feature | `bucket(N, col)` transform | Not a partition transform |

The bucket transform also enables storage-partitioned joins in Spark, where two tables bucketed the same way can be joined without a shuffle. For more depth, read [Hidden Partitioning: How Iceberg Eliminates Accidental Full Table Scans](/blog/2026-04-29-apache-iceberg-masterclass-05-hidden-partitioning/), [Partition Evolution: Change Your Partitioning Without Rewriting Data](/blog/2026-04-29-apache-iceberg-masterclass-04-partition-evolution/), and [Storage-Partitioned Joins and the Bucket Transform](/blog/storage-partitioned-joins-and-the-bucket-transform/).

## Summary of Technical Value

Hidden partitioning separates how users query a table from how its files are organized. Analysts filter on real columns and still get partition pruning, and engineers can change the partition spec through metadata instead of rewriting history. It is one of the main practical differences between an Iceberg table and a Hive table on the same object storage.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
