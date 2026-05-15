---
title: "What is ELT?"
meta_title: "What is ELT? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to ELT (Extract, Load, Transform). Learn how cloud data warehouses and dbt revolutionized data integration and transformation."
---

# What is ELT?

ELT stands for Extract, Load, and Transform. It is the modern architectural standard for data integration, completely reversing the traditional ETL (Extract, Transform, Load) paradigm. Driven by the immense compute power and decoupled storage of cloud platforms, ELT allows organizations to load raw, entirely untransformed data directly into their central [Data Lakehouse](/data-lakehouse) or Cloud Data Warehouse, executing the complex mathematical transformations only *after* the data is safely secured in the target destination.

In the legacy ETL model, data was forced through an intermediate, highly constrained transformation server. If the pipeline failed during transformation, the raw data was lost, and the entire extraction process had to be restarted from the source database. ELT completely destroys this bottleneck. By pushing the raw data immediately to the highly scalable cloud storage layer, it guarantees data preservation and leverages the infinite, elastic compute power of the modern data stack to handle the transformations.

## The Architecture of ELT

The ELT architecture relies entirely on the separation of storage and compute, capitalizing on the reality that cloud storage is virtually free, and cloud compute is infinitely scalable on demand.

### 1. Extract and Load (The Ingestion Phase)
Modern ingestion platforms (like Fivetran, Airbyte, or dlt) handle the first two steps almost entirely automatically. 

The pipeline extracts raw data from hundreds of disparate operational systems (Salesforce, Zendesk, PostgreSQL) and loads it exactly as it is—raw, messy, and deeply nested—directly into the Bronze layer of the Data Lakehouse (often as [Apache Iceberg](/apache-iceberg) or Delta Lake tables) or raw schema schemas in Snowflake. There is no intermediate processing, no complex structural mapping, and no quarantine layers during the transit phase. The absolute priority is to securely land the data in the cloud as quickly as possible.

### 2. Transform (The In-Database Processing Phase)
Once the raw data rests securely in the cloud platform, the transformation phase begins natively inside the destination database.

This paradigm shift sparked the creation of Analytics Engineering and tools like dbt (Data Build Tool). Instead of writing complex, proprietary drag-and-drop logic on an external integration server, data engineers and analysts write standard SQL. 

They configure dbt to execute massive SQL queries directly against the raw Bronze tables. The Cloud Data Warehouse (or the Lakehouse query engine like Trino or Dremio) spins up massive, distributed compute clusters dynamically. It executes the complex joins, flattens the nested JSON, calculates the business metrics, and writes the clean data to the Silver and Gold tiers. Because the transformation happens natively inside the engine, it leverages aggressive optimizations like Vectorized Execution and Broadcast Hash Joins, processing terabytes of data exponentially faster than an external server ever could.

## The Advantages of the ELT Paradigm

The shift to ELT fundamentally altered the speed and agility of data teams.

* **Raw Data Preservation:** Because data is loaded into the warehouse before it is transformed, the raw, historical truth is permanently preserved. If a data engineer introduces a catastrophic bug into the SQL transformation logic, the raw data is completely unharmed. The engineer simply fixes the SQL bug and re-runs the transformation, instantly rebuilding the clean tables from the pristine raw history.
* **Elimination of the Engineering Bottleneck:** In the ETL era, only highly specialized data engineers who understood complex Java code or proprietary integration tools could build pipelines. In the ELT era, anyone who knows basic SQL can use dbt to transform the raw data residing in the warehouse, radically democratizing the analytics workflow.
* **Infinite Scalability:** Data transformation is no longer bound by the hardware limitations of a single integration server. If an organization needs to transform ten petabytes of data by tomorrow morning, they simply instruct their cloud provider to spin up a massive 128-node compute cluster for one hour, process the data natively, and instantly spin the cluster down to zero, paying exactly for the compute they utilized.

## Summary of Technical Value

ELT completely revolutionized enterprise data integration by treating the Cloud Data Warehouse (and the modern Lakehouse) as the central engine for both storage and computation. By abandoning intermediate transformation servers in favor of fast, raw ingestion and highly optimized, in-database SQL transformations, ELT guarantees complete data preservation, infinite scalability, and unprecedented organizational agility.


## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
