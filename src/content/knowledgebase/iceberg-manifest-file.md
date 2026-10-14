---
title: "What is an Iceberg Manifest File?"
meta_title: "What is an Iceberg Manifest File? | Expert Architecture Guide"
description: "An Iceberg manifest file is an Avro metadata file listing data files with their status and column stats, so query engines can prune files without listing S3."
canonical: "https://iceberglakehouse.com/iceberg/iceberg-manifest-file/"
---

# What is an Iceberg Manifest File?

An Iceberg manifest file is a core building block of the [Apache Iceberg](/apache-iceberg/) metadata architecture. Sitting at the lowest tier of the Iceberg metadata tree, a manifest file is an Avro file that tracks the locations, statuses, and column statistics of individual data files (typically Apache Parquet files) in the [Data Lakehouse](/data-lakehouse/).

In older big data architectures (like Apache Hive), the Hive Metastore tracked partitions as directories. The query engine had to list the files inside those directories in Amazon S3 to discover which files existed. Because S3 is an object store, not a true file system, listing large directories is slow and adds latency to query planning.
Apache Iceberg moved away from directory-based tracking. It uses manifest files to track data at the *file* level, so engines can plan queries without listing storage directories.

## The Architecture of the Manifest File

A manifest file does not contain user data (like names or credit card numbers). It contains structured metadata *about* the data files.

When an engine reads a manifest file, it gets three key pieces of information:

### 1. The Physical File Path
The manifest stores the full path of each data file (e.g., `s3://lake/data/file_001.parquet`). This allows the query engine (like Trino or Dremio) to go straight to the file without walking a folder hierarchy.

### 2. The File Status (ACID Compliance)
The manifest tracks how each file relates to the snapshot that wrote it using three statuses: `ADDED`, `EXISTING`, or `DELETED`.
* If a data engineer runs an `UPDATE` statement on a copy-on-write table, Iceberg does not modify the existing Parquet file. It writes a new Parquet file with the updated rows. (Merge-on-read tables instead write delete files that record which rows to skip.)
* It then writes a new manifest. In this manifest, the old Parquet file is marked `DELETED`, and the new Parquet file is marked `ADDED`.
* When a query engine reads the current snapshot, it ignores files marked `DELETED`. Combined with the catalog's atomic commit, this gives readers a consistent view of the table.

### 3. Column-Level Metrics (Min/Max Statistics)
This is one of the most useful features of the manifest file.
When data is written, Iceberg records lower and upper bounds (along with value and null counts) for columns in each data file. By default, these metrics are collected for a limited number of columns, which is configurable.
* *File A contains timestamps from 8:00 AM to 9:00 AM.*
* *File B contains timestamps from 9:00 AM to 10:00 AM.*

If an analyst writes the query `SELECT * WHERE timestamp = '8:15 AM'`, the query engine reads the manifest. It sees from the bounds that 8:15 AM cannot exist in File B and skips that file without reading it. This file pruning saves compute and speeds up queries.

## The Problem with Too Many Manifests

Manifest files also create a maintenance task. If a streaming pipeline writes many small Parquet files every day, it can produce many small manifest files.

If the query engine has to open thousands of manifests to plan a query, planning slows down. Iceberg merges manifests during some commits, and teams also run the `rewrite_manifests` maintenance procedure periodically to combine small manifests into fewer, larger ones, which keeps query planning fast.

## Summary of Technical Value

The Iceberg manifest file changed data lakehouse architecture by moving tracking from the folder level to the file level. By storing file paths, status flags, and column-level statistics in a compact Avro format, manifest files remove the need for storage directory listings during query planning. They give query engines the information needed to skip irrelevant files across very large datasets.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
