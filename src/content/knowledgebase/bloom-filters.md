---
title: "Bloom Filters in Parquet and Apache Iceberg Tables"
meta_title: "Bloom Filters in Parquet and Iceberg Tables | Glossary"
description: "A Bloom filter is a compact probabilistic structure that tells an engine a value is definitely absent. Learn how Parquet and Iceberg use them to skip data."
---

A Bloom filter is a space-efficient probabilistic data structure that tests whether a value might be in a set. It can answer "definitely not present" or "possibly present," never "definitely present." In a [data lakehouse](/knowledgebase/data-lakehouse/), Bloom filters are written into [Apache Parquet](/knowledgebase/apache-parquet/) and [Apache ORC](/knowledgebase/apache-orc/) files so engines can skip row groups that cannot contain a value used in an equality filter.

## Why Min/Max Statistics Are Not Enough

Parquet already stores min and max values per row group, and Iceberg stores them per file in manifests. Those work well for sorted or clustered columns like dates. They fail for random, high-cardinality values such as UUIDs: a row group's min might start with `0` and its max with `f`, so every lookup value falls inside the range and nothing is skipped. A Bloom filter answers the question min/max cannot: is this exact value in here?

## How a Bloom Filter Works

A Bloom filter is an array of bits, all starting at 0. To add a value, the writer hashes it and sets a few bits chosen by the hash. To test a value, the reader hashes it the same way and checks those bits:

* **Any bit is 0:** the value was never added. The engine can skip the data.
* **All bits are 1:** the value may be present, or the bits may have been set by other values (a false positive). The engine has to read the data.

The false positive rate depends on the filter size and the number of distinct values. Bigger filters mean fewer false positives.

Parquet uses a split block Bloom filter: values are hashed with xxHash (XXH64, a fast non-cryptographic hash), and each lookup touches a single 256-bit block, which keeps checks cache-friendly. Filters are stored per column chunk, and the file footer records where each one is.

## Configuring Bloom Filters in Iceberg

[Apache Iceberg](/knowledgebase/apache-iceberg/) does not write Bloom filters by default. You enable them per column with table properties:

```sql
ALTER TABLE db.events SET TBLPROPERTIES (
  'write.parquet.bloom-filter-enabled.column.device_id' = 'true',
  'write.parquet.bloom-filter-fpp.column.device_id' = '0.01'
);
```

| Property | Default | Meaning |
|---|---|---|
| `write.parquet.bloom-filter-enabled.column.<col>` | not set | Write a Bloom filter for this column |
| `write.parquet.bloom-filter-fpp.column.<col>` | 0.01 | Target false positive probability |
| `write.parquet.bloom-filter-ndv.column.<col>` | not set | Expected distinct values, used to size the filter |
| `write.parquet.bloom-filter-max-bytes` | 1 MB | Maximum filter size |
| `write.orc.bloom.filter.columns` | not set | Columns to index in ORC files |

Properties apply to files written after the change; rewrite data files with compaction to add filters to existing data.

## When to Use Them

| Technique | Helps with | Weak at |
|---|---|---|
| Partitioning | Filters on low-cardinality columns like date or region | High-cardinality keys |
| Min/max statistics (Iceberg manifests, Parquet footers) | Range filters on sorted or clustered columns | Random values like UUIDs |
| Bloom filters | Equality and `IN` lookups on high-cardinality columns | Range filters, low-cardinality columns |
| Parquet page index | Skipping pages inside a row group on sorted data | Unsorted columns |

Good candidates are columns used in point lookups that cannot be sorted for every query, such as `user_id`, `device_id`, `email`, or `transaction_id`. Each filter adds bytes to every file and some write cost, so add them only where queries filter by equality on those columns. Engine support for reading Parquet Bloom filters varies, so check that your engine uses them before relying on them. For more on file-level pruning, read [Parquet Page Indexes and the Last Mile of Pruning in Apache Iceberg](/blog/parquet-page-index-pruning-iceberg/), [All About Parquet Part 07: Metadata in Parquet](/blog/2024-10-all-about-parquet-part-07/), and [What is Apache Parquet?](/blog/2026-04-apache-parquet/).

## Summary

Bloom filters let engines prove a value is absent from a row group without reading its data. In Iceberg tables they complement partitioning and min/max statistics for high-cardinality equality filters, and they are opt-in per column.


## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
