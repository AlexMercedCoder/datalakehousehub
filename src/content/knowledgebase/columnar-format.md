---
title: "What is Columnar Format?"
meta_title: "What is Columnar Format? | Expert Data Lakehouse & AI Glossary"
description: "A columnar format stores each column's values together instead of row by row, which speeds up analytical scans. See how it relates to Arrow and Iceberg."
---

A columnar format is a way of laying out tabular data so that all values of one column are stored next to each other, instead of storing each row's fields together. A query that reads three columns from a table with a hundred columns only has to touch those three columns, and because similar values sit side by side, they compress and encode far better than mixed row data. Apache Parquet and Apache ORC are the common columnar file formats on disk, and Apache Arrow is the common columnar format in memory.

## How It Works

Take a table with `order_id`, `customer`, `region`, and `amount`. A row format such as CSV or Avro writes one complete record after another. A columnar format writes every `order_id`, then every `customer`, and so on.

Parquet organizes a file into **row groups** (horizontal slices of the table). Inside each row group, each column is stored as a **column chunk**, which is split into **pages**. The file footer holds the schema and statistics such as min and max values per column chunk. Readers use that layout in three ways:

- **Projection.** Only the column chunks a query needs are read from storage.
- **Encoding and compression.** Runs of repeated or low-cardinality values suit [dictionary encoding](/knowledgebase/dictionary-encoding/) and [run-length encoding](/knowledgebase/run-length-encoding/), followed by a general codec such as Snappy or Zstandard. The Parquet project describes itself as a column-oriented format with "high performance compression and encoding schemes."
- **Skipping.** Min and max statistics let a reader skip row groups and pages whose value ranges cannot match a filter.

Apache Arrow applies the same idea in memory. Its specification is a language-independent columnar layout, and the contiguous buffers let engines run [vectorized execution](/knowledgebase/vectorized-execution/) that processes batches of values with SIMD instructions instead of one row at a time.

## Row vs Columnar

| Aspect | Row format (CSV, JSON, Avro) | Columnar format (Parquet, ORC) |
|---|---|---|
| Physical layout | Full records stored together | Each column stored together |
| Good at | Writing and reading whole records, streaming events | Scans, aggregations, filters over a few columns |
| Compression | Lower, because adjacent values differ in type | Higher, because adjacent values share a type |
| Reading one column | Must read every row | Reads only that column's chunks |
| Typical home | OLTP systems, message payloads | Analytics, data lakes, lakehouses |

Columnar formats are slower for single-row lookups and frequent small updates, which is why transactional databases keep a row layout.

## Columnar Formats in the Lakehouse

Apache Iceberg, Delta Lake, and Apache Hudi are table formats, not file formats. They track collections of data files, and in practice those data files are usually Parquet. Iceberg adds its own column-level statistics to manifest files, so an engine can prune whole files before opening them and then use Parquet's footer statistics to prune row groups inside the files it does read.

Engines such as Dremio, Trino, Spark, and DuckDB all read Parquet directly. Dremio and DuckDB also process data in a columnar in-memory form (Dremio is built on Arrow), which keeps data in a column layout from storage to result. Arrow Flight and ADBC extend this to the network, moving result sets as Arrow batches instead of converting them row by row.

For the hands-on details, the Hub's guide to [row vs column storage](/blog/2026-04-29-query-engine-optimization-02-row-vs-column-storage/) walks through the query engine side, and the [Apache Parquet](/knowledgebase/apache-parquet/) and [Apache Arrow](/knowledgebase/apache-arrow/) entries cover each format in depth.

## Summary

A columnar format stores data by column so analytical queries read less, compress better, and skip more. Parquet on disk and Arrow in memory are the two formats most lakehouse engines share, and open table formats like Iceberg sit on top of them to add transactions and table-level metadata.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
