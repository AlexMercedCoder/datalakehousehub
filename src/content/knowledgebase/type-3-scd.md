---
title: "What is Type 3 SCD?"
meta_title: "What is Type 3 SCD? | Expert Data Lakehouse & AI Glossary"
description: "Type 3 SCD is a slowly changing dimension method that keeps limited history by adding a column for the previous value next to the current one in the same row."
---

Type 3 SCD is a [slowly changing dimension](/knowledgebase/slowly-changing-dimensions/) technique that keeps limited history by adding a column for the prior value of an attribute. When the attribute changes, the old value moves into a "previous" column and the new value overwrites the "current" column, all in the same row. The Kimball Group describes it as adding a new attribute to preserve the old value, sometimes called an "alternate reality," and notes it is used relatively infrequently.

## How It Works

Consider a `dim_customer` table where a customer's sales region is reassigned from East to Central.

Before the change:

| customer_key | name | current_region | previous_region | region_changed_on |
|---|---|---|---|---|
| 1001 | Acme Corp | East | NULL | NULL |

After the change:

| customer_key | name | current_region | previous_region | region_changed_on |
|---|---|---|---|---|
| 1001 | Acme Corp | Central | East | 2026-10-01 |

The row count does not grow and the surrogate key does not change, so existing fact rows still join to the same dimension row. Reports can now group sales by either `current_region` or `previous_region`, which is the main reason to choose Type 3: comparing results under the new and old structure side by side, for example during a sales territory realignment.

The limit is depth. A second change overwrites `previous_region`, and the first value is lost unless you add more columns (`region_2_changes_ago`, and so on), which quickly becomes awkward.

## Comparison With Other SCD Types

| | [Type 1](/knowledgebase/type-1-scd/) | [Type 2](/knowledgebase/type-2-scd/) | Type 3 |
|---|---|---|---|
| On change | Overwrite in place | Insert a new row, expire the old one | Shift old value to a prior column, overwrite current |
| History kept | None | Full | One prior value per tracked attribute |
| Row count | Unchanged | Grows with each change | Unchanged |
| Fact joins | Always current | Point-in-time via surrogate key | Current row, both values available |
| Best for | Corrections, attributes nobody analyzes historically | Auditable history | Before-and-after comparison of a planned reorganization |

Teams that need both full history and easy current-versus-prior reporting sometimes combine techniques, for example a Type 2 table that also carries a current-value column.

## Type 3 SCD in the Lakehouse

On an [Apache Iceberg](/knowledgebase/apache-iceberg/) table, a Type 3 update is a single `MERGE INTO` (or `UPDATE`) that sets the previous column from the current one and writes the new value. Engines such as Spark, Dremio, and Trino support row-level updates on Iceberg tables, using either [copy-on-write](/knowledgebase/copy-on-write/) or [merge-on-read](/knowledgebase/merge-on-read/) depending on table settings.

Iceberg adds a dimension Type 3 lacks on its own: [time travel](/knowledgebase/time-travel/). Every update creates a snapshot, so past states of the table can be queried until those snapshots are expired. That is useful for audits and debugging, but snapshots are a storage-level history with retention limits, not a modeled history users can join against, so it does not replace Type 2 when the business needs long-term attribute history. Type 3 dimensions usually live in the Silver or Gold layer of a [medallion architecture](/knowledgebase/medallion-architecture/) and are exposed to BI users through a [semantic layer](/knowledgebase/semantic-layer/) as two clearly named fields.

For worked examples of all SCD types, see [Slowly Changing Dimensions: Types 1-3 with Examples](/blog/2026-02-data-modeling-06-slowly-changing-dimensions/) and [Dimensional Modeling: Facts, Dimensions, and Grains](/blog/2026-02-data-modeling-05-dimensional-modeling/) on the Hub.

## Summary

Type 3 SCD stores one prior value next to the current value in the same row. It is simple, keeps the table small, and supports side-by-side comparisons, but it cannot track a long sequence of changes. Use Type 2 when full history matters.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
