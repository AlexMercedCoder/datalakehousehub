---
title: "Pushdown Execution: How Trino, Dremio, and Spark Push Work to Sources and Iceberg Files"
meta_title: "Pushdown Execution in Trino, Dremio, Iceberg | Glossary"
description: "Pushdown execution sends filters, projections, and aggregations to the data source instead of moving rows. See how it works for federated sources and Iceberg."
---

Pushdown execution is a query optimization in which an engine sends part of a query (filters, column selection, aggregations, sometimes joins) to the system that holds the data, so less data travels back to the engine. Federated engines such as Trino, Dremio, and Apache Spark rely on it, and so does any engine reading [Apache Iceberg](/knowledgebase/apache-iceberg/) tables. The principle: move the computation to the data, not the data to the computation.

When an engine queries an external database such as PostgreSQL or Elasticsearch, pulling every row over the network and filtering afterwards is slow and expensive. With pushdown, the engine analyzes the SQL, works out which operations the source can perform, and sends those operations to the source in its own dialect.

## Predicate Pushdown vs Aggregation Pushdown

### 1. Predicate (Filter) Pushdown
[Predicate pushdown](/knowledgebase/predicate-pushdown/) sends `WHERE` conditions to the source. An analyst runs `SELECT * FROM global_sales WHERE country = 'Japan'` in Trino against a 500-million-row PostgreSQL table. Without pushdown, Trino would read all 500 million rows and filter them itself. With pushdown, the PostgreSQL connector adds `WHERE country = 'Japan'` to the query it sends, PostgreSQL filters using its own indexes, and only the matching rows cross the network. Projection pushdown works the same way for columns: only the selected columns are fetched.

### 2. Aggregation (Compute) Pushdown
[Compute pushdown](/knowledgebase/compute-pushdown/) sends `GROUP BY`, `SUM`, `COUNT`, and similar operations to the source. For `SELECT country, SUM(revenue) FROM global_sales GROUP BY country`, a connector that supports aggregate pushdown lets PostgreSQL compute the totals and return roughly one row per country instead of millions of detail rows. Trino's PostgreSQL connector, for example, supports aggregate pushdown, and many connectors also push down `LIMIT`, `ORDER BY ... LIMIT`, and some joins.

## Dialect Translation and Connector Limits

Pushdown only happens when the connector knows how to express an operation in the source's SQL and is confident the result will match. Collation, null ordering, numeric precision, or functions with different semantics can all stop pushdown. When that happens, the engine pushes what it safely can (often the filters) and runs the rest itself. Checking `EXPLAIN` output to see what reached the source is the fastest way to diagnose a slow federated query.

## Pushdown on Iceberg Tables vs Federated Sources

Files cannot run SQL, so pushdown on a lakehouse means using metadata to avoid reading data.

| Operation | Federated database source | Iceberg table |
|---|---|---|
| Filters | Sent to the source as SQL | Used to prune partitions, skip files with manifest min/max stats, and skip Parquet row groups and pages |
| Projection | Source returns only selected columns | Engine reads only those column chunks from Parquet |
| Aggregations | Source computes them, if the connector supports it | Some engines answer `MIN`, `MAX`, and `COUNT` from manifest statistics (Spark does this by default); other aggregations run in the engine |
| Joins | Some connectors push joins between tables in the same source | Run in the engine; bucketing can avoid shuffles |
| Who does the work | Source database CPUs | Query engine CPUs, with metadata reducing what is read |

[Data federation](/knowledgebase/data-federation/) depends on the left column; lakehouse performance depends on the right one, along with good partitioning, sorting, and file sizes. Dremio combines both: it pushes work into federated sources through its connectors and reads Iceberg tables with metadata pruning, and its Reflections can serve repeated queries without hitting the source at all. For guidance on when to federate and when to move data into Iceberg, read [Federation and the Lakehouse: Two Roads to Unified Data Access](/blog/federation-and-lakehouse/).

## Summary

Pushdown execution is what keeps federated queries practical: the engine translates filters and aggregations into each source's SQL and lets the source do that work. On Iceberg tables, the same idea shows up as metadata-driven pruning that avoids reading files at all.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
