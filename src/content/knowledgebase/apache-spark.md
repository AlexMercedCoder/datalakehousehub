---
title: "Apache Spark for the Lakehouse: Architecture, Iceberg Writes, and When to Use Other Engines"
meta_title: "Apache Spark on a Lakehouse with Iceberg | Glossary"
description: "Apache Spark is an open source distributed engine for batch, SQL, and streaming. Learn how it writes Iceberg tables and when Trino, Dremio, or Flink fit better."
---

Apache Spark is an open source distributed engine for large-scale data processing, SQL, streaming, and machine learning. It was created at UC Berkeley's AMPLab and is a top-level Apache Software Foundation project. Spark keeps intermediate data in memory where it can, which made it much faster than Hadoop [MapReduce](/knowledgebase/mapreduce/) for multi-step and iterative jobs, and it largely replaced MapReduce in Hadoop-era stacks.

Spark is one of the most widely used engines for data engineering pipelines. Teams use it for ETL and ELT jobs, streaming applications, and distributed machine learning. Engineers write code in Python, Scala, Java, or SQL, and Spark distributes the work across a cluster. The 4.x line began with Spark 4.0 in 2025, and Spark 4.1 followed in December 2025.

## The Architecture of Apache Spark

Spark scales through a driver and executor architecture. When an engineer submits a Spark application, the workload is distributed and managed across a cluster of machines.

### The Driver Program and Spark Context
Every Spark application begins with the Driver program. The Driver is the central coordinator; it contains the primary `main()` function and creates the `SparkContext` (or `SparkSession` in modern versions). The Driver is responsible for converting the user's high-level code into actual physical execution tasks, scheduling those tasks, and communicating with the broader cluster.

### The Cluster Manager
To acquire the necessary computational resources, the Driver connects to a Cluster Manager. Historically, organizations used Hadoop YARN or Apache Mesos to manage resources; Mesos support was removed in Spark 4.0. Today, YARN, Kubernetes, and Spark's own Standalone cluster manager are the supported options, with Kubernetes common for containerized deployments. The Cluster Manager allocates memory and CPU cores across the physical machines.

### Executor Nodes
Once resources are allocated, Spark launches Executors on the worker nodes. Executors are the workhorses of the Spark architecture. They receive specific, isolated tasks from the Driver, execute the computations, and store the resulting data in memory (or spill it to disk if memory is exhausted). Because Executors hold data in memory across the cluster, Spark can perform complex iterative algorithms, like machine learning model training, quickly without constantly writing intermediate states back to physical storage.

## Core Data Structures: RDDs to DataFrames

The evolution of Apache Spark is deeply tied to how it structures data in memory. Understanding these abstractions is critical for writing efficient distributed code.

### Resilient Distributed Datasets (RDDs)
The RDD is the foundational data structure of Apache Spark. An RDD is a read-only, partitioned collection of records distributed across the cluster. It is "Resilient" because Spark tracks the exact lineage of transformations required to build the dataset. If a specific worker node fails and loses its chunk of data, Spark uses the lineage graph to recompute the lost partition on a different node. While extremely fault-tolerant, programming directly with RDDs requires manual optimization and can be verbose.

### DataFrames and Datasets
To make Spark more accessible and performant, the community introduced DataFrames. A DataFrame organizes data into named columns, conceptually identical to a table in a relational database or a data frame in Python's Pandas library. 

Because DataFrames impose a strict schema, Spark understands exactly what the data looks like. This allows the engine to apply optimizations before execution, a capability that raw RDDs lacked. Datasets are a strongly-typed extension of DataFrames (primarily used in Scala and Java) that provide compile-time safety.

## The Catalyst Optimizer and Tungsten Engine

The true power of modern Apache Spark lies beneath the surface in its advanced SQL optimization engine and physical execution framework.

### The Catalyst Optimizer
When an engineer writes a DataFrame transformation or a SQL query, Spark does not execute it immediately. Instead, the Catalyst Optimizer evaluates the code. 

1. **Logical Plan:** Catalyst parses the code and generates an unresolved logical plan.
2. **Analysis:** It checks the catalog to resolve column names and verify data types.
3. **Logical Optimization:** Catalyst applies heuristic rules, such as Predicate Pushdown (moving filters closer to the data source) and Constant Folding.
4. **Physical Planning:** Catalyst generates multiple potential physical execution plans (e.g., choosing between a Sort-Merge Join or a Broadcast Hash Join) and selects the most cost-effective path based on underlying data statistics.

### The Tungsten Execution Engine
Once the optimal physical plan is selected, the Tungsten engine executes it. Tungsten focuses on optimizing CPU and memory efficiency. It utilizes Whole-Stage Code Generation, taking the entire physical plan and compiling it into highly optimized Java bytecode. Furthermore, Tungsten manages memory explicitly using off-heap allocations, reducing overhead from Java garbage collection.

## Unified Workloads: Streaming and Machine Learning

Unlike legacy systems that required entirely different technologies for batch processing and streaming, Apache Spark provides a unified engine for varied workloads.

### Spark Structured Streaming
Spark approaches streaming differently than continuous event processors like Apache Flink. By default, Spark uses a [micro-batch](/knowledgebase/micro-batching/) architecture. It treats a live data stream as an unbounded, continuously growing table. As new data arrives, Spark groups the events into small, frequent batches and runs the same DataFrame queries used for batch processing. This lets engineers write a transformation once and run it as either a batch job or a streaming pipeline. Spark 4.1 added a Real-Time Mode for lower latency, which in its first release supports stateless queries only.

### MLlib (Machine Learning Library)
Spark includes MLlib, a comprehensive distributed machine learning library. Because Spark holds data in memory across the cluster, it suits iterative algorithms like logistic regression or clustering. Data scientists can clean large datasets using Spark SQL, pass the DataFrame to MLlib to train a model, and deploy the results back to the data lake, all within a single unified script.

## Spark and the Open Lakehouse

Spark is a common engine for writing and maintaining tables in the open [data lakehouse](/knowledgebase/data-lakehouse/). [Apache Iceberg](/knowledgebase/apache-iceberg/), [Apache Hudi](/knowledgebase/apache-hudi/), and [Delta Lake](/knowledgebase/delta-lake/) all ship Spark integrations. With Iceberg, Spark supports `MERGE INTO`, `UPDATE`, and `DELETE`, schema and partition evolution, time travel, and stored procedures for maintenance such as `rewrite_data_files` (compaction) and `expire_snapshots`. It connects to catalogs such as Apache Polaris, Project Nessie, AWS Glue, and any Iceberg REST catalog.

When reading these formats, Spark uses table metadata to skip files that cannot match a query's filters. A typical [medallion architecture](/knowledgebase/medallion-architecture/) uses Spark to refine raw data into bronze, silver, and gold Iceberg tables, while engines like Dremio or Trino query the same tables for interactive BI.

| Workload on Iceberg | Spark | Trino / Dremio | Apache Flink |
|---|---|---|---|
| Large batch ETL and backfills | Strong fit | Possible, less common | Possible |
| Table maintenance (compaction, snapshot expiry) | Built-in procedures | Partial support, varies by engine | Limited |
| Interactive BI and dashboards | Slower startup per query | Strong fit | Not designed for it |
| Low-latency streaming ingestion | Micro-batch; Real-Time Mode is stateless only | Not a streaming engine | Strong fit |
| Python and ML in the same job | PySpark and MLlib | Limited | Limited |

For hands-on guides, read [Intro to Apache Iceberg with Apache Polaris and Apache Spark](/blog/2025-10-intro-to-apache-iceberg-with-apache-polaris-and-apache-spark/), [DataFusion Comet 1.0 and What Native Rust Scans Change for Spark on Iceberg](/blog/datafusion-comet-1-spark-iceberg/), and, for smaller jobs that do not need a cluster, [Building Iceberg Pipelines in Python Without Standing Up Spark](/blog/python-native-iceberg-pipelines/).

## Summary of Technical Value

Apache Spark replaced disk-bound MapReduce jobs with fault-tolerant, in-memory distributed processing. Its Catalyst optimizer, DataFrame API, and mature integrations with Iceberg, Delta Lake, and Hudi make it a standard choice for lakehouse ETL and table maintenance, while interactive BI is usually better served by engines like Dremio or Trino reading the same tables.

### Frequently Asked Questions

**Is Apache Spark a database?**
No. Spark is a processing engine. It does not store data persistently. It reads data from external storage systems (like Amazon S3, Hadoop HDFS, or Cassandra), processes it in memory across the cluster, and writes the results back to storage.

**What programming languages does Spark support?**
Spark is written in Scala, and it provides APIs for Python (PySpark), Java, and Scala, plus Spark SQL. The R API (SparkR) is deprecated as of Spark 4.0; the sparklyr package is the usual alternative for R users.

**Why did PySpark become so popular?**
Python is the dominant language in data science and machine learning. PySpark allows data scientists to use the familiar Python syntax while Spark's engine translates the code under the hood to run across a cluster, so the same code can scale from a sample to a full dataset.

---
