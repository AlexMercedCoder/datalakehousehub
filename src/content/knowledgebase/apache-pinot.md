---
title: "What is Apache Pinot?"
meta_title: "What is Apache Pinot? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Apache Pinot. Learn how this massive real-time distributed OLAP datastore powers extreme-concurrency user-facing analytics."
---

# What is Apache Pinot?

Apache Pinot is a massive, incredibly specialized, highly distributed real-time OLAP (Online Analytical Processing) datastore engineered specifically to solve the catastrophic performance challenges of "User-Facing Analytics." Originally developed at LinkedIn to power the "Who Viewed Your Profile" feature, Pinot was explicitly architected to execute highly complex analytical SQL queries over massive, constantly streaming datasets, and critically, it must do so for tens of thousands of concurrent human users simultaneously, in absolute sub-second latency.

Traditional Cloud Data Warehouses (like Snowflake) and Lakehouse engines (like Trino) are phenomenally powerful, but they are architected for internal Business Intelligence. If 50 data scientists execute a massive query, Trino handles it flawlessly. But if LinkedIn exposed Trino directly to the public internet, allowing 10 million normal users to load their profile dashboards simultaneously, the massive concurrency would instantly melt the architecture. 
Apache Pinot is explicitly designed for extreme concurrency. It physically assumes that 100,000 queries will hit the system every single second, and it guarantees that every single one of those queries returns a result in milliseconds.

## The Architecture of Extreme Concurrency

To achieve this impossible blend of analytical depth and web-scale concurrency, Pinot completely abandons generalized database mechanics in favor of brutal, hyper-aggressive pre-computation and indexing.

### 1. The Star-Tree Index (Pre-Aggregation)
The absolute crown jewel of Pinot’s architecture is the Star-Tree Index. 
In a traditional database, executing `SELECT SUM(Revenue) FROM Sales GROUP BY Country, Device_Type` requires the CPU to physically scan millions of rows. 
Pinot refuses to scan. When the data is ingested, Pinot automatically generates a massive, complex mathematical tree (the Star-Tree) that physically pre-computes the sums, counts, and averages for every possible combination of dimensions. When the 100,000 concurrent users hit the dashboard, the queries completely bypass raw data scanning. They hit the exact pre-computed node on the Star-Tree and return the answer in one millisecond, completely saving the CPU from catastrophic burnout.

### 2. Real-Time and Offline Isolation
Pinot physically splits its architecture to handle continuous data ingestion safely.
* **The Real-Time Nodes:** These nodes connect directly to Apache Kafka. They ingest massive streams of live data, keeping it in active memory to ensure the dashboards display real-time metrics.
* **The Offline Nodes:** Periodically, the real-time data is compressed into highly optimized "Segments" and pushed down to the massive Offline Nodes for deep historical storage.
When a user executes a query, the Pinot Broker intelligently shatters the query, hits both the live RAM and the historical disks simultaneously, merges the result, and returns a perfectly accurate, real-time aggregation.

## The Pluggable Indexing Arsenal

Pinot does not rely on a single indexing strategy. It provides data engineers with a massive, highly specific arsenal of indexes to tune the database to absolute perfection.
* **Inverted Indexes:** Used for instant filtering of discrete values (e.g., `WHERE status = 'Active'`).
* **Text Indexes:** Powered by Apache Lucene, enabling instant, Google-like text search across massive log data.
* **Geospatial Indexes:** Powered by H3, enabling instant calculation of GPS coordinates (used heavily by Uber for live driver tracking).

## Summary of Technical Value

Apache Pinot is the absolute definitive architecture for user-facing analytics. By utilizing aggressive pre-aggregation structures like the Star-Tree Index and physically isolating real-time stream ingestion from massive historical querying, Pinot guarantees that organizations can safely expose highly complex, multi-terabyte analytical dashboards directly to millions of concurrent public consumers with flawless, guaranteed sub-second latency.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse), read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
