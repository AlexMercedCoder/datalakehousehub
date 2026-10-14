---
title: "What are Aggregation Reflections?"
meta_title: "What are Aggregation Reflections? | Expert Data Lakehouse Guide"
description: "Aggregation Reflections are Dremio's precomputed, grouped aggregates stored as Iceberg or Parquet, which the optimizer substitutes into matching queries for BI."
---

# What are Aggregation Reflections?

Aggregation Reflections are a query acceleration feature of the Dremio query engine. They precompute and store aggregated results (such as `SUM`, `COUNT`, and `AVG` grouped by chosen dimensions) as columnar [Apache Iceberg](/apache-iceberg/) or Parquet data inside the [Data Lakehouse](/data-lakehouse/), and Dremio's optimizer uses them transparently when a query can be answered from them.

In traditional relational databases, data engineers often use Materialized Views to speed up executive dashboards. If leadership wants to see "Total Global Sales by Region," the engineer writes that SQL query, runs it, and saves the result as a Materialized View.
A view built for one exact query can be rigid. If the question changes to "Total Global Sales by *Country*" instead of *Region*, a view that only stores regional totals cannot answer it, and the database falls back to scanning the raw data.
Aggregation Reflections address this limitation through query substitution.

## The Architecture of Query Substitution

End users do not query Aggregation Reflections directly; Dremio's query optimizer decides when to use them.

When a data engineer configures an Aggregation Reflection on a large `Sales` table, they do not write a specific SQL query. They define the Dimensions (for example `Region`, `Country`, `City`, `Date`) and the Measures (for example `Revenue`, `Cost`).
Dremio then builds a compressed, pre-aggregated dataset grouped by those dimensions.

### The Transparent Rewrite
When an analyst connects Tableau to Dremio and runs an ad-hoc query such as `SELECT SUM(Revenue) FROM Sales GROUP BY Country`, the query targets the raw table.
The analyst does not need to know the Reflection exists.

Before execution, Dremio's optimizer checks whether any Reflection can satisfy the query. If the requested aggregation (`SUM` by `Country`) can be computed from data already stored in the Aggregation Reflection, Dremio rewrites the plan to read the much smaller Reflection instead of the raw table.
The query then scans far less data and returns faster.

## Supporting Sub-Second BI

Because Reflections are matched against the logical query plan rather than by exact SQL text, one Aggregation Reflection can serve many related queries. If the analyst asks for `SUM(Revenue)` by `City` the next day, Dremio can use the same Reflection, which reduces the number of separate Materialized Views data engineers need to build and maintain.

This capability is central to Dremio's approach to fast Business Intelligence directly on the Data Lakehouse. By caching common aggregations and substituting them at query time, Aggregation Reflections reduce repetitive scans of the underlying object storage, lowering compute costs and making interactive dashboards more responsive.

## Summary of Technical Value

Aggregation Reflections extend the idea of materialized views. By transparently redirecting ad-hoc SQL queries to pre-aggregated datasets, they help organizations deliver fast analytical performance on large data lakes without requiring analysts to change their queries or manage cache routing by hand.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
