---
title: "Fact Table vs Dimension Table: Types, Examples, and Iceberg Design"
meta_title: "Fact Table vs Dimension Table in a Lakehouse | Glossary"
description: "A fact table stores measurable business events at a fixed grain in a star schema. See how it differs from a dimension table and how to build one in Iceberg."
---

A fact table is the central table in a star schema. It records measurable business events, such as a sale, a page view, a sensor reading, or a bank deposit, with one row per event at a declared level of detail called the grain. Each row holds numeric measures plus keys that point to the dimension tables describing who, what, where, and when.

In a data warehouse, or the Gold layer of a [data lakehouse](/knowledgebase/data-lakehouse/), questions like "What was total revenue yesterday by region?" are answered by aggregating a fact table and joining it to dimensions. Fact tables are usually long (millions to billions of rows) and relatively narrow.

## Anatomy of a Fact Table

### Grain
The grain states what one row represents, for example "one row per order line." Every measure and key in the table must be true at that grain. Getting the grain wrong is the most common cause of double-counted totals.

### Foreign Keys
Fact rows do not store customer names or product descriptions. They store keys, usually [surrogate keys](/knowledgebase/surrogate-key/), that reference [dimension tables](/knowledgebase/dimension-table/):

* `customer_key: 1045`
* `product_key: 998`
* `date_key: 20260514`

### Measures
Measures are the numbers being analyzed with `SUM`, `AVG`, `MIN`, and `MAX`:

* `quantity_sold: 2`
* `gross_revenue_usd: 150.00`
* `discount_usd: 10.00`

Measures can be additive (revenue sums across every dimension), semi-additive (an account balance sums across accounts but not across days), or non-additive (a ratio, which should be recomputed rather than summed).

## Types of Fact Tables

1. **Transaction fact tables:** one row per event, written when the event happens. The most common type.
2. **Periodic snapshot fact tables:** one row per entity per period, such as each account's balance at midnight, whether or not anything changed.
3. **Accumulating snapshot fact tables:** one row per process instance, such as an order or an insurance claim, updated as it reaches each milestone. Useful for measuring time between steps.
4. **Factless fact tables:** rows that record that something happened, such as a student attending a class, with no numeric measure beyond the count.

## Fact Table vs Dimension Table

| | Fact table | Dimension table |
|---|---|---|
| Holds | Events and numeric measures | Descriptive attributes (names, categories, regions) |
| Shape | Many rows, few columns | Fewer rows, many columns |
| Growth | Appends continuously | Changes slowly, often tracked with SCD Type 2 |
| Keys | Foreign keys to each dimension | Surrogate primary key plus the natural key |
| Typical query role | Filtered and aggregated | Filtered, grouped by, and labeled |

## Building Fact Tables on Apache Iceberg

On a lakehouse, a fact table is usually an [Apache Iceberg](/knowledgebase/apache-iceberg/) table of Parquet files. A few design choices matter most:

- **Partition by event time** with a transform such as `days(event_ts)`. Iceberg's hidden partitioning lets queries filter on `event_ts` directly without a separate partition column.
- **Set a sort order** on columns commonly filtered together, such as `customer_key`, so Parquet statistics can skip more data.
- **Use `MERGE INTO`** for late-arriving data and for accumulating snapshots, and compact small files on a schedule.
- **Expose it through a semantic layer** so metrics like revenue are defined once, rather than each dashboard writing its own `SUM`.

For a fuller treatment, see [Dimensional Modeling: Facts, Dimensions, and Grains](/blog/2026-02-data-modeling-05-dimensional-modeling/), [Star Schema vs. Snowflake Schema](/blog/2026-02-data-modeling-03-star-schema-vs-snowflake/), and [Data Modeling for the Lakehouse: What Changes](/blog/2026-02-data-modeling-04-data-modeling-lakehouse/).

## Summary

A fact table records business events at a declared grain, with numeric measures and keys to dimension tables. On a lakehouse it becomes a partitioned, sorted Iceberg table that columnar engines can scan and prune efficiently, with dimensions supplying the context for every number.

## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
