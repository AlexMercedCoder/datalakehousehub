---
title: "Broadcast Hash Join: How Spark, Trino, and Dremio Join Iceberg Tables"
meta_title: "Broadcast Hash Join in Spark, Trino and Iceberg | Glossary"
description: "A broadcast hash join copies a small table to every worker so a large table joins without a shuffle. See how Spark and Trino pick it and how Iceberg stats help."
---

A broadcast hash join is a distributed join strategy in which the smaller side of a join is copied to every worker, so the larger side can be joined where it already sits. Engines such as Apache Spark, Trino, and Dremio use it for the most common pattern in [dimensional modeling](/knowledgebase/dimensional-modeling/): a large [fact table](/knowledgebase/fact-table/) joined to a small [dimension table](/knowledgebase/dimension-table/).

In a cluster, a table's rows are spread across many workers. A regular distributed join has to shuffle both tables over the network so rows with matching keys land on the same worker. Shuffling is usually the most expensive step in the query. A broadcast join removes the shuffle of the large table.

## How the Broadcast Works

The optimizer chooses a broadcast when it estimates that one side is small enough to fit in each worker's memory.

### Phase 1: Broadcast
Say an analyst joins a 10-billion-row `sales_fact` table to a 500-row `stores_dim` table. In Spark, the driver collects `stores_dim` and ships a copy to every executor. In Trino, the workers that scan the small table replicate its rows to every node that processes the join. Either way, each worker ends up with the full small table.

### Phase 2: Hash Join
Each worker builds an in-memory hash table keyed on `store_id`. It then scans its local share of `sales_fact`, probes the hash table for each row, and emits joined rows. The large table never crosses the network for the join.

## When Engines Choose It

| Engine | How broadcast is chosen | Manual control |
|---|---|---|
| Apache Spark | Size below `spark.sql.autoBroadcastJoinThreshold` (10 MB by default); adaptive query execution can switch to a broadcast at runtime | `/*+ BROADCAST(stores_dim) */` hint |
| Trino | `join_distribution_type = AUTOMATIC` (default) makes a cost-based choice between broadcast and partitioned | Set `join_distribution_type` to `BROADCAST` or `PARTITIONED` |
| Dremio | Cost-based planner picks broadcast or hash-distributed joins from table statistics | Planner settings |

## Broadcast vs Other Join Strategies

| Strategy | Network cost | Memory risk | Best for |
|---|---|---|---|
| Broadcast hash join | Small table copied to every worker | Small table must fit on each worker | Fact table joined to a small dimension |
| Shuffle (partitioned) hash join | Both tables shuffled by key | One partition of the build side per worker | Two large tables |
| [Sort-merge join](/knowledgebase/sort-merge-join/) | Both tables shuffled and sorted | Low, can spill to disk | Two large tables when memory is tight |
| Storage-partitioned join | None, if both tables share bucket layout | Low | Iceberg tables bucketed on the join key |

## Risks: Bad Estimates and Out-of-Memory Errors

The decision depends on size estimates. If statistics are stale or missing, the optimizer may think a multi-gigabyte table is small and broadcast it, which can exhaust worker or driver memory and fail the query. The reverse mistake, shuffling a table that could have been broadcast, makes the query slower but not broken.

## Why Iceberg Tables Help the Optimizer

[Apache Iceberg](/knowledgebase/apache-iceberg/) manifests record row counts and file sizes for every data file, so an engine can estimate a table's size after partition and file pruning without listing storage. Iceberg can also store distinct-value estimates in [Puffin files](/knowledgebase/puffin-files/), which Trino uses for join ordering and cardinality estimates. Keeping those statistics fresh (for example with Trino's `ANALYZE`) gives the [cost-based optimizer](/knowledgebase/cost-based-optimizer/) better inputs. For tables that are both large, Iceberg's bucket transform enables storage-partitioned joins, covered in [Storage-Partitioned Joins and the Bucket Transform](/blog/storage-partitioned-joins-and-the-bucket-transform/).

For a full walkthrough of join algorithms, read [Hash, Sort-Merge, Broadcast: How Distributed Joins Work](/blog/2026-04-29-query-engine-optimization-09-distributed-joins/).

## Summary

The broadcast hash join trades a copy of a small table for not moving a large one. It is the usual plan for star schema queries on a [data lakehouse](/knowledgebase/data-lakehouse/), and it works best when table statistics are accurate enough for the optimizer to pick it safely.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
