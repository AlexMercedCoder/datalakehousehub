---
title: "What is Data Ingestion?"
meta_title: "What is Data Ingestion? | Expert Data Lakehouse Architecture Guide"
description: "Data ingestion is the process of extracting data from sources like databases, APIs, and logs and loading it into a lakehouse, by batch or real-time streaming."
---

# What is Data Ingestion?

Data Ingestion is the first phase of the data engineering lifecycle. It is the process of extracting raw data from many different source systems (such as operational databases, third-party SaaS APIs, and live web server logs) and securely moving that data into a centralized storage environment, typically the raw Bronze layer of an Open [Data Lakehouse](/knowledgebase/data-lakehouse/) or Cloud Data Warehouse.

Without reliable data ingestion, everything downstream suffers. A machine learning model or an executive dashboard is of little use if the ingestion pipeline drops transactional data or falls far behind. The primary challenge of Data Ingestion is dealing with external, fragile source systems, often across the public internet.

## The Two Approaches to Ingestion

Data engineering teams architect ingestion pipelines using two strategies, chosen mainly by the latency requirements of the business.

### 1. Batch Ingestion
Batch Ingestion is the historical standard and remains the backbone of most enterprise data. In a batch architecture, the data pipeline wakes up at a specific, scheduled interval (e.g., every night at midnight, or every hour). It connects to the source system, extracts the records for that interval in one large sweep, and writes them to the Lakehouse.

Batch ingestion is efficient, easy to validate, and consumes little sustained compute. However, it means data is stale between runs. If the CEO looks at the dashboard at 4:00 PM, they are viewing data that is 16 hours old.

### 2. Streaming (Real-Time) Ingestion
Streaming Ingestion reduces latency to seconds or less. Instead of running on a schedule, the pipeline maintains a continuous, persistent connection to the source system (often utilizing tools like Apache Kafka or AWS Kinesis). When a customer clicks a button on the website, that individual event is captured, pushed through the streaming pipeline, and landed in the Data Lakehouse shortly after. 

While streaming provides near real-time visibility, it is more complex to engineer, requiring distributed state management and continuous compute resources to ensure data is not duplicated during network outages.

## The Challenges of the Extraction Layer

Pulling data out of a source system carries real risks.

* **API Rate Limiting:** If an engineer writes a script to extract customer data from the Salesforce API, Salesforce enforces API limits on that connection. If the script requests too much data too quickly, Salesforce rejects further requests, which can fail the ingestion pipeline. Engineers build "Backoff and Retry" logic into the ingestion script to handle this throttling.
* **Database Contention:** If an engineer runs a large `SELECT *` query against the live PostgreSQL database powering the main website to extract the daily sales, that query consumes significant CPU resources. It can slow the live website, directly affecting customers. To address this, many ingestion pipelines use Change Data Capture (CDC), reading the low-level transaction log of the database rather than querying the tables directly, which keeps the impact on live operations low.

## Summary of Technical Value

Data Ingestion is the logistics layer of the modern data stack. By handling API rate limits, managing network throughput, and combining historical batch loads with low-latency streams, reliable ingestion pipelines keep the central Data Lakehouse supplied with complete, accurate business data.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
