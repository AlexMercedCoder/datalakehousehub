---
title: "System Architecture: Principles and How They Shape a Data Lakehouse"
meta_title: "System Architecture for a Data Lakehouse | Glossary"
description: "System architecture is the high-level design of a system's components and how they interact. See its core tradeoffs and how they map to lakehouse layers."
---

System architecture is the high-level design of a software system: which components it has, what each one is responsible for, how they communicate, and how the whole behaves under load and failure. It sits above code. Individual services can be well written and the system can still fail if, for example, every service depends on one database with no failover.

Architecture is mostly about tradeoffs. Faster, more available, cheaper, simpler, and more secure pull against each other, and the architect's job is to choose which to favor for a given workload and to write that choice down.

## Core Concerns

### Scalability
- **Vertical scaling:** give one machine more CPU and memory. Simple, but it has a ceiling and a single point of failure.
- **Horizontal scaling:** add more machines and spread the work. It scales further and can shrink when demand drops, but it requires stateless services or partitioned state.

### Availability and Fault Tolerance
Hardware, networks, and whole data centers fail. Systems stay up by replicating components across failure domains, such as multiple availability zones within a cloud region, with health checks and load balancers routing around failed instances. Availability targets (99.9%, 99.99%) should be set from business need, because each extra nine costs more in redundancy and operations. The [CAP theorem](/knowledgebase/cap-theorem/) describes the limit: during a network partition, a distributed system must choose between consistency and availability.

### Decoupling and Security
In a [monolithic architecture](/knowledgebase/monolithic-architecture/), one failure or one breach can affect everything. Decoupled systems split responsibilities into components with clear interfaces, so they can be scaled, deployed, and secured separately. Network segmentation, least-privilege access, and [zero trust](/knowledgebase/zero-trust-architecture/) principles limit how far an attacker can move after compromising one component.

### Cost and Operability
A design that is fast and highly available but that no one can operate, debug, or afford is not a good design. Observability, automation, and managed services are architectural decisions too.

## System Architecture of a Data Lakehouse

A [data lakehouse](/knowledgebase/data-lakehouse-architecture/) is a clear example of decoupled architecture. Each layer has one job and an open interface, so components can be replaced independently.

| Layer | Responsibility | Example components |
|---|---|---|
| Storage | Durable, cheap storage of files | Amazon S3, ADLS, Google Cloud Storage, MinIO |
| File format | Columnar data layout | Apache Parquet |
| Table format | Transactions, schema, snapshots | Apache Iceberg, Delta Lake |
| Catalog | Table discovery, atomic commits, access control | Apache Polaris, Project Nessie, AWS Glue, Unity Catalog OSS |
| Compute | Query and transformation engines | Dremio, Trino, Spark, Flink, DuckDB |
| Semantic and access | Business definitions, governed access for BI and AI agents | Semantic layers, BI tools, MCP servers |

The architectural principles above show up directly:

- **Storage and compute scale separately.** Adding query capacity does not mean copying data, and several engines can share the same tables.
- **Failure is contained.** If one engine cluster goes down, data in object storage and metadata in the catalog are untouched, and another engine can serve queries.
- **The catalog is the coordination point.** It must be highly available, because every commit and most queries depend on it. Treat it like a production database.
- **Security is enforced at the catalog and semantic layers,** so policies apply no matter which engine runs the query.

For deeper walkthroughs, see [Assembling the Apache Lakehouse: The Modular Architecture](/blog/2026-04-assembling-apache-lakehouse/), [Data Lakehouse Architecture Explained](/blog/2025-05-intro-to-data-engineering-concepts-16/), and [Five-Layer Agentic Lakehouse Architecture](/blog/five-layer-agentic-lakehouse-architecture-enterprise-pattern/).

## Summary

System architecture defines a system's components and their interactions, balancing scalability, availability, security, cost, and operability. The open lakehouse applies these principles by separating storage, table format, catalog, compute, and semantic layers so each can scale, fail, and evolve on its own.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
