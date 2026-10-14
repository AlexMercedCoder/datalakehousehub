---
title: "Apache Parquet: How the File Format Works Under Iceberg Tables"
meta_title: "Apache Parquet vs Iceberg: File vs Table Format | Glossary"
description: "Apache Parquet is an open source columnar file format for analytics. See how its row groups, encodings, and statistics work and how it relates to Iceberg."
---

Apache Parquet is an open source columnar file format built for analytical queries. It was started in 2013 by engineers at Twitter and Cloudera and became a top-level Apache Software Foundation project in 2015. Today it is the default data file format for [Apache Iceberg](/knowledgebase/apache-iceberg/) tables and the only data file format for Delta Lake.

Row-based formats such as CSV and JSON are easy to write one record at a time but slow for analytics. To average one `revenue` column in a 100-column CSV file, an engine has to read every column of every row. Parquet changes the physical layout so the engine can read only what the query needs.

## Columnar Layout

Parquet stores values of the same column together. When a query asks for `SUM(purchase_amount)`, the engine reads only the `purchase_amount` column chunks and skips the rest. This is called column projection, and it cuts both I/O and object storage request costs.

A Parquet file is organized in three levels:

- **Row groups:** horizontal slices of the file, often sized around 128 MB or larger.
- **Column chunks:** the data for one column inside one row group.
- **Pages:** the smallest unit of encoding and compression inside a column chunk.

The file footer holds the schema and metadata for every row group and column chunk.

## Encoding and Compression

Because each column holds values of one type, Parquet can encode them efficiently before compression.

- **Dictionary encoding:** repeated values such as country names are stored once in a dictionary and replaced by small integer codes.
- **RLE and bit-packing hybrid:** runs of repeated values and small integers are packed tightly. Sorting data before writing makes runs longer and files smaller.
- **Delta and byte-stream-split encodings:** help with sorted integers, timestamps, and floating point data.

A codec such as Snappy, ZSTD, GZIP, or LZ4 is applied on top. ZSTD is a common choice for lakehouse tables when you want smaller files at modest CPU cost.

## Statistics and Predicate Pushdown

The footer stores minimum and maximum values, and null counts, for each column chunk. Optional page indexes add the same statistics per page, and optional Bloom filters help with equality lookups on high-cardinality columns. When a query filters on `event_date = '2026-05-14'`, the engine checks these statistics and skips row groups or pages that cannot contain a match. Engines such as Trino, Spark, DuckDB, and Dremio all use this to avoid reading data.

## Parquet vs Iceberg: File Format vs Table Format

Parquet and Iceberg are often mentioned together but solve different problems.

| | Apache Parquet | Apache Iceberg |
|---|---|---|
| What it is | A file format | A table format: metadata that defines a table as a set of files |
| Unit it describes | One file | A whole table across many files and snapshots |
| Statistics | Per row group and page, inside each file | Per file in manifests, so engines can skip whole files before opening them |
| Transactions | None; a file is written once | ACID commits through a catalog |
| Schema evolution | Limited to a single file's schema | Add, drop, rename, and reorder columns by field ID |
| Partitioning, time travel | No | Hidden partitioning, snapshots, time travel |

In practice, an Iceberg table is a catalog pointer to metadata, which lists manifests, which list Parquet data files. Iceberg prunes at the file level and Parquet prunes inside each file. Iceberg also supports ORC and Avro data files, but Parquet is the default and the most widely supported choice across engines. Delta Lake and Apache Hudi also store their data in Parquet.

To go deeper, see [What is Apache Parquet? Columns, Encoding, and Performance](/blog/2026-04-apache-parquet/), [Parquet Page Indexes and the Last Mile of Pruning in Apache Iceberg](/blog/parquet-page-index-pruning-iceberg/), and [The State of Apache Parquet in 2026](/blog/state-of-apache-parquet-2026/).

## Summary

Apache Parquet stores data by column, encodes and compresses each column efficiently, and keeps statistics that let engines skip data. Table formats like Iceberg build on it by adding transactions, snapshots, and table-level metadata, which is why Parquet sits at the bottom of nearly every open lakehouse.


## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
