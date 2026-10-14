---
title: "AWS Glue for Iceberg Lakehouses: Data Catalog, ETL, and Engines"
meta_title: "AWS Glue Data Catalog for Iceberg Lakehouses | Glossary"
description: "AWS Glue is Amazon's serverless data integration service with a shared Data Catalog. See how Glue serves Iceberg tables to Spark, Athena, Dremio, and Trino."
---

AWS Glue is a serverless data integration service from Amazon Web Services. It combines a metadata catalog (the Glue Data Catalog), crawlers that infer schemas, and managed Apache Spark and Python jobs for ETL.

Before managed services like Glue, teams running ETL on AWS typically provisioned Hadoop or Spark clusters, ran a Hive Metastore, and patched and scaled that infrastructure themselves. Glue removes most of that work: AWS provisions compute for each job run and maintains the catalog service.

## The AWS Glue Data Catalog

The Data Catalog is the most widely used part of Glue. It is the central metadata store for analytics services on AWS.

### Hive Metastore Compatibility
The Data Catalog stores databases, table definitions, schemas, and partition locations, and it can stand in for an Apache [Hive Metastore](/knowledgebase/hive-metastore/). Amazon Athena uses it by default, and Amazon EMR can be configured to use it, so a table defined once is visible to both and points at data in [Amazon S3](/knowledgebase/amazon-s3/).

### Crawlers
Crawlers scan locations such as S3 prefixes on a schedule, infer the format and schema (for example, recognizing Parquet files with a `user_id` integer column), detect partitions, and create or update catalog tables. How a crawler handles schema changes, such as a new column in JSON logs, depends on its configured schema change policy, so teams should set that policy deliberately rather than assume updates happen automatically.

## Serverless ETL

### Managed Spark Jobs
Glue jobs run PySpark or Scala Spark code (or plain Python shell scripts) on compute that AWS provisions per run. You pay per DPU-hour, billed per second with a one-minute minimum on Glue 2.0 and later, instead of keeping an EMR cluster running between jobs. Short jobs still pay the minimum, and very long or constantly running workloads can cost less on EMR or other engines, so compare both for steady pipelines.

### Glue Studio
Glue Studio is a visual editor for building jobs: read from Amazon RDS or S3, join, drop sensitive columns, and write to an [Apache Iceberg](/knowledgebase/apache-iceberg/) table. It generates a PySpark script that engineers can edit and deploy through their CI/CD process.

## AWS Glue in an Iceberg Lakehouse

Glue jobs support Apache Iceberg, Apache Hudi, and Delta Lake through the `--datalake-formats` job parameter, so a job can read raw data, deduplicate it, and run `MERGE INTO` against Iceberg tables. The Data Catalog then serves as the [Iceberg catalog](/knowledgebase/iceberg-catalog/) that records each table's current metadata file.

The catalog is also reachable outside AWS's own engines. Glue exposes an Iceberg REST endpoint (`https://glue.<region>.amazonaws.com/iceberg`) that implements the [Iceberg REST catalog specification](/knowledgebase/rest-catalog-specification/), with SigV4 authentication and permissions from IAM or AWS Lake Formation. It serves tables in general-purpose S3 buckets and in Amazon S3 Tables.

| Engine | How it connects to Glue |
|---|---|
| Spark (Glue, EMR, or self-managed) | Glue catalog implementation or the Iceberg REST endpoint |
| Amazon Athena | Native, uses the Data Catalog by default |
| Dremio | Glue Data Catalog source for reading and managing Iceberg tables |
| Trino | Iceberg connector with `iceberg.catalog.type=glue` or REST |
| PyIceberg | Glue catalog type or REST with SigV4 |

Glue is a strong choice when most of your stack runs on AWS. If you need one catalog across several clouds, or want catalog features such as branching, compare it with [Apache Polaris](/knowledgebase/apache-polaris/), [Project Nessie](/knowledgebase/project-nessie/), and [Unity Catalog](/knowledgebase/unity-catalog/). For step-by-step setup with Dremio, see [Connect AWS Glue Data Catalog to Dremio Cloud](/blog/2026-03-connect-aws-glue-dremio/), and for how Glue compares with other vendor catalogs see [An Exploration of the Commercial Iceberg Catalog Ecosystem](/blog/2025-10-exploring-commerical-apache-iceberg-catalogs/).

## Summary

AWS Glue lowered the operational cost of running a data lake on AWS by pairing a managed, Hive-compatible catalog with serverless Spark jobs. In an Iceberg lakehouse, its main role is the catalog: Glue jobs, Athena, EMR, and outside engines such as Dremio, Trino, and PyIceberg can all read and write the same Iceberg tables through it.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
