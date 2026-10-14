---
title: "Cloud Data Warehouse vs Open Lakehouse: Storage, Formats, and Lock-In"
meta_title: "Cloud Data Warehouse vs Open Lakehouse | Glossary"
description: "A cloud data warehouse is a managed analytical database such as Snowflake or BigQuery. Compare its storage, formats, and lock-in with an open Iceberg lakehouse."
---

A Cloud Data Warehouse (CDW) is a managed analytical database delivered as a service on cloud infrastructure. Snowflake, Google BigQuery, Amazon Redshift, Azure Synapse, and Databricks SQL are common examples. The vendor runs the servers, storage, upgrades, and scaling, and you load data and query it with SQL.

Earlier [data warehouses](/knowledgebase/data-warehouse/) were on-premises appliances (Teradata, Netezza, Oracle Exadata) where compute and storage came in the same box. Running out of disk meant buying more of both, even if CPU was idle. Cloud warehouses changed that by separating the two.

## Separating Storage and Compute

### Storage
Data loaded into a cloud warehouse is stored on the provider's object or distributed storage, apart from the query servers. Storage is billed by volume, so keeping years of history is a cost question rather than a capacity question.

### Compute
Queries run on compute clusters that can be resized, paused, or run in parallel against the same data. Snowflake virtual warehouses can auto-suspend when idle and resume in seconds, billed per second after a one-minute minimum. BigQuery's on-demand model bills by data scanned, with capacity-based pricing as an alternative. Redshift added RA3 nodes with managed storage in 2019 and later a serverless option. The details differ, but the shared idea is that compute can scale independently of stored data.

## The Lock-In Question

Historically, data loaded into a cloud warehouse was stored in the vendor's internal format, readable only through that vendor's engine. Using the same data in Spark, a Python ML pipeline, or another engine meant exporting it and paying for the compute (and sometimes egress) to do so. That is the [vendor lock-in](/knowledgebase/vendor-lock-in/) concern behind the open lakehouse movement.

The picture has shifted. Snowflake made Apache Iceberg tables generally available in June 2024, BigQuery supports Iceberg through BigLake, and Redshift can query Iceberg tables. The remaining questions are about which features work on open tables, which catalog is the system of record, and whether other engines can write, not only read.

## Cloud Data Warehouse vs Open Lakehouse

| | Cloud data warehouse (native tables) | Open lakehouse ([Apache Iceberg](/knowledgebase/apache-iceberg/)) |
|---|---|---|
| Storage format | Vendor-internal | Parquet files plus Iceberg metadata in your object storage |
| Who can read and write | The vendor's engine | Any Iceberg-compatible engine: Dremio, Spark, Trino, Flink, DuckDB, and warehouses that support Iceberg |
| Catalog | Built into the warehouse | Open catalogs such as Apache Polaris, Nessie, Unity Catalog OSS, or AWS Glue |
| Operations | Fully managed: maintenance, tuning, security | You or a managed service handle compaction, snapshot expiry, and catalog operations |
| Cost model | Vendor storage plus compute credits or scan pricing | Object storage pricing plus whichever engines you run |
| Switching engines | Requires export or migration | Point another engine at the same tables |

Many organizations run both: a warehouse for workloads that rely on its features, and Iceberg tables as the shared layer that several engines use. For the cost side, read [Building an Honest TCO Model for Open Lakehouses and Proprietary Warehouses](/blog/lakehouse-vs-warehouse-tco/). For moving tables over, see [A Migration Playbook for Moving Legacy Warehouses onto Apache Iceberg](/blog/warehouse-to-iceberg-migration-playbook/).

## Summary

Cloud data warehouses made elastic, managed analytics standard by separating storage from compute. Their main limitation was proprietary storage, and that line is softening as warehouses add Iceberg support. An open lakehouse takes the same separation one step further by keeping the data in an open format and an open catalog that any engine can use.

## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
