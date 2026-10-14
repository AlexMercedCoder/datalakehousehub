---
title: "Amundsen data catalog: archived in 2026, and how it compares to DataHub and OpenMetadata"
meta_title: "Amundsen Data Catalog vs DataHub and OpenMetadata"
description: "Amundsen is Lyft's open-source data discovery catalog, archived in September 2026. See how it compares to DataHub and OpenMetadata and fits Iceberg catalogs."
---

Amundsen is an open-source data discovery and metadata engine created at Lyft, described publicly in April 2019 and open sourced later that year. It gives analysts a search interface over table metadata: descriptions, owners, columns, last-updated times, and popularity. The project was hosted by the LF AI & Data Foundation.

**Project status:** the [amundsen-io/amundsen](https://github.com/amundsen-io/amundsen) GitHub repository was archived in September 2026. Its README states that the project was archived due to inactivity and that the code remains available for historical purposes. The last tagged release was databuilder 7.5.1 in August 2024, and the old amundsen.io documentation domain no longer serves the project docs. Treat Amundsen as a reference design, not a platform to adopt for new work.

## Architecture

Amundsen is split into three services plus an ingestion library:

- **Frontend service:** a Flask application with a React UI where users search and browse tables.
- **Search service:** a REST proxy over Elasticsearch (or Apache Atlas's search API) that indexes table metadata.
- **Metadata service:** serves table, column, user, and dashboard metadata, stored in Neo4j by default with Apache Atlas as an alternative backend. Metadata is modeled as a graph of tables, columns, users, and dashboards.
- **Databuilder:** a Python ingestion library with extractors for sources such as Hive Metastore, AWS Glue, Snowflake, BigQuery, Postgres, Dremio, dbt, and OpenLineage. Lyft ran it as a daily Airflow DAG to refresh the catalog.

## Amundsen vs DataHub vs OpenMetadata

| | Amundsen | [DataHub](/knowledgebase/datahub/) | OpenMetadata |
|---|---|---|---|
| Origin | Lyft | LinkedIn | Created by the team behind Collate |
| Status (Oct 2026) | Archived Sept 2026 | Actively developed | Actively developed |
| Metadata storage | Neo4j or Atlas, plus Elasticsearch | Its own metadata service with a search index | Its own metadata server with a search index |
| Ingestion | Batch Databuilder jobs | Push and pull ingestion framework | Pull-based connectors |
| [Lineage](/knowledgebase/data-lineage/) | Limited; table and dashboard relationships | Table and column level | Table and column level |
| Iceberg | No Iceberg extractor; reaches Iceberg tables only through Hive Metastore, Glue, or engine extractors | Iceberg source (beta) reads REST, Glue, and SQL catalogs | Iceberg tables surfaced through engine connectors such as Trino, Athena, or Snowflake |

If you are running Amundsen today, DataHub and OpenMetadata are the usual migration targets, since both cover search, ownership, glossary, and lineage in one project.

## Discovery catalogs vs Iceberg catalogs

These are two different things that share a name. An [Iceberg catalog](/knowledgebase/iceberg-catalog/) such as [Apache Polaris](/knowledgebase/apache-polaris/), AWS Glue, or [Project Nessie](/knowledgebase/project-nessie/) is a technical service: it tracks the current metadata file for each table so engines like Dremio, Trino, and Spark can read and commit to it, and it can enforce access control. A discovery catalog such as Amundsen or DataHub sits above that layer and adds the human context: descriptions, owners, glossary terms, and lineage across tools. In a lakehouse you typically need both, with the discovery tool ingesting from the Iceberg catalog or from the query engine that reads it.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
