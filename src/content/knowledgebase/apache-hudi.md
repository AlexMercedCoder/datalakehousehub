---
title: "What is Apache Hudi?"
meta_title: "What is Apache Hudi? | Expert Data Lakehouse Architecture Guide"
description: "Apache Hudi is an open table format and data lake platform for upserts, deletes, and incremental processing, with copy-on-write and merge-on-read tables."
---

# What is Apache Hudi?

Apache Hudi (Hadoop Upserts Deletes and Incrementals) is an open-source data management framework designed to simplify incremental data processing and pipeline development on cloud data lakes. Traditional data lakes worked mostly as append-only storage; Hudi added the capabilities needed to treat a data lake more like a transactional database. Organizations use Hudi to manage data ingestion, apply continuous updates, and handle streaming workloads on top of cloud object storage (such as Amazon S3, Google Cloud Storage, or Azure Data Lake Storage).

The core motivation behind Apache Hudi, which was created at Uber, was the need to handle late-arriving data and continuous database replication. Before Hudi, engineers building change data capture (CDC) pipelines relied on cumbersome batch jobs. If a customer updated their shipping address in an operational database, propagating that one update to a large data lake often meant rewriting the entire partition containing the original record. Hudi removes much of this overhead by providing record-level `UPSERT` and `DELETE` operations directly on the lake.

## The Architectural Foundation of Apache Hudi

Apache Hudi is not a computation engine; it is a table format and data management layer. It integrates with distributed processing engines like Apache Spark, Apache Flink, and Presto. To provide transactional guarantees and incremental processing, Hudi relies on an internal timeline and metadata layer.

### The Hudi Timeline
The core of Hudi's architecture is the Timeline. The timeline keeps a log of all actions performed on a table at distinct instants in time. Every time a table is modified, Hudi records an action on the timeline. These actions include:
- **Commits:** An atomic write of a batch of records.
- **Cleans:** Background processes that delete older file versions to manage storage.
- **Compactions:** Processes that merge row-level updates into columnar files.
- **Rollbacks:** Reversions of unsuccessful or aborted commits.

By reading this timeline, query engines can reconstruct the state of a table at earlier points in time (within the history that has not yet been cleaned), which enables time travel and point-in-time queries.

### File Layout and Indexing
Hudi organizes data files into partitions and file groups, and it adds an indexing mechanism to locate records quickly. When an `UPSERT` occurs, Hudi uses an index (such as a Bloom filter index, a record-level index in its metadata table, or an external HBase index) to determine which file group contains the original record. Instead of scanning the whole table to find the old row, Hudi targets the specific file, reducing the I/O needed for updates.

## Storage Types: Copy-On-Write vs Merge-On-Read

To accommodate different analytical and streaming workloads, Apache Hudi provides two table types. Data engineering teams choose based on their latency requirements for reading versus writing.

### Copy-On-Write (COW) Tables
In a Copy-On-Write table, Hudi stores data only in columnar files (such as Apache Parquet). When an update is ingested, Hudi locates the file containing the target record, writes a new version of that file with the updated row, and commits the new file to the timeline.

Because data is rewritten in columnar form at write time, reads are fast: the query engine only reads fully merged Parquet files. This table type suits historical analytics and batch reporting where query speed matters most and write latency is a secondary concern.

### Merge-On-Read (MOR) Tables
In a Merge-On-Read table, Hudi stores data as a combination of columnar base files (Parquet) and row-based log files (Avro). When an update arrives, Hudi appends it to a small log file instead of rewriting the larger Parquet file.

More of the work moves to read time. When an analyst queries an MOR table for the latest data, the engine reads the base Parquet file and merges it with the associated log files to produce the current state. This supports near real-time ingestion. To keep read performance from degrading as log files accumulate, Hudi runs compaction (inline or asynchronously) to merge the logs into new base files.

## Incremental Processing

One of Hudi's distinguishing features is its native support for incremental data processing. In traditional architectures, updating a daily dashboard often meant scanning the entire historical dataset.

With Hudi's incremental queries, an engineer can ask the processing engine for only the records that changed since the last successful run. Using the Hudi timeline, the engine identifies the commits that occurred since then and processes only the new or modified records. This shifts pipelines away from expensive full recalculations toward efficient, continuous incremental processing.

## Concurrency Control and ACID Transactions

Modifying large distributed datasets safely requires transactional guarantees. If two pipelines update the same data at the same time without concurrency control, one can overwrite the other's changes and leave the table inconsistent.

Hudi provides ACID (Atomicity, Consistency, Isolation, Durability) transactions and supports Optimistic Concurrency Control (OCC) for multiple writers, coordinated through a lock provider. Writers prepare their changes independently, and at commit time Hudi checks whether a conflicting modification occurred. If a conflict is detected (for example, two pipelines modified the same file group), the later transaction is aborted, protecting the integrity of the table. Newer releases also add non-blocking concurrency control options for some workloads.

## Hudi in the Modern Data Ecosystem

Apache Hudi sits alongside and often integrates directly with other major frameworks in the modern data stack.

### Integration with Streaming Engines
Hudi is designed to work well as a storage destination for Apache Flink and Apache Kafka pipelines. It handles continuous, high-volume ingestion where data arrives late or out of order. By absorbing `UPSERT`s from continuous Kafka streams, Hudi connects operational event logs with structured analytical tables.

### Interoperability and Apache XTable
Historically, organizations had to choose between Hudi, Iceberg, and Delta Lake. Interoperability projects like Apache XTable (incubating, formerly OneTable) change this. XTable translates table metadata between formats. An organization can ingest high-velocity CDC streams into an Apache Hudi table and use XTable to generate [Apache Iceberg](/apache-iceberg/) metadata for the same data files. Engines like Dremio or Trino can then read the data through the Iceberg specification without copying the underlying files.

## Summary of Technical Value

Apache Hudi turned the data lake from a static file repository into a transactional store that supports updates and incremental reads. By providing indexing, ACID transactions, and the flexibility of Merge-On-Read storage, Hudi lets organizations run streaming ingestion and change data capture directly on low-cost cloud object storage. It is a strong option for data engineering teams building near real-time, reliable analytical pipelines.

### Frequently Asked Questions

**Does Apache Hudi replace my data warehouse?**
Hudi brings transactional capabilities similar to a data warehouse to your data lake storage. This lets you build an open [data lakehouse](/data-lakehouse/), which can reduce or replace reliance on proprietary cloud data warehouses when you use distributed engines like Dremio or Presto to query the Hudi tables.

**What is the difference between Hudi and Apache Iceberg?**
Both provide ACID transactions as open table formats, but they started from different engineering problems. Iceberg focused on reliable table semantics and query planning at scale, including removing Hive's file-listing bottlenecks. Hudi was designed to handle high-frequency streaming upserts and incremental pipelines. Today, their capabilities overlap considerably.

**How does Hudi handle late-arriving data?**
Hudi handles late-arriving data through its upsert capabilities. If a record arrives three days late, Hudi uses its index to locate the file group containing that record and applies the update, so downstream incremental queries pick up the change.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
