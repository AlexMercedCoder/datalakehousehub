---
title: "What is Apache Pinot?"
meta_title: "What is Apache Pinot? | Expert Data Lakehouse Architecture Guide"
description: "Apache Pinot is an open-source real-time distributed OLAP datastore for high-concurrency, user-facing analytics, using star-tree indexes and real-time tables."
---

# What is Apache Pinot?

Apache Pinot is a distributed, real-time OLAP (Online Analytical Processing) datastore designed for "user-facing analytics." Originally developed at LinkedIn, where it powered features such as "Who Viewed Your Profile," Pinot was built to run analytical SQL queries over continuously streaming data for large numbers of concurrent users with low latency.

Cloud data warehouses (like Snowflake) and lakehouse engines (like Trino) are powerful, but they are mainly designed for internal business intelligence, where a limited number of analysts run heavy queries. Exposing such an engine directly to millions of end users, each loading a personal dashboard, creates a very different workload: very high query concurrency with strict latency expectations.
Apache Pinot is designed for that workload. It targets high query throughput with low, predictable latency for each query.

## The Architecture of High Concurrency

To combine analytical queries with web-scale concurrency, Pinot relies heavily on pre-computation and indexing rather than on large scans.

### 1. The Star-Tree Index (Pre-Aggregation)
A distinctive part of Pinot's architecture is the Star-Tree Index.
In a traditional database, running `SELECT SUM(Revenue) FROM Sales GROUP BY Country, Device_Type` requires scanning many rows.
With a Star-Tree Index, Pinot pre-aggregates configured metrics (such as sums and counts) across a configured set of dimensions when segments are built. At query time, matching queries read from these pre-aggregated nodes instead of scanning raw rows. The index lets engineers trade extra storage for predictable query latency.

### 2. Real-Time and Offline Tables
Pinot separates continuous ingestion from historical storage.
* **Real-Time Tables:** Servers consume directly from streams such as Apache Kafka. Recent data sits in in-memory "consuming segments," so dashboards can show fresh metrics.
* **Offline Tables:** Batch-built segments (or completed real-time segments moved by background tasks) hold historical data.
When a query hits a hybrid table, the Pinot Broker splits it at a time boundary, sends parts to the real-time and offline servers, merges the results, and returns a single answer.

## The Pluggable Indexing Options

Pinot does not rely on a single indexing strategy. It gives data engineers a range of indexes to tune performance for specific query patterns.
* **Inverted Indexes:** Used for fast filtering on discrete values (for example, `WHERE status = 'Active'`).
* **Text Indexes:** Based on Apache Lucene, enabling full-text search over log and text data.
* **Geospatial Indexes:** Based on Uber's H3 grid system, speeding up location queries over GPS coordinates.

## Summary of Technical Value

Apache Pinot is a leading option for user-facing analytics. By combining pre-aggregation structures like the Star-Tree Index with real-time stream ingestion and historical segments, Pinot lets organizations expose analytical dashboards over large datasets to many concurrent external users with low latency.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
