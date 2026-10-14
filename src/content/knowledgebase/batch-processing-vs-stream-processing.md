---
title: "What is Batch Processing vs Stream Processing?"
meta_title: "What is Batch Processing vs Stream Processing? | Data Lakehouse Hub Knowledge Base"
description: "Batch processing handles data in scheduled chunks; stream processing handles each event as it arrives. Compare Spark, Kafka, and Flink, plus Lambda and Kappa."
---

# What is Batch Processing vs Stream Processing?

## Introduction to Data Processing Models

At its core, Data Engineering is the practice of moving data from Point A (a source database) to Point B (an analytical dashboard) and transforming it along the way. There are two main architectural models for this movement: **Batch Processing** and **Stream Processing**.

The choice between these two models shapes the latency of your data (how old the data is when the CEO looks at it), the cost of your cloud infrastructure, and the complexity of your engineering pipelines.

## Batch Processing: Large and Scheduled

**Batch Processing** is the traditional method of handling data. In this model, data is collected, stored, and processed in large chunks (batches) on a predetermined schedule.

### How it Works
Imagine an e-commerce website. Throughout the day, every user purchase is logged into a raw PostgreSQL database. The analytics systems do not touch that data during the day.
At 2:00 AM, an [Apache Spark](https://datalakehousehub.com/knowledgebase/apache-spark/) cluster wakes up. It pulls the entire day's worth of transactions (e.g., 5 million rows), cleans them, aggregates the total revenue, writes the final numbers to an [Apache Iceberg](https://iceberglakehouse.com/iceberg/iceberg-catalog/) table, and then shuts down at 3:00 AM. 

*   **Pros**: Efficient and cost-effective. Because the compute cluster only runs for about an hour a day, you pay for far less compute. It handles large, complex joins across historical data well.
*   **Cons**: **Latency**. If the CEO checks the dashboard at 4:00 PM, they are looking at data that is up to 24 hours old. It is a poor fit for real-time operational decisions.

## Stream Processing: Continuous and Immediate

**Stream Processing** handles data as a continuous flow of events rather than as static tables.

### How it Works
Instead of waiting for 2:00 AM, the e-commerce website pushes each purchase into a message broker like **[Apache Kafka](https://datalakehousehub.com/knowledgebase/apache-kafka/)**. 
A stream processing engine (like **[Apache Flink](https://datalakehousehub.com/knowledgebase/apache-flink/)**) runs continuously. Moments after a user buys a product, Flink receives the event, adds it to a running total held in state, and updates the downstream table or database. 

*   **Pros**: **Low Latency**. Results can be seconds old or less instead of hours. It supports systems (like fraud detection and real-time monitoring) that must react quickly.
*   **Cons**: More expensive and complex. The compute cluster runs around the clock. Handling delayed data, outages, and state management (for example, "windowing" calculations over a 5-minute period) requires specialized engineering.

## The Convergence: The Unified Model

Historically, organizations had to build two separate pipelines (The [Lambda Architecture](https://datalakehousehub.com/knowledgebase/lambda-architecture/)): a Batch pipeline for deep historical analytics, and a Streaming pipeline for real-time alerts.

Modern architectures (The [Kappa Architecture](https://datalakehousehub.com/knowledgebase/kappa-architecture/)) and modern frameworks are converging. 
*   **[Apache Flink](https://datalakehousehub.com/knowledgebase/apache-flink/)** allows engineers to write one set of code that treats batch data simply as a "stream that eventually stops." 
*   **Micro-batching** (used by Spark Structured Streaming) blurs the lines by running small batch jobs at short, configurable intervals (for example, every few seconds).

Ultimately, the choice depends on the business requirement. If you are calculating the quarterly tax report, use Batch. If you are predicting if an Uber driver will arrive in 3 minutes, use Streaming.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
