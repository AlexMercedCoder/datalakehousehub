---
title: "What is Universal Semantic Layer?"
meta_title: "What is Universal Semantic Layer? | Expert Data Lakehouse & AI Glossary"
description: "A universal semantic layer defines business metrics and logic once so every BI tool reads them the same way, and this entry covers how Dremio applies the idea."
---

## What is Universal Semantic Layer?

A universal semantic layer is a shared layer of business definitions, such as metrics, dimensions, joins, and friendly names, that sits between data storage and the tools people use to analyze data. "Universal" means the definitions are written once and served to many consumers, including BI tools, notebooks, applications, and AI agents, instead of being rebuilt inside each tool.

The idea is general, not a single vendor's feature. It extends the [semantic layer](/knowledgebase/semantic-layer/) concept that BI tools have long had internally (for example, Business Objects universes or Looker's LookML models) by moving those definitions out of any one tool so they can be shared. Several products implement it in different ways, including the dbt Semantic Layer (built on MetricFlow), Cube, AtScale, and Dremio.

## The Problem It Solves

Without a shared semantic layer, each dashboard tool, spreadsheet, and script defines metrics on its own. "Revenue" in one dashboard may exclude refunds while another includes them, and "active customer" may mean different time windows on different teams. Reconciling those differences takes time and erodes trust in the numbers. A universal semantic layer gives each metric one governed definition that every tool reads.

## How It Works

Implementations differ, but most combine some of these pieces:

* **A semantic model:** definitions of business entities, dimensions, measures, metrics, and the joins between tables, written in code (often YAML or SQL) or in a modeling interface.
* **A query interface:** consumers request metrics by name and dimension, and the layer generates SQL for the underlying engine. Interfaces include SQL, JDBC/ODBC, Arrow Flight, REST or GraphQL APIs, and, increasingly, MCP servers for AI agents.
* **Governance:** access rules, such as row- and column-level security, applied in the layer so every consumer gets the same restrictions.
* **Performance features:** caching, pre-aggregations, or materializations so that repeated metric queries are fast.

## Approaches to Implementation

* **Metrics-layer tools** such as the dbt Semantic Layer and Cube store metric definitions in code and compile requests into SQL for a separate warehouse or engine.
* **OLAP-style semantic platforms** such as AtScale present a dimensional model to BI tools and manage aggregates in the underlying platform.
* **Engine-integrated layers** build the semantic model into the query engine. In Dremio, the semantic layer is made of views organized in spaces and folders, with wikis, tags, and fine-grained access controls, and with [Reflections](/knowledgebase/data-reflections/) used to accelerate queries on those views. Because Dremio also [federates](/knowledgebase/federated-data-access/) queries across sources, the views can span lakehouse tables and other databases.

There are also efforts to standardize how semantic definitions are exchanged between tools, such as the Open Semantic Interchange (OSI) initiative announced in 2025 by a group of vendors.

## Why It Matters on a Lakehouse

On an open [data lakehouse](/knowledgebase/data-lakehouse/), many engines and tools read the same [Apache Iceberg](/knowledgebase/apache-iceberg/) tables. A universal semantic layer gives them the same business meaning on top of the same data. It also gives AI agents a governed, documented set of metrics to query, which reduces the chance that an agent writes SQL that computes a metric differently from the official definition.

## Frequently Asked Questions

### Is a universal semantic layer a proprietary Dremio concept?
No. It is a general architectural idea with several implementations. Dremio is one of them, alongside tools such as the dbt Semantic Layer, Cube, and AtScale.

### Does it require copying data?
Generally no. Most semantic layers query data in place through an engine. Some create caches or aggregate tables for performance.

### How does it affect governance?
Defining access rules and certified metrics in one place means they apply to every tool that queries through the layer. Tools that bypass the layer and query tables directly are not covered, so organizations usually route analytical access through it.

---

### Sources and further reading

- dbt documentation, [dbt Semantic Layer](https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl)
- Cube documentation, [Semantic layer](https://cube.dev/docs)
- Dremio documentation, [Reflections](https://docs.dremio.com/current/acceleration/)

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
