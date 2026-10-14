---
title: "Apache Pulsar: Architecture, Kafka Comparison, and Iceberg Pipelines"
meta_title: "Apache Pulsar vs Kafka for Iceberg Pipelines | Glossary"
description: "Apache Pulsar is a messaging and streaming platform that separates brokers from BookKeeper storage. See how it compares to Kafka for feeding Iceberg tables."
---

Apache Pulsar is an open source distributed messaging and event streaming platform. It was created at Yahoo and became an Apache Software Foundation top-level project in 2018. Pulsar supports both streaming (like [Apache Kafka](/knowledgebase/apache-kafka/)) and queue-style messaging with shared subscriptions, and teams often choose it over Kafka when they want separated compute and storage, built-in multi-tenancy, or geo-replication.

## The Decoupled Architecture

Pulsar splits serving and storage into separate tiers.

### 1. Brokers
Pulsar brokers do not keep durable message data on local disk. They handle producers and consumers, own topics, and cache recent messages. Because they hold no durable state, adding or replacing a broker means reassigning topic ownership, not copying data.

### 2. Apache BookKeeper
Messages are stored in Apache BookKeeper, a distributed log store. Each topic is written as a series of segments called ledgers, replicated across storage nodes called bookies. When you add bookies, new ledgers start using them right away; existing data does not have to move.

### 3. Metadata store
Pulsar keeps cluster metadata in a separate store. ZooKeeper is still supported, and the Pulsar docs recommend Oxia for new production clusters.

### Tiered storage
Older ledgers can be offloaded to object storage such as S3, so topics can retain long histories without growing the bookie fleet.

## Multi-Tenancy and Geo-Replication

* **Multi-tenancy:** topics live under tenants and namespaces, with quotas, retention, and authorization set per namespace. Several teams can share one cluster with isolation.
* **Geo-replication:** replication between clusters is configured per namespace and built into the broker, without a separate mirroring tool.

## Pulsar vs Kafka

Kafka has closed some of the gaps that once set Pulsar apart. Kafka 3.9 made tiered storage production-ready, and Kafka 4.0 removed ZooKeeper in favor of KRaft. Kafka brokers still store partition data locally, so adding brokers requires reassigning partitions and copying data.

| | Apache Pulsar | Apache Kafka |
|---|---|---|
| Storage | BookKeeper, separate from brokers | Broker local disks, optional tiered storage |
| Scaling storage | Add bookies; new ledgers use them | Add brokers and reassign partitions |
| Messaging models | Streaming and queue semantics | Streaming; share groups (queues) are newer |
| Multi-tenancy | Tenants and namespaces built in | Usually separate clusters or ACL conventions |
| Ecosystem | Smaller | Larger: Kafka Connect, Flink, most vendors |

## Pulsar in an Iceberg Lakehouse

Pulsar usually feeds the lakehouse through a processing engine or connector. [Apache Flink](/knowledgebase/apache-flink/) has a Pulsar source and an Iceberg sink, so a Flink job can read topics, clean events, and commit to [Apache Iceberg](/knowledgebase/apache-iceberg/) tables on each checkpoint. StreamNative also publishes an Iceberg sink connector for Pulsar IO. Whatever the path, data appears in Iceberg on the commit interval, not per message, so plan for compaction of small files. For the trade-offs between streaming paths, read [The State of Streaming to Apache Iceberg in July 2026](/blog/streaming-to-iceberg-july-2026/), [Apache Fluss and Kafka Solve Different Problems in an Iceberg Pipeline](/blog/fluss-kafka-iceberg-streaming/), and [Kafka 4.0 Changes Streaming Platform Operations](/blog/2026-05-kafka-streaming-operations/).

## Summary

Pulsar separates stateless brokers from BookKeeper storage, which makes scaling and rebalancing simpler, and it builds in multi-tenancy and geo-replication. Kafka's larger ecosystem and its own tiered storage keep it the default for many teams, so choose Pulsar when its tenancy, queueing, or storage model solves a real problem for your [data lakehouse](/knowledgebase/data-lakehouse/) ingestion.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
