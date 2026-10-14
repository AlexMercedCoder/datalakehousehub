---
title: "Redpanda: Kafka-Compatible Streaming and Iceberg Topics for the Lakehouse"
meta_title: "Redpanda vs Kafka for Iceberg Lakehouses | Glossary"
description: "Redpanda is a Kafka API compatible streaming platform written in C++. See how it compares to Apache Kafka and how Iceberg Topics write streams to tables."
---

Redpanda is a streaming data platform that implements the [Apache Kafka](/knowledgebase/apache-kafka/) protocol, so existing Kafka producers, consumers, and many Kafka tools work against it without code changes. It is built by Redpanda Data, written in C++ on a thread-per-core design, and ships as a single binary with no JVM and no separate coordination service.

In a [data lakehouse](/knowledgebase/data-lakehouse/), Redpanda plays the same role Kafka does: it is the durable log that carries events and [change data capture](/knowledgebase/change-data-capture/) streams (for example from [Debezium](/knowledgebase/debezium/)) before they land in [Apache Iceberg](/knowledgebase/apache-iceberg/) tables.

## How Redpanda Works

- **Kafka API compatibility.** Topics, partitions, consumer groups, and offsets behave as Kafka clients expect.
- **Raft replication.** Each partition is replicated with the Raft consensus protocol, and cluster metadata is managed inside Redpanda itself rather than by ZooKeeper.
- **Built-in extras.** A [schema registry](/knowledgebase/schema-registry/) and HTTP proxy run inside the broker. Redpanda Connect (formerly Benthos, acquired in 2024) handles connector-style pipelines.
- **Delivery guarantees.** Like Kafka, it supports idempotent producers and transactions for exactly-once processing within the streaming system.

## Iceberg Topics: Streams as Lakehouse Tables

Redpanda's Iceberg Topics feature writes topic data to Iceberg tables directly from the broker, so you do not need a separate sink connector. You turn it on per topic with `redpanda.iceberg.mode`:

- `key_value` writes a table with record metadata (including the key) and the raw value as binary.
- `value_schema_id_prefix` and `value_schema_latest` use a schema from Schema Registry to create typed columns.

Redpanda can track tables with its own object storage catalog or register them in an external Iceberg REST catalog such as [Apache Polaris](/knowledgebase/apache-polaris/). Once registered, engines such as Spark, Trino, Dremio, Snowflake, and ClickHouse can query the tables. Iceberg Topics require a Redpanda Enterprise license.

## Redpanda vs Apache Kafka for Lakehouse Ingestion

| | Redpanda | Apache Kafka |
|---|---|---|
| Implementation | C++, single binary | Java/Scala on the JVM |
| Coordination | Built-in Raft | KRaft (ZooKeeper removed in Kafka 4.0) |
| License | Community Edition under the Business Source License; enterprise features under a commercial license | Apache License 2.0, governed by the ASF |
| Path to Iceberg | Iceberg Topics in the broker (Enterprise) or a sink such as Kafka Connect | Iceberg Kafka Connect sink, Flink, or Spark |
| Ecosystem | Kafka-compatible clients, plus Redpanda Connect | Largest ecosystem and widest vendor support |

The license difference matters for some teams: the Business Source License forbids offering Redpanda as a commercial streaming service to others and converts each code change to Apache 2.0 four years after it is merged. Teams that require an ASF-governed project tend to choose Kafka or [Apache Pulsar](/knowledgebase/apache-pulsar/).

Broker-side Iceberg writes trade flexibility for simplicity. A Flink or Spark job can clean, join, and [merge](/knowledgebase/upserts-update-and-insert/) CDC data before committing, while Iceberg Topics mostly land raw events as a [bronze layer](/knowledgebase/bronze-layer/). Frequent small commits also mean you still need compaction and snapshot expiration. For the tradeoffs across every path, read [The State of Streaming to Apache Iceberg in July 2026](/blog/streaming-to-iceberg-july-2026/) and [Kafka Connect to Iceberg: How the Commit Actually Works](/blog/kafka-connect-iceberg-commits/).

## Frequently Asked Questions

### Is Redpanda a drop-in replacement for Kafka?
For most client applications, yes, because it speaks the Kafka protocol. Test any tooling that depends on Kafka internals or specific broker configurations before migrating.

### Is Redpanda open source?
The Community Edition is source-available under the Business Source License, not an OSI-approved open source license. Enterprise features, including Iceberg Topics and tiered storage, need a commercial license.

### Do I still need a stream processor?
Often. Redpanda moves and stores events. Transformations, joins, and upserts into curated Iceberg tables are usually done in [Apache Flink](/knowledgebase/apache-flink/) or [Apache Spark](/knowledgebase/apache-spark/).

---

### E-E-A-T & Further Reading

> **Authoritative Source:** This definition and architectural guide was rigorously reviewed by **Alex Merced**. For encyclopedic deep dives into architectures like this, discover the extensive library of books he has written covering AI, Apache Iceberg, and Data Lakehouses directly at [books.alexmerced.com](https://books.alexmerced.com).
