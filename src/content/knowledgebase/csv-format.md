---
title: "CSV Files in a Lakehouse: Why and How to Convert Them to Iceberg"
meta_title: "CSV Files in a Lakehouse: Converting CSV to Iceberg"
description: "A CSV file is plain text where each line is a row and commas separate columns. Learn its limits for analytics and how to load CSV into Iceberg tables."
---

A CSV (comma-separated values) file stores tabular data as plain text. Each line is a row, and a delimiter, usually a comma, separates the fields within that row. The format is old and widely supported, and it was documented as RFC 4180 in 2005, though many real-world files deviate from that specification.

Because a CSV file has no binary encoding or embedded metadata, almost any tool can open it: a Python script, Excel, a database import wizard, or a text editor like Vim. That universality makes CSV a good exchange format. Its lack of types, row layout, and parsing ambiguity make it a poor storage format for analytical tables in a [data lakehouse](/knowledgebase/data-lakehouse/).

## Limits of CSV for Analytics

### 1. No Embedded Schema
A CSV file is text. If a column contains `1000`, a reader cannot know from the file alone whether that is an integer, a decimal, a string, or a ZIP code that needs its leading zeros. Engines either need a schema supplied separately or must sample the file and infer types, which costs time and can guess wrong (dates and IDs are common victims).

### 2. Row-Oriented Layout
To compute the average of one `revenue` column in a 50-column CSV file, an engine must read and parse every byte of every row. A [columnar format](/knowledgebase/columnar-format/) like [Apache Parquet](/knowledgebase/apache-parquet/) stores each column separately, so the engine reads only the columns the query needs and can skip row groups using min and max statistics.

### 3. Compression and Splitting
CSV text compresses reasonably well with gzip, but a gzipped CSV file cannot be split across workers, so one large file is read by one task. Parquet applies per-column encodings such as [dictionary encoding](/knowledgebase/dictionary-encoding/) and [run-length encoding](/knowledgebase/run-length-encoding/) before compression, and its row groups can be read in parallel. The size difference varies by data, but Parquet is usually several times smaller than the equivalent uncompressed CSV.

## Parsing Problems

CSV parsing is brittle. If an address field holds `123 Main St, Apartment 4B`, the comma inside it splits the field unless the value is wrapped in double quotes. Embedded quotes must be escaped, embedded newlines break naive line-based readers, and files differ in delimiter, encoding, header presence, and null representation. Many ingestion failures trace back to one of these inconsistencies.

## Loading CSV into Apache Iceberg

[Apache Iceberg](/knowledgebase/apache-iceberg/) data files must be Parquet, ORC, or Avro, so an Iceberg table cannot store CSV directly. CSV belongs at the edge of the lakehouse, in a landing zone or [bronze layer](/knowledgebase/bronze-layer/), and gets converted on the way in:

1. **Land the raw file** in object storage, unchanged, so you can reprocess it later.
2. **Read it with an explicit schema** rather than relying only on inference. Spark (`spark.read.schema(...).csv(...)`), DuckDB (`read_csv` with `columns=`), and PyArrow all support this.
3. **Write it to an Iceberg table**, for example with Spark's `df.writeTo("catalog.db.orders").append()` or with PyIceberg's `table.append(arrow_table)`, which produces Parquet data files and an atomic commit.
4. **Quarantine bad rows** instead of failing the whole load, and keep a count so data quality checks can flag sudden spikes.

Query engines such as Dremio, Trino, Spark, and DuckDB can also query CSV files in place for quick exploration, which is useful before you decide on a schema. For a small-footprint version of this pipeline, see [Building Lightweight Serverless Ingestion to Apache Iceberg with PyIceberg and DuckDB](/blog/serverless-iceberg-ingestion-pyiceberg-duckdb/). For managed options that handle file sources, see [The Lakehouse Ingestion Tool Landscape](/blog/lakehouse-ingestion-tools/), and for related text formats see [JSON](/knowledgebase/json-format/).

## Summary

CSV is the common denominator for moving tabular data between systems and people. Its lack of types, row layout, and loose parsing rules make it slow and error-prone as an analytical storage format. In a lakehouse, treat CSV as an input: land it, parse it with an explicit schema, and write it into Iceberg tables backed by Parquet.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
