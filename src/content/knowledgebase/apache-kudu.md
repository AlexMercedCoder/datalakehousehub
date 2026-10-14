---
title: "What is Apache Kudu?"
meta_title: "What is Apache Kudu? | Expert Data Lakehouse Architecture Guide"
description: "Apache Kudu is an open-source columnar storage engine for fast inserts, updates, and analytic scans using primary key indexes and Raft, and how Iceberg differs."
---

# What is Apache Kudu?

Apache Kudu is a distributed, open-source columnar storage engine originally developed at Cloudera and now an Apache Software Foundation project. It was designed to address a long-standing tension in Big Data engineering: the conflict between fast, row-level data ingestion and fast analytical scans.

Historically, data architects faced a hard choice.
If they needed to ingest high volumes of data and apply frequent row-level `UPDATE` commands (like tracking the live location of a fleet of delivery trucks), they used a NoSQL store such as Apache HBase or Cassandra. However, those systems are not efficient at large analytical scans. A query calculating the average speed of all trucks would be slow.
Conversely, for fast analytical scans they used Apache Parquet files in HDFS. Parquet files are immutable, so updating a single row means rewriting the whole file, which does not suit real-time update pipelines.

Apache Kudu was created to bridge this gap, offering row-level inserts, updates, and deletes with low latency alongside columnar scan performance suited to analytics.

## The Architecture of the Hybrid Engine

Kudu takes a different approach from the decoupled [Data Lakehouse](/data-lakehouse/) (where compute and storage are separate). Kudu is a storage engine that manages data on the local disks of its own cluster of tablet servers.

### 1. The Columnar Architecture
Like Parquet, Kudu stores data in a columnar format. If a data analyst runs an aggregation through Apache Impala (`SELECT SUM(revenue)`), Kudu reads only the columns the query needs, which gives the read efficiency expected of an analytical system.

### 2. Primary Keys and Delta Stores
Unlike Parquet, Kudu tables require a primary key, and Kudu indexes it.
When an `UPDATE` arrives (for example, changing the status of Order #1234 from "Pending" to "Shipped"), Kudu does not rewrite a large file. It uses the primary key index (backed by bloom filters and key ranges) to find the rowset that holds the row, records the change in an in-memory delta store, and later flushes and compacts those deltas into the columnar base data in the background. This lets updates land with low latency while scans still read efficient columnar data.

### 3. Raft Consensus Protocol
Because Kudu manages its own storage, it is responsible for its own high availability. It uses the Raft consensus algorithm to replicate each tablet across multiple servers (three replicas is a common configuration). If a server fails, Raft elects a new leader from the remaining replicas, so the tablet stays available as long as a majority of replicas are healthy.

## The Rise of Iceberg and the Shift in Architecture

Kudu is a well-engineered system, but its need to run on a dedicated cluster with local storage is a disadvantage in cloud environments built around object storage.

Many modern architectures prefer the open Data Lakehouse model, where low-cost object storage such as Amazon S3 holds [Apache Iceberg](/apache-iceberg/) tables that any compute engine can use. Iceberg's format version 2 added row-level deletes with merge-on-read delete files, so a decoupled lakehouse can handle row-level updates without a dedicated storage cluster, although high-frequency updates still need regular compaction to keep reads fast.

## Summary of Technical Value

Apache Kudu is a hybrid storage engine that expanded what real-time analytics could do on Hadoop-era infrastructure. By combining low-latency row-level mutability with efficient columnar scans, Kudu lets organizations run analytical SQL queries directly against continuously updated operational data.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
