---
title: "What is Federated Data Access?"
meta_title: "What is Federated Data Access? | Expert Data Lakehouse & AI Glossary"
description: "Federated data access lets one query engine read data across separate sources without copying it first. Learn how engines like Dremio query data where it lives."
---

## What is Federated Data Access?

Federated data access is the ability to query data in several independent systems, such as object storage, relational databases, data warehouses, and NoSQL stores, through one interface, without first copying that data into a single central store. A user writes one SQL query, and a federated query engine reads from each source and combines the results.

It is a general architectural approach, not a single vendor's feature. The idea goes back to federated database systems and data virtualization products, and it is implemented today by engines such as [Trino](/knowledgebase/trino/), [Presto](/knowledgebase/presto/), Dremio, Starburst, and Denodo, as well as by cloud services such as Amazon Athena federated queries and Google BigQuery federated queries. It is closely related to [data virtualization](/knowledgebase/data-virtualization/).

## How It Works

1. **Connectors:** The engine has a connector for each source type. A connector exposes the source's tables and their schemas to the engine and knows how to read data from it.
2. **Unified namespace:** Tables from all connected sources appear in one catalog, so a query can reference, for example, `postgres.sales.orders` and `lake.analytics.customers` together.
3. **Planning and pushdown:** The engine's optimizer splits the query into parts. Where a source can do work itself, such as filtering, projecting columns, or sometimes aggregating or joining, the engine pushes that work down to reduce the data it has to transfer.
4. **Execution:** The engine reads the remaining data from each source and performs cross-source joins and aggregations in its own workers, then returns one result.

## Benefits

* **Less data copying:** Teams can query data where it lives instead of building a pipeline for every source before analysis.
* **Faster access to new sources:** Connecting a source can make it queryable without waiting for an ingestion project.
* **One access point:** Users and tools connect to one engine, and governance rules can be applied at that layer.

## Limitations

* **Performance depends on the sources:** A slow or busy operational database makes federated queries slow, and heavy analytical queries can add load to production systems.
* **Network transfer:** Cross-source joins can move large amounts of data between systems, especially when filters cannot be pushed down.
* **Uneven capabilities:** Connectors differ in what they can push down and which data types they support.

Engines address these limits in different ways, for example with caching or materialization. Dremio, for instance, can build [Reflections](/knowledgebase/data-reflections/) over federated sources so repeated queries read an optimized copy instead of hitting the source each time. Many teams also combine federation with ingestion: frequently used, heavy data goes into [Apache Iceberg](/knowledgebase/apache-iceberg/) tables on the lakehouse, and federation covers the rest.

## Frequently Asked Questions

### Is federated data access a proprietary Dremio concept?
No. Federated querying is a general approach supported by many open-source and commercial engines. Dremio is one implementation.

### Does federation replace a data lakehouse?
Usually not. Federation is a way to reach data in many systems. A [data lakehouse](/knowledgebase/data-lakehouse/) is a way to store and manage analytical data in open formats. Many architectures use both.

### How does federation affect governance?
A federated engine can apply access controls, masking, and auditing at a single layer across sources. Each source's own permissions still apply to the credentials the engine uses, so both layers need to be configured.

---

### Sources and further reading

- Trino documentation, [Connectors](https://trino.io/docs/current/connector.html)
- Amazon Athena, [Federated query](https://docs.aws.amazon.com/athena/latest/ug/connect-to-a-data-source.html)

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
