---
title: "Amazon S3 for Data Lakehouses: Iceberg, S3 Tables, and Storage Costs"
meta_title: "Amazon S3 for Iceberg Lakehouses: S3 Tables and Costs"
description: "Amazon S3 is AWS object storage that keeps files as objects in buckets behind an HTTP API. See how Iceberg runs on S3, what S3 Tables adds, and what it costs."
---

Amazon S3 (Simple Storage Service) is the object storage service of Amazon Web Services. It launched in March 2006 as one of the first generally available AWS services. S3 stores data as objects in buckets, addressed by key and accessed over an HTTP API, and AWS handles the hardware, replication, and capacity behind it.

For data teams, S3 is where a large share of data lakes and lakehouses keep their files. A bucket can hold a 10 KB JSON file or petabytes of Apache Parquet, and you pay for what you store and the requests you make, not for disks you provision.

## Durability and Consistency

S3 is designed for 99.999999999% ("eleven nines") durability of objects over a year. Most storage classes store data redundantly across at least three Availability Zones in a region; the One Zone classes are the exception. Since December 2020, S3 provides strong read-after-write consistency for all PUT and DELETE operations, so a reader sees a new object or overwrite as soon as the write succeeds.

Durability and availability are different numbers. S3 Standard is designed for 99.99% availability, and its SLA credits apply below 99.9% monthly uptime.

## The S3 API

The S3 API (`PutObject`, `GetObject`, `ListObjectsV2`, `DeleteObject`, multipart uploads) has become a common interface for object storage. Spark, Trino, Dremio, DuckDB, Flink, and most data tools can read and write through it, and many other storage systems, including Cloudflare R2, Ceph, and on-premises appliances, offer S3-compatible endpoints. Compatibility varies in the details (conditional writes, listing behavior, checksums), so test the specific features your table format and engines rely on.

## Running Apache Iceberg on S3

Object storage has no real directories and no atomic rename, which made older Hive-style tables slow and fragile on S3. [Apache Iceberg](/knowledgebase/apache-iceberg/) was designed around those limits:

* **No directory listing for planning.** Iceberg tracks every data file in manifests, so engines read metadata instead of listing prefixes.
* **Atomic commits through the catalog.** A commit swaps the table's current metadata pointer in a catalog such as Apache Polaris, AWS Glue, or Nessie, instead of renaming files.
* **Request rate limits.** S3 supports at least 3,500 write and 5,500 read requests per second per prefix. Iceberg's object storage location provider (`write.object-storage.enabled`) spreads files across hashed prefixes to avoid hot spots.

**Amazon S3 Tables**, announced at re:Invent in December 2024, adds table buckets that store Iceberg tables natively, with built-in compaction, snapshot expiry, and unreferenced file cleanup, plus an Iceberg REST endpoint for engines. The tradeoff versus general purpose buckets plus your own catalog is convenience against control over maintenance and catalog choice.

## Storage Classes and Lifecycle Costs

S3 offers several storage classes, and two mechanisms move data between them:

| Mechanism | How it decides | Lakehouse caution |
|---|---|---|
| Lifecycle rules | Object age or prefix, on a schedule you define | Objects moved to Glacier Flexible Retrieval or Deep Archive must be restored before reading, so an Iceberg query that touches them fails |
| S3 Intelligent-Tiering | Observed access patterns, per object | Frequent, infrequent, and archive instant access tiers stay readable; optional archive tiers do not |

For Iceberg tables, move cold data in ways the table metadata knows about, or keep it in classes that stay readable without a restore step, such as Standard-IA or Glacier Instant Retrieval. [Agent-Driven Storage Tiering for Apache Iceberg](/blog/agent-driven-iceberg-storage-tiering/) walks through a path-safe approach, and [Connect Amazon S3 to Dremio Cloud](/blog/2026-03-connect-amazon-s3-dremio/) shows how to query S3 data directly. See also [object storage](/knowledgebase/object-storage/).

## Summary

Amazon S3 provides durable, elastic object storage behind a widely copied API, and it is a common storage layer for lakehouses. Iceberg makes S3 behave like a reliable table store through manifests and catalog commits, S3 Tables offers a managed variant, and storage class choices need to account for how query engines read the files.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
