---
title: "What is Apache Fluss?"
meta_title: "What is Apache Fluss? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Apache Fluss. Learn how this innovative streaming storage system natively bridges the gap between Apache Flink and the Data Lakehouse."
---

# What is Apache Fluss?

Apache Fluss is a highly advanced, modern open-source streaming storage architecture explicitly engineered to serve as the unified, high-performance storage foundation for Apache Flink. In the massive, chaotic ecosystem of real-time data streaming, the industry has historically relied on Apache Kafka or Apache Pulsar to hold the data, while using Flink strictly as the computational engine to process it. While this separation works, it introduces massive network latency, complex serialization overhead, and significant architectural friction when attempting to merge real-time streaming data directly with the massive historical batch data sitting in an Open Data Lakehouse.

Apache Fluss fundamentally disrupts this paradigm by providing a streaming storage engine that is architecturally native to Flink’s internal logic. It is specifically designed to eliminate the massive impedance mismatch between continuous event streaming and columnar batch storage, acting as the ultimate bridge that allows real-time operational streams to seamlessly merge into the analytical Data Lakehouse.

## The Architecture of Unified Storage

The core architectural brilliance of Apache Fluss lies in its dual-tier, highly hybrid storage mechanism, designed to provide absolute real-time latency while ensuring massive, cheap historical retention.

### 1. The Real-Time Log Tier
When high-velocity streaming data enters Fluss, it is immediately written to a highly optimized, append-only Distributed Log (similar in concept to Kafka's partition structure). This Log Tier is physically housed on ultra-fast SSDs or active memory, ensuring that downstream Flink applications can consume the live events with absolute, sub-millisecond latency to trigger real-time operational alerts or machine learning inference.

### 2. The Lakehouse Tier (Columnar Archiving)
This is where Fluss completely diverges from traditional message queues. 
Kafka was never designed to store petabytes of data forever; retaining massive data in Kafka is catastrophically expensive. 
Apache Fluss possesses a native, automated tiering mechanism. As the data in the Real-Time Log ages, Fluss autonomously and continuously transforms the raw stream into highly compressed, columnar Apache Parquet or Apache Iceberg format. It physically flushes this columnar data directly down into the cheap, massive Amazon S3 Data Lakehouse.

## The Unified Flink Experience

Because Fluss handles the complex transition from row-based streaming to columnar batch storage entirely in the background, it provides a flawless, unified experience for the Data Engineer.

When an engineer writes a Flink SQL query against a Fluss table, they do not need to write two separate pipelines (one for Kafka, one for Iceberg). They simply query the single Fluss table. 
* If the query demands the latest 5 seconds of data, Fluss serves it instantly from the Real-Time Log Tier.
* If the query demands an aggregation of the last 5 years of data, Fluss seamlessly executes the scan against the heavily compressed columnar data sitting in S3.
The storage medium is completely abstracted, allowing Flink to execute flawless unified batch and streaming analytics against a single, coherent architectural endpoint.

## Summary of Technical Value

Apache Fluss represents the massive architectural convergence of event streaming and the Open Data Lakehouse. By providing a highly intelligent, dual-tier storage engine that natively captures sub-millisecond events in a distributed log while autonomously archiving historical data into optimized columnar formats, Fluss empowers data engineering teams to execute completely unified, highly performant real-time and historical analytics without the catastrophic complexity of managing disparate storage systems.

## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
