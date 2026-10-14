---
title: "HDFS Explained: Architecture, Limits, and Moving to an Iceberg Lakehouse"
meta_title: "HDFS vs Object Storage for Iceberg Lakehouses | Glossary"
description: "HDFS is the Hadoop Distributed File System, which spreads replicated file blocks across a cluster. See how it compares to object storage for Iceberg tables."
---

HDFS (Hadoop Distributed File System) is the distributed, fault-tolerant file system of [Apache Hadoop](/knowledgebase/hadoop/). Modeled on Google's GFS paper (2003), it became the main storage layer for on-premises big data clusters from the late 2000s through the 2010s, before cloud [object storage](/knowledgebase/object-storage/) such as Amazon S3 became the default home for analytical data.

Before Hadoop, many organizations stored large datasets on SAN or NAS appliances and scaled by buying bigger, more expensive hardware (vertical scaling). HDFS took a different approach: combine the local disks of many commodity servers into one file system namespace and add servers to grow (horizontal scaling).

## Distribution and Replication

HDFS assumes hardware will fail. In a cluster of a thousand servers, disk failures are routine, and the file system is designed to keep working through them.

### NameNode and DataNodes
* **NameNode:** holds the file system namespace and the map of which blocks make up each file and where they live. It stores metadata, not file contents.
* **DataNodes:** store the blocks on their local disks and report to the NameNode.

In early Hadoop the NameNode was a single point of failure. Since Hadoop 2, HDFS supports NameNode high availability with an active and a standby NameNode sharing an edit log, and federation to split the namespace across several NameNodes. The NameNode still keeps the namespace in memory, so very large numbers of small files strain it.

### Blocks and Replication
When a large file is written to HDFS:
1. It is split into blocks, 128 MB by default.
2. Blocks are placed on DataNodes, with rack awareness so copies span racks.
3. Each block is replicated, three copies by default. Hadoop 3 also added erasure coding as a lower-overhead option for colder data.

If a DataNode dies, reads go to the remaining replicas and the NameNode schedules new copies until the replication target is met again.

## Data Locality and MapReduce

HDFS was built when moving large volumes across the network was slow. Hadoop co-located storage and compute: [MapReduce](/knowledgebase/mapreduce/) (and later YARN-based Spark) scheduled tasks on the nodes that held the blocks, so most reads were local disk reads. See [data locality](/knowledgebase/data-locality/).

## Why Many Teams Moved Away

Coupling storage and compute means adding disk also adds CPU, and adding CPU adds disk, whether you need both or not. Operating HDFS also takes work: NameNode memory sizing, small-file management, upgrades, and hardware replacement. Faster networks reduced the value of data locality. As a result, many organizations moved analytics to cloud object storage, which scales storage independently of compute, and some on-premises sites moved to S3-compatible stores such as Apache Ozone or Ceph. HDFS remains in production at many on-premises sites, and Apache Hadoop is still actively released.

## HDFS vs Object Storage for Iceberg

[Apache Iceberg](/knowledgebase/apache-iceberg/) works on both. Iceberg tracks files in its own metadata, so it does not depend on directory listings or renames, which removes the main object storage weaknesses that older Hive tables had.

| | HDFS | Object storage (S3, ADLS, GCS, Ozone) |
|---|---|---|
| Scaling | Storage and compute scale together | Storage scales independently of engines |
| Operations | You run NameNodes, DataNodes, and hardware | Managed by the provider, or by a separate storage team on-premises |
| Small files | Each file costs NameNode memory | No namespace memory limit, but small files still slow queries |
| Engines | Spark, Flink, Trino, Hive, Dremio via Hadoop connectors | Nearly every lakehouse engine, including DuckDB and PyIceberg |

The usual migration path is to convert existing Hive tables on HDFS into Iceberg first, using Spark procedures such as `migrate`, `snapshot`, or `add_files` to register existing Parquet or ORC files without rewriting them, and then move data to object storage on a separate timeline as files are rewritten or compacted. For in-place options, see [Migrating Into Iceberg Without Moving Data](/blog/iceberg-in-place-migration/), and for a broader playbook, see [Migrating to Apache Iceberg: Strategies for Every Source System](/blog/2026-04-29-apache-iceberg-masterclass-15-migrating-to-iceberg/). Related: [Apache Hive](/knowledgebase/apache-hive/) and [Hive Metastore](/knowledgebase/hive-metastore/).

## Summary

HDFS showed that large, fault-tolerant analytical storage could run on commodity servers by splitting files into replicated blocks and moving compute to the data. Its coupling of storage and compute and its operational load pushed many teams toward object storage. Iceberg tables run on either, which lets HDFS-based estates adopt an open table format first and change storage later.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
