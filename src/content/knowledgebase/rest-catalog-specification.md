---
title: "What is REST Catalog Specification?"
meta_title: "What is REST Catalog Specification? | Expert Data Lakehouse & AI Glossary"
description: "The Iceberg REST catalog spec is an open API that defines how engines talk to Apache Iceberg catalogs. See how it lets many engines share one lakehouse catalog."
---

## What is REST Catalog Specification?

The Iceberg REST Catalog Specification is an open API standard, published by the Apache Iceberg project as an OpenAPI definition, that defines how compute engines communicate with [Apache Iceberg](/apache-iceberg/) catalogs over HTTP.

In the lakehouse ecosystem, the **REST Catalog Specification** lets any engine that implements the client side work with any catalog that implements the server side. Before it existed, each engine needed a separate client for each catalog (Hive Metastore, AWS Glue, JDBC, Nessie, and others). With the REST spec, engines such as Spark, Flink, Trino, Dremio, and PyIceberg use one protocol, and catalog services such as [Apache Polaris](/knowledgebase/apache-polaris/), [Project Nessie](/knowledgebase/project-nessie/), AWS Glue, and Unity Catalog can expose Iceberg tables through it.

## Core Architecture and Mechanics

To understand the practical application of REST Catalog Specification, it helps to look at what the protocol defines:

* **Namespace, table, and view operations.** Engines list, create, load, rename, and drop namespaces, tables, and views through standard endpoints.
* **A commit protocol.** Clients send table updates along with requirements (for example, that the current snapshot has not changed), and the catalog applies the change atomically or rejects it, which keeps concurrent writers from overwriting each other.
* **Storage access delegation and server-side features.** The protocol supports credential vending and remote signing, so the catalog can give clients scoped access to the table's storage, and it defines optional server-side scan planning.

Because the catalog only tracks the pointer to each table's current metadata file, the rest of Iceberg's design (manifests, snapshots, hidden partitioning, time travel) works the same regardless of which REST catalog is used.

## Why REST Catalog Specification Matters in the Modern Data Stack

An open lakehouse reduces vendor lock-in and duplicate storage by allowing any compatible engine to query the same datasets without copying them. A standard catalog API is what lets those engines share tables safely.

For enterprises with decentralized teams, the REST spec allows each team to pick its engine while all of them commit to the same catalog. Moving logic like commits and access control to the server also means fixes and policies apply to every client at once, instead of being reimplemented in each engine's catalog client.

### Key Benefits
- **Interoperability:** One protocol works across many engines and catalog implementations.
- **Vendor Neutrality:** You can switch catalog services or engines without rewriting table data.
- **Centralized security:** Credential vending and server-side access control give one place to manage who can read or change each table.

## Frequently Asked Questions

### What makes a Lakehouse different from a Data Lake?
A standard data lake is a collection of files. A lakehouse adds a metadata layer that provides warehouse-like features (transactions, schema enforcement) directly on those files.

### Why use an Open Table Format?
Open formats like Apache Iceberg keep your data out of a single proprietary database; it stays readable by any engine that supports the format.

### How does REST Catalog Specification impact data governance and security?
The spec defines authentication hooks and storage access delegation, but the access rules themselves are implemented by each catalog service. Catalogs such as Apache Polaris add role-based access control (RBAC) and vend short-lived, table-scoped storage credentials so engines do not need broad storage keys.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
