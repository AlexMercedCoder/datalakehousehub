---
title: "What is Compute Pushdown?"
meta_title: "What is Compute Pushdown? | Data Lakehouse Hub Knowledge Base"
description: "Compute pushdown sends filters, column selection, and aggregations to the data source instead of the engine. See how Iceberg metadata and Parquet stats use it."
---

# What is Compute Pushdown?

## Introduction to Compute Pushdown

In modern decoupled data architectures, data is often stored far away from the engine executing the query. For example, a business analyst might run a large SQL aggregation using a federated query engine (like [Dremio](https://opendatalakehouse.com/kb/dremio/) or Trino), but the actual data resides inside a proprietary operational database (like Oracle), a cloud data warehouse (like Snowflake), or even an external REST API.

If the analyst executes the query:
`SELECT region, SUM(sales) FROM oracle_db.sales_data WHERE region = 'EMEA' GROUP BY region`

The naive way to execute this query is for the federated engine to pull *every row* from the Oracle database over the network, load the dataset into its own memory, filter out the non-EMEA rows, calculate the sum, and return the answer. If the table has 10 billion rows, this network transfer can take hours and exhaust the engine's resources.

**Compute Pushdown** (often called Query Pushdown) is the optimization technique that prevents this problem.

Compute Pushdown is the process where a query engine delegates (pushes down) portions of the SQL computation directly to the underlying data source, allowing the source system to perform the heavy lifting before any data is transferred over the network.

## The Mechanics of Compute Pushdown

Compute pushdown relies on a component within the query engine called the **[Query Planner](https://datalakehousehub.com/knowledgebase/query-planner/)** or **Cost-Based Optimizer (CBO)**.

When the query engine receives a SQL statement, the optimizer analyzes the capabilities of the underlying storage system.

### 1. Filter Pushdown (Predicate Pushdown)
This is the most common form of pushdown. In the example above, the query contains a `WHERE region = 'EMEA'` clause.
Instead of downloading all 10 billion rows, the Trino/[Dremio](https://opendatalakehouse.com/kb/dremio/) engine rewrites the query and sends a SQL string such as `SELECT * FROM sales_data WHERE region = 'EMEA'` directly to the Oracle database. 
Oracle, which is optimized for its own storage, executes the filter natively. It only returns the rows that belong to EMEA over the network, which greatly reduces network I/O.

### 2. Projection Pushdown (Column Pruning)
If a table has 100 columns, but the user's `SELECT` statement only asks for 2 columns (`region` and `sales`), the query engine pushes down a projection constraint. It instructs the source database (or the Parquet file reader) to skip the other 98 columns, extracting and transmitting only the required data.

### 3. Aggregation Pushdown
Modern query engines can push down aggregate operations. 
In our example, the engine can push the entire `SUM()` and `GROUP BY` operation down to Snowflake or Oracle. The source database calculates the final answer natively and returns a single row containing the result: `[EMEA, $500,000]`. The federated engine does very little processing and transfers only a few bytes over the network.

## Compute Pushdown in the Lakehouse (Iceberg/Parquet)

While pushdown is conceptually easy to understand when querying another relational database, it becomes more complex (and more important) when querying flat files in a [Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/).

Object storage (like [Amazon S3](https://datalakehousehub.com/knowledgebase/amazon-s3/)) has no native compute capabilities; S3 cannot execute a SQL `SUM()`. Therefore, compute pushdown in a lakehouse refers to pushing the logic down into the *file reader* processes (the low-level software libraries scanning the Parquet files).

**[Apache Iceberg](https://iceberglakehouse.com/iceberg/iceberg-catalog/)** and **[Apache Parquet](https://iceberglakehouse.com/iceberg/iceberg-parquet/)** are designed to support pushdown:
1.  **Metadata Level (Iceberg)**: When Dremio evaluates `WHERE date = '2026-01-01'`, it pushes that filter into the Iceberg manifest files. Iceberg's partition data and column statistics identify which Parquet files cannot contain data for that date (for example, most of them), and Dremio skips reading those files.
2.  **File Level (Parquet)**: For the files Dremio does read, the Parquet reader uses the file's footer statistics (min/max values) to skip irrelevant chunks of data (Row Groups) within the file itself.

## The Importance in Data Virtualization

Compute Pushdown is the primary enabling technology for **[Data Virtualization](https://datalakehousehub.com/knowledgebase/data-virtualization/)** and the **[Data Mesh](https://iceberglakehouse.com/iceberg/iceberg-data-mesh/)**. 

Without strong pushdown capabilities, organizations are often forced to use brittle ETL pipelines to physically copy data from operational databases into a central data warehouse just to achieve decent query performance. 
With Compute Pushdown, an engine like Dremio can execute a SQL join between an Oracle database and a Snowflake database at query time. By pushing the heavy filtering and aggregations down to the respective source systems simultaneously, the virtualized query can return quickly without permanently moving or duplicating the underlying data.

## Conclusion

In the era of distributed data, network bandwidth is often the main bottleneck. Compute Pushdown is the architectural strategy that follows a core principle of big data: *Move the compute to the data, do not move the data to the compute.* By delegating SQL operations to the source systems and storage layers, modern query engines deliver fast federated analytics across fragmented enterprise infrastructures.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
