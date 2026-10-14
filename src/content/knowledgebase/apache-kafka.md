---
title: "What is Apache Kafka?"
meta_title: "What is Apache Kafka? | Expert Data Lakehouse Architecture Guide"
description: "Apache Kafka is an open-source distributed event streaming platform built on producers, brokers, consumers, topics, and partitions, often feeding a lakehouse."
---

# What is Apache Kafka?

Apache Kafka is an open-source, distributed event streaming platform used to handle high-throughput streams of data in real time. Originally developed at LinkedIn to manage large volumes of activity data such as user clickstreams, and later donated to the Apache Software Foundation, Kafka changed how many organizations integrate microservices, aggregate logs, and ingest raw data into their Data Lakehouses.

Historically, if a company had dozens of applications that needed to exchange data, they built point-to-point connections. Application A wrote a custom script to send data directly to Application B. As the company grew, these connections turned into a hard-to-manage "spaghetti architecture." If Application B was down, Application A's data could be lost. Kafka replaces much of this with a durable, central event backbone that many systems can write to and read from.

## The Core Architecture

Kafka does not function like a traditional database. It uses a decoupled Publish/Subscribe (Pub/Sub) model built on an append-only log.

### Producers, Consumers, and Brokers
The architecture relies on three primary components:
1. **Producers:** These are the upstream systems generating the data. A web server emitting click events, or a CDC tool streaming changes from a PostgreSQL database, acts as a Producer. It writes events to Kafka and does not need to know who will read them.
2. **Brokers (The Cluster):** A Kafka cluster consists of servers called Brokers. Brokers receive events from Producers, append them sequentially to log files on disk, and replicate them to other brokers for fault tolerance.
3. **Consumers:** These are the downstream engines or microservices. An Apache Spark or Flink job that reads events and writes them into the [Data Lakehouse](/data-lakehouse/) acts as a Consumer. It pulls data from Kafka at its own pace.

### Topics and Partitions
Kafka organizes events into named categories called Topics (for example, `user_clicks`).

To scale, Kafka splits each Topic into multiple Partitions and distributes them across Brokers. Producers typically assign events to partitions by hashing a key (often something like `user_id`), which keeps events for the same key in order within one partition. Because each partition can be read by a different consumer in a consumer group, a topic with 50 partitions can be processed by up to 50 consumers in parallel, and throughput scales by adding partitions and brokers.

## Persistence and Decoupling

A key difference between Apache Kafka and traditional message queues is persistence.

In a traditional message queue, a message is typically removed once a consumer acknowledges it.
Kafka does not delete messages when they are read. It keeps them on disk for a configurable retention period (for example, 7 days, or indefinitely), and consumers track their own position.

This enables strong decoupling. If the downstream Lakehouse ingestion job is offline for three days, the web servers keep producing events into Kafka as usual. When the job recovers, it resumes from its committed "Offset" (its bookmark) and works through the backlog, so as long as the outage is shorter than the retention period, no events are lost.

## Summary of Technical Value

Apache Kafka is a common ingestion layer for real-time data. By acting as a persistent, distributed buffer, it decouples upstream operational systems from downstream analytical platforms like the data lakehouse. It lets organizations process very high volumes of events reliably, replacing tangled point-to-point integrations with a shared, high-throughput event backbone.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
