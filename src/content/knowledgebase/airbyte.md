---
title: "Airbyte for the lakehouse: open-source ingestion into Iceberg, and Airbyte vs Fivetran"
meta_title: "Airbyte to Iceberg: Open-Source ELT vs Fivetran"
description: "Airbyte is an open-source data integration platform that moves data from APIs and databases into warehouses and lakes. See how it writes Iceberg vs Fivetran."
---

Airbyte is an open-source data integration platform. It replicates data from APIs, SaaS applications, databases, and files into warehouses, data lakes, and vector databases. The platform is licensed under the Elastic License 2.0 (ELv2), which allows free use and modification but not offering Airbyte itself as a managed service. You can self-host it or use the paid Airbyte Cloud.

Airbyte's main draw is coverage of the long tail. Managed services such as [Fivetran](/knowledgebase/fivetran/) cover the most common SaaS sources well, but most companies also have niche or internal APIs. Airbyte's connector framework and community catalog make it practical to add those without writing a one-off script.

## Connector architecture

Each Airbyte source and destination connector runs as its own Docker container and communicates through the Airbyte protocol, a defined message format for records, state, and schema. Because the boundary is a container and a protocol, connectors can be written in any language, though most are Python or Java/Kotlin.

To build new connectors, Airbyte offers the Connector Builder, a UI for declarative low-code connectors, and the Connector Development Kit (CDK) for Python when you need custom code. Both handle common API concerns such as pagination, rate limiting, authentication, and incremental state.

## Self-hosting for control

Because the platform is open source, you can run Airbyte inside your own cloud account or Kubernetes cluster. Data then moves from source to destination inside your network, which can simplify security reviews for sensitive data. Whether that satisfies a specific regulation such as HIPAA depends on your own controls, not on Airbyte alone.

## Destinations, including vector databases

Airbyte writes to warehouses, object storage, and lake table formats. It also has destinations for vector databases such as Pinecone, Milvus, and Weaviate. These destinations split text fields into chunks, compute embeddings with a provider such as OpenAI or Cohere, and write the vectors to the index, which is a common way to feed retrieval-augmented generation (RAG) systems from support tickets or documents.

## Airbyte to Iceberg: the S3 Data Lake destination

Airbyte's S3 Data Lake destination writes [Apache Iceberg](/knowledgebase/apache-iceberg/) tables to Amazon S3 or S3-compatible storage through a REST, AWS Glue, Nessie, or [Apache Polaris](/knowledgebase/apache-polaris/) catalog. Points worth knowing before you use it:

- **Sync modes:** full refresh (overwrite, append, overwrite plus dedupe) and incremental (append, append plus dedupe) are all supported.
- **Deduplication:** dedupe modes map primary keys to Iceberg identifier fields and use merge-on-read equality deletes. Your query engine must honor those deletes; Airbyte's docs note that Snowflake does not recognize them for externally cataloged tables.
- **Schema evolution:** adding or removing columns, widening types, and changing the primary key are handled. Other changes need a full refresh or a manual table change.
- **Maintenance:** each microbatch creates a snapshot. Compaction and snapshot expiry are yours to run, for example with Spark or Dremio's `OPTIMIZE` and `VACUUM`, and Airbyte warns not to compact during a truncate refresh sync.

Once the bronze tables land, engines such as Dremio, [Trino](/knowledgebase/trino/), and [Spark](/knowledgebase/apache-spark/) query them through the same catalog, and [dbt](/knowledgebase/dbt/) builds the silver and gold layers of a [medallion architecture](/knowledgebase/medallion-architecture/).

## Airbyte vs Fivetran

| | Airbyte | Fivetran |
|---|---|---|
| Deployment | Self-hosted open source or Airbyte Cloud | Managed SaaS only |
| Iceberg | S3 Data Lake destination (REST, Glue, Nessie, Polaris) | Managed Data Lake Service on S3, ADLS, or GCS |
| Iceberg table upkeep | Your responsibility | Managed by Fivetran |
| Custom sources | Connector Builder, CDK | Connector SDK (Python) |
| Best fit | Long-tail sources, self-hosting, cost control | Lowest operational effort on common sources |

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
