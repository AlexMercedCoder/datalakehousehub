---
title: "What is Raw Reflections?"
meta_title: "What is Raw Reflections? | Expert Data Lakehouse & AI Glossary"
description: "A Raw Reflection is a Dremio feature that stores an optimized, materialized copy of a dataset's rows and columns to speed up queries on lakehouse tables."
---

## What is Raw Reflections?

A raw reflection is a type of Dremio [Reflection](/knowledgebase/data-reflections/): a materialized copy of a table or view (called its anchor) that keeps the same rows as the anchor but can include only a chosen subset of its columns, and can be partitioned and sorted differently from the source. Dremio stores the copy as an [Apache Iceberg](/knowledgebase/apache-iceberg/) table and its query optimizer uses it automatically to answer queries that would otherwise read the anchor.

Raw reflections are not filtered copies. They do not apply a `WHERE` clause to the anchor's records. If a team wants a reflection over a subset of rows or over the result of joins and calculations, it defines a view with that logic and creates a raw reflection on the view.

## How Raw Reflections Work

When creating a raw reflection, a user (or Dremio, for autonomous Reflections) chooses:

* **Display fields:** which columns of the anchor to include. All columns are included by default.
* **Partition fields:** columns, optionally with partition transforms, used to partition the reflection's data so queries that filter on those columns read fewer files.
* **Sort fields:** columns used to sort data within the reflection, which helps file-level pruning on range filters.

Dremio builds the reflection and keeps it up to date through refreshes. For Iceberg anchors, Dremio can refresh reflections automatically when the source table changes. For other sources, administrators set a refresh schedule.

At query time, the optimizer checks whether a reflection can satisfy all or part of a query plan. If it can, Dremio reads the reflection instead of the anchor. Users and BI tools keep querying the original table or view, and the substitution does not require any change to their SQL. The Jobs page and `EXPLAIN PLAN FOR` show whether a query was accelerated.

## Raw vs. Aggregation Reflections

Dremio has two main Reflection types:

* **Raw reflections** keep row-level data. They suit queries that select detailed records, views with expensive joins or transformations that run often, and sources that are slow to read, such as data in an operational database or in a file layout that is not optimized for the query pattern.
* **[Aggregation reflections](/knowledgebase/aggregation-reflections/)** store data pre-aggregated by chosen dimensions and measures. They suit BI dashboards that run `GROUP BY` queries.

## When Raw Reflections Help

* **Expensive views:** A view that joins several tables and applies business logic can be materialized once and reused by every query against it.
* **Different physical layout:** A table partitioned by date can have a raw reflection partitioned by region, so region-filtered queries prune effectively.
* **Remote or slow sources:** Queries against a federated source can be served from a reflection instead of pushing every query to the source system.

The trade-offs are storage for the materialized copy and the compute used for refreshes. Data in a reflection is as fresh as its last refresh, so refresh settings should match how current the results need to be.

## Frequently Asked Questions

### Is this an open standard?
No. Reflections are a Dremio feature. The closest general concept is the [materialized view](/knowledgebase/materialized-view/), which some databases can also substitute automatically through query rewrite. In Dremio, Reflections are separate from the views and tables users query, and the optimizer decides when to use them.

### Does a raw reflection require moving data out of the lake?
The anchor data stays where it is. The reflection is an additional copy that Dremio stores in its configured distributed storage, which is typically object storage.

### Do users need to reference the reflection in SQL?
No. Users query the anchor table or view, and the optimizer decides whether to use a reflection.

---

### Sources and further reading

- Dremio documentation, [Reflections overview](https://docs.dremio.com/current/acceleration/)
- Dremio documentation, [Manually Manage Reflections](https://docs.dremio.com/current/acceleration/manual-reflections/)

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
