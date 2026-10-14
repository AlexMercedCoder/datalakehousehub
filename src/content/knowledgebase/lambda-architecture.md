---
title: "Lambda Architecture vs Kappa and the Streaming Lakehouse"
meta_title: "Lambda Architecture vs Kappa and the Iceberg Lakehouse"
description: "Lambda architecture splits data into a batch layer and a real-time speed layer merged at query time. See how it compares to Kappa and Iceberg streaming."
---

## What the Lambda Architecture Is

The Lambda architecture is a data processing design that runs two pipelines over the same incoming data: a batch layer that periodically recomputes accurate results over all history, and a speed layer that produces low-latency results for the data the batch layer has not processed yet. A serving layer combines the two at query time. Nathan Marz described it around 2011 and expanded on it in the book *Big Data*, written with James Warren.

It was a response to the tools of that era. Hadoop MapReduce could recompute over all data reliably but took hours, and stream processors like Apache Storm were fast but harder to make exact.

## The Three Layers

1. **Batch layer.** Stores the master dataset as an immutable, append-only record of raw events and periodically recomputes batch views from scratch. Historically this was HDFS with MapReduce, later Spark.
2. **Speed layer.** Processes only recent data as it arrives (Storm, later Spark Streaming or Flink) and produces real-time views. Its results cover the gap until the next batch run and are discarded once the batch layer catches up.
3. **Serving layer.** Indexes the batch views (stores such as Apache HBase or Druid were common) and merges them with real-time views to answer queries.

Because the batch layer rebuilds from immutable raw data, errors in the speed layer, such as missed late events or duplicates after a failure, are corrected on the next batch run.

## Why Teams Moved Away from It

The main cost is running the same logic twice in two systems. When the batch code and streaming code drift apart, the dashboard shows different numbers depending on which layer answered. Operating two pipelines also doubles the infrastructure to monitor and tune. Jay Kreps' [Kappa architecture](/knowledgebase/kappa-architecture/) proposed one streaming path with replay instead, and engines like Spark and Flink later added unified batch and streaming APIs that shrink the duplication even when both paths remain.

## Lambda on a Modern Lakehouse

The batch-plus-speed split still shows up, in a lighter form. A typical [Apache Iceberg](/knowledgebase/apache-iceberg/) lakehouse might stream events into Iceberg tables with Flink every minute while nightly Spark or dbt jobs rebuild gold tables and fix late-arriving data. The difference from classic Lambda is that both paths write to the same open tables, so a single engine such as Dremio or Trino can query one copy of the data instead of merging two serving stores. [The Real-Time Lakehouse with Streaming and Iceberg](/blog/real-time-lakehouse-streaming-sql-cold-iceberg-storage/) covers that hot and cold split.

## Lambda vs Kappa vs Streaming Lakehouse

| | Lambda | Kappa | Streaming into Iceberg |
|---|---|---|---|
| Pipelines | Batch plus speed | One streaming job | Streaming ingest, batch or streaming transforms |
| Logic duplication | High | None | Low, shared SQL or dbt models |
| Serving | Merge of two views | One output store | One set of Iceberg tables |
| Reprocessing | Rerun batch layer | Replay the log | Reread bronze tables, use snapshots or branches |

For choosing a processing model, see [Batch vs. Streaming: Choose the Right Processing Model](/blog/2026-02-de-best-practices-06-batch-vs-streaming/) and [batch processing vs stream processing](/knowledgebase/batch-processing-vs-stream-processing/).

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
