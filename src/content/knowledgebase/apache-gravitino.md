---
title: "Apache Gravitino vs Polaris and Unity Catalog OSS as a Metadata Layer"
meta_title: "Apache Gravitino vs Polaris and Unity Catalog | Glossary"
description: "Apache Gravitino is an open source metadata lake that federates many catalogs behind one API. See how it serves Iceberg and compares to Polaris and Unity."
---

Apache Gravitino is an open source, federated metadata lake. It manages metadata in place across many sources (Hive Metastore, [Apache Iceberg](/knowledgebase/apache-iceberg/) catalogs, relational databases such as MySQL and PostgreSQL, Kafka, and file stores like HDFS and S3) and exposes them through one API and one governance layer. Gravitino entered the Apache Incubator in June 2024, graduated to an Apache top-level project in June 2025, and reached its 1.0 release later that year.

Large organizations rarely have one catalog. A single company may run a Hive Metastore for older Hadoop tables, an Iceberg REST catalog for new pipelines, and several operational databases. Gravitino sits above these as a "catalog of catalogs" so engines and people see one namespace instead of many.

## How Gravitino Works

### Unified namespace
Gravitino organizes everything under a metalake, then catalogs, schemas, and tables (or topics, filesets, and models for non-tabular assets). It manages metadata directly in the underlying sources rather than copying it, so changes made in those systems show up through Gravitino. Connectors for Trino, Apache Spark, Apache Flink, and Daft let those engines query everything Gravitino manages without changing their SQL dialect.

### Iceberg REST catalog service
Gravitino ships an Iceberg REST catalog service backed by Hive, JDBC, or another REST catalog. It can vend temporary credentials for S3, GCS, OSS, and ADLS. It runs either standalone or as an auxiliary service inside the Gravitino server; access control on the Iceberg REST endpoint is supported only in the auxiliary mode.

### Access control
Gravitino uses role-based access control: privileges are grouped into roles, roles are granted to users and groups, and an explicit DENY overrides any ALLOW. Gravitino enforces these checks itself on its own REST API and its Iceberg REST service. For some catalogs, enforcement can be pushed down to external systems such as Apache Ranger. Authorization is off by default.

### AI assets
Beyond tables, Gravitino catalogs filesets and ML models, and recent releases added a Lance REST service and a Model Context Protocol (MCP) server.

## Gravitino vs Polaris vs Unity Catalog OSS

| | Apache Gravitino | [Apache Polaris](/knowledgebase/apache-polaris/) | [Unity Catalog OSS](/knowledgebase/unity-catalog/) |
|---|---|---|---|
| Governance | ASF top-level project (2025) | ASF top-level project (2026) | LF AI & Data project, sandbox stage |
| Core idea | Federate many existing catalogs and asset types | Iceberg-native REST catalog | Single catalog for tables, files, functions, and models |
| Iceberg | Iceberg REST service plus federation of other catalogs | Implements the Iceberg REST spec as its primary API | Iceberg REST API compatibility; Delta Lake first |
| Non-Iceberg sources | Hive, MySQL, PostgreSQL, Kafka, filesets, models | Focused on Iceberg | Delta Lake, Parquet, CSV, JSON, volumes, models |
| Access control | RBAC enforced in Gravitino, optional pushdown | RBAC with credential vending | Governance of data and AI assets through one interface |

Pick Polaris when Iceberg is your standard and you want a focused REST catalog that every engine (Spark, Flink, Trino, [Dremio](/knowledgebase/dremio-cloud/)) speaks natively. Pick Gravitino when the problem is many existing catalogs and asset types that you need to browse and govern from one place. Unity Catalog OSS fits teams centered on Delta Lake. These are not mutually exclusive: Gravitino can federate an Iceberg REST catalog, so it can sit above Polaris rather than replace it. See also [metadata catalog](/knowledgebase/metadata-catalog/) and the [Iceberg REST catalog specification](/knowledgebase/rest-catalog-specification/).

## Summary

Apache Gravitino is a federation layer for metadata. It does not replace Hive Metastore, Glue, or an Iceberg catalog; it connects them under one namespace, one API, and one RBAC model, and it also offers its own Iceberg REST service.

## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
