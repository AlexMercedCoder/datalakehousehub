---
title: "dlt (Data Load Tool): Python Ingestion Into Iceberg, DuckDB, and Warehouses"
meta_title: "dlt (Data Load Tool) for Iceberg and DuckDB | Glossary"
description: "dlt is an open-source Python library that loads API and database data into warehouses and lakes. See how it writes Iceberg tables and compares to Airbyte."
---

dlt (data load tool) is an open-source Python library, maintained by dltHub, that extracts data from APIs, databases, and files and loads it into warehouses, DuckDB, and data lake storage. It is not a hosted service or an orchestrator. You `pip install dlt` and call it from an ordinary Python script, a notebook, or a task inside [Apache Airflow](/knowledgebase/apache-airflow/) or [Dagster](/knowledgebase/dagster/).

Writing a script that pages through a REST API is easy. The hard part is everything after: flattening nested JSON, creating and altering destination tables, typing columns, and remembering where the last run stopped. dlt handles those steps so a pipeline stays a few dozen lines of Python.

## Schema Inference and Evolution

You hand dlt Python objects (dicts, lists, generators, or Arrow tables). During its normalize step it infers a schema from the data it sees.

### Flattening and Typing
Nested dictionaries are flattened into columns, and nested lists become child tables linked to their parent by generated keys. Column types are inferred from values, and dlt's detectors can type ISO 8601 strings as timestamps.

### Automated DDL
dlt generates the `CREATE TABLE` and `ALTER TABLE` statements the destination needs. When a source adds a field, dlt adds the column on the next load instead of failing. You can tighten this with schema contracts that freeze tables or columns, which is useful once a pipeline feeds production models.

## Incremental Loading and State

Re-extracting a full dataset every night wastes API quota. dlt's `dlt.sources.incremental` helper tracks a cursor field such as `updated_at`, and the pipeline stores its state alongside the loaded data in the destination. On the next run, the resource reads the last cursor value and requests only newer records. Combined with the `merge` write disposition and a primary key, reruns update existing rows instead of appending duplicates. See [idempotency](/knowledgebase/idempotency/) for why that matters.

## dlt in a Data Lakehouse

For lakehouse work, the filesystem destination can write [Apache Iceberg](/knowledgebase/apache-iceberg/) tables by setting `table_format="iceberg"`. dlt writes Parquet and commits it through PyIceberg, so it works with the catalogs PyIceberg can load, such as an Iceberg REST catalog (for example [Apache Polaris](/knowledgebase/apache-polaris/)) or a SQL catalog. Current limits include no partition evolution after table creation and some restrictions on upserts, so check the dlt Iceberg docs before relying on it for high-volume merges.

A common pattern is to use dlt for the [bronze layer](/knowledgebase/bronze-layer/) of a [medallion architecture](/knowledgebase/medallion-architecture/): land raw API data as Iceberg tables, then let Spark, Dremio, Trino, or dbt build silver and gold tables on top. For local work, the [DuckDB](/knowledgebase/duckdb/) destination lets an analyst pull an API into a database file and query it right away.

### dlt vs Airbyte vs Fivetran

| | dlt | [Airbyte](/knowledgebase/airbyte/) | [Fivetran](/knowledgebase/fivetran/) |
|---|---|---|---|
| Form factor | Python library | Platform with UI and connector catalog | Managed SaaS |
| Where it runs | Your process, notebook, or orchestrator task | Self-hosted or Airbyte Cloud | Vendor infrastructure |
| Custom sources | Write Python generators | Connector builder or CDK | Limited, mostly vendor-built |
| Iceberg output | Filesystem destination via PyIceberg | Iceberg destinations available | Managed data lake destinations |
| Best fit | Engineers who want code-first pipelines | Teams that want many prebuilt connectors | Teams that want no pipeline operations |

For a longer comparison, read [The Lakehouse Ingestion Tool Landscape: Fivetran, Airbyte, dlt, and CDC vs Batch](/blog/lakehouse-ingestion-tools/).

## Summary

dlt packs schema inference, DDL generation, JSON flattening, and incremental state into a Python library. It suits engineers who want ingestion as code without running a separate ingestion platform, and its Iceberg support lets those pipelines land data directly in an open lakehouse.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
