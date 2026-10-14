---
title: "What is the Medallion Architecture?"
meta_title: "What is the Medallion Architecture? | Expert Data Lakehouse Guide"
description: "The medallion architecture is a design pattern that refines lakehouse data through Bronze, Silver, and Gold tiers, built on table formats like Apache Iceberg."
---

# What is the Medallion Architecture?

The Medallion Architecture is a design pattern used to organize data within a [Data Lakehouse](/data-lakehouse/). Popularized by Databricks, it provides a simple framework for managing data as it is ingested, cleaned, and refined for business consumption.

In the early days of big data, many organizations loaded raw JSON and CSV files into large cloud buckets. Because there was no logical separation between raw, messy data and clean, analytical data, business analysts queried the wrong files, dashboards broke, and the data lake turned into a hard-to-manage "data swamp." The Medallion Architecture addresses this by separating the data lifecycle into three progressively refined tiers: Bronze, Silver, and Gold.

## The Three Tiers of Refinement

The architecture is built on the principle that raw data should be preserved. Data progresses through separate stages, so the original records stay available while refined data is exposed to consumers.

### 1. The Bronze Tier (Raw Data)
The Bronze layer is the ingestion point of the data lakehouse. It stores data as it arrives from the source systems (like external REST APIs, Apache Kafka streams, or operational PostgreSQL databases).

The main rule of the Bronze layer is to keep data close to its original form. Data is generally appended rather than transformed or filtered. If an external API returns a deeply nested, poorly formatted JSON blob full of NULL values, it is stored in the Bronze layer in that state. If a downstream transformation pipeline contains a bug, the data engineering team can rebuild the affected downstream tables from the historical record retained in the Bronze tier.

### 2. The Silver Tier (Cleansed & Conformed Data)
The Silver layer is the cleaned and conformed view of the organization's data. Data engineering pipelines (often built with dbt or Apache Spark) read the raw data from the Bronze tier and apply structural transformations.

In the Silver layer, JSON blobs are flattened into relational columns. Dates are converted into a standard format (e.g., UTC). Duplicate records are merged, and invalid data (like negative ages) is quarantined. The Silver layer also provides an "enterprise view" of key entities. It joins operational tables together to create a single `Customers` table or a unified `Orders` table. Data scientists often use the Silver layer to train machine learning models because the data is clean, comprehensive, and granular.

### 3. The Gold Tier (Business-Ready Aggregations)
The Gold layer is the presentation-ready tier. It is built for business intelligence (BI) tools (like Tableau, Power BI, or Apache Superset) and executive dashboards.

While the Silver layer contains individual transactions, business users rarely need to see individual receipts. They need aggregated metrics. Pipelines read from the Silver layer and compute aggregations (e.g., "Total Monthly Recurring Revenue by Region"). Gold tables are often modeled as star schemas, sorted and partitioned for common query patterns, and secured with role-based access controls (RBAC). Business analysts query the Gold layer, which gives them faster responses and consistent metric definitions across the organization.

## Implementing with Open Table Formats

The Medallion Architecture is a logical concept, but it is physically implemented using open table formats like [Apache Iceberg](/apache-iceberg/), Apache Hudi, or Delta Lake.

These formats matter because they provide the ACID transactional guarantees needed to move data safely between the tiers. When a micro-batch pipeline processes new raw events in the Bronze tier and updates the aggregated Gold table, the table format makes each commit atomic. If the pipeline crashes halfway through the Gold update, the commit never completes and readers keep seeing the previous snapshot, so a dashboard does not show partial results.

## Summary of Technical Value

The Medallion Architecture brings engineering discipline to the data lakehouse. By separating data into raw history (Bronze), validated enterprise data (Silver), and business aggregations (Gold), it improves data reliability. It lets data engineers, data scientists, and business analysts work on the same platform while each group uses the tier that fits its needs.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
