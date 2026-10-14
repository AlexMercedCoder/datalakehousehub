---
canonical: "https://opendatalakehouse.com/kb/materialized-views/"
title: "What is a Materialized View?"
meta_title: "What is a Materialized View? | Expert Data Lakehouse Architecture Guide"
description: "A materialized view is a database object that stores precomputed query results. Learn about incremental refresh and query rewriting with Dremio Reflections."
---

# What is a Materialized View?

A materialized view is a database object that stores the results of a query as physical data. Instead of rerunning an expensive join or aggregation every time someone asks for it, the engine reads the stored result, which is usually much smaller and faster to scan.

A standard view is only a saved query. Each time you select from it, the engine runs the full definition: it reads the source tables, performs the joins, and computes the aggregations at query time. A materialized view runs that work ahead of time. For example, it can summarize a billion-row `sales_fact` table into a few hundred rows of total sales by region, and dashboards then read those few hundred rows.

## Keeping Materialized Views Fresh

Stored results go stale as soon as the source tables change, so every materialized view needs a refresh strategy.

### Full refresh
The simplest approach recomputes the whole query and replaces the stored result. PostgreSQL works this way: `REFRESH MATERIALIZED VIEW` reruns the definition, and the `CONCURRENTLY` option lets readers keep querying the old data during the refresh. Full refresh is easy to reason about, but its cost grows with the size of the source tables.

### Incremental refresh
Incremental refresh processes only what changed in the sources since the last refresh and merges that change into the stored result. Snowflake, for example, runs a background service that updates a materialized view after changes to its base table. On the lakehouse, [Apache Iceberg](/knowledgebase/apache-iceberg/) snapshots record which files were added in each commit, which lets an engine find new data without rescanning the whole table. Dremio uses this for incremental refresh of Reflections on Iceberg tables. Not every query shape can be refreshed incrementally, so engines fall back to a full refresh when they cannot.

## Transparent Query Rewriting

If analysts have to query a materialized view by name, every dashboard must be rewritten to point at it, and the view can only help queries that know about it. Many engines avoid this with query rewriting: the optimizer checks whether a query against the base tables can be answered from a materialized view and, when it can, reads the view instead.

Snowflake's optimizer can do this for queries against a base table. Dremio's [Data Reflections](/knowledgebase/data-reflections/) are built around it: users never reference a Reflection in SQL. Dremio compares a plan that uses a Reflection against a plan on the raw tables and runs the cheaper one. [Raw reflections](/knowledgebase/raw-reflections/) store a copy of a table or view with chosen columns, partitioning, and sort order, while [aggregation reflections](/knowledgebase/aggregation-reflections/) precompute measures such as SUM and COUNT across chosen dimensions for BI-style `GROUP BY` queries.

For more on how this works in practice, see [When the Query Optimizer Starts Managing Its Own Materializations](/blog/autonomous-reflections-agentic-lakehouse/).

## Tradeoffs

* **Storage and refresh cost:** Each materialized view uses storage and compute to maintain, so it pays off for queries that run often.
* **Freshness:** Between refreshes, a view may lag the source data unless the engine fills the gap from the base table, as Snowflake does when maintenance is behind.
* **Definition limits:** Engines restrict what a materialized view can contain. Snowflake materialized views, for example, can query only a single table and cannot use joins or window functions.

## Summary

A materialized view trades storage and refresh work for faster reads on repeated queries. Incremental refresh keeps that work proportional to what changed, and transparent query rewriting lets queries benefit without being rewritten to name the view.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
