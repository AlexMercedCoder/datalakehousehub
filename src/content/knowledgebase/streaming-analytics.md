---
title: "What is Streaming Analytics?"
meta_title: "What is Streaming Analytics? | Expert Data Lakehouse & AI Glossary"
description: "Streaming analytics processes data continuously as events arrive instead of in scheduled batches. Learn how CDC, commit logs and delivery guarantees support it."
---

Streaming analytics is the continuous processing and analysis of data as events arrive, rather than collecting data first and analyzing it later in scheduled batches. A streaming job treats its input as an unbounded sequence of events, such as clicks, payments, sensor readings, or database changes, and keeps results such as counts, aggregates, alerts, or joined records up to date while new events flow in. The goal is to shorten the gap between something happening and a system or person acting on it.

## How Streaming Analytics Works

A typical streaming pipeline has four parts:

* **Event sources.** Applications publish events to a log or broker such as [Apache Kafka](/knowledgebase/apache-kafka/), or [change data capture](/knowledgebase/change-data-capture/) tools such as Debezium read a database's transaction log and emit row-level inserts, updates, and deletes.
* **A stream processor.** Engines such as [Apache Flink](/knowledgebase/apache-flink/) or Spark Structured Streaming read the events, keep state (running totals, session data, join buffers), and compute results continuously.
* **Time handling.** Because events can arrive late or out of order, processors distinguish event time (when the event happened) from processing time (when the engine saw it). Flink tracks event-time progress with watermarks, markers that say no more events at or before a given timestamp are expected, so the engine knows when a window can close.
* **Sinks.** Results go to dashboards, alerting systems, serving databases, or lakehouse tables.

Since an unbounded stream never ends, aggregations are scoped with windows. Tumbling windows cover fixed, non-overlapping intervals; sliding windows overlap; session windows group events separated by gaps of inactivity.

## Delivery Guarantees

Streaming systems describe correctness through delivery guarantees. At-most-once can lose events, at-least-once can produce duplicates after a failure, and exactly-once ensures each event affects state once. Flink provides exactly-once state consistency by taking periodic checkpoints of operator state and source offsets, then replaying from the last checkpoint after a failure. The Flink docs note this depends on a source that can rewind, such as Kafka. Whether results are exactly-once end to end also depends on how the sink commits its output.

## Streaming Analytics Versus Batch Analytics

| Aspect | Batch analytics | Streaming analytics |
|---|---|---|
| Input | Bounded dataset | Unbounded event stream |
| Trigger | Schedule or manual run | Each event or small micro-batch |
| Result latency | Minutes to hours | Seconds or less, depending on design |
| State | Recomputed per run | Maintained continuously |
| Typical uses | Historical reporting, model training, large backfills | Fraud alerts, monitoring, live operational metrics |

Most platforms use both. Streaming covers fresh operational views, and batch handles reprocessing, backfills, and heavy historical aggregation. [Lambda and Kappa architectures](/knowledgebase/kappa-architecture/) are two well-known ways to combine or unify them.

## Streaming Analytics in the Lakehouse

Streaming and the lakehouse meet at the table format. Flink, Spark, and Kafka Connect can write streams into [Apache Iceberg](/knowledgebase/apache-iceberg/) tables, which turns a stream into queryable history. The Iceberg Flink sink commits data files to the table after each successful Flink checkpoint, and the Iceberg docs state it provides exactly-once semantics. With format v2 tables and identifier fields defined, the sink can also run in upsert mode to apply CDC updates and deletes.

This pattern lets one table serve two audiences: streaming jobs keep it fresh within a checkpoint interval, and engines such as Dremio, Trino, and DuckDB query it with standard SQL for dashboards and AI agents. Frequent streaming commits create many small files, so streaming tables need regular compaction and snapshot expiration. In a medallion design, streaming often feeds the bronze layer, with batch or incremental jobs refining it into silver and gold tables.

## Related Reading

* [Real-Time Lakehouse Patterns with Apache Flink and Iceberg](/blog/2026-05-real-time-lakehouse-flink/)
* [Batch vs. Streaming: Choose the Right Processing Model](/blog/2026-02-de-best-practices-06-batch-vs-streaming/)
* [Real-time analytics](/knowledgebase/real-time-analytics/)

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
