---
title: "What is OpenLineage?"
meta_title: "What is OpenLineage? | Expert Data Lakehouse & AI Glossary"
description: "OpenLineage is an open standard for collecting lineage metadata from data pipelines, whatever tool runs them. Learn its role in lakehouse data governance."
---

OpenLineage is an open standard and framework for collecting [data lineage](/knowledgebase/data-lineage/) metadata from data pipelines as they run. It defines a common JSON event format that schedulers, query engines, and transformation tools emit when a job starts, finishes, or fails, describing which datasets the job read and which it wrote. Any backend that understands the format can collect those events and assemble a lineage graph across tools. OpenLineage is a graduated project of the LF AI & Data Foundation, and [Marquez](/knowledgebase/marquez/), another LF AI & Data project, is its reference implementation.

## How It Works

The specification is built on three core entities:

* **Job:** a process that consumes or produces data, such as an Airflow task, a Spark application, a dbt model, or a SQL query. Jobs have a unique name within a namespace.
* **Run:** one execution of a job, identified by a client-generated UUID.
* **Dataset:** a table or file, identified by a namespace and a name derived from its physical location.

Integrations send **RunEvents** to a lineage backend over HTTP or another transport. Each event carries an `eventType`: `START`, `RUNNING`, `COMPLETE`, `ABORT`, `FAIL`, or `OTHER`. `COMPLETE`, `ABORT`, and `FAIL` are terminal, so no further events follow for that run. Inputs and outputs can be reported at start, at completion, or both. The spec also defines design-time **JobEvents** and **DatasetEvents** for metadata that is not tied to a run.

Details travel as **facets**, typed extensions attached to runs, jobs, or datasets. Examples in the spec include a dataset `schema` facet, `dataQualityMetrics` and `dataQualityAssertions` on inputs, `outputStatistics` on outputs, a `sql` facet on runs, and `sourceCodeLocation` on jobs. Custom facets let vendors add their own fields without breaking the core format.

The project lists integrations for Apache Airflow, Apache Spark, Apache Flink, Apache Hive, dbt, Trino, Great Expectations, and others, so lineage is captured from the tools doing the work rather than reconstructed later from logs.

| | OpenLineage | Catalog-native lineage | Manual documentation |
|---|---|---|---|
| Source of truth | Events emitted at run time | One platform's own query history | People |
| Cross-tool coverage | Any tool with an integration | Usually limited to that platform | As complete as people keep it |
| Freshness | Each run | Each query | Often stale |
| Run status and timing | Yes, per run | Varies | No |

## OpenLineage in the Lakehouse

A lakehouse spreads work across many engines: Spark or Flink for ingestion, dbt for transformation, Dremio or Trino for queries, Airflow for scheduling, all reading and writing shared [Apache Iceberg](/knowledgebase/apache-iceberg/) tables through a catalog. No single engine sees the whole path from source to dashboard. OpenLineage gives each tool a shared way to report its piece, and the backend joins those pieces on dataset identifiers.

That cross-engine view supports several jobs:

* **Impact analysis:** before changing a column in a Silver table, find every downstream job and Gold table that reads it.
* **Root cause analysis:** when a dashboard number is wrong, trace back through failed or late runs.
* **Governance and compliance:** show where regulated data flowed, which complements [data provenance](/knowledgebase/data-provenance/) and [data observability](/knowledgebase/data-observability/) tooling.
* **AI context:** lineage tells an analytics agent which tables are derived from which sources and how fresh they are, which helps it pick trustworthy inputs.

The Hub's [OpenLineage as the Spine of Data Observability](/blog/2026-05-openlineage-observability/) walks through a working setup, and [The Context Layer for AI Agents](/blog/context-layer-semantic-lineage-quality-ai-agents/) covers its role for agents.

## Summary

OpenLineage standardizes how pipelines report what they read, what they wrote, and how each run went. With integrations across the major lakehouse engines and schedulers, it is a practical route to end-to-end lineage in a multi-engine architecture.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
