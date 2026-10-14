---
title: "Apache Kafka Connect: Streaming Kafka Topics into Iceberg Tables"
meta_title: "Kafka Connect to Apache Iceberg: How It Works | Glossary"
description: "Kafka Connect is Apache Kafka's framework for moving data in and out of Kafka with connectors. See how its Iceberg sink lands topics in lakehouse tables."
---

Apache Kafka Connect is the framework, shipped as part of Apache Kafka, for moving data between Kafka and other systems using reusable connectors instead of custom code. You configure a connector with JSON through a REST API, and Connect runs it, tracks its progress, and restarts it after failures.

Before Connect, teams wrote their own producer and consumer applications for every integration: one to read MySQL changes into Kafka, another to write Kafka events into Elasticsearch. Each had to handle offsets, retries, and scaling on its own. Connect moves that work into a shared runtime.

## Source and Sink Connectors

### Source Connectors
A source connector reads from an external system and writes records to Kafka topics. A JDBC source connector can poll a table for new rows. Log-based change data capture connectors such as [Debezium](/knowledgebase/debezium/) read the database's transaction log instead, capturing inserts, updates, and deletes without polling.

### Sink Connectors
A sink connector reads from Kafka topics and writes to a destination: a database, a search index, object storage, or a lakehouse table. Single Message Transforms (SMTs) can rename fields, mask values, or route records along the way.

## Workers, Tasks, and Offsets

Connect runs as a cluster of worker processes in distributed mode. Each connector is split into tasks that are spread across workers. If a worker fails, the cluster rebalances and moves its tasks to the remaining workers, which resume from the last committed offsets.

Delivery guarantees depend on the connector. Source connectors can run with exactly-once semantics since Kafka 3.3 (KIP-618) when the connector supports it. For sinks, exactly-once depends on how the connector commits to the destination; many sinks are at-least-once, so the destination has to tolerate duplicates.

Records are serialized by converters. With Avro, Protobuf, or JSON Schema converters backed by a [schema registry](/knowledgebase/schema-registry/), schemas are registered and checked so incompatible changes are caught. Records that fail conversion or transformation in a sink can be routed to a [dead letter queue](/knowledgebase/dead-letter-queue/) topic instead of stopping the task.

## Kafka Connect and Apache Iceberg

The Apache Iceberg project includes an Iceberg sink connector for Kafka Connect, built as part of the Iceberg build. It writes data files in the table's format (Parquet by default) and commits them to [Apache Iceberg](/knowledgebase/apache-iceberg/) tables through any supported catalog, including Iceberg REST catalogs such as [Apache Polaris](/knowledgebase/apache-polaris/).

Because an Iceberg commit must be atomic, workers do not commit on their own. Each worker writes files and reports them on a control topic, and a coordinator makes one commit per cycle (every five minutes by default) with the Kafka offsets stored in the Iceberg snapshot. That design gives exactly-once delivery from Kafka into the table. It can also fan records out to multiple tables, and it can create tables and evolve their schemas when those options are turned on (both are off by default).

| | Kafka Connect Iceberg sink | Apache Flink | Spark Structured Streaming |
|---|---|---|---|
| Code required | None, configuration only | SQL or Java/Python jobs | Python, Scala, or SQL jobs |
| Transformations | SMTs, light per-record changes | Joins, windows, stateful logic | Joins, windows, aggregations |
| Commit cadence | Coordinator interval, default 5 minutes | Checkpoint interval | Micro-batch trigger |
| Good fit | Landing topics as Bronze tables | Real-time Silver tables with heavy logic | Teams already running Spark |

Frequent commits create many small files, so plan for regular compaction on tables fed by any streaming path. For the commit internals and the tradeoffs between approaches, see [Kafka Connect to Iceberg: How the Commit Actually Works](/blog/kafka-connect-iceberg-commits/), [The State of Streaming to Apache Iceberg in July 2026](/blog/streaming-to-iceberg-july-2026/), and [Optimizing Compaction for Streaming Workloads in Apache Iceberg](/blog/iceberg-streaming-compaction/).

## Summary

Kafka Connect replaces custom integration code with configured source and sink connectors running on a fault-tolerant worker cluster. With the Iceberg sink, it is a straightforward way to land Kafka topics as lakehouse tables, while Flink or Spark take over when the data needs real transformation in flight.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
