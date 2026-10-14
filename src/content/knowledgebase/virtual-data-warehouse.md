---
title: "What is Virtual Data Warehouse?"
meta_title: "What is Virtual Data Warehouse? | Data Lakehouse Hub Knowledge Base"
description: "A virtual data warehouse queries data where it lives through federation instead of copying it into one database, with tradeoffs in freshness, cost, and speed."
---

# What is Virtual Data Warehouse?

## Introduction to the Virtual Data Warehouse

Since the 1990s, the standard approach to enterprise analytics was centralization: *To analyze your data, you move it into one central database.* 

This necessitated the creation of the **ETL (Extract, Transform, Load)** pipeline. Data engineering teams spent large budgets and many hours writing scripts to copy data from operational databases (like Oracle or MySQL), format it, and push it into a central Data Warehouse (like Teradata or Snowflake). 

This approach has significant drawbacks:
1.  **Data Staleness**: When ETL jobs run overnight, the data warehouse can be up to a day out of date.
2.  **Duplication Costs**: You pay to store the data in the source database, and you pay *again* to store the exact same data in the warehouse.
3.  **Fragility**: If the source database changes a column name, the ETL pipeline can break, leaving the central warehouse stale or with incomplete loads.

The **Virtual Data Warehouse** (also known as a Logical Data Warehouse or Data Federation) reverses this approach: *Leave the data exactly where it is, and move the query engine instead.*

## How a Virtual Data Warehouse Works

A Virtual Data Warehouse (powered by federated query engines like [Dremio](https://opendatalakehouse.com/kb/dremio/) or Trino) looks like a traditional relational database to the end user. When a business analyst connects [Tableau](https://datalakehousehub.com/knowledgebase/tableau/) to it, they see a clean list of schemas and tables, and they can write standard SQL queries against them.

However, the Virtual Data Warehouse **does not hold its own copy of the source data** (apart from optional caches, described below).

It is a query planning, routing, and compute layer. It holds the *metadata* (the schema definitions and connection strings) pointing to the actual data sources scattered across the enterprise.

### The Federated Query in Action
Imagine an analyst runs the following query:
`SELECT c.customer_name, s.lifetime_spend FROM postgres_crm.customers c JOIN s3_lake.sales_history s ON c.id = s.user_id`

1.  **Interception**: The Virtual Data Warehouse receives the query.
2.  **[Compute Pushdown](https://datalakehousehub.com/knowledgebase/compute-pushdown/)**: The Virtual engine's [Query Planner](https://datalakehousehub.com/knowledgebase/query-planner/) analyzes the request. It translates the `postgres_crm` part of the query into the SQL dialect PostgreSQL understands and sends it to PostgreSQL: *"Please filter your customers and send me the names."*
3.  **Parallel Execution**: Simultaneously, it translates the S3 part of the query, distributing tasks to its own worker nodes to scan the Parquet files in the data lake.
4.  **In-Memory Join**: The engine pulls the (ideally small) result set from PostgreSQL over the network, joins it in memory with the S3 data, and returns the final answer to [Tableau](https://datalakehousehub.com/knowledgebase/tableau/).

## The Advantages of Virtualization

Virtual Data Warehouses offer several benefits.

### 1. Real-Time Analytics (Zero-ETL)
Because there is no ETL pipeline, there is no overnight delay. When the analyst queries the Virtual Data Warehouse, the engine queries the live operational PostgreSQL database. The dashboard reflects the current state of the source at query time (unless the query is served from a cache).

### 2. Lower Cost
By reducing the need to copy large amounts of data into a central repository, organizations can shrink their storage footprint and cut the compute costs of daily ETL jobs. Federated queries do add load to the source systems, which has to be managed.

### 3. Rapid Prototyping and Agility
If a data scientist wants to see if combining a new external weather dataset with internal sales data yields predictive insights, they don't have to wait for the data engineering team to build a hardened ETL pipeline to ingest the weather data. They add the weather data source in the Virtual Data Warehouse (if a connector exists for it), write a federated JOIN, and test their hypothesis quickly.

## The Performance Challenge

The historical knock against Virtual Data Warehouses was performance. Pulling large amounts of data over a network from a slow source database is slower than querying data stored in a warehouse optimized for analytics.

Modern engines address this with two techniques:
*   **[Compute Pushdown](https://datalakehousehub.com/knowledgebase/compute-pushdown/)**: Having the source database do as much filtering and aggregation as it can before data crosses the network.
*   **Reflections / Materialized Caching**: If a federated query runs often, engines like [Dremio](https://opendatalakehouse.com/kb/dremio/) can materialize the result as a Reflection, stored as an Iceberg table of [Apache Parquet](https://iceberglakehouse.com/iceberg/iceberg-parquet/) files in object storage, and the optimizer uses it transparently. Subsequent queries read the faster materialization instead of hitting the source databases, at the cost of data being as fresh as the last refresh.

## Conclusion

The Virtual Data Warehouse puts agility first. By decoupling the consumption of data from its physical storage, it reduces dependence on fragile ETL pipelines. It lets enterprises work with data where it lives, across clouds, databases, and lakes, while still giving business users a single, fast point of access for analytics.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
