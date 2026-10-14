---
canonical: "https://opendatalakehouse.com/kb/trino/"
title: "Trino and Apache Iceberg: How It Compares to Spark and Dremio"
meta_title: "Trino for Iceberg Lakehouses vs Spark and Dremio | Glossary"
description: "Trino is an open source distributed SQL engine that queries data where it lives. See how it reads and writes Iceberg tables and compares to Spark and Dremio."
---

Trino is an open source, distributed SQL query engine for interactive analytics over data lakes and other databases. It has no storage of its own: it reads and writes data in external systems through connectors, most often [Apache Iceberg](/knowledgebase/apache-iceberg/) tables stored as Parquet files in object storage.

Trino's history explains its name. Presto was created at Facebook in 2012 by Martin Traverso, Dain Sundstrom, David Phillips, and Eric Hwang. In 2019 the original creators continued the project independently as PrestoSQL, and in December 2020 PrestoSQL was renamed Trino. PrestoDB, the Facebook-originated line, continues separately under the Linux Foundation's Presto Foundation.

## How Trino Executes a Query

### The Coordinator
A client (a BI tool, a notebook, or the CLI) sends SQL to the coordinator. The coordinator parses the statement, plans and optimizes it, asks the connector which files or splits hold the data, and breaks the work into stages and tasks.

### The Workers
Workers run those tasks in parallel. They read data from storage, filter and aggregate it in memory, exchange intermediate results with each other for joins and grouping, and stream results back through the coordinator. Trino is built for low-latency interactive queries, so by default it keeps intermediate data in memory. For long batch jobs, its fault-tolerant execution mode can retry failed tasks and spool intermediate data to external storage, and spilling to disk is available for memory-heavy operations.

## Federated Queries

Trino ships connectors for Iceberg, Delta Lake, Hive, PostgreSQL, MySQL, Oracle, MongoDB, Kafka, Elasticsearch, and many more. One query can join a PostgreSQL customer table to years of clickstream data in Iceberg. Trino pushes filters and projections down to sources that support them, then combines the results. This is useful for exploration and for avoiding small ETL jobs, though heavy recurring joins against an operational database are usually better served by landing that data in the lakehouse.

## Trino on Iceberg

The Trino Iceberg connector supports Hive Metastore, AWS Glue, JDBC, REST, Nessie, and Snowflake catalogs, so it works with Iceberg REST catalogs such as [Apache Polaris](/knowledgebase/apache-polaris/). It writes Parquet by default and also supports ORC and Avro. It handles `INSERT`, `UPDATE`, `DELETE`, and `MERGE`, time travel with `FOR VERSION AS OF` and `FOR TIMESTAMP AS OF`, branches and tags, and materialized views stored as Iceberg tables.

| | Trino | Apache Spark | Dremio |
|---|---|---|---|
| Main strength | Interactive SQL and federation | Large batch ETL, streaming, ML in Python and Scala | Interactive SQL, semantic layer, query acceleration |
| Iceberg writes | Yes, including MERGE | Yes, the most complete feature coverage | Yes, including MERGE |
| Table maintenance | Procedures such as `optimize` and `expire_snapshots` | Full set of Iceberg Spark procedures | `OPTIMIZE` and `VACUUM`, plus automatic maintenance for tables in its built-in catalog |
| Federation | Broad connector library | Through JDBC data sources | Broad connector library |
| Typical role | Ad hoc and BI queries across sources | Building Bronze, Silver, and Gold tables | BI serving and self-service analytics |

Many lakehouses run more than one of these against the same Iceberg tables through a shared catalog. For a closer look at engine choice, see [Using Apache Iceberg with Python and MPP Query Engines](/blog/2026-04-29-apache-iceberg-masterclass-12-python-and-mpp/), [Query Routing Across Lakehouse Engines](/blog/query-routing-lakehouse-engines/), and [What Happens When Two Engines Write the Same Iceberg Table](/blog/two-engines-one-iceberg-table/).

## Summary

Trino is a distributed SQL engine that separates compute from storage and queries data where it already lives. On a lakehouse it is a strong choice for interactive and federated SQL over Iceberg, and it shares tables cleanly with Spark, Dremio, and other engines through an open catalog.

## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
