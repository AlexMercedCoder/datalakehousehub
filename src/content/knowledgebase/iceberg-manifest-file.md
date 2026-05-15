---
title: "What is an Iceberg Manifest File?"
meta_title: "What is an Iceberg Manifest File? | Expert Architecture Guide"
description: "A comprehensive guide to the Iceberg Manifest File. Learn how this foundational metadata file tracks physical Parquet files and enables sub-second query planning."
---

# What is an Iceberg Manifest File?

An Iceberg Manifest File is the absolute foundational building block of the Apache Iceberg metadata architecture. Operating at the lowest tier of the Iceberg metadata tree, the Manifest File is a highly specialized, binary Avro file explicitly designed to track the exact physical locations, statuses, and complex mathematical statistics of individual data files (typically Apache Parquet files) resting in the Data Lakehouse.

In legacy Big Data architectures (like Apache Hive), the centralized Hive Metastore tracked partitions strictly by maintaining a massive directory tree of folders. The query engine was forced to physically execute an `ls` (list) command against Amazon S3 to discover which files actually existed inside those folders. Because S3 is an object store, not a true file system, executing `ls` against a folder containing 10,000 files is catastrophically slow, completely destroying query performance.
Apache Iceberg completely abandoned folder-based tracking. Instead, it utilizes Manifest Files to track data at the absolute, granular *file* level, completely eliminating the need for slow S3 directory listings.

## The Architecture of the Manifest File

A Manifest File does not contain the actual user data (like names or credit card numbers). It contains highly structured, incredibly dense metadata *about* the data files.

When an engine reads a Manifest File, it receives three critical pieces of architectural intelligence:

### 1. The Physical File Path
The Manifest explicitly stores the absolute, exact URL of the Parquet file (e.g., `s3://lake/data/file_001.parquet`). This allows the query engine (like Trino or Dremio) to bypass the folder hierarchy entirely and jump directly to the exact file.

### 2. The File Status (ACID Compliance)
The Manifest File tracks exactly how a file relates to the current state of the table using three explicit statuses: `ADDED`, `EXISTING`, or `DELETED`.
* If a data engineer executes an `UPDATE` statement, Iceberg does not physically alter the existing Parquet file. Instead, it writes a brand new Parquet file with the updated data.
* It then writes a new Manifest File. Inside this Manifest, the old Parquet file is marked `DELETED`, and the new Parquet file is marked `ADDED`. 
* When the query engine reads the Manifest, it sees the `DELETED` flag and explicitly ignores the old file, guaranteeing perfect ACID transactional consistency.

### 3. Column-Level Metrics (Min/Max Statistics)
This is the absolute superpower of the Manifest File. 
When the data is originally written, Iceberg calculates and saves the absolute Minimum and Maximum values for every single column inside the Parquet file. 
* *File A contains timestamps from 8:00 AM to 9:00 AM.*
* *File B contains timestamps from 9:00 AM to 10:00 AM.*

If an analyst writes the query: `SELECT * WHERE timestamp = '8:15 AM'`, the query engine reads the Manifest File. It looks at the Min/Max metrics for File B, mathematically realizes that 8:15 AM cannot possibly exist inside File B, and explicitly skips the entire file without ever downloading it (Predicate Pushdown). This mechanism saves massive amounts of cloud compute power and dramatically accelerates query execution.

## The Problem with Too Many Manifests

While Manifest Files are incredibly powerful, they create a new structural challenge. If a massive streaming pipeline writes 100,000 tiny Parquet files every day, it will generate thousands of tiny Manifest Files. 

If the query engine is forced to open and read 5,000 Manifest Files just to find the Min/Max metrics, the query will slow down. To solve this, Iceberg utilizes an automated maintenance procedure called "Manifest Compaction." Periodically, a background job will take 1,000 tiny Manifest Files and merge them into one single, highly optimized Manifest File, restoring absolute peak performance to the metadata tree.

## Summary of Technical Value

The Iceberg Manifest File fundamentally redefined Data Lakehouse architecture by moving tracking from the folder level to the explicit file level. By storing absolute physical paths, transactional status flags, and highly granular column-level statistics within a compact Avro format, the Manifest File completely eliminates catastrophic cloud storage directory listings. It provides the exact mathematical intelligence required for modern query engines to execute sub-second, highly optimized data skipping across multi-petabyte datasets.

## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
