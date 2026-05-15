---
title: "What is Trino?"
meta_title: "What is Trino? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Trino. Learn how this massive distributed SQL query engine executes petabyte-scale federated analytics."
---

# What is Trino?

Trino is a highly advanced, massively distributed, open-source SQL query engine designed to execute blistering fast analytical queries against petabyte-scale data lakes and federated databases. Originally developed at Facebook as "PrestoSQL" (before officially rebranding to Trino in 2020 following a structural split from the Presto project), Trino has become one of the absolute foundational computing engines of the modern Open [Data Lakehouse](/data-lakehouse) ecosystem.

Unlike traditional relational databases (like PostgreSQL or Oracle), Trino is explicitly a Query Engine, not a database. It completely decouples compute from storage. Trino possesses absolutely no physical storage of its own. It cannot "store" data. Instead, it acts as a massive, intelligent mathematical brain that connects to external storage systems—primarily cloud object storage containing Apache Parquet and [Apache Iceberg](/apache-iceberg) files—and executes highly complex SQL aggregations entirely in active memory.

## The Architecture of Distributed Execution

Trino achieves sub-second analytical performance over petabytes of data by utilizing a highly scalable, parallel distributed architecture.

### 1. The Coordinator
When a data analyst executes a complex SQL query via a BI dashboard, the query is received by the Trino Coordinator. The Coordinator is the absolute master node. It does not execute the data processing; instead, it mathematically analyzes the SQL statement. 
It parses the SQL, generates a highly optimized logical execution plan, and determines the exact physical locations of the data on the underlying S3 hard drives. It then shatters the massive query into thousands of tiny, independent mathematical "Tasks."

### 2. The Worker Nodes
The Coordinator distributes these Tasks across a massive cluster of Trino Worker nodes (often hundreds of physical or virtual servers).
The Workers execute the raw, heavy lifting. They physically reach out over the network, pull the necessary Apache Parquet chunks from S3 directly into their local RAM, execute the mathematical aggregations (like `SUM` or `JOIN`) in parallel, and return the intermediate results to the Coordinator, completely bypassing slow physical disk I/O.

## Federated Querying (The Data Mesh Enabler)

The absolute superpower of Trino is its native capability for Federated Querying.

Trino utilizes a highly modular Connector architecture. A single Trino cluster can simultaneously connect to a massive S3 Data Lake, a live MongoDB NoSQL database, a legacy Oracle database, and a real-time Apache Kafka stream. 

An analyst can write a single, standard SQL statement that mathematically `JOIN`s a user record from the Oracle database directly to five years of historical clickstream logs sitting in the S3 Data Lakehouse. Trino dynamically pushes the specific queries down to the underlying systems, extracts the data, and fuses the completely disparate datasets together in active RAM. This eliminates the need to build massive, fragile ETL pipelines to copy the Oracle data into the Data Lake, establishing Trino as a critical engine for the modern Data Mesh architecture.

## Summary of Technical Value

Trino is the definitive distributed SQL query engine for the open data ecosystem. By completely decoupling analytical compute from physical storage and executing massive parallel processing entirely in active memory, Trino empowers organizations to run highly complex, sub-second interactive analytics directly against the raw Data Lakehouse and across vastly disparate federated databases, without ever moving the underlying data.

## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
