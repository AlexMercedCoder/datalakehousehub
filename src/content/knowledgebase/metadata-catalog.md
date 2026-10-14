---
title: "What is Metadata Catalog?"
meta_title: "What is Metadata Catalog? | Expert Data Lakehouse & AI Glossary"
description: "A metadata catalog is a central registry that tracks where tables live, their schemas, and their current state, so query engines can find lakehouse tables."
---

## What is Metadata Catalog?

A metadata catalog is a central service that records which tables exist, their schemas, and where their data and metadata live, so query engines and people can find and use them. 

In a lakehouse, data files sit in object storage, and an engine needs a way to resolve a name like `sales.orders` to a table. A **Metadata Catalog** provides that lookup. Examples include the Hive Metastore, AWS Glue Data Catalog, Apache Polaris, Project Nessie, and Unity Catalog. Business-facing data catalogs, such as Alation or Collibra, sit on top and add search, documentation, and ownership.

## Core Architecture and Mechanics

A technical metadata catalog for Iceberg tables does the following:

* **Maps each table name to its current metadata file.** For Iceberg, the catalog stores a pointer to the latest metadata file and swaps it atomically on each commit, which is what makes transactions safe across engines.
* **Organizes tables into namespaces.** Namespaces (similar to databases or schemas) group tables and views for discovery and permissions.
* **Exposes a standard API.** The Iceberg REST Catalog specification lets any compatible engine talk to any compliant catalog, and many catalogs add access control and credential vending.

With a shared catalog, Spark, Flink, Trino, Dremio, and other engines see the same set of [Apache Iceberg](/knowledgebase/apache-iceberg/) tables.

## Why Metadata Catalog Matters in the Modern Data Stack

The catalog decides which engines can see and write your tables. An open, standards-based catalog lets many engines share the same tables without copying data, which reduces vendor lock-in.

For organizations with many teams, a central catalog gives one place to register tables, manage permissions, and find data, instead of each tool keeping its own list.

### Key Benefits
- **Discovery:** One place to find tables and their schemas.
- **Vendor Neutrality:** Open catalog APIs let different engines share the same tables.
- **Consistency:** Atomic metadata pointer updates keep concurrent commits safe.

## Frequently Asked Questions

### What makes a Lakehouse different from a Data Lake?
A standard data lake is just a collection of files. A lakehouse adds a metadata layer that provides warehouse-like features (transactions, schema enforcement) directly to those files. The catalog is the entry point to that metadata layer.

### Why use an Open Table Format?
Open formats like Apache Iceberg keep your data readable by many engines instead of one proprietary database. Pairing them with a catalog that implements the Iceberg REST specification keeps the catalog layer open as well.

### How does Metadata Catalog impact data governance and security?
Many catalogs enforce role-based access control on catalogs, namespaces, and tables, and record audit logs of who accessed what. Because every engine goes through the catalog, those rules apply consistently.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
