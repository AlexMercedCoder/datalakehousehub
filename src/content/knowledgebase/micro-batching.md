---
title: "What is Micro-Batching?"
meta_title: "What is Micro-Batching? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Micro-Batching. Learn how engines like Spark Streaming process high-velocity data streams in tiny, discrete intervals."
---

# What is Micro-Batching?

Micro-Batching is a hybrid data processing architecture designed to handle high-velocity streaming data by treating the continuous stream as a sequence of tiny, discrete batch jobs. Popularized heavily by Apache Spark Structured Streaming, micro-batching fundamentally bridges the massive architectural gap between highly latent overnight batch processing and true, event-by-event continuous streaming.

In traditional data engineering, batch processing handled massive datasets (e.g., executing a daily ETL job at midnight to process the entire day's logs). This provided immense throughput but resulted in data being 24 hours out of date. Conversely, true continuous streaming processed every single event the exact microsecond it arrived. While incredibly fast, true streaming was exceptionally difficult to engineer, struggled with massive aggregations, and offered extremely poor overall system throughput. Micro-batching strikes a pragmatic balance, achieving near real-time latency (typically ranging from a few milliseconds to a few seconds) while maintaining the massive computational throughput and fault tolerance of a traditional batch engine.

## The Execution Mechanics

In a micro-batching architecture, the query engine does not process events individually. Instead, it aggressively collects incoming events over a highly specific, predefined time interval (e.g., every 500 milliseconds or every 2 seconds).

When the interval triggers, the engine takes all the events accumulated during that specific window and bundles them into a discrete, immutable batch (in Spark, this is an RDD or a DataFrame). The engine then dispatches this tiny batch to the distributed cluster, executes the SQL transformations or mathematical aggregations exactly as it would for a massive batch job, and writes the output directly to the destination [Data Lakehouse](/data-lakehouse) or dashboard. Once complete, the engine immediately begins processing the next accumulated batch.

## Exactly-Once Fault Tolerance

One of the most profound advantages of micro-batching is its inherent resilience and fault tolerance. 

In a distributed cluster, network failures and hardware crashes are inevitable. If a worker node crashes while processing a true, event-by-event stream, tracking exactly which single events were successfully processed and which were lost is incredibly complex, often leading to duplicated data (at-least-once delivery).

Micro-batching solves this cleanly through strict state management and checkpointing. Before processing a batch, the engine securely logs the exact offset range of the data it intends to consume (e.g., Kafka offsets 1,000 to 1,500). If the worker node crashes halfway through processing the batch, the data is entirely discarded. When the node recovers, the engine simply looks at the checkpoint, retrieves the exact same batch of data (offsets 1,000 to 1,500) from the source, and re-processes it entirely. This guarantees exactly-once processing semantics without massive architectural overhead.

## Micro-Batching in the Open Data Lakehouse

Micro-batching is the absolute standard ingestion pattern for the modern Data Lakehouse. 

Because Open Table Formats like [Apache Iceberg](/apache-iceberg) and Delta Lake rely on writing physical Apache Parquet files and generating new metadata manifests (commits), attempting to write a new Parquet file for every single streaming event would instantly collapse the lakehouse under millions of tiny files.

Instead, organizations configure micro-batch pipelines to trigger every few minutes. The pipeline consumes millions of events from Kafka, bundles them in memory, and executes a single, highly optimized, atomic `MERGE INTO` or `APPEND` operation against the Iceberg table. This architecture guarantees the data lakehouse receives fresh data continuously without compromising query performance or destroying the underlying file structure.

## Summary of Technical Value

Micro-Batching provides a highly pragmatic, immensely powerful architecture for real-time analytics. By carving continuous data streams into rapid, discrete intervals, it allows organizations to leverage robust batch-processing engines and strict fault-tolerance mechanisms to process streaming data. It serves as the foundational integration pattern for feeding high-velocity operational data safely and efficiently into the modern Open Data Lakehouse.


## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
