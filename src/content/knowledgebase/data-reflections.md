---
title: "What is Data Reflections?"
meta_title: "What is Data Reflections? | Expert Data Lakehouse & AI Glossary"
description: "Data Reflections, now called Reflections, are Dremio's optimized precomputed copies of data that its planner uses to speed up queries without changes to SQL."
---

## What is Data Reflections?

"Data Reflections" is an older name for a Dremio feature that Dremio's documentation now simply calls **Reflections**. A Reflection is a precomputed, optimized copy of the data in a table or view, or of a query result, that Dremio's query optimizer can use in place of the original to speed up queries. The table or view a Reflection is based on is called its anchor.

Users and BI tools keep querying the original tables and views. When the optimizer finds that a Reflection can answer all or part of a query, it rewrites the plan to read the Reflection instead. No change to the SQL is needed.

## Types of Reflections

* **[Raw reflections](/knowledgebase/raw-reflections/)** keep the same rows as the anchor, can include only some of its columns, and can use their own partitioning and sorting. They suit row-level queries and expensive views.
* **[Aggregation reflections](/knowledgebase/aggregation-reflections/)** store data aggregated by chosen dimensions and measures. They suit BI queries that group and summarize data.
* **External reflections** let Dremio use a table that was materialized outside Dremio as a Reflection for a view.

Reflections can also be **manual**, defined and managed by users, or **autonomous**, created and managed by Dremio based on query patterns.

## How Reflections Work

Dremio stores Reflections as [Apache Iceberg](/knowledgebase/apache-iceberg/) tables in its configured storage. It keeps them current through refreshes: Reflections on Iceberg tables can refresh automatically when the source changes, and Reflections on other sources follow a refresh schedule. During query planning, the optimizer considers available Reflections and picks the one that gives the cheapest plan. The Jobs page and `EXPLAIN PLAN FOR` show whether a query used a Reflection.

## Why Reflections Matter

Reflections address a common problem on a [data lakehouse](/knowledgebase/data-lakehouse/): dashboards and applications query the same views repeatedly, and those views may join several tables, read slow federated sources, or scan data laid out for a different access pattern. Without Reflections, teams often build and maintain separate summary tables and point each tool at the right one. With Reflections, the optimized copies are managed by the engine and used transparently.

The trade-offs are the storage the copies use, the compute spent refreshing them, and freshness: results served from a Reflection are as current as its last refresh.

## Frequently Asked Questions

### Is this an open standard?
No. Reflections are a Dremio feature. The closest general concept is the [materialized view](/knowledgebase/materialized-view/), which some databases can also substitute automatically through query rewrite. In Dremio, Reflections are separate from the views and tables users query, and the optimizer decides when to use them.

### Does this require moving data into Dremio?
Source data stays where it lives. A Reflection is an additional copy that Dremio stores and manages, typically in object storage.

### Do users need to reference a Reflection in SQL?
No. Users query the anchor tables and views, and the optimizer decides whether to use a Reflection.

---

### Sources and further reading

- Dremio documentation, [Reflections overview](https://docs.dremio.com/current/acceleration/)
- Dremio documentation, [Manually Manage Reflections](https://docs.dremio.com/current/acceleration/manual-reflections/)

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
