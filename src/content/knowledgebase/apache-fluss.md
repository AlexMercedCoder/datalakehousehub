---
title: "Apache Fluss vs Kafka: Streaming Storage for Iceberg Lakehouses"
meta_title: "Apache Fluss vs Kafka for Iceberg Streaming | Glossary"
description: "Apache Fluss is open source streaming storage for real-time analytics that tiers data into lake tables. See how it compares to Kafka for Iceberg tables."
---

Apache Fluss is an open source, lakehouse-native streaming storage system built for real-time analytics and AI. It stores streams as tables with sub-second freshness, integrates with Apache Flink and Apache Spark, and continuously tiers its data into open lake formats including [Apache Iceberg](/knowledgebase/apache-iceberg/), Apache Paimon, Apache Hudi, and Lance. Fluss entered the Apache Incubator in 2025 and graduated to an Apache top-level project in July 2026.

Most streaming architectures pair a message log such as [Apache Kafka](/knowledgebase/apache-kafka/) with a separate pipeline that copies events into lake tables. Fluss collapses those two layers: the same table serves fresh streaming reads and holds a committed copy in the lakehouse.

## How Fluss Stores Data

### Columnar streaming
Fluss stores its log in a columnar layout built on Apache Arrow. A Flink or Spark job that needs three columns out of fifty reads only those three, and filters can be pushed down to storage. Row-oriented message logs have to ship every field of every record.

### Log tables and primary key tables
* **Log tables** are append-only, similar to a Kafka topic with a schema.
* **Primary key tables** accept updates, serve key lookups, and emit a changelog. Merge engines handle deduplication, partial updates, and aggregation.

### Lakehouse tiering
The Fluss tiering service runs as an Apache Flink job. It writes data into the chosen lake format, commits it, and records how far the streaming log has been tiered. Recent data stays in Fluss for low-latency access, while older data lives as normal lake tables on object storage.

### Union reads
A union read combines a committed lake snapshot with the newer records still in Fluss, so one query covers both history and the last few seconds. Support depends on the engine, table type, and lake format, so check the docs for your release.

## Fluss vs Kafka for Lakehouse Streaming

| | Apache Fluss | Apache Kafka |
|---|---|---|
| Data model | Tables with schemas (log and primary key tables) | Topics of records; schema handled outside the broker |
| Storage layout | Columnar (Arrow), supports projection pushdown | Row-oriented record batches |
| Updates and lookups | Primary key tables with upserts and point lookups | Compacted topics keep the latest value per key; no query lookups |
| Path to Iceberg | Built-in tiering service writes and commits Iceberg tables | Separate sink, such as Kafka Connect or a Flink job |
| Querying history plus fresh data | Union reads across lake snapshot and Fluss | Two systems queried separately |
| Ecosystem maturity | Young; Flink and Spark integrations | Very broad client and connector ecosystem |

Kafka remains the right choice for general event distribution between many services. Fluss fits when the goal is analytics: streams that must land in Iceberg tables, be queried with Flink or Spark, and stay readable by the rest of the lakehouse. Once tiered, the data is an ordinary Iceberg table, so engines like [Dremio](/knowledgebase/dremio-cloud/) or [Trino](/knowledgebase/trino/) can query it through your catalog without knowing Fluss exists. See also [Apache Flink](/knowledgebase/apache-flink/) and [Kafka Connect](/knowledgebase/kafka-connect/).

## Summary

Apache Fluss treats streams as columnar tables and keeps a committed copy in open lake formats such as Iceberg. For teams that currently run Kafka plus a separate ingestion job into the lakehouse, it offers one storage layer for both fresh and historical analytics.

## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
