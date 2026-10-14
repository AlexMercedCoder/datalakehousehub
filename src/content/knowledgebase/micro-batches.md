---
title: "What is Micro-Batches?"
meta_title: "What is Micro-Batches? | Data Lakehouse Hub Knowledge Base"
description: "Micro-batching is a method that splits a data stream into small time-based batches, and how Spark and Apache Iceberg commit and compact them in a lakehouse."
---

# What is Micro-Batches?

## Introduction to Micro-Batches

In the evolution of data engineering, the move from historical analytics (batch processing) to live analytics (stream processing) did not happen all at once. Teams needed a middle ground that combined the throughput of batch systems with the lower latency that real-time dashboards demand.

One of the most widely used middle grounds is the **Micro-Batch**.

Micro-batching is an ingestion and processing technique where continuous streams of incoming data are grouped into small, discrete intervals (often from a few seconds to a few minutes) and processed as small batch jobs. It provides "near real-time" analytics, giving up some latency in exchange for high throughput and simpler fault tolerance.

## How Micro-Batching Works

To understand micro-batching, look at the framework that popularized it: **[Apache Spark](https://datalakehousehub.com/knowledgebase/apache-spark/) Streaming** (and later, Structured Streaming).

Spark's core architecture was built for parallel batch processing. It was not originally designed to process an unending stream one event at a time like [Apache Flink](https://datalakehousehub.com/knowledgebase/apache-flink/) or Apache Storm. To process streams, Spark's creators applied the batch engine to small slices of the stream.

1.  **Ingestion**: A system like [Apache Kafka](https://datalakehousehub.com/knowledgebase/apache-kafka/) continuously receives raw events (e.g., user clicks on a website).
2.  **Chunking**: The Spark streaming job reads from Kafka. Instead of processing each click as it arrives, Spark waits for a configured interval (the "batch interval" or trigger interval), say 5 seconds.
3.  **Execution**: After 5 seconds, Spark takes the events that arrived within that window, treats them as a small, bounded dataset (an RDD in the original Spark Streaming API, or a DataFrame in Structured Streaming), and runs a parallel batch job to process them.
4.  **Output**: The results of that chunk are written to a downstream database or [Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/) table. The system then moves on to the next chunk.

## The Advantages of Micro-Batching

Continuous, record-at-a-time stream processing can reach lower latency, but micro-batching remains widely used in enterprise architectures because of its operational advantages.

### 1. Reusing Batch Logic
A major advantage of micro-batching is code reuse. Because the engine treats the stream as a series of small tables, data engineers can use much of the same SQL or DataFrame logic they use for nightly ETL jobs to process real-time data. There are fewer specialized streaming APIs to learn.

### 2. High Throughput
Processing events one at a time adds per-record overhead. By grouping many events into a micro-batch, the engine can use vectorized operations and send data over the network efficiently. Micro-batching often achieves higher total throughput than record-at-a-time processing, at the cost of added latency.

### 3. Fault Tolerance and Exactly-Once Semantics
In a distributed system, servers crash. If a server crashes mid-stream, making sure that an event is neither lost nor processed twice (which would corrupt financial metrics) is difficult.
Because micro-batches process bounded chunks of data, tracking progress is simpler. Spark records each batch's source offsets in a checkpoint, so if a node fails while processing a batch, the batch can be re-run from the same offsets. With a replayable source and an idempotent or transactional sink, Structured Streaming provides end-to-end exactly-once semantics.

## The Modern Lakehouse and Micro-Batches

Open data lakehouse table formats (like [Apache Iceberg](https://iceberglakehouse.com/iceberg/iceberg-catalog/)) have made the micro-batch pattern more practical for lakehouse tables.

Historically, appending a small micro-batch to a data lake every few seconds created the "small file problem": many tiny Parquet files that slowed down query engines.
Modern table formats help. Iceberg lets a Spark micro-batch commit data atomically at each trigger. Iceberg manages the transactional metadata, and teams schedule compaction jobs (such as Iceberg's `rewrite_data_files` procedure, or a managed optimization service) to combine small files into larger, read-optimized files without stopping ingestion.

## Conclusion

Micro-batching is a practical workhorse of near real-time data engineering. It is not suited to use cases that need millisecond latency, such as high-frequency trading or blocking fraud in-line, but a delay of seconds to a minute is acceptable for many BI dashboards and machine learning pipelines. By providing much of the throughput and fault tolerance of a batch system with lower latency, micro-batching remains a foundational pattern in the modern data stack.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
