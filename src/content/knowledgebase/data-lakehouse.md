---
title: "What is Data Lakehouse?"
meta_title: "What is Data Lakehouse? | Expert Data Lakehouse & AI Glossary"
description: "A data lakehouse is an architecture that adds warehouse features like ACID transactions and schema enforcement to data lake files via open formats like Iceberg."
---

A data lakehouse is a data architecture that stores data in open file formats on low-cost object storage, like a [data lake](/knowledgebase/data-lake/), and adds the management features of a [data warehouse](/knowledgebase/data-warehouse/) on top: ACID transactions, schema enforcement and evolution, governance, and fast SQL. The term was described in the CIDR 2021 paper "Lakehouse: A New Generation of Open Platforms that Unify Data Warehousing and Advanced Analytics" (Armbrust, Ghodsi, Xin, and Zaharia), which characterized it by open direct-access formats such as Apache Parquet and ORC, first-class support for machine learning and data science, and strong SQL performance.

## How It Works

A lakehouse is built from independent layers that communicate through open standards:

* **Storage:** [object storage](/knowledgebase/object-storage/) such as Amazon S3, Azure Data Lake Storage, Google Cloud Storage, or an on-premises S3-compatible store.
* **File format:** columnar files, usually [Apache Parquet](/knowledgebase/apache-parquet/).
* **Table format:** an [open table format](/knowledgebase/open-table-format/) such as [Apache Iceberg](/knowledgebase/apache-iceberg/), Delta Lake, or Apache Hudi. It tracks which files make up a table, records each change as an atomic commit, and enables schema evolution, partition evolution, and [time travel](/knowledgebase/time-travel/).
* **Catalog:** a service such as [Apache Polaris](/knowledgebase/apache-polaris/) or another implementation of the Iceberg REST catalog specification, which tells engines where each table's current metadata lives and enforces access control.
* **Compute:** query and processing engines such as Dremio, Trino, Apache Spark, Apache Flink, and DuckDB, each reading and writing the same tables.
* **Semantic and access layer:** a [semantic layer](/knowledgebase/semantic-layer/) that defines business metrics and governed views for BI tools and AI agents.

Because storage and compute are separate, teams can scale them independently and point multiple engines at one copy of the data instead of loading it into each tool.

| | Data lake | Data warehouse | Data lakehouse |
|---|---|---|---|
| Storage | Files on object storage | Proprietary, managed by the vendor | Open files on object storage |
| Transactions | None at the table level | ACID | ACID through the table format |
| Schema | On read, loosely enforced | Enforced on write | Enforced, with evolution |
| Engines | Many, but no shared table semantics | Usually the vendor's own | Many, sharing tables via a catalog |
| Workloads | Data science, raw storage | BI and SQL | BI, SQL, data science, and AI |
| Lock-in risk | Low | Higher | Low, if formats and catalog are open |

## Organizing a Lakehouse

Most lakehouses organize tables with a [medallion architecture](/knowledgebase/medallion-architecture/): Bronze for raw ingested data, Silver for cleaned and conformed data, and Gold for business-ready tables and metrics. Ongoing maintenance keeps tables healthy: [compaction](/knowledgebase/data-compaction/) of small files, snapshot expiration, and orphan file cleanup. Some platforms automate that maintenance in the catalog.

## Why It Matters for AI

AI agents and analytics assistants need governed, well-described, current data. A lakehouse gives them a single set of tables reachable from many engines, catalog metadata that describes those tables, and a semantic layer that defines metrics consistently. That is why the [agentic lakehouse](/knowledgebase/agentic-lakehouse/) builds on the same foundation, adding interfaces such as MCP so agents can discover and query data under the same access rules as people.

To go deeper, read [Data Lakehouse 101](/blog/2024-8-data-lakehouses-101/), [The 2025 and 2026 Guide to the Data Lakehouse Ecosystem](/blog/2025-09-2026-guide-to-data-lakehouses/), and the [data lakehouse architecture](/knowledgebase/data-lakehouse-architecture/) entry.

## Summary

A data lakehouse combines open, low-cost lake storage with warehouse-grade transactions and governance through open table formats and catalogs. It lets many engines and AI agents share one governed copy of data, which is why it has become a common foundation for modern analytics.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
