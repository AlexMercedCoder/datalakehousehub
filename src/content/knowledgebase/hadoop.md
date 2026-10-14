---
canonical: "https://opendatalakehouse.com/kb/hadoop-catalog/"
title: "What is Apache Hadoop?"
meta_title: "What is Apache Hadoop? | Expert Data Lakehouse Architecture Guide"
description: "Apache Hadoop is an open-source framework for storing and processing large datasets on clusters with HDFS, MapReduce, and YARN; a forerunner of the lakehouse."
---

# What is Apache Hadoop?

Apache Hadoop is an open-source software framework used to store and process large datasets across clusters of commodity hardware. Created by Doug Cutting and Mike Cafarella and established as its own project in 2006 (inspired by Google's papers on the Google File System and MapReduce), Hadoop started the big data era.

Before Hadoop, enterprises often stored analytical data in large relational database appliances from vendors like Teradata or Oracle. When the system filled up, the organization had to buy a larger, more expensive machine (vertical scaling). Hadoop popularized horizontal scaling. Instead of buying one very expensive server, an organization could link together many standard servers. Hadoop handled the distribution of data and computation across the cluster and was designed to tolerate the failure of individual machines.

## The Foundational Architecture of Hadoop

Hadoop is not a single application; it is a set of components built around three core pieces.

### 1. HDFS (Hadoop Distributed File System)
HDFS is the storage layer of the cluster. When a large file is loaded into Hadoop, HDFS splits the file into large blocks (128 MB by default). It then distributes these blocks across the servers (DataNodes) in the cluster.

For reliability, HDFS replicates every block (3 copies by default) across different servers. A central server, the NameNode, maintains the directory tree and tracks which DataNodes hold which blocks. If a DataNode stops responding, the NameNode detects the failure and schedules re-replication of the affected blocks from surviving nodes, without human intervention.

### 2. MapReduce
MapReduce is the original computational engine of Hadoop. It is designed to process data where it resides on disk, reducing network transfers.
* **Map Phase:** The framework schedules map tasks on the nodes that hold the required HDFS blocks where possible. Each task processes its local chunk of data, filtering and extracting key-value pairs.
* **Shuffle and Sort:** The cluster redistributes the intermediate outputs across the network, grouping identical keys together.
* **Reduce Phase:** Reduce tasks take these grouped keys and compute the final aggregation (like a global SUM or COUNT), writing the output back to HDFS.

MapReduce was resilient but slow for many workloads, because it wrote intermediate data to disk between phases to support fault tolerance.

### 3. YARN (Yet Another Resource Negotiator)
Introduced in Hadoop 2.0, YARN is the cluster resource manager. It separated resource management from the MapReduce execution engine. YARN allocates CPU cores and memory to competing applications. Because of YARN, a single Hadoop cluster could run MapReduce batch jobs, Apache Spark machine learning workloads, and Apache Flink streaming jobs on the same hardware.

## The Decline of the Hadoop Era

Hadoop defined a decade of data engineering, but its use declined as public cloud platforms (AWS, Google Cloud, Azure) matured.

Classic Hadoop deployments coupled storage and compute. An organization bought physical servers containing both disks and CPUs. If the organization needed to store petabytes of cold data but rarely queried it, they still had to buy and maintain many servers just for the disk space, leaving CPU capacity idle.

The modern [Data Lakehouse](/data-lakehouse/) separates storage and compute. Organizations store data on cloud object storage (like Amazon S3) at a low cost per gigabyte, and run compute engines (like Snowflake, Dremio, or Trino) that can be scaled up for queries and scaled down when idle.

## Summary of Technical Value

Apache Hadoop showed that large-scale storage and processing could be achieved in software by distributing work across commodity hardware. While HDFS and MapReduce have largely been replaced by cloud object storage and in-memory engines like Apache Spark, Hadoop established distributed processing ideas that many modern data architectures still use.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
