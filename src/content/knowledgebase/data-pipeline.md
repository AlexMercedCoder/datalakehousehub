---
title: "What is a Data Pipeline?"
meta_title: "What is a Data Pipeline? | Expert Data Lakehouse Architecture Guide"
description: "A data pipeline is automated software that extracts, transforms, and loads data from sources into a warehouse or lakehouse. Learn each phase and idempotency."
---

# What is a Data Pipeline?

A Data Pipeline is the automated software infrastructure that extracts, transports, transforms, and loads data from many different operational systems into a centralized analytical environment (like a Cloud Data Warehouse or an Open [Data Lakehouse](/knowledgebase/data-lakehouse/)). 

If the Data Lakehouse is the central brain of an enterprise, Data Pipelines are the central nervous system. Without them, the analytical databases are empty and expensive storage. A data pipeline bridges the gap between the normalized OLTP databases powering the live website and the denormalized OLAP databases powering the executive business intelligence dashboards.

## The Architecture of Movement

Data pipelines are generally designed around two patterns: ETL (Extract, Transform, Load) and ELT (Extract, Load, Transform). Regardless of the pattern, a reliable pipeline must execute three phases.

### 1. The Extraction Phase
The pipeline connects to the external source system, such as the Salesforce REST API, a live Apache Kafka event stream, or a legacy on-premises Oracle database. It securely extracts the raw data. 

This phase is often brittle. External APIs impose rate limits, and live operational databases can slow down if the extraction script runs too aggressively. Many pipelines use Change Data Capture (CDC) to read the database's transaction log, extracting only the rows that changed since the last read, which keeps the load on operational systems low.

### 2. The Transformation Phase
Raw extracted data is often inconsistent. Dates might be formatted as `MM/DD/YYYY` in one system and `Unix Epoch Timestamps` in another. Columns might contain null values or corrupted text. 

During transformation, the pipeline applies programmatic logic (often written in Python, Scala, or SQL). It standardizes the timezones, executes multi-table `JOIN` operations, hashes sensitive PII (Personally Identifiable Information) like Social Security Numbers, and restructures loosely structured JSON into clean Star Schemas.

### 3. The Loading Phase
The pipeline executes the final write. It takes the transformed data, compresses it into analytical file formats (like Apache Parquet), and writes it atomically to the final destination (the Data Lakehouse storage layer), committing the new data to the [Apache Iceberg](/knowledgebase/apache-iceberg/) table through its catalog so downstream query engines can see it.

## Resilience and Idempotency

Because data pipelines handle millions of records and connect to external systems across the public internet, they fail regularly. A network outage or a sudden API change can break the pipeline.

To handle these failures, data engineering teams design pipelines to be idempotent. An idempotent pipeline can be rerun from the beginning after a crash without duplicating data or corrupting the downstream database. This is typically achieved using `MERGE INTO` (Upsert) operations and partition overwrites, which removes the "Write-and-Pray" weakness of legacy pipelines.

## Summary of Technical Value

Data Pipelines are the core data movement infrastructure of the modern enterprise. By automating the secure transport and transformation of large volumes of raw data, they are the main mechanism for populating the Data Lakehouse, keeping data science models and executive dashboards supplied with accurate, validated data.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
