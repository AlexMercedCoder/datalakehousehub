---
title: "Apache ORC vs Parquet: Which to Use for Iceberg Tables"
meta_title: "Apache ORC vs Parquet for Iceberg Tables | Glossary"
description: "Apache ORC is an open source columnar file format created in 2013 to speed up Apache Hive. See how it differs from Parquet and when to use it in Iceberg."
---

Apache ORC (Optimized Row Columnar) is an open source columnar file format for analytical workloads. It was created in January 2013 as part of an effort to speed up Apache Hive and store Hadoop data more efficiently. Apache Parquet, its closest peer, came out of work at Twitter and Cloudera at about the same time.

Before ORC, Hive tables were usually stored as text files or RCFile, which cost a lot of CPU and disk I/O at query time. ORC cut storage size through type-aware encoding and compression and made Hive queries much faster by letting readers skip data they did not need.

## The Layout of an ORC File

Like Parquet, ORC stores values of the same column together so a query that touches a few columns reads only those columns.

### Stripes and Streams
An ORC file is divided into stripes, which default to about 64 MB. Each stripe is an independent unit of work, so different tasks can read different stripes in parallel.

Inside a stripe, each column is split into streams. An integer column, for example, has a data stream holding the values and a present stream, a compact bitmap recording which rows are NULL. Readers use the present stream to avoid processing NULLs.

### Type-Specific Encoding
ORC chooses encodings by data type: dictionary encoding for repetitive strings, run-length and delta encoding for integers such as IDs and timestamps, and bit packing. A general compression codec (such as ZLIB, Snappy, LZ4, or ZSTD) is applied on top.

### Lightweight Indexes
The file footer stores the schema and column statistics, and each stripe carries row indexes with minimum and maximum values for groups of 10,000 rows. When an engine like Trino runs `WHERE age > 65`, it checks these statistics and skips row groups that cannot match without decompressing them. Optional Bloom filters help with equality lookups.

## ORC vs Parquet for Iceberg Tables

The [Apache Iceberg](/knowledgebase/apache-iceberg/) table spec allows three data file formats: Parquet, ORC, and Avro. Parquet is the default (`write.format.default=parquet`), and the format is recorded per data file, so a single table can contain both.

| | Apache ORC | [Apache Parquet](/knowledgebase/apache-parquet/) |
|---|---|---|
| Origin | Apache Hive project, 2013 | Twitter and Cloudera, 2013 |
| Default in Iceberg | No | Yes |
| Delta Lake support | No (Parquet only) | Yes |
| Engine coverage for Iceberg writes | Narrower; check each engine | Every major Iceberg engine |
| Built-in indexes | Row-group min/max, optional Bloom filters | Row-group and page statistics, optional Bloom filters |
| Typical reason to choose it | Existing Hive ORC data you want to adopt in place | New tables and broad engine compatibility |

The practical guidance: write new Iceberg tables as Parquet, because it is the format every Iceberg engine reads (Spark, Trino, Flink, [Dremio](/knowledgebase/dremio-cloud/), Doris, StarRocks, DuckDB, and others) and the one engines write by default. If you have large Hive tables already stored as ORC, Iceberg lets you register those files in place through migration procedures instead of rewriting them. New data can then land as Parquet, and older ORC files can be rewritten during routine compaction when it suits you.

## Summary

Apache ORC solved the storage bottleneck of the original Hadoop era with stripes, type-specific encoding, and lightweight indexes. It remains a valid Iceberg data format and a sensible choice for existing Hive data, while Parquet is the default for new lakehouse tables.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
