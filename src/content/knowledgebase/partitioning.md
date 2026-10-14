---
title: "What is Partitioning?"
meta_title: "What is Partitioning? | Expert Data Lakehouse & AI Glossary"
description: "Partitioning splits a large table into groups of files by column values so queries can skip data. Learn how Apache Iceberg's hidden partitioning handles it."
---

## What is Partitioning?

Partitioning is a way of organizing a large table into groups of files based on the values of one or more columns, such as date or region. 

**Partitioning** is one of the main tools for making queries on large tables fast and affordable. When a query filters on a partition column, the engine can skip every file group that cannot match, which reduces the data it reads. Choosing partitions poorly has the opposite effect: too many small partitions create many small files and extra metadata.

## Core Architecture and Mechanics

In a lakehouse built on an open table format, partitioning works through a few mechanisms:

* **Groups rows into files by partition value.** Each data file in a partitioned table holds rows that share the same partition value, so the engine can tell from metadata which files are relevant to a filter.
* **Records partition values in metadata.** Apache Iceberg stores each file's partition value and column statistics in manifest files, so query planning can prune files without listing directories in object storage.
* **Separates the physical layout from the logical table using techniques like [hidden partitioning](/knowledgebase/hidden-partitioning/).** Iceberg derives partition values with transforms such as `day(ts)` or `bucket(16, id)`, so users filter on the original column and do not need to know the layout.

Engines such as Spark, Trino, Flink, and Dremio use this metadata to prune partitions when they query [Apache Iceberg](/knowledgebase/apache-iceberg/) tables, and tools like dbt can set partition specs when they create tables.

## Why Partitioning Matters in the Modern Data Stack

Query cost and speed in a lakehouse depend heavily on how much data each query has to read. Partition pruning is often the first and largest reduction, before file-level statistics and row-group filtering.

Partitioning also helps with data management. Deleting or rewriting a single partition, such as one day of data, touches only that partition's files. With Iceberg partition evolution, a table can change its partition scheme as data grows without rewriting existing data.

### Key Benefits
- **Faster Queries:** Filters on partition columns let engines skip files that cannot match.
- **Lower Cost:** Reading fewer files reduces compute time and object storage requests.
- **Simpler Maintenance:** Operations such as deletes, compaction, and retention can target specific partitions.

## Frequently Asked Questions

### What makes a Lakehouse different from a Data Lake?
A standard data lake is just a collection of files. A lakehouse adds a metadata layer that provides warehouse-like features (transactions, schema enforcement) directly to those files. Partitioning in a data lake usually depends on directory paths, while table formats like Iceberg track partitions in metadata.

### Why use an Open Table Format?
Open formats like Apache Iceberg keep your data readable by many engines instead of one proprietary database. The partition spec is part of the open table metadata, so every engine that reads the table can prune partitions the same way.

### How does Partitioning impact data governance and security?
Partitioning is a performance feature, not an access control. It can support governance tasks, such as deleting data for a retention policy by partition, but permissions still come from the catalog or query engine.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
