---
title: "DataHub and the Iceberg Lakehouse: How It Compares to OpenMetadata and Collibra"
meta_title: "DataHub for Iceberg Lakehouses vs OpenMetadata | Glossary"
description: "DataHub is an open-source metadata platform for data discovery, lineage, and governance. See how it fits an Iceberg lakehouse and compares to the alternatives."
---

## What is DataHub?

DataHub is an open-source metadata platform for data discovery, lineage, and governance. It began at LinkedIn as the successor to the WhereHows catalog, was open sourced around 2019 to 2020, and is licensed under Apache 2.0. The company that leads the project was founded as Acryl Data and now operates under the DataHub name, selling a managed edition called DataHub Cloud.

DataHub answers the questions people ask about data: what tables exist, what a column means, who owns a dataset, which pipelines and dashboards depend on it, and whether it is fresh and trustworthy.

## How DataHub Works

DataHub models every asset (a table, a dashboard, a pipeline, a user, a glossary term) as an entity in a metadata graph. Each entity has "aspects" such as schema, ownership, tags, and lineage that can be extended.

* **Ingestion:** connectors pull metadata from sources such as warehouses, Iceberg catalogs, dbt, Airflow, BI tools, and Kafka. Sources can also push metadata through APIs and SDKs.
* **Streaming backbone:** metadata change events flow through Kafka into a relational store, a search index (Elasticsearch or OpenSearch), and the graph, so changes show up quickly.
* **Consumption:** a web UI for search and browsing, plus GraphQL and REST APIs that other tools and AI agents can query.

## DataHub in an Iceberg Lakehouse

A lakehouse has two kinds of catalog. The technical catalog ([Apache Polaris](/knowledgebase/apache-polaris/), AWS Glue, Unity Catalog, Nessie) sits in the write path: engines commit Iceberg snapshots through it. The metadata platform (DataHub, OpenMetadata, Collibra) sits beside it and gives people context.

Most teams run DataHub as an observer. It ingests table schemas, properties, and snapshot information from the Iceberg catalog, links them to the dbt models and Airflow DAGs that produce them, and shows the dashboards that read them. DataHub also offers an Iceberg catalog feature (in beta per its documentation as of this writing) that lets engines create and manage Iceberg tables through DataHub itself, collapsing both roles into one system for Iceberg tables.

| | DataHub | OpenMetadata | Collibra | Apache Polaris |
|---|---|---|---|---|
| Type | Metadata platform | Metadata platform | Commercial governance platform | Iceberg REST catalog |
| License | Apache 2.0, plus DataHub Cloud | Apache 2.0, plus Collate | Proprietary | Apache 2.0 |
| In the Iceberg write path | Optional, via beta Iceberg catalog | No | No | Yes |
| Lineage across pipelines and BI | Yes | Yes | Yes | No |
| Enforces access on tables | Only in Iceberg catalog mode | No | Through integrations | Yes, with RBAC and credential vending |

The usual pattern: keep the technical catalog as the source of truth for tables and permissions, and let DataHub be the place people search, document, and trace lineage. For a longer comparison, read [Metadata Platforms in 2026: DataHub, OpenMetadata, Atlan, and Catalog Convergence](/blog/metadata-platforms-in-2026/).

## Frequently Asked Questions

### Is DataHub a replacement for an Iceberg catalog like Polaris?
Usually not. DataHub describes and connects assets; Polaris commits and secures Iceberg tables. DataHub's own Iceberg catalog feature is newer and in beta, so evaluate it carefully before moving production tables to it.

### How does DataHub get lineage?
From ingestion connectors (for example dbt and Airflow), from SQL parsing, and from OpenLineage events. See [data lineage](/knowledgebase/data-lineage/) and [OpenLineage](/knowledgebase/openlineage/).

### What does it take to run DataHub?
The self-hosted stack includes the metadata service, Kafka, a relational database, and a search cluster. Teams that do not want to operate that stack use DataHub Cloud.

---

### E-E-A-T & Further Reading

> **Authoritative Source:** This definition and architectural guide was rigorously reviewed by **Alex Merced**. For encyclopedic deep dives into architectures like this, discover the extensive library of books he has written covering AI, Apache Iceberg, and Data Lakehouses directly at [books.alexmerced.com](https://books.alexmerced.com).
