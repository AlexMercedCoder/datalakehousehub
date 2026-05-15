---
title: "What is Apache XTable?"
meta_title: "What is Apache XTable? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Apache XTable. Learn about omnidirectional metadata translation, preventing vendor lock-in, and unifying Iceberg, Hudi, and Delta Lake."
---

# What is Apache XTable?

Apache XTable (formerly known as OneTable) is an open-source, omnidirectional metadata translation layer designed to eliminate vendor lock-in across modern data lakehouses. It provides seamless interoperability between the three dominant open table formats: [Apache Iceberg](/apache-iceberg), Apache Hudi, and Delta Lake.

Historically, organizations building a [data lakehouse](/data-lakehouse) were forced to choose a single table format. If an engineering team chose Apache Hudi to handle massive streaming ingestions, they were locked out of utilizing the vast ecosystem of business intelligence tools heavily optimized for Apache Iceberg. If they wanted to support both, they had to physically copy the petabytes of data, maintaining two separate massive storage architectures. XTable completely resolves this issue by translating the lightweight metadata layer instantly, allowing any query engine to read the exact same physical data files.

## The Architecture of Omnidirectional Translation

Apache XTable is not a storage format, nor is it an execution engine. It acts exclusively as a highly optimized translation framework sitting directly above the physical data layer.

To understand XTable, it is crucial to recognize that Iceberg, Hudi, and Delta Lake share an identical physical foundation: they all store their massive datasets in Apache Parquet files. The entire difference between the formats lies strictly in how they track and manage the metadata (the manifests, transaction logs, and schema definitions) pointing to those Parquet files.

### The Lightweight Translation Process
When an organization uses Apache XTable, the translation process is incredibly lightweight. XTable scans the source metadata (for instance, the Delta Lake `_delta_log` transaction files). It extracts the internal table schema, the physical file paths, the partition definitions, and the column-level statistics. 

It then uses that information to rapidly generate the precise, corresponding metadata structure for the target formats. XTable writes out an Apache Iceberg metadata manifest tree and an Apache Hudi timeline, pointing them directly at the exact same, original Parquet files.

### Zero-Copy Interoperability
Because XTable exclusively manipulates the metadata, it never copies the actual physical data. Translating a multi-terabyte dataset takes seconds, not hours. The underlying Parquet files remain entirely untouched in the cloud object storage bucket. 

This Zero-Copy architecture saves organizations massive amounts of capital. They do not pay to duplicate storage, and they do not pay for massive distributed compute clusters to execute data copying pipelines.

## Seamless Multi-Engine Compatibility

The core value of Apache XTable is the architectural freedom it provides. In a massive enterprise, different teams require different compute engines optimized for specific workloads.

* A real-time streaming team can utilize Apache Flink to continuously ingest millions of chaotic IoT events into an Apache Hudi table, taking advantage of Hudi’s exceptional Merge-On-Read capabilities and incremental processing logic.
* A batch processing team can execute Apache XTable periodically (e.g., every 15 minutes) to generate Delta Lake transaction logs representing the newest state of that Hudi table.
* The data science team can then use Databricks to train machine learning models, reading the exact same data natively via the Delta Lake protocol.
* Simultaneously, the Business Intelligence team can use Dremio to execute massive, highly concurrent analytical SQL queries against the exact same underlying Parquet files using the Iceberg REST Catalog protocol.

XTable acts as a universal adapter, guaranteeing that every engine operates at maximum efficiency using its native integration language, completely bypassing the fragmented standards war.

## Incremental Sync Capabilities

Executing a full metadata translation on a massive table containing millions of files every few minutes would eventually cause latency. Apache XTable avoids this by fully supporting incremental synchronization.

Once the initial baseline translation is complete, XTable monitors the source format's transaction log. When a new batch of data is appended or a specific partition is updated, XTable identifies only the exact files that were modified. It translates and appends just those specific modifications to the target metadata structures. This highly optimized incremental sync process ensures that all three table formats remain perfectly synchronized with near real-time latency.

## Summary of Technical Value

Apache XTable fundamentally resolves the fragmentation of the open data lakehouse. By providing lightweight, zero-copy, omnidirectional metadata translation, it guarantees absolute interoperability between Apache Iceberg, Apache Hudi, and Delta Lake. It empowers organizations to select the absolute best processing engine for every unique workload without ever being trapped by an incompatible storage specification or forced to execute expensive, redundant data duplications.


## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
