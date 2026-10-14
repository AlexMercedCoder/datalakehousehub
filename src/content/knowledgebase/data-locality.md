---
title: "What is Data Locality?"
meta_title: "What is Data Locality? | Expert Data Lakehouse & AI Glossary"
description: "Data locality is the practice of running computation close to where data is stored to cut network transfer. Learn how columnar formats and caching apply it."
---

Data locality is the principle of running computation as close as possible to where the data it needs is stored, so that less data has to cross the network. Moving a small piece of code to a large dataset is cheaper than moving the large dataset to the code. The idea shaped the design of Hadoop, and it still guides how modern engines cache data, push filters down to sources, and choose where to run in the cloud.

## How It Works

Locality can be achieved at several levels, from the same machine to the same region:

- **Node locality.** In Hadoop, HDFS splits files into blocks spread across the cluster's disks, and the MapReduce scheduler tries to run each map task on a node that already holds a copy of its input block. If that is not possible, it prefers a node in the same rack before falling back to a remote node.
- **Process and memory locality.** Engines keep hot data in memory or on local SSD so repeated reads avoid the network entirely.
- **Source locality.** Instead of pulling a whole table out of a database, an engine sends filters and aggregations to the source and receives only the result. This is called [predicate pushdown](/knowledgebase/predicate-pushdown/) or compute pushdown.
- **Regional locality.** In the cloud, placing compute in the same region as the storage bucket reduces latency and avoids cross-region transfer charges.

## Data Locality Then and Now

| Aspect | Hadoop era (HDFS + MapReduce) | Cloud lakehouse (object storage + engines) |
|---|---|---|
| Storage | Disks inside compute nodes | Object storage separate from compute |
| How locality is achieved | Schedule tasks on nodes holding the blocks | Cache files on executor disks, prune data before reading, colocate by region |
| Scaling | Storage and compute scale together | Storage and compute scale independently |
| Cost of losing locality | Network reads between nodes | Object storage request and transfer costs, latency |

Separating storage from compute gave up node locality in exchange for elastic scaling and shared access to one copy of the data. Engines recover much of the lost locality in other ways.

## Data Locality in the Lakehouse

In a lakehouse on Amazon S3, ADLS, or Google Cloud Storage, no compute node owns the data, so locality comes from reading less and reading it closer:

- **Read less.** Apache Iceberg metadata lets an engine prune partitions and files using column statistics before any data file is opened. Columnar formats such as Parquet then let it read only the needed columns and skip row groups. Every byte not read is a byte that never crosses the network.
- **Cache on the executors.** Dremio's Columnar Cloud Cache (C3) stores chunks of recently read Parquet data on local disks attached to each executor and serves later reads from there, re-reading from object storage when the underlying data changes. Other engines, including Trino and Spark-based platforms, offer their own file or fragment caches.
- **Reuse precomputed results.** Materialized views and Dremio Reflections hold query-ready versions of data so frequent queries skip reprocessing the raw tables.
- **Push work to sources.** When an engine federates across databases, pushing filters and aggregates down keeps the heavy lifting where the data lives.

The Hub post on [storage and compute decoupling in Iceberg](/blog/iceberg-storage-compute-decoupling/) covers the trade-offs, and the [caching](/knowledgebase/caching/) and [Hadoop Distributed File System](/knowledgebase/hadoop-distributed-file-system/) entries cover the two ends of this history.

## Summary

Data locality means doing work near the data to cut network movement. Hadoop achieved it by scheduling tasks on the nodes that stored the data. Cloud lakehouses separate storage from compute and recover locality through metadata pruning, columnar reads, executor caching, pushdown, and placing compute in the same region as storage.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
