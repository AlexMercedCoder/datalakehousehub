---
title: "Micro-Batching vs Continuous Streaming for Iceberg Ingestion"
meta_title: "Micro-Batching vs Streaming for Iceberg Tables | Glossary"
description: "Micro-batching processes a data stream as a series of small batch jobs. Learn how Spark, Flink, and Kafka Connect use it to write Iceberg tables and tradeoffs."
---

Micro-batching is a stream processing approach that treats a continuous stream as a series of small batch jobs. Instead of processing each event as it arrives, the engine collects the events from a short interval, processes them together, and commits the result. Spark Streaming (DStreams) made the approach widely known, and Spark Structured Streaming uses it as its default execution mode.

Traditional batch jobs, such as a nightly ETL run, give high throughput but data that is hours old. Record-at-a-time streaming engines like [Apache Flink](/knowledgebase/apache-flink/) process each event as it arrives and can reach very low latency. Micro-batching sits between them: latency is usually in the range of a second to a few minutes, depending on the trigger interval, while the engine keeps the throughput and simpler recovery model of batch processing.

## How It Works

The engine runs on a trigger. In Spark Structured Streaming, the default trigger starts a new micro-batch as soon as the previous one finishes, and a fixed interval (for example `processingTime='1 minute'`) can be set instead.

At each trigger, the engine determines the range of new input (for example Kafka offsets 1,000 to 1,500), reads it as a DataFrame, runs the same transformations a batch job would, and writes the output to the sink, such as a [data lakehouse](/knowledgebase/data-lakehouse/) table. Then it starts the next batch.

## Fault Tolerance

Before processing a batch, Spark records the offset range it plans to read in a checkpoint location, along with any streaming state. If a task or node fails, Spark re-reads the same offset range from the source and processes it again.

This gives exactly-once results only when the source is replayable (like Kafka) and the sink is idempotent or transactional. Iceberg sinks qualify because each batch is committed as an atomic table commit, and Spark records which batch IDs were committed. With a non-idempotent sink, such as an external API, replays can produce duplicates.

## Micro-Batching on Apache Iceberg

Every write to an [Apache Iceberg](/knowledgebase/apache-iceberg/) table creates new data files and a new snapshot. Committing once per event would create huge numbers of tiny files and snapshots, slowing down both reads and metadata operations. So nearly every Iceberg streaming path batches commits in some way, even when the engine itself processes events one at a time:

| Ingestion path | How commits are batched | Typical commit interval |
|---|---|---|
| Spark Structured Streaming | One commit per micro-batch | Set by the trigger, often 1 to 5 minutes |
| Apache Flink | One commit per checkpoint | Set by the checkpoint interval |
| Kafka Connect Iceberg sink | Coordinated commit across tasks | Set by the commit interval setting |
| PyIceberg or DuckDB jobs | One commit per scheduled run | Set by the scheduler |

Shorter intervals give fresher data but more small files and snapshots. Longer intervals give larger files but staler data. Either way, plan for [compaction](/knowledgebase/data-compaction/) and snapshot expiration. For upserts, each batch typically runs one `MERGE INTO`, which on merge-on-read tables also creates delete files that compaction must clean up.

For more depth, read [The State of Streaming to Apache Iceberg in July 2026](/blog/streaming-to-iceberg-july-2026/), [Optimizing Compaction for Streaming Workloads in Apache Iceberg](/blog/iceberg-streaming-compaction/), and [Serverless Iceberg Ingestion with PyIceberg and DuckDB](/blog/serverless-iceberg-microbatch-pyiceberg-duckdb/). See also the [micro-batches](/knowledgebase/micro-batches/) and [continuous streaming](/knowledgebase/continuous-streaming/) glossary entries.

## Summary of Technical Value

Micro-batching processes streams as small, repeatable batch jobs, which gives near real-time freshness with simple replay-based recovery. On Iceberg, the commit interval is the key setting: it decides how fresh the data is and how much compaction work the table needs. Spark 4.1 also added a Real-Time Mode for lower-latency stateless queries, but micro-batching remains Spark's default.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
