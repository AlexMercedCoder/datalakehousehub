---
title: "What is Data Warehousing?"
meta_title: "What is Data Warehousing? | Data Lakehouse Hub Knowledge Base"
description: "Their sales are processed in an Oracle database, their website traffic is logged in a MySQL database, and their customer support tickets are managed in Salesforce."
---

# What is Data Warehousing?

## Introduction to Data Warehousing

Imagine a large retail corporation. Their sales are processed in an Oracle database, their website traffic is logged in a MySQL database, and their customer support tickets are managed in Salesforce. 

If the CEO asks, *"Did website traffic impact our customer support volume for shoe sales?"*, answering that question is hard. You cannot easily write a single SQL query that joins an Oracle database, a MySQL database, and a Salesforce API.

The **Data Warehouse (EDW, Enterprise Data Warehouse)** emerged in the late 1980s to solve this problem: IBM researchers Barry Devlin and Paul Murphy described a "business data warehouse" in 1988, and Bill Inmon, often called the father of data warehousing, popularized the concept. It is a central, structured repository designed to consolidate data from disparate operational systems, optimize it, and serve it for complex business intelligence (BI) and analytics.

## The Core Characteristics

A Data Warehouse is different from a standard operational database (OLTP).

1.  **Subject-Oriented**: Data is organized around major business subjects (e.g., Customers, Products, Sales), rather than the messy application logic of the operational databases.
2.  **Integrated**: Data from Oracle, MySQL, and Salesforce is cleaned, standardized, and transformed (via ETL) before it enters the warehouse. (e.g., Ensuring "US", "USA", and "United States" are all standardized to "US").
3.  **Time-Variant**: Operational databases usually focus on the present. If a customer changes their address today, the old address is often overwritten. A Data Warehouse keeps history; it stores a record of changes over time, allowing analysts to query the business as it looked years ago.
4.  **Non-Volatile**: Data in a warehouse is generally read-only for end-users. It is optimized for large, complex read queries (OLAP - Online Analytical Processing), not for single-row updates.

## The Evolution of the Data Warehouse

### Generation 1: On-Premises Appliances (1990s - 2010s)
Early data warehouses (Teradata, Oracle Exadata) were physical hardware appliances. They were fast but rigid. They tightly coupled storage and compute. If you ran out of disk space, you had to buy expensive additional hardware that also included CPUs you didn't need. 

### Generation 2: The Cloud Data Warehouse (2010s)
Services like **Snowflake**, **Amazon Redshift**, and **Google BigQuery** changed the market. They moved the warehouse to the cloud, and most of them **Decoupled Compute from Storage** (Redshift added this later with RA3 nodes and Serverless). Organizations could store petabytes of data on low-cost cloud storage and spin up compute only for the time needed to run a heavy query.

### Generation 3: The Threat of the Lakehouse (2020s)
While Cloud Data Warehouses work well for structured BI, they are less suited to unstructured AI data (images, text) and have traditionally stored data in proprietary, vendor-specific formats. This has led to the rise of the **Open [Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/)** ([Apache Iceberg](https://iceberglakehouse.com/iceberg/iceberg-catalog/)). Lakehouses provide the high-speed SQL analytics of a Data Warehouse, but store the data in open formats on object storage such as S3, challenging proprietary data warehouses.

## The Architecture: Dimensional Modeling

To achieve fast query speeds on large historical datasets, Data Warehouses often avoid standard operational schemas (like 3rd Normal Form) in their presentation layer. They use **[Dimensional Modeling](https://datalakehousehub.com/knowledgebase/dimensional-modeling/)** (The [Star Schema](https://datalakehousehub.com/knowledgebase/star-schema/)), popularized by Ralph Kimball.

Data is split into two types of tables:
*   **Fact Tables**: The core business events. Large tables containing numbers (e.g., `Sales_Fact`: Date_ID, Store_ID, Product_ID, Revenue=$50).
*   **Dimension Tables**: The descriptive context. Smaller tables containing text (e.g., `Product_Dimension`: Product_ID, Name, Color, Category).

This [Star Schema](https://datalakehousehub.com/knowledgebase/star-schema/) architecture is well suited to analytical databases, allowing BI tools to quickly aggregate millions of rows of revenue while slicing it by any dimension (e.g., Revenue by Color by Year).

## Conclusion

The Data Warehouse is the foundation of enterprise analytics. It turned data from a byproduct of software applications into a curated, easily queryable corporate asset. While modern architectures like the Data Lakehouse are beginning to supersede proprietary warehouses by embracing open storage formats, the core principles of Data Warehousing (consolidation, historical tracking, and dimensional modeling) remain standard practice for business intelligence.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
