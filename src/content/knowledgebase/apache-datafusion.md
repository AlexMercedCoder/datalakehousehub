---
title: "Apache DataFusion and Iceberg: The Embeddable Rust Query Engine"
meta_title: "Apache DataFusion with Iceberg: Rust SQL Engine | Glossary"
description: "Apache DataFusion is an embeddable SQL query engine written in Rust on Apache Arrow. See how it reads Iceberg tables and compares to DuckDB, Spark, and Trino."
canonical: "https://iceberglakehouse.com/iceberg/apache-datafusion/"
---

## What Apache DataFusion Is

Apache DataFusion is an open-source, extensible query engine written in Rust that uses [Apache Arrow](/knowledgebase/apache-arrow/) as its in-memory format. It ships as a library, not a server: developers add it to a Rust project and get a SQL parser, a DataFrame API, a query planner and optimizer, and a multi-threaded, vectorized execution engine that reads Parquet, CSV, JSON, and Arrow data.

DataFusion started as a subproject of Apache Arrow and became its own Apache top-level project in 2024. Projects built on it include InfluxDB 3, Apache DataFusion Comet (a Spark accelerator), and Ballista (distributed execution).

## How It Is Built

- **Rust.** Rust gives native performance without a garbage collector, and its compiler rules out whole classes of memory-safety bugs in safe code. That avoids the JVM pause behavior that tuned Java engines still contend with, though query latency still depends on the plan, the I/O, and the data.
- **Arrow end to end.** Data moves between operators as Arrow record batches, so an application that already speaks Arrow can hand data in and take results out without a conversion step.
- **Extension points.** DataFusion exposes traits (Rust interfaces) for nearly every layer: `TableProvider` and `CatalogProvider` for data sources, user-defined scalar, aggregate, and window functions, custom optimizer rules, and custom `ExecutionPlan` operators. Teams build their own engines by plugging into these rather than forking the codebase.

## DataFusion and Apache Iceberg

DataFusion learns about [Apache Iceberg](/knowledgebase/apache-iceberg/) through an integration crate that implements its catalog and table traits on top of iceberg-rust. Once you register an Iceberg catalog, such as an [Iceberg REST catalog](/knowledgebase/rest-catalog-specification/) served by [Apache Polaris](/knowledgebase/apache-polaris/), namespaces appear as schemas and tables become queryable with SQL. Scans use Iceberg metadata to prune manifests and data files before reading Parquet.

In September 2026 the Iceberg and DataFusion communities voted to move that integration out of `apache/iceberg-rust` into a new `apache/datafusion-iceberg` repository under the DataFusion project. [Why the Iceberg DataFusion Integration Is Moving](/blog/datafusion-iceberg-moves-to-apache-datafusion/) explains what moved and why. DataFusion also powers native Iceberg scans for Spark through Comet; see [DataFusion Comet 1.0 and Spark on Iceberg](/blog/datafusion-comet-1-spark-iceberg/).

## DataFusion vs Other Lakehouse Engines

| | Apache DataFusion | DuckDB | Apache Spark SQL | Trino |
|---|---|---|---|---|
| Form | Rust library | Embedded C++ database | Distributed JVM engine | Distributed JVM SQL server |
| Main use | Building engines and data services | Local and in-process analytics | Large batch ETL and streaming | Interactive SQL across sources |
| Extensibility | Deep (planner, operators, sources) | Extensions | Data sources, UDFs, plugins | Connectors, UDFs |
| Iceberg support | Via the `iceberg-datafusion` crate | `iceberg` extension | Mature, read and write | Mature, read and write |

Pick DataFusion when you are building a product or service that needs a query engine inside it. For a ready-to-use tool, [DuckDB](/knowledgebase/duckdb/), [Apache Spark](/knowledgebase/apache-spark/), [Trino](/knowledgebase/trino/), or Dremio are closer to what you want.

## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
