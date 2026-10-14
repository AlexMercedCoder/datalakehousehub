---
title: "What is Iceberg Catalog?"
meta_title: "What is Iceberg Catalog? | Expert Data Lakehouse & AI Glossary"
description: "An Iceberg catalog is the service that maps each Apache Iceberg table name to its current metadata file and swaps that pointer atomically so commits stay safe."
canonical: "https://iceberglakehouse.com/iceberg/iceberg-catalog/"
---

## What is Iceberg Catalog?

An Iceberg catalog is the service that tracks the current metadata file for each Apache Iceberg table and swaps that pointer atomically when a commit happens.

In a lakehouse, the **Iceberg Catalog** is the entry point every engine uses to find tables. Iceberg keeps table state in metadata files stored next to the data, so the catalog does not need to track individual files. It maps a table name (like `sales.orders`) to the location of the table's current metadata file, and it makes commits safe by only accepting a new pointer if the previous one has not changed in the meantime. Common catalog implementations include the [REST catalog](/knowledgebase/rest-catalog-specification/) (implemented by services such as [Apache Polaris](/knowledgebase/apache-polaris/), [Project Nessie](/knowledgebase/project-nessie/), and AWS Glue), the Hive Metastore, and JDBC catalogs.

## Core Architecture and Mechanics

To understand the practical application of Iceberg Catalog, it helps to look at how it fits with the rest of Iceberg:

* **Provides the atomic commit step that gives Iceberg tables ACID transactions on top of cloud object storage.** Object stores do not offer multi-file transactions, so the catalog's compare-and-swap of the metadata pointer is what makes each commit all-or-nothing.
* **Points to the table's metadata tree (metadata files, manifest lists, and manifests) that tracks file states and enables time-travel queries.** The catalog stores the pointer; the metadata files store the history.
* **Works with Iceberg features like hidden partitioning that decouple the physical layout from the logical table structure.** Because those details live in table metadata, any engine that reads the catalog sees the same table definition.

Catalogs are used by engines such as Spark, Flink, Trino, and Dremio, so the same [Apache Iceberg](/apache-iceberg/) tables can be read and written by several tools, including transformation tools like dbt.

## Why Iceberg Catalog Matters in the Modern Data Stack

An open lakehouse reduces vendor lock-in and duplicate storage by allowing any compatible engine to query the same datasets without copying them. The catalog is what makes that sharing work: every engine has to agree on which metadata file is current.

For enterprises with decentralized teams, a shared catalog lets each team use the engine it prefers while working against the same tables. Many REST catalog implementations also add access control and credential vending, so permissions can be managed in one place rather than in each engine.

### Key Benefits
- **Multi-engine access:** Several engines can read and write the same tables through one catalog.
- **Vendor Neutrality:** The open REST catalog specification lets you switch catalog implementations or engines without rewriting data.
- **Central governance:** Catalogs that support access control give one place to manage who can read or change each table.

## Frequently Asked Questions

### What makes a Lakehouse different from a Data Lake?
A standard data lake is a collection of files. A lakehouse adds a metadata layer that provides warehouse-like features (transactions, schema enforcement) directly on those files.

### Why use an Open Table Format?
Open formats like Apache Iceberg keep your data out of a single proprietary database; it stays readable by any engine that supports the format.

### How does Iceberg Catalog impact data governance and security?
The catalog is a natural place to enforce governance because every engine goes through it to find tables. Catalogs such as Apache Polaris support role-based access control (RBAC) and can vend short-lived storage credentials scoped to the tables a user may access.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
