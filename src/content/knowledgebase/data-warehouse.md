---
canonical: "https://opendatalakehouse.com/kb/data-warehouse/"
title: "What is a Data Warehouse?"
meta_title: "What is a Data Warehouse? | Expert Data Lakehouse Architecture Guide"
description: "A data warehouse is a central, structured store built for analytical SQL queries. See how OLAP, ETL, and cloud warehouses led to the open lakehouse."
---

# What is a Data Warehouse?

A Data Warehouse is a centralized, structured repository designed to store and analyze historical business data. While operational databases (like the MySQL database powering a live e-commerce website) are optimized for executing many small, fast transactions (OLTP), the Data Warehouse is optimized for executing large, complex analytical queries (OLAP) that scan millions of rows to generate business intelligence dashboards and executive reports.

By physically separating analytical workloads from operational workloads, the Data Warehouse keeps a large financial report requested by the CFO from slowing down or crashing the live customer-facing website. It serves as a "Single Source of Truth," so that when different departments ask "What was our total revenue last quarter?", they all receive the same number.

## OLTP versus OLAP Architecture

To understand the architecture of a Data Warehouse, one must contrast it directly with an operational database.

### Online Transaction Processing (OLTP)
Operational databases use OLTP. They are designed to process individual transactions quickly (e.g., a customer adding an item to a cart). They write data using a Row-Oriented format. If a database needs to insert a single customer record containing 50 distinct columns, a row-oriented database writes the entire row contiguously, typically within a single page.

### Online Analytical Processing (OLAP)
Data Warehouses use OLAP. They are designed to process large aggregations. If an analyst wants to calculate the average age of one million customers, an OLAP database uses a Columnar format. It stores all one million ages contiguously on the hard drive. The engine reads only the ages, skipping the other 49 columns, so the aggregation reads far less data and runs much faster than on a row-oriented database.

## The ETL Pipeline and Schema-on-Write

A defining characteristic of a traditional Data Warehouse is its rigidity. Data cannot simply be dumped into the warehouse. It must be structured beforehand.

This is managed through an ETL (Extract, Transform, Load) pipeline. Data is extracted from operational systems, transformed on an intermediate integration server (cleaning NULL values, standardizing dates, applying currency conversions), and finally loaded into the warehouse. 

The warehouse enforces a Schema-on-Write approach. The database administrator must define the columns, data types, and constraints of a table before the data arrives. If the incoming data does not match the predefined schema, the ETL pipeline fails, and the data is rejected. While this rigidity makes the data reliable and fast to query, it makes the architecture brittle and slow to adapt to changing business requirements.

## The Evolution to the Cloud

The physical architecture of the Data Warehouse has changed a great deal over the last two decades.

### Legacy On-Premises Appliances
Early data warehouses were monolithic hardware appliances (like Teradata or Oracle Exadata). An organization had to purchase expensive dedicated hardware. In these machines, storage and compute were physically locked together. If the company ran out of disk space, it had to buy more expensive hardware, even if they required no additional computational power. 

### The Modern Cloud Data Warehouse
Platforms like Snowflake, Google BigQuery, and Amazon Redshift broke from the legacy model by moving the warehouse to the cloud, and most of them decouple storage from compute (Redshift added this later with RA3 nodes and Serverless). 

In a cloud data warehouse, data is stored on highly scalable, low-cost cloud storage. The compute engine operates as a separate cluster of virtual machines. An organization can store large volumes of data at low cost, and only run the more expensive compute clusters when queries need to run. 

## The Transition to the Lakehouse

While the Cloud Data Warehouse solved the hardware scaling problem, it traditionally kept organizations' data in a single vendor's proprietary storage format. 

Today, many organizations are moving toward the Open [Data Lakehouse](/data-lakehouse/). The Lakehouse aims to provide the OLAP analytical performance and transactional guarantees of the Data Warehouse, but runs those queries against open file and table formats (like Apache Parquet and Apache Iceberg) stored in the organization's own cloud buckets, reducing vendor lock-in.

## Summary of Technical Value

The Data Warehouse established the discipline of business intelligence. By physically separating complex analytical aggregations from fragile operational databases, and enforcing strict data quality through Schema-on-Write pipelines, it gave organizations a reliable system of record for analytics. While its architecture is evolving into the open lakehouse, the analytical principles established by the data warehouse remain a foundation of modern data engineering.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
