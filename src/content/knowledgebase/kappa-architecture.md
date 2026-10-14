---
title: "Kappa Architecture vs Lambda on an Apache Iceberg Lakehouse"
meta_title: "Kappa Architecture vs Lambda on an Iceberg Lakehouse"
description: "Kappa architecture processes all data, live and historical, through one streaming pipeline. Here is how it compares to Lambda and works with Iceberg tables."
---

## What the Kappa Architecture Is

The Kappa architecture is a data processing design in which a single stream processing pipeline handles both real-time data and historical reprocessing. Jay Kreps, one of the creators of Apache Kafka, described it in his 2014 essay "Questioning the Lambda Architecture" as an alternative to running separate batch and streaming code paths.

The idea: keep an ordered, replayable log of events, process it with one streaming job, and when the logic changes, replay the log through a new version of that job instead of running a separate batch system.

## How It Works

1. **A replayable log.** Events land in a log such as [Apache Kafka](/knowledgebase/apache-kafka/), [Apache Pulsar](/knowledgebase/apache-pulsar/), or [Redpanda](/knowledgebase/redpanda/). The log must keep data long enough to replay it. With Kafka that means long retention, log compaction for keyed data, or tiered storage, which became production ready in Kafka 3.9.
2. **One streaming job.** A stream processor such as [Apache Flink](/knowledgebase/apache-flink/) or Spark Structured Streaming applies the business logic and writes results to a serving table.
3. **Reprocessing by replay.** To fix a bug or change logic, you start a second instance of the updated job reading from the earliest retained offset, let it write to a new output table, and switch readers over once it catches up. Then you retire the old job and table.

The benefit is one codebase for live and historical results. The costs are real too: replaying years of events through a streaming engine can be slow and expensive, keeping that history in the broker costs storage, and some computations (large joins, full recomputes) are simpler to express as batch jobs.

## Kappa on an Iceberg Lakehouse

[Apache Iceberg](/knowledgebase/apache-iceberg/) changes where the history lives. Instead of keeping years of events in Kafka, a common pattern is:

- Flink or Kafka Connect writes the raw stream into a bronze Iceberg table, committing every few seconds to minutes.
- Downstream Flink jobs read that table incrementally (Iceberg supports streaming reads of new snapshots) and write silver and gold tables.
- Reprocessing reads from the bronze Iceberg table instead of from the broker, and the corrected output can be written to a new table or a branch and swapped in.

The pipeline is still one streaming codebase, but the replayable log is now a governed table that batch engines like Dremio, Trino, and Spark can also query. Streaming-first formats such as [Apache Paimon](/knowledgebase/apache-paimon/) and [Apache Fluss](/knowledgebase/apache-fluss/) push the same idea further. See [Real-Time Lakehouse Patterns with Apache Flink and Iceberg](/blog/2026-05-real-time-lakehouse-flink/) and [Approaches to Streaming Data into Apache Iceberg Tables](/blog/2026-04-29-apache-iceberg-masterclass-13-streaming-to-iceberg/).

## Kappa vs Lambda

| | Kappa | [Lambda](/knowledgebase/lambda-architecture/) |
|---|---|---|
| Processing paths | One streaming path | Batch layer plus speed layer |
| Codebases | One | Usually two |
| Reprocessing | Replay the log or bronze table through the new job | Rerun the batch layer |
| Source of history | Broker retention or an Iceberg table | Master dataset in batch storage |
| Main risk | Slow, costly replays; retention limits | Logic drift between two codebases |

For help choosing between batch and streaming in the first place, see [Batch vs. Streaming: Choose the Right Processing Model](/blog/2026-02-de-best-practices-06-batch-vs-streaming/).

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
