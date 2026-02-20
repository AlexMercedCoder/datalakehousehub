---
title: "The 2025 State of the Apache Iceberg Ecosystem Results"
date: 2026-02-29T13:50:00Z
pubDatetime: 2026-02-20T13:50:00Z
description: "A survey of data professionals reveals the state of the Apache Iceberg ecosystem in 2025. Key findings include adoption rates, popular tools, and future trends."
author: "Alex Merced"
category: "Apache Iceberg"
bannerImage: "https://i.imgur.com/cpoMZQ8.png"
tags:
  - Apache Iceberg
  - Data Lakehouse
  - Data Engineering
slug: 2026-02-state-of-the-apache-iceberg-ecosystem
draft: false
image: "/images/blog.png"
---

![2025 Survey](https://imgur.com/eSwOYfd.png)

**Raw Results at Bottom of Post**

**Apache Iceberg Literature from Alex Merced and/or Andrew Madsen:**
- [Apache Iceberg: The Definitive Guide](https://drmevn.fyi/tableformatblog)
- [Apache Polaris: The Defintive Guide](https://drmevn.fyi/tableformatblog-62P6t)
- [Architecting an Apache Iceberg Lakehouse](https://hubs.la/Q03GfY4f0)
- [The Apache Iceberg Digest: Vol. 1](https://www.puppygraph.com/ebooks/apache-iceberg-digest-vol-1)
 
*An Independent Practitioner Survey that was collected from Jan 1, 2026 to Jan 31, 2026. This survey is meant to be a baseline for tracking the state of the Apache Iceberg ecosystem over time. The results reflect the perspectives of data professionals actively working with Iceberg in production environments. The survey covers engine usage, cloud patterns, table formats, catalogs, feature priorities, and more.*

Apache Iceberg has entered a new phase. The conversation in the ecosystem is no longer centered on whether Iceberg can deliver ACID guarantees on object storage. That baseline is assumed. The focus has shifted to optimization, governance, and interoperability across a growing set of engines and catalogs.

This survey was conducted by [Alex Merced of DataLakehouseHub.com](https://datalakehousehub.com) and [Andrew Madson of InsightsXDesign](https://www.linkedin.com/in/andrew-madson/). The goal was to capture practitioner sentiment across engines, environments, ingestion patterns, and roadmap priorities. To participate in next year’s survey window and track how these numbers evolve, follow them and watch for the next announcement cycle.

The results reflect active builders. They offer a snapshot of where Iceberg stands in real production environments and where the ecosystem is heading next.

## Practitioner Profile

![Practicioner Profile](https://imgur.com/XdsIJF4.png)

The audience skews heavily toward technical roles. Data Engineers represent 29.6% of respondents. Software Engineers account for 25.9%. Architects represent another 25.9%. The remainder spans data scientists, managers, and executives. The concentration among engineers and architects suggests that responses are grounded in hands-on implementation experience rather than surface familiarity.

Experience levels vary but skew seasoned. 32.1% report 1–5 years working in the data space. 28.6% report 10–20 years. 17.9% report more than 20 years. Another 17.9% report 5–10 years. Only a small minority report less than one year in the field. The distribution reflects both newer entrants and deeply experienced practitioners.

Familiarity with Iceberg is strong. 60.7% describe themselves as moderately experienced, meaning they have used Iceberg across multiple projects. 25% identify as expert users. 14.3% report limited experience. No meaningful share reports unfamiliarity. This indicates that the findings reflect practitioners with operational context.

## Engine Usage: Spark Dominates, Commercial Engines Compete

![Engine Usage](https://imgur.com/V7bAAiD.png)

Apache Spark remains the dominant engine in the Iceberg ecosystem. 96.4% of respondents report using Spark with Iceberg. This near-universal adoption reinforces Spark’s central role in ingestion, transformation, and metadata operations.

OSS Trino shows significant traction at 60.7%. Apache Flink registers at 32.1%. DuckDB appears at 28.6%, signaling growing interest in lightweight, local, or embedded analytical engines. Amazon Athena registers at 21.4%. These numbers confirm that Iceberg is structurally multi-engine.

The data does not indicate a single engine winner beyond Spark’s foundational dominance. It indicates an ecosystem where Iceberg functions as a shared substrate across engines.

## Cloud and Infrastructure Patterns

![Cloud and Infrastructure Patterns](https://imgur.com/fmZ6nV7.png)

AWS is the primary deployment environment, with 64.3% reporting AWS usage. On-premises deployments account for 28.6%. Azure and GCP each appear at 17.9%. Multi-cloud configurations register at 21.4%. Local development and testing environments are common at 42.9%.

The AWS majority reinforces the importance of S3 performance patterns, Glue integration, and IAM alignment. The strong presence of local development environments suggests that Iceberg experimentation and testing remain developer-driven.

Iceberg is not confined to a single cloud. However, AWS continues to exert significant gravitational pull in the ecosystem.

## Table Format Overlap

Iceberg dominates among table formats in this survey. 78.6% report using Iceberg exclusively among open table formats. Delta Lake shows meaningful overlap at 39.3%. Other formats such as Hudi and Paimon appear in smaller shares.

The overlap with Delta is strategically relevant. Many teams operate in mixed ecosystems. Interoperability and migration narratives matter. The Iceberg value proposition cannot rely solely on exclusivity. It must account for coexistence.

## Catalog Landscape: Competitive and Fragmented

![Catalog Landscape: Competitive and Fragmented](https://imgur.com/LIkrrSu.png)

Catalog usage reflects a fragmented market. AWS Glue leads at 39.3%. Nessie follows at 28.6%. Amazon S3 Tables registers at 25%. Apache Polaris and Lakekeeper each register at 21.4%. Hadoop and Hive Metastore implementations appear at 17.9%.

No single catalog dominates. Glue’s position reflects AWS gravity rather than universal preference. Nessie’s 28.6% reflects continued interest in branching workflows. Apache Polaris appears at 21.4% adoption. Polaris is not a branching catalog like Nessie. It focuses on open REST interoperability and governance alignment. Given that Polaris recently became an Apache Top Level Project, its early visibility at over one-fifth of respondents is notable.

The catalog market remains unsettled. Governance, federation, and metadata standardization are still active areas of competition.

## Table Scale: Production Reality

![Table Scale: Production Reality](https://imgur.com/3FfGy3J.png)

Iceberg workloads are not confined to small datasets. 28.6% report managing tables between 10 and 100 TB. 21.4% report less than 1 TB. 17.9% report 1–10 TB. Another 17.9% report 100 TB to 1 PB. 10.7% report managing tables larger than 1 PB.

These distributions confirm production usage at meaningful scale. Discussions about commit models, metadata pruning, and compaction strategies are grounded in operational volume.

## Ingestion Patterns: Engine-Centric Workflows

Data ingestion into Iceberg remains engine-driven. 71.4% primarily use distributed open source engines such as Spark or Flink to land data. 10.7% use the same engine for ingestion and analytics. Another 10.7% report alternative approaches.

Among ETL and streaming tools, Apache Kafka Connect leads at 50%. AWS Glue Jobs appear at 22.7%. Debezium registers at 18.2%. Other tools appear in smaller shares.

Traditional SaaS ELT platforms show minimal representation. The ecosystem remains oriented around open compute engines rather than turnkey ingestion layers.

## Feature Priorities: Governance and Optimization

![Feature Priorities: Governance and Optimization](https://imgur.com/SsRTTYz.png)

Interest in Iceberg v3 features centers on schema and deletion improvements. Row Level Lineage values lead at 33.3%. Deletion vectors follow at 25.9%. Variant Datatype registers at 22.2%. Other features such as geo types and variant types trail behind.

Deletion vectors address update efficiency. Lineage addresses governance visibility. These are production-driven concerns.

Looking ahead to potential v4 features, materialized views lead at 37%. Parquet-based metadata and secondary indexes each register at 22.2%. Smaller shares express interest in relative paths and unsigned integer types.

The direction is clear. The ecosystem wants performance acceleration and metadata intelligence layered onto the existing format foundation.

## Interface Preferences: SQL at the Center

![Interface Preferences: SQL at the Center](https://imgur.com/6HQgidX.png)

SQL is the dominant interface at 46.4%. Python and Java or Scala each register at 25%. Rust, Go, and graphical no-code interfaces represent only marginal usage.

This distribution underscores that Iceberg adoption is mediated primarily through SQL engines. Language-level SDK growth may expand influence, but SQL ergonomics and engine compatibility remain central.

## Core Value Proposition

When asked which value proposition resonates most, interoperability among lakehouse tooling and ACID Transaction through less duplicative storage each register at 35.7%. Cost Reductions register at 14.3%. Faster transactions over Hive or Parquet also register at 14.3%.

## Satisfaction and Contribution

Satisfaction levels are positive but measured. 51.9% rate performance and reliability at 4 out of 5. 18.5% rate it at 5 out of 5. 29.6% rate it at 3 out of 5. There are no significant low ratings.

Contribution engagement is notable. 46.2% report occasional contributions. 7.7% report active contribution. 42.3% report plans to contribute in the future. The ecosystem is participatory and evolving through practitioner input.

## Strategic Observations

Spark remains foundational at 96.4%, but Iceberg is inherently multi-engine. Commercial engines such as Dremio, at 17.9%, compete within their category even as open engines dominate overall usage.

AWS Glue leads catalog usage at 39.3%, but fragmentation persists. Nessie and Polaris demonstrate strong presence. Polaris’s 21.4% visibility early in its Apache lifecycle signals momentum around open REST-aligned governance.

Materialized views at 37% and default column values at 33.3% point toward a future centered on performance primitives and schema intelligence.

Interoperability and cost, each at 35.7%, remain Iceberg’s strongest structural advantages.

Iceberg has crossed the production threshold. The next phase will focus on metadata optimization, governance clarity, and multi-engine coherence rather than basic transactional guarantees.

To follow how these trends develop and to participate in the next survey cycle, follow Alex Merced at DataLakehouseHub.com and Andrew Madson at InsightsXDesign. The future of the Iceberg ecosystem will be shaped by those who build with it.


# Raw Results

# State of the Apache Iceberg Ecosystem — Raw Results (%)

## Primary Role / Job Function
- Data Engineer: 29.6%
- Software Engineer: 25.9%
- Architect (Data/Solutions/Enterprise): 25.9%
- Data Scientist / ML Engineer: 14.8%
- Other roles (Manager, Product, Executive, etc.): Remaining %

## Years Working in Data Space
- 1–5 Years: 32.1%
- 10–20 Years: 28.6%
- 20+ Years: 17.9%
- 5–10 Years: 17.9%
- Less than 1 Year: Remaining %

## Familiarity with Apache Iceberg
- Moderately Experienced: 60.7%
- Expert: 25.0%
- Limited Experience: 14.3%
- Not Familiar: 0%

## Table Formats Used (Select All That Apply)
- Apache Iceberg Only: 78.6%
- Delta Lake: 39.3%
- Apache Hudi: 7.1%
- Apache Paimon: 3.6%
- Duck Lake: 7.1%
- No Table Formats: 0%

## Primary Environment for Iceberg
- AWS: 64.3%
- Local Development / Testing: 42.9%
- On-Premises Data Center: 28.6%
- Multi-Cloud: 21.4%
- Azure: 17.9%
- GCP: 17.9%
- Not Applicable: 0%

## Engines Used with Iceberg (Select All That Apply)
- Apache Spark: 96.4%
- OSS Trino: 60.7%
- Apache Flink: 32.1%
- DuckDB: 28.6%
- Amazon Athena: 21.4%
- Dremio: 17.9%
- StarRocks: 17.9%
- Snowflake: 17.9%
- Databricks Spark: 17.9%
- Google BigQuery: 14.3%
- Amazon EMR Spark: 14.3%
- DataFusion: 10.7%
- Databricks Photon: 7.1%
- Polars: 7.1%
- Other engines (ClickHouse, Impala, Presto, etc.): 3.6% each

## Iceberg Catalogs Used
- AWS Glue Catalog: 39.3%
- Nessie: 28.6%
- Amazon S3 Tables: 25.0%
- Apache Polaris: 21.4%
- Lakekeeper: 21.4%
- Hadoop: 17.9%
- Hive Metastore (HMS): 17.9%
- Google BigLake: 10.7%
- Unity Catalog (Databricks): 10.7%
- Unity Catalog (OSS): 10.7%
- Apache Gravitino: 7.1%
- Other (Custom, JDBC, lakeFS, Tabular, etc.): 3.6% each

## Largest Iceberg Table Size
- 10 TB – 100 TB: 28.6%
- Less than 1 TB: 21.4%
- 1 TB – 10 TB: 17.9%
- 100 TB – 1 PB: 17.9%
- More than 1 PB: 10.7%
- Not Applicable: Remaining %

## Primary Ingestion Method
- Spark / Flink Distributed Engine: 71.4%
- Same Engine as Analytics: 10.7%
- Batch/Streaming ETL Vendor: 10.7%
- Other: Remaining %

## Batch / Streaming ETL Tools Used
- Apache Kafka Connect: 50.0%
- AWS Glue Jobs: 22.7%
- Debezium: 18.2%
- Confluent: 9.1%
- Apache Spark (explicit listing): 9.1%
- Other tools (Flink, dlt, RisingWave, etc.): 4.5% each
- Other: 0%

## Most Interesting v3 Feature

- Row-Level Lineage: 33.3%
- Deletion Vectors: 25.9%
- Variant Datatype: 22.2%
- Default Column Types: 7.4%
- Geo Datatypes: 3.7%
- Implicit Maintenance / Equality Delete Deprecation: 3.7 %

## Most Exciting Potential v4 Feature
- Materialized Views: 37.0%
- Parquet-Based Metadata: 22.2%
- Secondary Indexes: 22.2%
- Single File Commits: 14.8%
- Other (Relative Paths, Unsigned Ints): Smaller %

## Primary Interface for Iceberg Workloads
- SQL: 46.4%
- Python: 25.0%
- Java / Scala: 25.0%
- Rust: Small %
- Go: Small %
- Graphical UI: Small %

## Most Appealing Iceberg Value Proposition
- ACID Transactions: 35.7%
- Reduced Cost (Less Duplicative Storage / ETL): 35.7%
- Interoperability Among Lakehouse Tooling: 14.3%
- Faster Transactions vs Hive/Parquet: 14.3%

## Performance & Reliability Satisfaction
- 4 out of 5: 51.9%
- 5 out of 5: 18.5%
- 3 out of 5: 29.6%
- 1 or 2 out of 5: 0%

## Contribution to Iceberg Open Source
- Occasional Contributor: 46.2%
- Active Contributor: 7.7%
- Plan to Contribute: 42.3%
- No Plan to Contribute: Remaining %
