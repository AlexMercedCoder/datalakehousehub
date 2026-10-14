---
title: "What is Real-time Analytics?"
meta_title: "What is Real-time Analytics? | Data Lakehouse Hub Knowledge Base"
description: "Real-time analytics means ingesting, processing, and querying data as it is generated. See how Kafka, Flink, real-time OLAP stores, and Apache Iceberg fit in."
---

# What is Real-time Analytics?

## Introduction to Real-time Analytics

For decades, business intelligence was mostly retrospective. Because ETL (Extract, Transform, Load) jobs put heavy load on operational databases, they usually ran in overnight batch windows. When an executive opened a dashboard on Tuesday morning, they were analyzing data that ended on Monday night. 

In the modern digital economy, analyzing yesterday's data is often too late. 
*   If a credit card is stolen, the bank needs to detect the anomaly and block the transaction while it is being authorized, not tomorrow morning.
*   If a product suddenly trends on social media, the supply chain system needs to detect the spike and reroute inventory quickly, before the item sells out.

**Real-time Analytics** (often synonymous with Streaming Analytics) is the ability to ingest, process, and query data within seconds or less of when it is generated, so automated systems and people can act on it right away.

## The Architecture of Real-Time Systems

Sub-second analytics is hard to achieve with traditional batch-oriented data warehouses. It usually requires a specialized architecture built on three main pieces.

### 1. The Message Broker (The Nervous System)
Real-time architectures usually do not use a traditional database as the point of ingestion. Instead, operational applications push events directly into a high-throughput message broker like **[Apache Kafka](https://datalakehousehub.com/knowledgebase/apache-kafka/)** or **Amazon Kinesis**. 
When a user clicks a button, an event (often JSON) is appended to a Kafka topic. Kafka acts as a durable buffer, and a properly sized cluster can absorb very high event rates.

### 2. The Stream Processing Engine (The Muscle)
Instead of waiting for data to land on a hard drive, stream processing engines (like **[Apache Flink](https://datalakehousehub.com/knowledgebase/apache-flink/)**, **Spark Structured Streaming**, or **Kafka Streams**) process the data as it flows, without waiting for a batch to land.
These engines perform continuous, stateful calculations, keeping state in memory or in a local state store. If the goal is to calculate "Total Sales in the Last 5 Minutes," Flink maintains a rolling time-window in memory. Each time a new purchase arrives from Kafka, Flink updates the total and can emit the new result. 

### 3. The Real-Time OLAP Database (The Brain)
While Flink is processing the stream, the data must be stored somewhere so a dashboard can query it. Batch-oriented data warehouses were not designed for very high rates of small writes with sub-second query freshness, although many now offer streaming ingestion features.
For the lowest latency, teams use specialized **Real-Time OLAP Databases** (like **[Apache Druid](https://datalakehousehub.com/knowledgebase/apache-druid/)**, **[ClickHouse](https://iceberglakehouse.com/iceberg/clickhouse/)**, or **Apache Pinot**). These databases are designed to ingest high event volumes directly from Kafka and make them queryable via SQL with low latency.

## Real-Time in the Lakehouse

Historically, building a real-time system meant building a separate data stack alongside the Data Lake. This "[Lambda Architecture](https://datalakehousehub.com/knowledgebase/lambda-architecture/)" forced engineers to write two different sets of code (one for streaming, one for batch).

The **[Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/)** is narrowing this gap. 
With the introduction of [Open Table Formats](https://opendatalakehouse.com/kb/open-table-formats/) like **[Apache Iceberg](https://iceberglakehouse.com/iceberg/iceberg-catalog/)**, which support frequent commits and Merge-on-Read (MoR) updates, organizations can stream data from Kafka into tables on [Amazon S3](https://datalakehousehub.com/knowledgebase/amazon-s3/), with commit intervals commonly in the range of a minute to several minutes. 
While this isn't the "sub-second" latency required for autonomous fraud detection, it provides "near real-time" analytics for human dashboards. It allows the business to monitor sales trends throughout the day using standard BI tools, which can remove the need for a separate real-time OLAP database for many dashboard use cases.

## Conclusion

Real-time analytics represents the shift from a reactive business posture to a proactive one. While sub-second streaming pipelines add engineering complexity and infrastructure cost, the value of fast insight, whether for dynamic pricing, cybersecurity, or personalized recommendations, often justifies the investment. As Lakehouse architectures mature, the barrier to entry for near real-time insights is dropping, and continuously updated data is becoming a normal expectation for enterprise data platforms.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
