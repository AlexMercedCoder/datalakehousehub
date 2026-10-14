---
title: "Zero-Copy Architecture: What It Means with Apache Iceberg and Arrow"
meta_title: "Zero-Copy Architecture with Iceberg and Arrow | Glossary"
description: "Zero-copy architecture means querying or sharing data where it lives instead of duplicating it. See the patterns behind the term in an Iceberg lakehouse."
---

## What Is Zero-Copy Architecture?

Zero-copy architecture is a design approach where engines, teams, and platforms work on one stored copy of the data instead of extracting and loading duplicates into each system. In an analytics context it usually means querying or sharing data in place, for example many engines reading the same [Apache Iceberg](/knowledgebase/apache-iceberg/) tables in object storage rather than each keeping its own copy.

The term is used loosely. Data still moves over the network when a query runs; what goes away is the persistent, separately managed copy and the pipeline that maintains it.

## Two Meanings of Zero-Copy

- **Zero-copy in memory.** In systems programming, zero-copy means passing data between components without serializing or copying buffers. [Apache Arrow](/knowledgebase/apache-arrow/) is built for this: processes and libraries that share the Arrow columnar format can hand off data without conversion, and [Arrow Flight](/knowledgebase/arrow-flight/) moves Arrow batches over the network without row-by-row translation.
- **Zero-copy in data architecture.** At the platform level, it means avoiding duplicate datasets across warehouses, marts, and SaaS tools. Open table formats and open catalogs make this practical because any compatible engine can read the same tables.

## Patterns That Get Called Zero-Copy

| Pattern | What happens to the bytes | Makes a persistent copy? |
|---|---|---|
| Shared open tables | Many engines (Dremio, Trino, Spark, DuckDB) read one set of Iceberg tables through a shared catalog | No |
| [Query federation](/knowledgebase/data-federation/) | An engine pushes queries to source systems and combines results | No |
| Format virtualization | Metadata is generated so one format can be read as another (for example with Apache XTable) | No, metadata only |
| Sharing protocols | A provider grants scoped, short-lived access to underlying files | No |
| Catalog federation | One catalog exposes tables registered in another catalog | No |
| Mirroring and replication | Data is continuously replicated into another platform | Yes |
| Caching and materialization | Engine keeps derived copies (result caches, materialized views, reflections) to speed queries | Yes, managed by the engine |

The last two are still copies, even when vendors market them as zero-copy. That is fine, but it matters for cost, freshness, and governance.

## Zero-Copy in an Iceberg Lakehouse

A practical zero-copy lakehouse looks like this: data lands once in object storage as Iceberg tables, an open catalog such as [Apache Polaris](/knowledgebase/apache-polaris/) or AWS Glue tracks them, and each engine connects to that catalog. Access policies live in the catalog or a semantic layer instead of being rebuilt in every tool, and credential vending gives each engine short-lived access to just the files it needs.

Trade-offs to plan for: federated queries can be slow or expensive when a source system is far away or charges for egress, and query-time access can load source systems that were not sized for analytics. Sometimes a governed copy is the right answer. [What Zero-Copy Actually Costs](/blog/zero-copy-actually-costs/) compares the patterns above in detail, and [What Zero-Copy Data Sharing Actually Does](/blog/zero-copy-data-sharing-iceberg/) covers sharing between Salesforce, Snowflake, and Databricks. See also [data virtualization](/knowledgebase/data-virtualization/) and [zero-ETL](/knowledgebase/zero-etl/).

---

### E-E-A-T & Further Reading
