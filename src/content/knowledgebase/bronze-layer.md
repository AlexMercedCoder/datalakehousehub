---
canonical: "https://opendatalakehouse.com/kb/bronze-layer/"
title: "What is Bronze Layer?"
meta_title: "What is Bronze Layer? | Expert Data Lakehouse & AI Glossary"
description: "The bronze layer is the raw landing zone of a medallion architecture, holding data as ingested from sources. See how it feeds silver and gold lakehouse tables."
---

## What is Bronze Layer?

The first layer of a medallion architecture, holding raw data as it was ingested from source systems.

The **Bronze Layer** is the landing zone of the medallion architecture, a pattern popularized by Databricks that organizes lakehouse tables into Bronze (raw), Silver (cleaned and conformed), and Gold (business-ready) layers. Bronze tables keep source data close to its original form, with minimal changes, so downstream layers can always be rebuilt from it. In an open lakehouse, Bronze tables are often stored as Apache Iceberg or Delta Lake tables on object storage.

## Core Architecture and Mechanics

To understand how the Bronze Layer works in practice, it helps to look at its core behaviors:

* **Captures data as it arrives from source systems.** Batch loads, CDC streams, and API extracts land in Bronze with little or no transformation, preserving the original values.
* **Adds ingestion metadata.** Teams commonly add columns such as load timestamp, source file name, or batch ID so every record can be traced back to where it came from.
* **Keeps history for reprocessing.** Because Bronze is typically append-only, engineers can replay it to rebuild Silver and Gold tables when business logic changes or a bug is fixed.

Bronze tables are often stored in [Apache Iceberg](/apache-iceberg/), and tools like dbt typically read from Bronze to build the Silver and Gold layers.

## Why Bronze Layer Matters in the Modern Data Stack

A clear layering pattern helps keep the data lake from turning into a "data swamp," because users know which layer holds raw data and which holds validated, business-ready data.

For data teams, a well-kept Bronze layer separates ingestion from transformation. Ingestion jobs only need to land data reliably, and transformation logic can change without re-extracting data from source systems. Because Bronze holds raw and possibly sensitive data, access to it is usually limited to data engineers.

### Key Benefits
- **Reprocessing:** Raw history lets teams rebuild downstream tables after logic changes.
- **Vendor Neutrality:** When stored in open table formats, Bronze data can be read by many engines.
- **Lineage and Auditability:** Ingestion metadata makes it possible to trace each record back to its source.

## Frequently Asked Questions

### What is the Medallion Architecture?
It is a logical layout dividing the lakehouse into Bronze (raw), Silver (cleansed), and Gold (business-ready) tables. Each layer improves data quality and structure for its consumers.

### What are Slowly Changing Dimensions?
SCDs are modeling techniques used to keep historical versions of a record (like an employee's previous job titles) rather than overwriting old values. They are usually implemented in the Silver or Gold layer, using change history captured in Bronze.

### How does Bronze Layer impact data governance and security?
Bronze tables often contain raw PII and unvalidated data, so they are usually restricted with role-based access controls (RBAC), and most users query curated Silver and Gold tables instead.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
