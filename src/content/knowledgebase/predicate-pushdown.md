---
title: "What is Predicate Pushdown?"
meta_title: "What is Predicate Pushdown? | Expert Data Lakehouse Architecture Guide"
description: "Predicate pushdown is a query optimization that applies filters at storage so engines read less data. See how Parquet stats and Iceberg manifests make it work."
---

# What is Predicate Pushdown?

Predicate Pushdown (also commonly referred to as Filter Pushdown) is a performance optimization used by distributed query engines (such as Trino, Dremio, and Apache Spark) to reduce I/O and speed up analytical queries over large data lakes.

In a naive execution model, if a business analyst queries a large `Sales` table to find transactions from "Germany", the query engine reads the entire table from storage, loads every row into memory, and *then* applies the filter, discarding most of the data. This wastes CPU time, memory, and network bandwidth. 

Predicate Pushdown reverses this. It takes the filter criteria (the predicate) from the SQL query and pushes it down as close to the storage layer as possible, so the engine can skip data that cannot match *before* reading it into memory.

## Mechanisms of Pushdown in File Formats

To apply Predicate Pushdown at the file level, the query engine uses the statistics stored in columnar file formats like Apache Parquet and Apache ORC.

### Min/Max Statistics and Skipping
When an engine writes a Parquet file, it divides the file into Row Groups (often configured at around 128MB). It records metadata in the file footer, including statistics such as the minimum and maximum value of each column within each Row Group.

When Trino executes `SELECT * FROM sales WHERE transaction_date = '2026-05-14'`, it does not read whole Parquet files blindly. Trino reads the small metadata footer first. It examines the Min/Max values for the `transaction_date` column in the first Row Group. If the Minimum date is '2025-01-01' and the Maximum date is '2025-12-31', Trino knows the target date cannot be inside that Row Group and skips reading it. 

By checking these statistics, the engine reads only the data blocks that might contain matching records, which can cut query time sharply when the data is sorted or clustered on the filter column.

## Partition Pruning

File-level Min/Max statistics help, but skipping whole partitions before opening any files usually saves even more. This is known as Partition Pruning.

In legacy Hadoop architectures utilizing the Hive Metastore, data is physically separated into distinct directories (e.g., `s3://data/sales/year=2026/month=05/`). If the query engine receives a predicate filtering for May 2026, it pushes that predicate to the Metastore. The Metastore returns only the matching partitions, so the engine skips every directory that does not match before it evaluates any file-level Parquet statistics.

## Predicate Pushdown in the Open Lakehouse

Open Table Formats like [Apache Iceberg](/knowledgebase/apache-iceberg/) change how Partition Pruning and Predicate Pushdown work.

With Hive-style tables, query engines had to run slow "file-listing" operations against cloud storage (like Amazon S3) to find out which files existed inside each partition directory. 

Apache Iceberg does not rely on directory listings. It tracks the location, partition values, and per-column Min/Max statistics of every data file in its manifest files. When Dremio queries an Iceberg table, it evaluates the SQL predicate against the manifest list and manifests during planning, narrowing a table of many thousands of files down to the few that can contain matching rows. The engine then reads only those files. This metadata-driven pruning, together with Hidden Partitioning, is a central reason Data Lakehouses can approach warehouse-level query speeds.

## Summary of Technical Value

Predicate Pushdown is one of the most important optimizations for querying large data lakes. By applying SQL filters to the metadata in Apache Parquet files and Apache Iceberg manifests, engines avoid a large amount of unnecessary I/O. That makes analytical queries faster and saves time and cloud compute costs.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
