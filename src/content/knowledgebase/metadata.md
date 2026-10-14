---
title: "What is Metadata?"
meta_title: "What is Metadata? | Expert Data Lakehouse Architecture Guide"
description: "Metadata is data about data: schemas, file locations, statistics, and definitions. Learn how Apache Iceberg metadata drives file pruning and time travel."
---

# What is Metadata?

Metadata is "data about data." The raw data itself (e.g., the number `150.00` or the string `John Doe`) holds the business value, and metadata is the contextual and structural information that makes that raw data usable, discoverable, and fast to query. In a large [Data Lakehouse](/data-lakehouse/), data without accurate metadata is hard to find, hard to trust, and expensive to query.

If you have a library containing a million books (the data), the metadata is the card catalog. The card catalog tells you the title of the book, the author, the publication date, and the shelf where it resides. Without the card catalog, finding a specific sentence requires reading every book in the building. In a large data lake, finding a specific transaction without metadata requires a query engine to scan a very large number of Parquet files, which is slow and costly.

## The Three Classifications of Metadata

In data engineering, metadata is commonly grouped into three categories.

### 1. Structural (Physical) Metadata
This is the low-level metadata used by query engines (like Apache Spark or Dremio) to plan and execute queries efficiently.
* It defines how the data is physically formatted in storage.
* It tracks the file paths (e.g., `s3://bucket/file.parquet`).
* It includes the min/max statistics stored in Parquet footers. If a query searches for `transaction_id = 5`, the engine reads the structural metadata. If the metadata states the file only contains IDs from 10,000 to 20,000, the engine skips the file without reading the raw data.

### 2. Logical (Schema) Metadata
This is the metadata that defines the shape of the data.
It states that the `customer_id` column is an `Integer`, the `revenue` column is a `Decimal`, and the `email` column is a `String`. Logical metadata is managed by open table formats (like [Apache Iceberg](/apache-iceberg/)). If a pipeline attempts to write a string of text into the integer `customer_id` column, the write fails schema validation, which protects the table from bad data.

### 3. Business (Semantic) Metadata
This is the metadata written for people. It is often housed in an enterprise data catalog (like Collibra or Alation).
It provides human-readable context. Business metadata can tag a column as `PII` (Personally Identifiable Information) so security rules apply to it. It provides definitions, stating how `Net_Revenue` is calculated within the organization, so that different departments do not misinterpret the raw numbers.

## The Engine of the Data Lakehouse

The open data lakehouse is a metadata-driven architecture.

A raw data lake is hard to manage because it only has files. Apache Iceberg adds a structured metadata layer (metadata files, manifest lists, and manifests) on top of those files. Iceberg does not change the physical data files; it tracks which files belong to each version of a table.

When an analyst runs a time travel query to see the table as it existed last Tuesday, the query engine first reads the metadata. It finds the snapshot that was current last Tuesday, identifies the data files that belonged to it, and reads only those files.

## Summary of Technical Value

Metadata is the organizational layer of the modern data stack. By providing structural statistics for query optimization, logical schemas for data integrity, and semantic context for human discoverability, metadata turns raw storage into a structured, performant, and secure data lakehouse.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
