---
title: "Fivetran for the lakehouse: loading Iceberg tables, and Fivetran vs Airbyte"
meta_title: "Fivetran vs Airbyte for Loading Iceberg Tables"
description: "Fivetran is a managed ELT service that copies data from SaaS apps and databases into warehouses and lakes. See how it loads Iceberg and compares to Airbyte."
---

Fivetran is a managed data integration service. It provides prebuilt connectors that extract data from SaaS applications (Salesforce, Zendesk, Stripe), databases (PostgreSQL, MySQL, SQL Server, Oracle), and files, then load it into a destination such as a cloud warehouse or a [data lakehouse](/knowledgebase/data-lakehouse/). Fivetran maintains the connectors, so API changes and source schema changes are its problem rather than yours. In June 2026 Fivetran completed its merger with dbt Labs, the company behind [dbt](/knowledgebase/dbt/).

## Extract and load, then transform

Fivetran follows the [ELT](/knowledgebase/elt/) pattern: it lands source data in the destination with a schema close to the source, and transformation happens afterward in the destination engine, typically with dbt. Fivetran's job is the E and the L.

## Schema drift

Source systems change. Columns get added, tables get dropped, types change. Fivetran detects these changes on sync and applies schema changes in the destination according to the connection's schema change settings, for example adding a new `customer_tier` column instead of failing the sync. You can also choose to block new tables or columns until someone approves them.

## Change data capture and incremental syncs

After the initial historical sync, Fivetran syncs incrementally. For databases it uses log-based [change data capture](/knowledgebase/change-data-capture/) where available (for example PostgreSQL logical replication or the MySQL binlog), reading inserts, updates, and deletes from the log instead of rescanning tables. This keeps load on the production database low. Some sources fall back to cursor or full-table methods.

## Normalized output and safe retries

For API sources, Fivetran publishes a documented schema per connector and unpacks nested objects into related tables where the connector's schema calls for it. Syncs track cursors so that a failed sync can be retried without creating duplicate rows.

## Loading Iceberg with Fivetran

Fivetran's Managed Data Lake Service writes to your own object storage (Amazon S3, ADLS, or Google Cloud Storage). It always creates [Apache Iceberg](/knowledgebase/apache-iceberg/) metadata for the tables it maintains and can optionally create Delta Lake metadata too. Tables are registered in the Fivetran Catalog, which Fivetran describes as a managed implementation of [Apache Polaris](/knowledgebase/apache-polaris/) that works with any Iceberg REST catalog client, or in a cloud catalog such as AWS Glue, OneLake, or BigLake Metastore. From there, Dremio, [Trino](/knowledgebase/trino/), [Spark](/knowledgebase/apache-spark/), or Snowflake can query the same tables, and these become the bronze layer of a [medallion architecture](/knowledgebase/medallion-architecture/).

## Fivetran vs Airbyte for loading Iceberg

| | Fivetran | [Airbyte](/knowledgebase/airbyte/) |
|---|---|---|
| Model | Fully managed SaaS | Open-source platform (ELv2) you self-host, plus Airbyte Cloud |
| Iceberg destination | Managed Data Lake Service on S3, ADLS, or GCS | S3 Data Lake destination on S3 or S3-compatible storage |
| Catalogs | Fivetran Catalog (Polaris based), Glue, OneLake, BigLake; Unity and Snowflake integrations | REST, Glue, Nessie, Polaris |
| Table maintenance | Fivetran manages the lake tables | Writes data; you run compaction and snapshot expiry |
| Custom connectors | Connector SDK | Connector Builder and CDK; large community catalog |
| Pricing | Usage based on monthly active rows | Free to self-host (open-source edition); Airbyte Cloud is paid |

Choose Fivetran when you want the least operational work and your sources are covered by its connectors. Choose Airbyte when you need to self-host, need a long-tail or custom connector, or want to control cost by running it yourself.

## Learn More
To learn more about the [Data Lakehouse](/knowledgebase/data-lakehouse/), read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
