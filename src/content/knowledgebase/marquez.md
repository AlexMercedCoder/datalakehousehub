---
title: "Marquez: The OpenLineage Reference Server for Lakehouse Lineage"
meta_title: "Marquez: OpenLineage Lineage Server for Lakehouses"
description: "Marquez is an open source metadata server that collects OpenLineage events and shows data lineage. See how it compares to DataHub and catalog lineage."
---

## What is Marquez?

Marquez is an open source metadata service that collects, stores, and visualizes [data lineage](/knowledgebase/data-lineage/): which jobs ran, which datasets they read and wrote, and how each run went. It was created at WeWork, is licensed under Apache 2.0, and is a graduated project of the LF AI & Data Foundation. It is the reference implementation of the [OpenLineage](/knowledgebase/openlineage/) standard.

Marquez is not an access control or data quality tool. It records what happened in your pipelines so you can trace where data came from and what a change will affect downstream.

## How Marquez Works

* **OpenLineage events in:** integrations for Spark, Airflow, Flink, dbt, and other tools emit OpenLineage run events (start, complete, fail) describing a job, its run, and its input and output datasets. Marquez accepts these through its HTTP API.
* **Metadata model:** Marquez stores namespaces, jobs, runs, and datasets in PostgreSQL, with versions of each, so you can see how a dataset's schema or a job's inputs changed over time.
* **Web UI and API:** a lineage graph shows upstream and downstream dependencies; the API lets other tools query lineage programmatically.

Because the events follow an open spec, you can start with Marquez and later send the same events to another backend without changing your pipelines.

## Marquez in an Iceberg Lakehouse

When Spark or Flink jobs write [Apache Iceberg](/knowledgebase/apache-iceberg/) tables, the OpenLineage integrations report the tables as datasets, so Marquez can show a path such as Kafka topic to bronze table to silver table to gold table. That helps answer impact questions ("which dashboards break if I change this column?") and audit questions ("which jobs wrote to this table last night?").

| | Marquez | DataHub / OpenMetadata | Catalog lineage (Unity Catalog, Dremio, cloud catalogs) |
|---|---|---|---|
| Focus | Run-level lineage from OpenLineage events | Broad metadata platform: search, ownership, glossary, lineage | Lineage of objects the platform itself manages |
| Lineage source | OpenLineage events | Connectors plus OpenLineage ingestion | Engine and catalog internals |
| Footprint | API server, UI, PostgreSQL | Larger, several services | Built in |
| Best fit | Teams standardizing on OpenLineage that want a light backend | Enterprise-wide discovery and governance | Teams mostly inside one platform |

For more on the standard and the wider tool landscape, read [OpenLineage as the Spine of Data Observability](/blog/2026-05-openlineage-observability/), [Metadata Platforms in 2026](/blog/metadata-platforms-in-2026/), and [Introduction to Data Engineering Concepts: Metadata, Lineage, and Governance](/blog/2025-05-intro-to-data-engineering-concepts-11/).

## Frequently Asked Questions

### What is the difference between Marquez and OpenLineage?
OpenLineage is the specification and the integrations that emit events. Marquez is a server that stores those events and serves lineage from them.

### Does Marquez enforce governance policies?
No. It records lineage and run history. Access policies live in your catalog or query engine; Marquez helps you see the impact of changes.

### Is Marquez still maintained?
The repository still receives commits, but the most recent tagged release is 0.50.0 from October 2024. Check the GitHub releases page and weigh release cadence before choosing it for production.

---

### E-E-A-T & Further Reading

> **Authoritative Source:** This definition and architectural guide was rigorously reviewed by **Alex Merced**. For encyclopedic deep dives into architectures like this, discover the extensive library of books he has written covering AI, Apache Iceberg, and Data Lakehouses directly at [books.alexmerced.com](https://books.alexmerced.com).
