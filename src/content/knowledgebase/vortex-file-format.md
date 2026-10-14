---
title: "Vortex File Format vs Parquet: What Changes for the Lakehouse"
meta_title: "Vortex File Format vs Parquet | Lakehouse Glossary"
description: "Vortex is an open source columnar file format and toolkit built for fast scans and random access on object storage. See how it compares to Parquet and Iceberg."
canonical: "https://iceberglakehouse.com/iceberg/vortex-file-format/"
---

## What is Vortex File Format?

Vortex is an open source columnar file format and compression toolkit designed for analytical systems that read data from object storage such as S3 and GCS. It was created at SpiralDB and contributed to the LF AI & Data Foundation, part of the Linux Foundation, in August 2025, where it is an incubation-stage project licensed under Apache 2.0. Microsoft, Snowflake, Palantir, and NVIDIA were named as supporters at launch.

Vortex aims at workloads where Parquet shows its age: very wide schemas, random access to individual rows, GPU-based processing, and multimodal data for AI training. It is designed to keep data compressed across memory, disk (the file format), and network (an IPC format).

## How Vortex Works

* **Pluggable encodings:** Vortex treats encodings as extensions. Schemes such as run-length and dictionary encoding can be cascaded, so a column is compressed by several nested encodings chosen for its data.
* **Compute on compressed data:** kernels can operate on encoded arrays directly, avoiding a full decode before filtering or aggregating.
* **Logical and physical separation:** the logical type of a column is independent of how it is physically encoded, so new encodings do not change the schema.
* **Fast metadata:** file metadata is designed to be zero-copy and zero-parse, and statistics are loaded lazily, which matters for wide tables with thousands of columns.
* **Arrow interoperability:** Vortex converts to and from Apache Arrow without copying.

Since release 0.36.0, the project treats the file format as stable: newer releases should read files written by earlier versions from 0.36.0 onward, even though library APIs may still change.

## Vortex vs Parquet

| | Vortex | [Apache Parquet](/knowledgebase/apache-parquet/) |
|---|---|---|
| Governance | LF AI & Data (Linux Foundation), incubation stage | Apache Software Foundation |
| Maturity | Format stable since 0.36.0; young ecosystem | Industry standard since 2013 |
| Encodings | Pluggable, cascading, extensible | Fixed set defined by the spec |
| Random access | Designed for it | Limited; reads whole pages |
| Engine support | DataFusion, DuckDB, Spark, Polars, pandas, Arrow | Nearly every analytics engine |
| Apache Iceberg | Not in the Iceberg spec; integration listed as coming soon | Default Iceberg data file format |

The Vortex README claims 100x faster random access reads, 10 to 20x faster scans, and 5x faster writes than modern Parquet, with similar compression ratios. These are the project's own benchmarks; test against your own data before relying on them.

## Where Vortex Fits Next to Iceberg

The [Apache Iceberg](/knowledgebase/apache-iceberg/) spec currently defines Parquet, ORC, and Avro as data file formats, so a standard Iceberg table cannot hold Vortex files today. The Vortex project lists Iceberg integration as coming soon, and Microsoft reported experiments running Spark workloads with Vortex inside Iceberg at the 2025 launch. Until that support lands in the Iceberg spec and in engines such as Dremio, Trino, and Spark, Parquet remains the format to use for shared Iceberg tables. Vortex is worth evaluating now for engine-local caches, AI training pipelines, and systems built on DataFusion or DuckDB. The [Lance file format](/knowledgebase/lance-file-format/) targets a similar AI-oriented niche.

---

### E-E-A-T & Further Reading

> **Authoritative Source:** This definition and architectural guide was reviewed by **Alex Merced**. For deeper coverage of architectures like this, see the books he has written on AI, Apache Iceberg, and Data Lakehouses at [books.alexmerced.com](https://books.alexmerced.com).
