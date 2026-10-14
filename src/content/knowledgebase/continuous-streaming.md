---
title: "Continuous Streaming vs Micro-Batching, and What Each Means for Iceberg"
meta_title: "Continuous Streaming vs Micro-Batch for Iceberg | Glossary"
description: "Continuous streaming processes each event as it arrives instead of in micro-batches. See how Flink and Spark compare and what latency Iceberg tables add."
---

Continuous streaming is a processing model in which an engine handles each event as it arrives, using long-running operators, instead of collecting events into small batches first. Apache Flink is the best-known continuous engine. Spark Structured Streaming defaults to micro-batching, though Spark 4.1 added a real-time mode with long-running tasks for stateless queries.

Low per-event latency matters for fraud scoring, alerting, and operational monitoring, where a decision has to be made within milliseconds to a few seconds of the event.

## Unbounded Data and Stateful Processing

A batch query computes `SUM(sales)` by reading a finite table. A stream never ends, so the engine keeps running state, such as a running total per key, and updates it as each event arrives. That state can grow large, so engines keep it in memory or in an embedded store like RocksDB.

### Checkpoints
Flink makes state fault tolerant with checkpoints, using asynchronous barrier snapshotting, a variant of the Chandy-Lamport algorithm. Sources insert numbered barriers into the stream. When an operator has received the barrier on its inputs, it snapshots its state to durable storage such as S3, while processing continues. After a failure, Flink restores the last completed checkpoint and replays the sources from the recorded offsets.

This gives exactly-once effects on Flink-managed state. End-to-end exactly-once also needs replayable sources (such as Kafka) and transactional or idempotent sinks.

## Event Time vs Processing Time

Events arrive late and out of order. A phone that loses signal at 12:00 may deliver its click at 12:05. Processing time would place the click at 12:05; event time uses the timestamp the device recorded.

Engines that use event time track a watermark, an estimate of how far event time has progressed. When the watermark passes the end of a window, the engine emits the window's result. Events that arrive after that can be dropped, sent to a side output, or used to update the result, depending on configuration.

## Continuous vs Micro-Batch, and the Iceberg Commit

| | Continuous (Flink, Spark real-time mode) | Micro-batch (Spark Structured Streaming default) |
|---|---|---|
| Unit of work | One event at a time through long-running operators | Small batches on a trigger interval |
| Typical latency | Milliseconds | Seconds, set by the trigger |
| Fault tolerance | Checkpoints of operator state | Offsets and state per batch |
| Iceberg visibility | At each checkpoint commit | At each batch commit |

For lakehouse tables the processing model is only half the story. An [Apache Iceberg](/knowledgebase/apache-iceberg/) table becomes visible to readers only when a commit creates a new snapshot. Flink's Iceberg sink commits on each checkpoint, so a Flink job with a one-minute checkpoint interval delivers data to Iceberg readers roughly once a minute, no matter how fast the operators run. Committing every few seconds creates many small files and snapshots, which then need compaction.

That is why many architectures split the path: [Apache Kafka](/knowledgebase/apache-kafka/) or [Apache Fluss](/knowledgebase/apache-fluss/) serve sub-second reads, and Iceberg holds the durable, queryable history on a minute-level cadence. For details, read [Real-Time Lakehouse Patterns with Apache Flink and Iceberg](/blog/2026-05-real-time-lakehouse-flink/), [The State of Streaming to Apache Iceberg in July 2026](/blog/streaming-to-iceberg-july-2026/), and [Batch vs. Streaming: Choose the Right Processing Model](/blog/2026-02-de-best-practices-06-batch-vs-streaming/).

## Summary

Continuous streaming engines like [Apache Flink](/knowledgebase/apache-flink/) process events one at a time with checkpointed state and event-time windows. When the output is an Iceberg table, end-to-end freshness is set by the commit interval, so pick it to match what readers need and plan for compaction.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
