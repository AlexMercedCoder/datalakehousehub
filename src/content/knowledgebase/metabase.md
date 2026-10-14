---
title: "Metabase: Open-Source BI on an Apache Iceberg Lakehouse"
meta_title: "Metabase BI on an Iceberg Lakehouse | Glossary"
description: "Metabase is an open-source BI tool with a visual query builder, SQL editor, and dashboards. See how it queries Iceberg tables through Trino, Athena, or Dremio."
---

Metabase is an open-source business intelligence (BI) tool for building questions, dashboards, and embedded analytics. Its open-source edition is licensed under the AGPL, and paid Pro and Enterprise plans add features such as SSO, advanced permissions, and more embedding options. Compared with [Tableau](/knowledgebase/tableau/) or [Apache Superset](/knowledgebase/apache-superset/), its focus is letting people who do not write SQL answer their own questions.

Metabase does not store or process data itself. It sends SQL to a connected database or query engine and charts what comes back. On a data lakehouse, that means Metabase sits on top of the engine that reads your [Apache Iceberg](/knowledgebase/apache-iceberg/) tables.

## The Query Builder and SQL Editor

### The Visual Query Builder
A user picks a table, adds filters (for example, `Status is Inactive`), and groups or summarizes by a column such as `Cancellation Date`. Metabase turns those choices into SQL for the connected database, runs it there, and suggests a visualization based on the result shape.

### SQL Editor and Snippets
Analysts can write native SQL when the builder is not enough. SQL snippets let a team save reusable fragments, such as a standard revenue filter, and insert them into other queries so the logic stays consistent.

## Metadata and Models

Admins can edit table metadata: rename columns for display, hide technical columns, set semantic types, and declare foreign key relationships. Declared relationships let users follow a customer to their orders without writing a join. Metabase Models go further by saving a curated query as a reusable dataset. This is a lightweight layer inside one BI tool. For metric definitions shared across several tools and AI agents, a separate [semantic layer](/knowledgebase/semantic-layer/) in the engine or catalog is the more durable place.

## Embedding Analytics

SaaS teams use Metabase to show charts to their own customers. Guest embeds (the successor to static, signed embeds) use a signed JWT and work on every plan, including open source. SSO-based modular embedding, which exposes the query builder, SQL editor, and drill-through to end users, requires a Pro or Enterprise plan.

## Connecting Metabase to an Iceberg Lakehouse

Metabase never reads Parquet or Iceberg metadata directly, so the engine you choose determines performance, governance, and which [Iceberg catalog](/knowledgebase/iceberg-catalog/) you can use.

| Engine | Metabase driver status | Typical Iceberg setup |
|---|---|---|
| Amazon Athena | Official | Iceberg tables in [AWS Glue](/knowledgebase/aws-glue/) |
| Starburst ([Trino](/knowledgebase/trino/)) | Official (Starburst driver) | Iceberg connector with a REST, Glue, or Hive catalog |
| Spark SQL / Databricks | Official | Iceberg via Spark catalogs, or Unity Catalog |
| Dremio | Not an official driver; check Metabase's community drivers | Iceberg via Polaris, Nessie, Glue, or other catalogs, with Reflections for acceleration |
| [DuckDB](/knowledgebase/duckdb/) / [ClickHouse](/knowledgebase/clickhouse/) | ClickHouse official; DuckDB community | Iceberg extensions or table functions for small to mid-size workloads |

Two practical points. First, dashboards fire many concurrent queries, so put caching or acceleration (materialized views, Dremio Reflections, or Metabase's own result caching) in front of large fact tables. Second, keep access rules in the engine or catalog rather than only in Metabase, so the same rules apply when people query from notebooks or agents.

For background on where BI tools fit in a governed lakehouse, read [What Is a Semantic Layer?](/blog/2026-02-semantic-layer-01-what-is-a-semantic-layer/) and [Headless BI: How a Universal Semantic Layer Replaces Tool-Specific Models](/blog/2026-02-semantic-layer-08-headless-bi/).

## Summary

Metabase gives non-technical users a point-and-click way to query data, with a SQL editor for analysts and embedding for product teams. On a lakehouse it is a presentation layer: pair it with an engine that reads Iceberg well and with governance that lives below the BI tool.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
