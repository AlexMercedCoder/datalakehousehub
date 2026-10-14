---
title: "dbt on Apache Iceberg: how SQL transformations work in a lakehouse"
meta_title: "dbt on Iceberg Tables: Lakehouse Transformations"
description: "dbt is an open-source framework that turns SQL SELECT statements into tested, versioned tables and views. Here is how dbt builds Iceberg tables in a lakehouse."
---

dbt (data build tool) is an open-source framework for the transform step of ELT. You write each model as a SQL `SELECT` statement, optionally with Jinja templating, and dbt compiles it, works out the dependency order, and runs it inside your warehouse or query engine as a table, view, or incremental model. dbt does not extract or load data; tools such as [Fivetran](/knowledgebase/fivetran/) or [Airbyte](/knowledgebase/airbyte/) do that.

By bringing version control, code review, tests, and CI to analytical SQL, dbt popularized the role now called analytics engineering. In June 2026 dbt Labs completed its merger with Fivetran, and the dbt Fusion engine runtime was open sourced as dbt Core v2.0 (alpha) under the Apache 2.0 license.

## ELT and where dbt fits

Older ETL tools transformed data on a separate integration server before loading it. Cloud warehouses and lakehouse query engines made it practical to load raw data first and transform it where it lands, which is [ELT](/knowledgebase/elt/). dbt is the transform layer in that pattern: it sends SQL to the engine and lets the engine do the work.

## Models, ref, and the DAG

A dbt project is a directory of SQL files, one per model. Instead of hardcoding table names, models reference each other with `{{ ref('model_name') }}`. dbt resolves each reference to the right schema for the current environment (dev, CI, prod) and uses those references to build a dependency graph. When you run the project, dbt executes models in dependency order and runs independent models in parallel up to your configured thread count.

## Tests and documentation

Data tests are declared in YAML next to models, for example `unique` and `not_null` on a `user_id` column or `accepted_values` on a status column. When a test fails during `dbt build`, downstream models that depend on it are skipped. dbt also generates a documentation site with the model graph, column descriptions, and tests.

## Semantic layer

dbt's Semantic Layer, powered by MetricFlow, lets you define metrics such as monthly active users or gross margin in YAML alongside your models. Supported BI and AI tools query those definitions through dbt's APIs, so a metric is defined once instead of in every dashboard.

## dbt on Iceberg tables

On a [data lakehouse](/knowledgebase/data-lakehouse/), dbt models usually materialize as [Apache Iceberg](/knowledgebase/apache-iceberg/) tables. What changes is the adapter and the catalog.

- **Adapters:** dbt-spark, dbt-trino, dbt-athena, dbt-snowflake, dbt-databricks, dbt-bigquery, and dbt-duckdb can all create Iceberg tables in some configuration. The Dremio-maintained dbt-dremio adapter writes tables to a Dremio object storage source; Dremio creates Iceberg tables in Glue, S3, and Nessie sources, while its default `$scratch` location writes plain Parquet, so point `object_storage_source` at an Iceberg-capable source.
- **Catalogs:** dbt's `catalogs.yml` lets an adapter register the tables it builds in a named Iceberg catalog. Because the catalog, not the engine, owns the table, a model built by Spark can be read by Dremio or [Trino](/knowledgebase/trino/) through the same [Iceberg catalog](/knowledgebase/iceberg-catalog/), such as an [Apache Polaris](/knowledgebase/apache-polaris/) REST catalog.
- **Materializations:** dbt's docs note that most Iceberg catalogs support tables and incremental models but not views, and some lack atomic `CREATE TABLE AS`. Plan to keep views in the engine's own namespace.
- **Incremental models:** `merge` and `delete+insert` strategies map to Iceberg row-level operations, but support varies by engine and connector, so check your adapter's docs.

A typical layout maps dbt folders to the [medallion architecture](/knowledgebase/medallion-architecture/): staging models read bronze Iceberg tables, intermediate models build silver, and marts build gold tables that a [semantic layer](/knowledgebase/semantic-layer/) exposes to BI tools and agents.

## Learn More
To learn more about the [Data Lakehouse](/knowledgebase/data-lakehouse/), read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
