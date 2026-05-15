---
title: "What is OLAP?"
meta_title: "What is OLAP (Online Analytical Processing)? | Expert Data Lakehouse Guide"
description: "A comprehensive guide to OLAP. Learn how columnar databases process massive aggregations and power enterprise business intelligence."
---

# What is OLAP (Online Analytical Processing)?

OLAP stands for Online Analytical Processing. It defines the highly specialized class of database architectures explicitly engineered to process massive, incredibly complex queries against vast volumes of historical data. While OLTP databases (like PostgreSQL) are built to execute millions of tiny, instantaneous transactions to run a live website, OLAP databases (like Snowflake, Amazon Redshift, and [Data Lakehouse](/data-lakehouse) engines like Dremio and Trino) are built to execute massive aggregations to power executive business intelligence dashboards and train machine learning models.

If a CEO wants to know the "Total Revenue across all retail stores in Europe over the last five years, grouped by individual product categories," executing that query against the live OLTP database is catastrophic. The database would have to scan billions of deeply normalized rows, dragging the application's CPUs to a halt and crashing the live retail systems. The OLAP architecture was explicitly invented to solve this by physically separating the heavy analytical workloads from the fragile operational systems.

## The Architecture of Columnar Storage

The fundamental defining characteristic of an OLAP engine is its physical storage layout: it is strictly Columnar.

In a traditional row-oriented operational database, data is written contiguously. If a `Sales` table contains 50 columns, writing a new transaction is very fast. However, if a business analyst only wants to calculate `SUM(revenue)`, the row-oriented database is forced to physically read the entire massive table off the hard drive—dragging all 50 columns into memory—just to isolate the single revenue number. It wastes 98% of the massive Disk I/O.

OLAP databases (utilizing formats like Apache Parquet) physically shatter the row. They take the `revenue` column for all ten billion transactions and store those numbers physically contiguously on the hard drive. They take the `customer_id` column and store it in a completely separate contiguous file block.

When the analyst queries `SUM(revenue)`, the OLAP engine completely ignores the other 49 columns. It surgically extracts only the highly compressed `revenue` block from the hard drive. This reduces the Disk I/O from 500 Gigabytes down to 5 Gigabytes, exponentially accelerating the speed of massive analytical aggregations.

## Denormalization and Star Schemas

Because OLAP systems are built explicitly for high-speed reads (not fast writes), data engineers intentionally break the strict Normalization rules used in operational databases.

In an OLAP environment, data is heavily Denormalized into specialized architectures like the Star Schema. The complex web of dozens of operational tables is forcefully collapsed into a single, massive central Fact table surrounded by wide, highly descriptive Dimension tables. 

While this intentional data duplication makes updating a single record much slower, it drastically reduces the number of complex `JOIN` statements required to generate a report. Query engines (utilizing Broadcast Hash Joins) can scan these denormalized schemas at lightning speed, allowing business analysts to explore petabytes of data intuitively without requiring a PhD in database architecture.

## Vectorized Execution and Compression

OLAP architectures achieve extreme scale by deeply optimizing the physical hardware layer.

Because columnar data stores identical data types contiguously (e.g., a file block containing nothing but one million integer dates), it compresses incredibly well using advanced algorithms like Run-Length Encoding or Dictionary Encoding.

Furthermore, modern OLAP engines utilize Vectorized Execution (often backed by Apache Arrow). Instead of the CPU processing one row at a time, the engine grabs a massive, contiguous array of 4,000 highly compressed integers and loads them perfectly into the ultra-fast L1 CPU Cache. It executes Single Instruction, Multiple Data (SIMD) hardware commands to calculate the aggregations across the entire array instantly, operating at the absolute physical limits of the silicon processor.

## Summary of Technical Value

OLAP architectures are the foundational computational engines of the modern data-driven enterprise. By entirely abandoning fragile, row-oriented structures in favor of highly compressed, mathematically optimized columnar storage formats and denormalized schemas, OLAP engines guarantee that organizations can execute highly complex, petabyte-scale business intelligence queries in sub-second response times without ever threatening the stability of live operational software.


## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
