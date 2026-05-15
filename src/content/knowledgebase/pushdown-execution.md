---
title: "What is Pushdown Execution?"
meta_title: "What is Pushdown Execution? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Pushdown Execution. Learn how federated query engines push complex math into source databases to optimize network traffic."
---

# What is Pushdown Execution?

Pushdown Execution is a highly sophisticated optimization strategy utilized by modern federated query engines (like Trino, Dremio, and Apache Spark) and data virtualization platforms. It operates on a simple but profound principle: "Move the computation to the data, do not move the data to the computation."

When a massive centralized query engine connects to an external, underlying database (like PostgreSQL, Snowflake, or Elasticsearch), pulling raw data across the network to process it centrally is the absolute slowest, most expensive operation possible. Pushdown Execution forces the federated engine to analyze the user's SQL query, identify specific filtering or mathematical operations, and push those exact operations down into the underlying database, forcing the underlying database to do the heavy lifting using its own local CPUs.

## Predicate Pushdown vs Computational Pushdown

There are two distinct levels of Pushdown Execution, each providing massive performance gains.

### 1. Predicate (Filter) Pushdown
Predicate Pushdown specifically involves pushing `WHERE` clauses down to the source system. 
If an analyst uses Trino to query a massive PostgreSQL table for `SELECT * FROM global_sales WHERE country = 'Japan'`, a poorly optimized engine would extract all 500 million global sales records from PostgreSQL over the network, place them into Trino's memory, and then filter out the Japanese records.

With Predicate Pushdown, Trino natively understands the PostgreSQL dialect. It intercepts the query and sends the exact `WHERE country = 'Japan'` SQL command directly to PostgreSQL. PostgreSQL filters the data locally on its own hard drives, and sends only the 2 million Japanese records back across the network to Trino.

### 2. Computational (Aggregation) Pushdown
While filtering is critical, Computational Pushdown is significantly more advanced. It involves pushing complex math and aggregations (`SUM`, `AVG`, `GROUP BY`) down to the source database.

If the analyst queries `SELECT country, SUM(revenue) FROM global_sales GROUP BY country`, Trino does not pull the 500 million rows across the network to execute the addition. Trino pushes the entire `GROUP BY` and `SUM` logic directly into PostgreSQL. PostgreSQL executes the heavy mathematical aggregation locally, and sends back exactly 195 tiny rows (one total sum for each country). This reduces network traffic from 500 gigabytes down to a few kilobytes, making the query virtually instantaneous.

## Complex Dialect Translation

The primary engineering challenge of Pushdown Execution is SQL dialect translation. 

Different underlying databases have wildly different capabilities and proprietary SQL syntax. A federated query engine must possess highly intelligent Connectors. 
* If a user writes a query utilizing an advanced Window Function, the Trino Connector must evaluate the underlying database.
* If the underlying database is Snowflake (which perfectly supports Window Functions), Trino translates the function into Snowflake's specific dialect and pushes it down.
* If the underlying database is an older, rigid version of MySQL (which might lack specific Window Function support), Trino recognizes the limitation. It pushes down the basic filtering, extracts the raw data, and executes the complex Window Function using Trino's own distributed CPUs.

## Pushdown in the Open Lakehouse

Pushdown Execution is also critical when querying raw files in the Data Lakehouse. When an engine queries Apache Iceberg tables, it executes Predicate Pushdown directly into the Iceberg Metadata Manifests (to skip files) and into the Parquet footers (to skip Row Groups). Because Parquet files cannot "compute" math, Computational Pushdown does not apply to files; the query engine itself must execute the aggregations.

## Summary of Technical Value

Pushdown Execution is the exact mechanism that makes global Data Federation and Data Virtualization physically possible. By intelligently translating SQL logic and forcing underlying source databases to execute heavy filtering and mathematical aggregations locally, query engines minimize network transfer by orders of magnitude. It ensures that massive, multi-system queries execute with the absolute highest possible computational efficiency.
