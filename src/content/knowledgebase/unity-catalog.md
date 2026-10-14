---
title: "What is Unity Catalog?"
meta_title: "What is Unity Catalog? | Expert Data Lakehouse Architecture Guide"
description: "Unity Catalog is Databricks' governance catalog for lakehouse data and AI assets, covering access control, lineage, data sharing, and its open source release."
---

# What is Unity Catalog?

Unity Catalog is a centralized governance and catalog service for the [data lakehouse](/knowledgebase/data-lakehouse/). Developed by Databricks, it provides one place to manage access permissions, audit logs, and data lineage for data and AI assets.

Historically, organizations dealt with fragmented security models. They managed data access policies inside their data warehouse, separate policies for their cloud storage buckets (via AWS IAM or Azure role-based access control), and another set of rules for their dashboards. Keeping these in sync was error-prone and made audits harder. Unity Catalog addresses this by applying one security model to many asset types, including tables, volumes of files, machine learning models, and functions.

## Centralized Governance Architecture

Unity Catalog simplifies governance by moving access controls out of individual compute clusters and into the catalog layer.

### Unified Role-Based Access Control (RBAC)
In Unity Catalog, privileges are managed with SQL `GRANT` statements. A security administrator can run a command such as: ``GRANT SELECT ON TABLE sales_data TO `finance_team` ``. 

That rule applies across Databricks compute. Whether a member of the finance team queries the table from a Databricks SQL warehouse or from a PySpark notebook, Unity Catalog enforces the same access rule, and requests from unauthorized users are rejected in every workspace attached to that metastore.

### Automated Data Lineage
In large enterprise environments, understanding how data flows matters for debugging and regulatory compliance (like GDPR or CCPA). Unity Catalog captures lineage automatically for queries run on Databricks, down to the column level. It provides a graph showing which source tables populated which Silver tables, and which Gold tables feed a specific dashboard. If a column contains bad data, data engineers can use the lineage graph to trace the problem back to its source.

## Multi-Cloud and Data Sharing

Many large enterprises use more than one cloud, for example with analytics on AWS, machine learning on Google Cloud, and other applications on Azure.

Unity Catalog is available on Databricks on AWS, Azure, and Google Cloud, with a metastore per region. It wraps cloud-specific IAM roles and storage credentials in catalog objects (storage credentials and external locations), so administrators manage data access through the catalog rather than through each cloud's console. 

Unity Catalog also incorporates Delta Sharing, an open protocol for sharing data across organizations. An enterprise can use Delta Sharing to give an external partner access to a live dataset without requiring the partner to use Databricks. The partner can read the shared data with clients such as Apache Spark, pandas, or Power BI, instead of relying on FTP transfers or extra copies.

## Open Sourcing Unity Catalog

In June 2024, Databricks open-sourced Unity Catalog and contributed it to the LF AI & Data Foundation, a move aimed at addressing concerns about vendor lock-in.

Open-source Unity Catalog exposes a REST API, including an implementation of the Iceberg REST catalog interface for reading tables. This allows other engines (such as Apache Spark, DuckDB, or Daft) to connect to a Unity Catalog server and read Delta Lake or [Apache Iceberg](/knowledgebase/apache-iceberg/) tables, without running them on Databricks compute.

## Summary of Technical Value

Unity Catalog addresses a hard governance problem in the decoupled data lakehouse. By centralizing access controls, lineage tracking, and cloud credential management in one auditable catalog, it helps enterprises widen data access safely. The open-source release gives organizations more options to use the same catalog model with engines beyond Databricks.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
