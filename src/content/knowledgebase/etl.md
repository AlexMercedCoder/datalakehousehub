---
title: "What is ETL?"
meta_title: "What is ETL? | Expert Data Lakehouse Architecture Guide"
description: "ETL (Extract, Transform, Load) cleans data on a separate server before loading it into a warehouse. Learn its three phases, schema-on-write, and why ELT rose."
---

# What is ETL?

ETL stands for Extract, Transform, and Load. It is the traditional data integration process used for decades to pull messy data from operational systems, clean it, and insert it into a structured central Data Warehouse for business intelligence and reporting.

While the modern data industry has largely shifted toward ELT (Extract, Load, Transform) due to the scalable compute of cloud data warehouses, understanding the ETL architecture is important for understanding the historical evolution of data engineering and why modern Data Lakehouses are designed the way they are.

## The Three Phases of ETL

The architecture of ETL is sequential. Data passes through each phase in order.

### 1. Extract
The pipeline extracts data from varied source systems. This could be a legacy Oracle relational database, a messy CSV file dumped onto an FTP server, or a rigid third-party SOAP API. In legacy environments, this extraction often ran as a large nightly batch process to avoid overloading the source systems during peak business hours.

### 2. Transform (The Bottleneck)
This is the most resource-intensive phase of the traditional architecture. In strict ETL, data is *not* transformed inside the final Data Warehouse. 

Instead, the raw data is pulled into a separate, dedicated integration server (often running proprietary enterprise software like Informatica or IBM DataStage). On this intermediate server, the data is cleaned. Dates are standardized into a uniform format, null values are quarantined, complex calculations (like applying currency conversion rates) are executed, and tables are joined together to build dimensional models (Star Schemas). 

This intermediate transformation server was often an architectural bottleneck. It was expensive, hard to scale horizontally, and required specialized engineers to maintain the proprietary, drag-and-drop transformation logic.

### 3. Load (Schema-on-Write)
Once the data is clean and structurally sound, the pipeline loads it into the final Data Warehouse (like Teradata). 

Traditional ETL enforces a Schema-on-Write approach. The database administrator defines the table structure in the warehouse *before* the data arrives. If the pipeline attempts to load a string into a column defined as an integer, the load fails, and the data is rejected. This protects data quality, but makes the architecture brittle.

## The Decline of Traditional ETL

The ETL architecture dominated the industry for about two decades, but it struggled to scale into the Big Data era.

As organizations began collecting large volumes of semi-structured JSON logs, sensor data, and behavioral tracking events, the intermediate transformation servers could not keep up. They lacked the computational power to process terabytes of data, and the target data warehouses were too rigid and too expensive to store the raw, unrefined data. 

Furthermore, traditional ETL often discarded raw data. If a data engineer applied a filter during the "Transform" phase that accidentally dropped important information, that data was gone from the warehouse. A data scientist looking to train a machine learning model on raw anomalies often could not use the warehouse, because the ETL process had cleaned the anomalies out.

## Summary of Technical Value

ETL (Extract, Transform, Load) established the discipline of data integration, showing that analytical data must be cleaned and structured to provide accurate business intelligence. While intermediate, isolated transformation servers have largely given way to the scalable compute of the modern cloud, the core requirement to extract, clean, and reliably load data remains a central function of data engineering teams.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
