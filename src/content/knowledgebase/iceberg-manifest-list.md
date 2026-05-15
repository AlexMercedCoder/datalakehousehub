---
title: "What is an Iceberg Manifest List?"
meta_title: "What is an Iceberg Manifest List? | Expert Architecture Guide"
description: "A comprehensive guide to the Iceberg Manifest List. Learn how this top-tier metadata file orchestrates entire Data Lakehouse snapshots for sub-second planning."
---

# What is an Iceberg Manifest List?

The Iceberg Manifest List is a highly advanced, mission-critical architectural component that sits directly at the top of the Apache Iceberg metadata hierarchy (just below the Snapshot pointer). While a Manifest File is responsible for tracking individual Data Files (Parquet files), the Manifest List is the supreme orchestrator that explicitly tracks the *Manifest Files themselves*. 

Every single time a new "Snapshot" of an Iceberg table is created (representing a specific state of the table at a specific point in time), a single, brand-new Manifest List is generated. This file acts as the absolute, definitive index for that specific Snapshot. When a query engine (like Trino or Dremio) attempts to query a massive petabyte-scale Iceberg table, it never touches the data files first. It reads the Snapshot, opens the single Manifest List, and uses the dense mathematical intelligence inside to instantly discard 99% of the underlying architecture.

## The Architecture of Metadata Pruning

If a massive enterprise table has 500,000 Parquet data files, those files might be tracked by 1,000 different Manifest Files.
If an analyst queries the table, forcing the query engine to open and read all 1,000 Manifest Files simply to check their Min/Max statistics would cause unacceptable latency. The Manifest List was explicitly invented to solve this exact bottleneck through a process called "Metadata Pruning."

The Manifest List (also stored as a binary Avro file) does not simply list the file paths of the 1,000 Manifest Files. It stores heavily aggregated, table-level metrics *about* those Manifest Files.

### 1. Partition Summaries
The absolute most critical data stored in the Manifest List is the Partition Bounds. 
The Manifest List explicitly declares: *"Manifest File A only contains data for the Year 2024. Manifest File B only contains data for the Year 2025."*
If the analyst's SQL query includes the clause `WHERE year = 2026`, the query engine reads the single Manifest List. It instantly realizes that neither Manifest A nor Manifest B could possibly contain 2026 data. It explicitly discards the Manifest Files without ever opening them. This is Metadata Pruning. The engine bypassed reading thousands of metadata files, saving massive amounts of compute time before it even began searching for the underlying Parquet files.

### 2. Manifest Status and File Counts
The Manifest List tracks the exact number of `ADDED`, `EXISTING`, and `DELETED` data files contained within each underlying Manifest. This allows the query optimizer to make highly intelligent execution plans. If a Manifest File contains only deleted records (due to a massive compaction or GDPR deletion event), the engine can recognize its status and process it appropriately without unnecessary computational friction.

## The Foundation of Time Travel

Because every single Snapshot has exactly one immutable Manifest List, it provides the absolute foundation for Iceberg's Time Travel capabilities.

If an analyst wants to query the exact state of the table from last Tuesday, the query engine simply looks up Tuesday's Snapshot ID. It opens the specific Manifest List tied to that Tuesday Snapshot. Because the Manifest List from Tuesday only points to the specific Manifest Files (and subsequently, the Parquet files) that existed on that exact day, the query engine completely ignores any data written on Wednesday or Thursday. The architecture flawlessly reconstructs the historical reality of the database without requiring heavy physical backups or complex transactional logs.

## Summary of Technical Value

The Iceberg Manifest List is the ultimate accelerant for Data Lakehouse query planning. By acting as the definitive index for a specific Snapshot and storing highly aggregated partition boundaries for the underlying Manifest Files, the Manifest List allows massive distributed query engines to execute ruthless Metadata Pruning. It completely shields the compute engine from opening irrelevant metadata files, drastically reducing query planning latency and ensuring that petabyte-scale Data Lakehouses can be queried interactively in sub-seconds.

## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
