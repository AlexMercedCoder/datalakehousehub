---
title: "What is the Medallion Architecture?"
meta_title: "What is the Medallion Architecture? | Expert Data Lakehouse Guide"
description: "A comprehensive guide to the Medallion Architecture. Learn about organizing data lakehouses into Bronze, Silver, and Gold tiers for scalable analytics."
---

# What is the Medallion Architecture?

The Medallion Architecture is a highly structured, logical design pattern used to logically organize data within a Data Lakehouse. Coined originally by Databricks, it provides a simple but profoundly effective framework for managing the flow of data as it is ingested, cleaned, and refined for business consumption.

In the early days of big data, organizations simply dumped petabytes of raw, chaotic JSON and CSV files into a massive cloud bucket. Because there was no logical separation between the raw, messy data and the clean, analytical data, business analysts queried the wrong files, dashboards crashed, and the data lake inevitably devolved into an unmanageable "data swamp." The Medallion Architecture completely solves this by strictly separating the data lifecycle into three distinct, progressively refined tiers: Bronze, Silver, and Gold.

## The Three Tiers of Refinement

The architecture is built upon the foundational principle that data should never be overwritten. It should progress sequentially through independent stages, ensuring that raw data is always preserved while refined data is securely exposed.

### 1. The Bronze Tier (Raw Data)
The Bronze layer is the absolute ingestion point of the data lakehouse. It stores data exactly as it arrives from the operational source systems (like external REST APIs, Apache Kafka streams, or operational PostgreSQL databases). 

The cardinal rule of the Bronze layer is immutability. Data is never transformed, filtered, or altered here. It is simply appended. If an external API returns a deeply nested, poorly formatted JSON blob full of NULL values, it is stored in the Bronze layer exactly in that chaotic state. This guarantees that if a downstream transformation pipeline contains a critical bug, the data engineering team can completely delete the corrupted downstream tables and recompute everything from scratch using the pristine, untouched historical record permanently preserved in the Bronze tier.

### 2. The Silver Tier (Cleansed & Conformed Data)
The Silver layer is the foundational analytical truth of the organization. Data engineering pipelines (often built with dbt or Apache Spark) read the raw data from the Bronze tier and apply heavy structural transformations.

In the Silver layer, JSON blobs are explicitly flattened into relational columns. Dates are converted into a standardized organizational format (e.g., UTC). Duplicate records are merged, and explicitly invalid data (like negative ages) is quarantined. Crucially, the Silver layer provides an "Enterprise View" of the entities. It joins disparate operational tables together to create a single, highly reliable `Customers` table or a unified `Orders` table. Data Scientists heavily utilize the Silver layer to train machine learning models because the data is clean, comprehensive, and highly granular.

### 3. The Gold Tier (Business-Ready Aggregations)
The Gold layer is the highly restricted, presentation-ready tier. It is built explicitly for the Business Intelligence (BI) tools (like Tableau, PowerBI, or Apache Superset) and executive dashboards.

While the Silver layer contains millions of highly granular individual transactions, business users rarely need to see individual receipts. They need highly aggregated metrics. Pipelines read from the Silver layer and execute massive mathematical aggregations (e.g., calculating the "Total Monthly Recurring Revenue by Region"). The Gold tables are heavily indexed, explicitly modeled using Star Schemas, and secured using strict Role-Based Access Controls (RBAC). Business analysts query the Gold layer exclusively, guaranteeing sub-second response times and mathematically consistent reporting across the entire enterprise.

## Implementing with Open Table Formats

The Medallion Architecture is an abstract logical concept, but it is physically implemented using Open Table Formats like Apache Iceberg, Apache Hudi, or Delta Lake.

These formats are absolutely critical because they provide the ACID transactional guarantees required to move data safely between the tiers. When a micro-batch streaming pipeline processes 10,000 new raw events in the Bronze tier and updates the aggregated Gold table, the open table format guarantees that the transaction is atomic. If the pipeline crashes halfway through the Gold update, the transaction rolls back instantly, ensuring that a CEO never opens a dashboard to see partial, corrupted metrics.

## Summary of Technical Value

The Medallion Architecture enforces strict engineering discipline upon the otherwise chaotic environment of the data lakehouse. By explicitly segmenting data into immutable raw history (Bronze), structurally validated enterprise truth (Silver), and highly optimized business aggregations (Gold), it guarantees data reliability. It empowers data engineers, data scientists, and business analysts to operate simultaneously on the exact same physical platform without ever interfering with one another's distinct analytical requirements.


## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
