---
title: "What is Late Materialization?"
meta_title: "What is Late Materialization? | Expert Data Lakehouse & AI Glossary"
description: "Late materialization is a query technique where a columnar engine filters on a few columns first and reads the remaining columns only for the rows that match."
---

Late materialization is a query execution strategy in columnar databases where the engine works with only the columns it needs to filter, join, or sort, and delays reading and assembling the remaining columns into full rows until it knows which rows survive. The opposite approach, early materialization, reads every column a query references up front and builds complete tuples before filtering. The trade-off was studied in detail by Daniel Abadi, Daniel Myers, David DeWitt, and Samuel Madden in "Materialization Strategies in a Column-Oriented DBMS," published at ICDE 2007.

## How Late Materialization Works

Consider this query over a wide sales table:

```sql
SELECT customer_name, address, notes, amount
FROM sales
WHERE region = 'EMEA' AND amount > 10000;
```

With late materialization, the engine:

1. Reads only the `region` and `amount` columns.
2. Evaluates the filters and produces a list of matching row positions, often as a selection vector or bitmap.
3. Reads `customer_name`, `address`, and `notes` only for those positions.
4. Stitches the values into output rows.

If a small share of rows match, the engine avoids reading and decoding most of the wide text columns. The same idea helps top-N queries (`ORDER BY ... LIMIT N`): sort on the ordering column alone, keep the top N row positions, then fetch the other columns for just those rows. ClickHouse calls its version of this "lazy materialization," and DuckDB 1.3 added deferred column fetching that speeds up queries with `LIMIT`.

## When It Helps and When It Does Not

Late materialization is not always the faster choice. Going back for more columns has a cost: tracking row positions, extra passes over storage, and random rather than sequential access when matches are scattered. A 2025 VLDB paper on selective late materialization, implemented in DuckDB, argued that the classic approach loses some of its value in vectorized engines and proposed choosing the materialization point for each column in each query.

| Situation | Late materialization | Early materialization |
|---|---|---|
| Selective filter on narrow columns, wide output columns | Usually faster, much less data read | Reads many values that are discarded |
| Top-N with small `LIMIT` | Usually faster | Sorts or carries full rows |
| Most rows match the filter | Little benefit, extra bookkeeping | Often comparable or faster |
| Many joins needing many columns | Depends on the plan | Simpler pipelines |

## Late Materialization in the Lakehouse

Lakehouse tables are stored as columnar [Apache Parquet](/knowledgebase/apache-parquet/) files in object storage, often managed by [Apache Iceberg](/knowledgebase/apache-iceberg/). Every column chunk read from object storage costs requests and bandwidth, so avoiding unnecessary column reads matters more than it would on local disk.

Late materialization works alongside other skipping techniques at different levels:

* **Partition and file pruning.** Iceberg metadata, including partition values and column statistics in manifests, lets engines skip whole files before reading any data.
* **Row group and page pruning.** Parquet min and max statistics and page indexes let readers skip parts of a file. See [predicate pushdown](/knowledgebase/predicate-pushdown/).
* **Late materialization.** Within the data that is read, only the filter columns are decoded in full, and the rest are fetched for surviving rows.

Lakehouse engines such as Dremio, Trino, Spark, and DuckDB all use metadata-based pruning, and how far each one defers column reads varies by engine and version. Data layout helps them: sorting or clustering an Iceberg table on commonly filtered columns makes matches more contiguous, so fetching the remaining columns for surviving rows touches fewer pages.

## Related Reading

* [Parquet Page Indexes and the Last Mile of Pruning in Apache Iceberg](/blog/parquet-page-index-pruning-iceberg/)
* [Row vs. Column: How Storage Layout Shapes Everything](/blog/2026-04-29-query-engine-optimization-02-row-vs-column-storage/)
* [Vectorized execution](/knowledgebase/vectorized-execution/)

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
