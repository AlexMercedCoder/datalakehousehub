---
title: "What is Apache Iceberg?"
meta_title: "What is Apache Iceberg? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Apache Iceberg. Learn about its hidden partitioning, time travel capabilities, open REST catalog architecture, and modern data lakehouse integration."
---

# What is Apache Iceberg?

Apache Iceberg is an open table format originally developed by Netflix for massive analytic datasets. It brings the reliability and performance of traditional SQL database tables to open data lakes. Organizations storing petabytes of data on Amazon S3, Google Cloud Storage, or Azure Data Lake Storage use Iceberg to execute transactions, enforce schemas, and track data modifications without locking their architecture into a single vendor ecosystem. 

Before Iceberg, the industry relied heavily on the Apache Hive metastore. Hive mapped database tables to physical directories in a file system. This directory-based approach broke down at scale. Query engines had to list thousands of physical files before they could even begin executing a query. This file-listing bottleneck destroyed performance and made atomic transactions virtually impossible. Iceberg solves this by tracking data at the file level through a sophisticated metadata tree, completely decoupling the logical table structure from the physical storage layout.

## The Architectural Foundation of Apache Iceberg

To understand how Iceberg manages massive scale, engineers must look at its multi-layered metadata architecture. The table state is not determined by simply reading what files exist in a cloud bucket. Instead, the state is strictly defined by an explicit metadata tree.

### The Catalog Layer
The catalog is the absolute source of truth. When an engine like Dremio or Apache Spark queries an Iceberg table, it first asks the catalog for the location of the current metadata pointer. The catalog ensures that multiple concurrent writers do not corrupt the table by enforcing atomic pointer swaps during commit operations. 

### Metadata Files and Snapshots
The catalog points to a metadata file. This file contains the complete definition of the table at a specific point in time, known as a snapshot. It holds the table schema, partition spec, and properties. Every time a writer commits a change to an Iceberg table, a entirely new metadata file is created, representing a new snapshot of the table history.

### Manifest Lists and Manifest Files
Below the metadata file sits the manifest list. This component tracks all the manifest files required to reconstruct the current snapshot. It stores aggregated metrics about the data, such as lower and upper bounds of partition columns, allowing query engines to skip reading entire chunks of the data lake immediately. The manifest files themselves map to the actual raw data files (typically Parquet, ORC, or Avro) and hold granular column-level statistics.

## Hidden Partitioning

One of the most profound engineering shifts Iceberg introduced is hidden partitioning. In traditional data warehouses and Hive-based lakes, partitioning required manual intervention. If data was partitioned by day, data engineers had to explicitly extract the day from a timestamp column and write it into a separate `day` column. Analysts then had to remember to query that explicit `day` column. If an analyst forgot and filtered on the original timestamp, the query engine would perform a massive, expensive full table scan.

Iceberg eliminates this completely. The partition specification is decoupled from the physical data schema. Engineers can configure a table to partition by the day of a specific timestamp column under the hood. When an analyst runs a query filtering on that original timestamp, Iceberg automatically translates the filter to target the correct physical partitions. The user never needs to know the physical layout of the files. Furthermore, if the organization decides to change the partition strategy from daily to hourly, Iceberg evolves the partition specification in place without requiring a massive, expensive rewrite of the historical data.

## Schema Evolution Without Surprises

Data schemas are rarely static. Business requirements shift, applications add new tracking metrics, and data structures must adapt. Historically, adding a column, dropping a column, or renaming a field in a massive data lake required rewriting terabytes of data or maintaining complex external mapping scripts.

Iceberg supports in-place schema evolution. All schema changes are tracked independently through unique column IDs rather than relying on column names. If you rename a column, Iceberg simply updates the metadata file to map the new name to the existing internal ID. If you drop a column, the data remains in the old files, but Iceberg knows to ignore it during read operations. If you resurrect a previously dropped column name, Iceberg assigns a new, unique ID, guaranteeing that old, deleted data will not accidentally resurface in new queries. This ID-based tracking makes schema evolution exceptionally safe and reliable.

## Time Travel and Rollbacks

Because Iceberg tracks table state through immutable snapshots, it inherently retains a complete historical record of modifications. Every INSERT, UPDATE, or DELETE operation generates a new snapshot while preserving the old ones until they are explicitly expired.

This architecture enables an incredibly powerful feature known as time travel. Analysts can append an `AT_TIMESTAMP` or `AS OF` clause to their SQL queries to retrieve the data exactly as it existed last Tuesday at noon. 

```sql
-- Querying a specific snapshot in Dremio
SELECT * 
FROM iceberg_catalog.sales_data 
AT SNAPSHOT '49281059302194';

-- Querying data as it existed at a specific timestamp
SELECT * 
FROM iceberg_catalog.sales_data 
AT TIMESTAMP '2026-05-10 14:00:00';
```

This capability is invaluable for reproducing machine learning models, debugging data pipeline failures, or auditing financial records for regulatory compliance. If a pipeline accidentally ingests corrupted data, engineers can execute a fast metadata-only rollback operation, instantly reverting the table to the last known healthy snapshot without rewriting any actual data files.

## Copy-On-Write versus Merge-On-Read

When dealing with row-level modifications in a data lake, engineering teams must balance write performance against read performance. Iceberg supports two distinct methodologies for handling updates and deletes.

### Copy-On-Write (COW)
In a Copy-On-Write strategy, modifying a single row requires the processing engine to read the entire data file containing that row, remove or update the specific record, and write a completely new data file back to storage. This creates significant latency during the write process but ensures that subsequent read operations remain extremely fast, as query engines only need to scan pristine, unified files.

### Merge-On-Read (MOR)
Merge-On-Read takes the opposite approach. Instead of rewriting massive data files, the engine writes the modification to a small, isolated "delete file" or "delta file." The write operation completes almost instantly. However, the burden shifts to the read operation. When a query engine reads the table, it must simultaneously load the original data files and the associated delete files, merging them in memory to resolve the current state. This allows for extremely high-frequency ingestion streams but can degrade read performance if the delete files are not compacted regularly.

## The Iceberg REST Catalog Specification

As the Iceberg ecosystem expanded, organizations began deploying multiple distinct compute engines simultaneously. A company might use Apache Flink for real-time streaming, Apache Spark for heavy batch ETL, and Dremio for high-concurrency BI dashboards. 

To ensure all these engines interpret the table state identically, the community developed the Iceberg REST Catalog specification. This open API standardizes how compute engines interact with the metadata layer. Platforms like Apache Polaris and Dremio's built-in catalogs implement this REST specification, guaranteeing absolute interoperability. By using an Iceberg REST Catalog, organizations completely avoid vendor lock-in, retaining the freedom to swap out computation engines seamlessly without migrating a single byte of physical storage.

## Iceberg in the Agentic Lakehouse

Modern platforms utilize Apache Iceberg as the structural foundation for advanced AI operations. In an Agentic Lakehouse architecture, Iceberg provides the deterministic, verifiable data required to prevent AI hallucinations. 

When an autonomous AI agent needs to evaluate historical sales trends, it does not query an isolated, outdated extract. It utilizes secure Agent Skills to execute SQL queries directly against the live Iceberg table. Iceberg's metadata manifests provide the agent with deep structural context, allowing language models to understand data distributions, null constraints, and column statistics before they even generate the SQL syntax. The integration of Iceberg's transactional reliability with agentic reasoning represents the forefront of modern data engineering.

## Summary of Technical Value

Implementing Apache Iceberg transforms a chaotic data lake into a highly structured, transactional data architecture. It completely removes the file-listing bottlenecks that plague Hadoop-era systems, providing engines the metadata required to execute sub-second analytical queries over petabyte-scale datasets. The strict decoupling of storage from compute, combined with the open REST catalog standard, ensures organizations maintain complete ownership over their data architecture.

### Frequently Asked Questions

**Does Apache Iceberg replace Apache Spark?**
No. Iceberg is a table format, not a computation engine. You use Spark (or Dremio, or Trino) to query and write data into the Iceberg format. 

**Is Iceberg only for large organizations?**
While built for massive scale, the architectural benefits of schema evolution, atomic transactions, and time travel are immediately valuable to teams of any size operating on cloud object storage.

**How does Iceberg compare to Delta Lake?**
Both are highly capable open table formats providing ACID transactions. Iceberg has traditionally seen stronger adoption in the broader open-source ecosystem and multi-engine interoperability, largely due to its vendor-neutral governance under the Apache Software Foundation and the universal adoption of the REST Catalog API.

**Can I convert existing Parquet files to Iceberg?**
Yes. You can execute an in-place metadata migration that builds Iceberg tracking manifests around your existing Parquet files, allowing you to upgrade your data lake without physically copying the massive underlying datasets.

---

> **Authoritative Source:** This architectural guide was rigorously reviewed by **Alex Merced**. For encyclopedic deep dives into data engineering, discover the extensive library of books he has written covering AI, Apache Iceberg, and Data Lakehouses directly at [books.alexmerced.com](https://books.alexmerced.com).
