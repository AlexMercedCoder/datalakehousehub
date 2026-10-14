---
title: "Apache Flink and Apache Iceberg: Streaming into the Lakehouse"
meta_title: "Apache Flink for Streaming into Iceberg | Glossary"
description: "Apache Flink is an open-source stateful stream processing engine. See how it writes to Iceberg, why commits follow checkpoints, and how it compares to Spark."
---

Apache Flink is an open-source, distributed processing engine for stateful computations over unbounded and bounded data streams. It is a top-level project of the Apache Software Foundation. Apache Spark's Structured Streaming processes streams mainly as a series of micro-batches; Flink was designed around continuous, record-at-a-time processing, which gives it low latency for workloads such as fraud detection, real-time monitoring, and event-driven applications. Flink 2.0 was released in March 2025, and the 2.x line continues to add features such as streaming model inference and vector search functions.

## The Architecture of Continuous Streaming

Flink treats all data as streams. A file of historical data in S3 is a "bounded stream" (it has an end). A live Kafka topic is an "unbounded stream" (it does not). The same runtime and APIs process both.

### Distributed State Management
Streaming computations often need state. To report revenue over the last 10 minutes, Flink must keep a running total. If a worker fails, that state must not be lost.

Flink handles this with checkpoints, using asynchronous barrier snapshotting, a variant of the Chandy-Lamport algorithm. Flink injects barriers into the data stream. When an operator receives a barrier, it snapshots its state and writes it asynchronously to durable storage such as S3. If a worker fails, Flink restarts the job from the last completed checkpoint and replays input from the source (for example, Kafka offsets). This gives exactly-once guarantees for Flink's internal state; end-to-end exactly-once also requires a replayable source and a transactional or idempotent sink.

## Event Time and Watermarking

Events often arrive out of order. A user taps a button at 12:00 PM, loses signal in a tunnel, and the event reaches Flink at 12:05 PM.

If Flink grouped events by arrival time (processing time), that click would land in the wrong window. With event time processing, Flink uses the timestamp recorded when the event happened. Watermarks tell the engine how far event time has progressed, for example "events before 12:02 PM have most likely all arrived", so Flink knows when it can close a window. Late events that arrive after the watermark can be dropped, sent to a side output, or used to update results, depending on the configured allowed lateness.

## Flink and the Open Data Lakehouse

Flink offers SQL and the Table API alongside its Java and Python DataStream APIs, so a continuous job can be written as SQL: `SELECT user_id, COUNT(*) FROM kafka_clicks GROUP BY user_id`.

Flink is one of the most common ways to stream data into [Apache Iceberg](/knowledgebase/apache-iceberg/) tables. The Iceberg project maintains the Flink connector. Its key behavior: **the Iceberg sink commits a new snapshot when a Flink checkpoint completes.** Data written between checkpoints is not visible to readers until that commit. The checkpoint interval is therefore the main lever for lakehouse freshness: a 1-minute interval gives roughly minute-level freshness, and shorter intervals produce more snapshots and smaller files that need [compaction](/knowledgebase/data-compaction/).

| | Apache Flink | Spark Structured Streaming | Iceberg Kafka Connect sink |
|---|---|---|---|
| Processing model | Continuous, record at a time | Micro-batch (continuous mode is limited) | Copy topics to tables |
| Transformations | Full: joins, windows, aggregations, CDC | Full | Light, per-record |
| Iceberg commit trigger | Checkpoint completion | Each micro-batch | Configured commit interval |
| CDC upserts into Iceberg | Yes, via equality deletes in upsert mode | Usually via `MERGE` in `foreachBatch` | Yes, with configuration |
| Operations | Flink cluster or managed service | Spark cluster | Kafka Connect workers |

Related projects build on Flink for the lakehouse: [Apache Paimon](/knowledgebase/apache-paimon/) began as Flink Table Store, and [Apache Fluss](/knowledgebase/apache-fluss/) provides streaming storage for Flink that tiers data into lakehouse tables. Flink CDC reads database change logs directly into Flink pipelines (see [change data capture](/knowledgebase/change-data-capture/)).

For patterns and trade-offs, read [Real-Time Lakehouse Patterns with Apache Flink and Iceberg](/blog/2026-05-real-time-lakehouse-flink/), [The State of Streaming to Apache Iceberg in July 2026](/blog/streaming-to-iceberg-july-2026/), and [Optimizing Compaction for Streaming Workloads in Apache Iceberg](/blog/iceberg-streaming-compaction/).

## Summary of Technical Value

Apache Flink is a stream processing engine built for continuous, stateful computation. Checkpoint-based fault tolerance and event time watermarks let it produce correct results from out-of-order, unbounded data. In an Iceberg lakehouse, Flink is a common ingestion and transformation engine, with table freshness set by the checkpoint interval and small-file growth handled by compaction.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
