---
title: "What is Presto?"
meta_title: "What is Presto? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Presto (PrestoDB). Learn about its distributed SQL architecture, memory management, and use cases in massive data environments."
---

# What is Presto?

Presto (often referred to as PrestoDB) is an open-source, distributed SQL query engine optimized for running interactive analytic queries against massive datasets. Built originally at Facebook in 2012 to replace incredibly slow Apache Hive MapReduce jobs, Presto allowed data analysts to run fast SQL queries directly against their 300-petabyte Hadoop data warehouse.

Like its fork, Trino, Presto strictly separates compute from storage. It does not store data. It connects to external data sources—ranging from cloud object storage and Hadoop Distributed File System (HDFS) to relational databases like MySQL—pulling the data into memory to perform high-speed analytical aggregations. Today, Presto is managed by the Presto Foundation under the Linux Foundation and remains a critical engine for immense tech organizations like Uber, Meta, and Alibaba.

## The Distributed Architecture

Presto was designed from the ground up for massive horizontal scalability. The engine functions via a master-worker architecture, relying on a central Coordinator node managing a fleet of Worker nodes.

### Coordinator and Query Planning
The Coordinator is responsible for parsing SQL statements, analyzing them against database schemas, and generating distributed execution plans. When an analyst submits a query, the Coordinator uses statistics to optimize the plan (such as determining the optimal side for a JOIN). It then fragments the logical plan into distinct physical tasks and dispatches them across the available Worker nodes.

### Worker Nodes and Pipelining
The Worker nodes execute the physical operations. Presto is designed specifically to avoid disk I/O. It processes data entirely in memory. Workers read data from storage using specific Connectors, process the data in small chunks (pages), and stream those pages continuously to the next stage of the query execution pipeline. This streaming architecture prevents the massive latency spikes associated with writing intermediate stages to disk.

## Memory Management and Concurrency

In a high-concurrency environment where hundreds of data scientists and analysts submit complex queries simultaneously, memory management is the most critical component of the engine. 

Presto organizes memory into memory pools. It meticulously tracks exactly how much memory every single query and operator is consuming. If a single bad query attempts to allocate more memory than the cluster can provide, Presto aggressively kills the query to prevent Out-Of-Memory (OOM) errors from crashing the Worker nodes, guaranteeing stability for the rest of the cluster.

## Connectors and Data Federation

Presto operates over an extensible Connector API. Connectors are essentially plugins that teach Presto how to communicate with disparate underlying data sources. A connector is responsible for providing metadata (table schemas), generating data splits (logical chunks of data to be processed), and supplying the actual data streams.

This architecture enables seamless Data Federation. An organization can use Presto to run a single SQL query that spans multiple databases. For instance, an analyst can query real-time operational data sitting in Apache Cassandra and join it immediately with historical archive data residing in Amazon S3, completely bypassing the need to build a brittle, slow ETL pipeline to move the data into a central warehouse first.

## Presto versus Trino: The Fork

Understanding Presto requires understanding its history. In 2018, the original creators of Presto left Facebook over disagreements regarding the project's direction. Facebook desired to optimize Presto specifically for their massive, internal batch workloads, while the creators wanted to ensure strict ANSI SQL compliance and build features for a broader enterprise community.

The creators forked the codebase to create PrestoSQL, which was later rebranded as Trino. Meanwhile, the original repository remained under Facebook's control as PrestoDB (Presto). 

Today, both engines share the same foundational architecture and memory-pipelining mechanics. However, they have diverged significantly in their optimization algorithms, connector support, and community ecosystems. Trino is generally favored by organizations building modern Open Lakehouses (with deep Iceberg and Delta Lake support), while PrestoDB continues to be aggressively optimized by massive internet companies for distinct, hyper-scale internal workloads.

## Summary of Technical Value

Presto fundamentally altered the big data landscape by proving that SQL was still the optimal interface for massive analytics, provided the underlying execution engine abandoned disk-based processing for memory-streaming architecture. By allowing organizations to query data precisely where it lives—with sub-second latencies over petabytes of data—Presto dramatically accelerated the transition away from monolithic, legacy data warehouses toward decentralized, highly scalable data lakes.
