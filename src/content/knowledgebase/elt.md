---
title: "What is ELT?"
meta_title: "What is ELT? | Expert Data Lakehouse Architecture Guide"
description: "ELT (Extract, Load, Transform) loads raw data into a warehouse or lakehouse first and transforms it there with SQL tools like dbt, using elastic cloud compute."
---

# What is ELT?

ELT stands for Extract, Load, and Transform. It is a common approach to data integration today, reversing the order of the traditional ETL (Extract, Transform, Load) pattern. Driven by the scalable compute and decoupled storage of cloud platforms, ELT allows organizations to load raw, untransformed data directly into their central [Data Lakehouse](/data-lakehouse/) or Cloud Data Warehouse, running the transformations only *after* the data has landed in the target destination.

In the legacy ETL model, data passed through an intermediate, resource-limited transformation server. If the pipeline failed during transformation, the extraction often had to be restarted from the source database. ELT removes this bottleneck. By landing the raw data first in scalable cloud storage, it preserves the raw data and uses the elastic compute of the cloud platform to handle the transformations.

## The Architecture of ELT

The ELT architecture relies on the separation of storage and compute, taking advantage of the fact that cloud storage is inexpensive and cloud compute scales on demand.

### 1. Extract and Load (The Ingestion Phase)
Modern ingestion platforms (like Fivetran, Airbyte, or dlt) largely automate the first two steps. 

The pipeline extracts raw data from many operational systems (Salesforce, Zendesk, PostgreSQL) and loads it as it is (raw, messy, and often nested) directly into the Bronze layer of the Data Lakehouse (often as [Apache Iceberg](/apache-iceberg/) or Delta Lake tables) or raw schemas in Snowflake. There is little intermediate processing or structural mapping in transit. The priority is to land the data in the cloud reliably and quickly.

### 2. Transform (The In-Database Processing Phase)
Once the raw data is in the cloud platform, the transformation phase runs inside the destination platform.

This shift helped give rise to Analytics Engineering and tools like dbt (Data Build Tool). Instead of building proprietary drag-and-drop logic on an external integration server, data engineers and analysts write standard SQL. 

They configure dbt to run SQL models against the raw Bronze tables. The Cloud Data Warehouse (or the Lakehouse query engine like Trino or Dremio) runs the work on distributed compute. It executes the joins, flattens the nested JSON, calculates the business metrics, and writes the clean data to the Silver and Gold tiers. Because the transformation happens inside the engine, it benefits from optimizations like Vectorized Execution and Broadcast Hash Joins, and it can process terabytes of data much faster than a single external server.

## The Advantages of the ELT Paradigm

The shift to ELT changed how quickly data teams can work.

* **Raw Data Preservation:** Because data is loaded into the warehouse before it is transformed, the raw history is preserved. If a data engineer introduces a serious bug into the SQL transformation logic, the raw data is unaffected. The engineer fixes the SQL bug and re-runs the transformation, rebuilding the clean tables from the raw history.
* **Reduced Engineering Bottleneck:** In the ETL era, mostly specialized data engineers who knew Java or proprietary integration tools built pipelines. In the ELT era, analysts who know SQL can use dbt to transform the raw data in the warehouse, opening the analytics workflow to more people.
* **Elastic Scalability:** Data transformation is no longer bound by the hardware limits of a single integration server. If an organization needs to transform a very large dataset by tomorrow morning, it can run a large compute cluster for the duration of the job and then shut it down, paying only for the compute it used.

## Summary of Technical Value

ELT changed enterprise data integration by treating the Cloud Data Warehouse (and the modern Lakehouse) as the central engine for both storage and computation. By replacing intermediate transformation servers with fast, raw ingestion and in-platform SQL transformations, ELT preserves raw data, scales with the platform, and lets teams iterate faster.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
