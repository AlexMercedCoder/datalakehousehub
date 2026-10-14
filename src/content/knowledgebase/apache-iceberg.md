---
title: "What is Apache Iceberg?"
meta_title: "What is Apache Iceberg? | Expert Data Lakehouse Architecture Guide"
description: "Apache Iceberg is an open table format for large analytic tables on object storage, covering its metadata tree, hidden partitioning, time travel, and catalogs."
canonical: "https://iceberglakehouse.com/apache-iceberg/"
---

# What is Apache Iceberg?

Apache Iceberg is an open table format originally developed at Netflix for large analytic datasets. It brings the reliability and performance of traditional SQL database tables to open data lakes. Organizations storing large volumes of data on Amazon S3, Google Cloud Storage, or Azure Data Lake Storage use Iceberg to execute transactions, enforce schemas, and track data modifications without locking their architecture into a single vendor ecosystem. 

Before Iceberg, the industry relied heavily on the Apache Hive metastore. Hive mapped database tables to physical directories in a file system. This directory-based approach broke down at scale. Query engines had to list many physical files before they could begin executing a query. This file-listing bottleneck hurt performance and made atomic transactions difficult. Iceberg solves this by tracking data at the file level through a metadata tree, decoupling the logical table structure from the physical storage layout.

## The Architectural Foundation of Apache Iceberg

To understand how Iceberg manages large tables, engineers must look at its multi-layered metadata architecture. The table state is not determined by simply reading what files exist in a cloud bucket. Instead, the state is defined by an explicit metadata tree.

### The Catalog Layer
The catalog is the source of truth for the current table state. When an engine like Dremio or Apache Spark queries an Iceberg table, it first asks the catalog for the location of the current metadata pointer. The catalog ensures that multiple concurrent writers do not corrupt the table by enforcing atomic pointer swaps during commit operations. 

### Metadata Files and Snapshots
The catalog points to a metadata file. This file contains the complete definition of the table at a specific point in time, known as a snapshot. It holds the table schema, partition spec, and properties. Every time a writer commits a change to an Iceberg table, a new metadata file is created, representing a new snapshot of the table history.

### Manifest Lists and Manifest Files
Below the metadata file sits the manifest list. This component tracks all the manifest files required to reconstruct the current snapshot. It stores aggregated metrics about the data, such as lower and upper bounds of partition columns, allowing query engines to skip entire manifests that cannot match a query. The manifest files themselves map to the actual raw data files (typically Parquet, ORC, or Avro) and hold granular column-level statistics.

## Hidden Partitioning

One of the most important changes Iceberg introduced is hidden partitioning. In traditional data warehouses and Hive-based lakes, partitioning required manual intervention. If data was partitioned by day, data engineers had to explicitly extract the day from a timestamp column and write it into a separate `day` column. Analysts then had to remember to query that explicit `day` column. If an analyst forgot and filtered on the original timestamp, the query engine would perform an expensive full table scan.

Iceberg removes this burden. The partition specification is decoupled from the physical data schema. Engineers can configure a table to partition by the day of a specific timestamp column under the hood. When an analyst runs a query filtering on that original timestamp, Iceberg automatically translates the filter to target the correct physical partitions. The user never needs to know the physical layout of the files. Furthermore, if the organization decides to change the partition strategy from daily to hourly, Iceberg evolves the partition specification in place without requiring an expensive rewrite of the historical data.

## Schema Evolution Without Surprises

Data schemas are rarely static. Business requirements shift, applications add new tracking metrics, and data structures must adapt. Historically, adding a column, dropping a column, or renaming a field in a large data lake could require rewriting large amounts of data or maintaining complex external mapping scripts.

Iceberg supports in-place schema evolution. All schema changes are tracked independently through unique column IDs rather than relying on column names. If you rename a column, Iceberg updates the metadata file to map the new name to the existing internal ID. If you drop a column, the data remains in the old files, but Iceberg knows to ignore it during read operations. If you resurrect a previously dropped column name, Iceberg assigns a new, unique ID, so that old, deleted data does not resurface in new queries. This ID-based tracking makes schema evolution safe and predictable.

## Time Travel and Rollbacks

Because Iceberg tracks table state through immutable snapshots, it retains a historical record of modifications. Every INSERT, UPDATE, or DELETE operation generates a new snapshot while preserving the old ones until they are explicitly expired.

This architecture enables a feature known as time travel. Analysts can append an `AT TIMESTAMP` clause (Dremio) or a `TIMESTAMP AS OF` clause (Spark SQL) to their SQL queries to retrieve the data exactly as it existed last Tuesday at noon. 

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

This capability is useful for reproducing machine learning models, debugging data pipeline failures, or auditing financial records for regulatory compliance. If a pipeline accidentally ingests corrupted data, engineers can execute a metadata-only rollback operation, reverting the table to the last known healthy snapshot without rewriting any actual data files.

## Copy-On-Write versus Merge-On-Read

When dealing with row-level modifications in a data lake, engineering teams must balance write performance against read performance. Iceberg supports two methods for handling updates and deletes.

### Copy-On-Write (COW)
In a Copy-On-Write strategy, modifying a single row requires the processing engine to read the entire data file containing that row, remove or update the specific record, and write a new data file back to storage. This adds latency to the write process but keeps subsequent read operations fast, as query engines only need to scan the rewritten files.

### Merge-On-Read (MOR)
Merge-On-Read takes the opposite approach. Instead of rewriting large data files, the engine writes the modification to a small, isolated "delete file" or "delta file." The write operation completes quickly. However, the burden shifts to the read operation. When a query engine reads the table, it must simultaneously load the original data files and the associated delete files, merging them in memory to resolve the current state. This suits high-frequency ingestion streams but can degrade read performance if the delete files are not compacted regularly.

## The Iceberg REST Catalog Specification

As the Iceberg ecosystem expanded, organizations began deploying multiple distinct compute engines simultaneously. A company might use Apache Flink for real-time streaming, Apache Spark for heavy batch ETL, and Dremio for high-concurrency BI dashboards. 

To ensure all these engines interpret the table state identically, the community developed the Iceberg REST Catalog specification. This open API standardizes how compute engines interact with the metadata layer. Platforms like Apache Polaris and Dremio's built-in catalog implement this REST specification, which improves interoperability across engines. By using an Iceberg REST Catalog, organizations reduce vendor lock-in and can change compute engines without migrating their physical storage.

## Iceberg in the Agentic Lakehouse

Modern platforms utilize Apache Iceberg as the structural foundation for advanced AI operations. In an [Agentic Lakehouse](/knowledgebase/agentic-lakehouse/) architecture, Iceberg provides consistent, versioned data that helps reduce AI hallucinations. 

When an autonomous AI agent needs to evaluate historical sales trends, it does not query an isolated, outdated extract. It utilizes secure Agent Skills to execute SQL queries directly against the live Iceberg table. Iceberg's metadata provides the agent with structural context, such as schemas, column statistics, and null counts, before it generates SQL. Combining Iceberg's transactional reliability with agentic reasoning is an active area of data engineering.

## Summary of Technical Value

Implementing Apache Iceberg turns a loosely organized data lake into a structured, transactional data architecture. It removes the file-listing bottlenecks of Hadoop-era systems, providing engines the metadata required to plan fast analytical queries over large datasets. The decoupling of storage from compute, combined with the open REST catalog standard, helps organizations keep ownership of their data architecture.

### Frequently Asked Questions

**Does Apache Iceberg replace Apache Spark?**
No. Iceberg is a table format, not a computation engine. You use Spark (or Dremio, or Trino) to query and write data into the Iceberg format. 

**Is Iceberg only for large organizations?**
While built for large scale, the architectural benefits of schema evolution, atomic transactions, and time travel are immediately valuable to teams of any size operating on cloud object storage.

**How does Iceberg compare to Delta Lake?**
Both are capable open table formats providing ACID transactions. Iceberg has traditionally seen stronger adoption in the broader open-source ecosystem and multi-engine interoperability, largely due to its vendor-neutral governance under the Apache Software Foundation and the broad adoption of the REST Catalog API.

**Can I convert existing Parquet files to Iceberg?**
Yes. You can execute an in-place metadata migration that builds Iceberg tracking manifests around your existing Parquet files, allowing you to upgrade your data lake without physically copying the underlying datasets.

---

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
