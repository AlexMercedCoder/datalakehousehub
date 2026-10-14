---
title: "MinIO and Apache Iceberg: S3-Compatible Storage After the Community Edition"
meta_title: "MinIO for Iceberg Lakehouses: Status and Alternatives"
description: "MinIO is an S3-compatible object storage server often used for local Iceberg lakehouses. Here is its 2026 status and what to run for dev and production."
---

## What is MinIO?

MinIO is an object storage server that implements the Amazon S3 API. Because it speaks S3, any engine or library that reads and writes S3 (Apache Spark, Trino, Dremio, Flink, PyIceberg, DuckDB) can point at a MinIO endpoint instead of AWS and work unchanged. That made MinIO the default storage container in local and on-premises [Apache Iceberg](/knowledgebase/apache-iceberg/) stacks for years: a Docker Compose file with MinIO, a REST catalog, and an engine gave you a working [data lakehouse](/knowledgebase/data-lakehouse/) on a laptop.

MinIO stores objects, not tables. It has no idea what an Iceberg snapshot or manifest is. The table format and the catalog provide the table semantics; MinIO provides the bucket that the data files and metadata files live in. See [object storage](/knowledgebase/object-storage/) for how that layer fits the rest of the stack.

## Project Status in 2026

The open-source MinIO server changed a lot between 2025 and 2026, and anyone reading older tutorials should know the timeline:

* **May 2025:** most administration features were removed from the community edition's web console and moved to the commercial product.
* **October 2025:** MinIO stopped publishing community Docker images and prebuilt binaries.
* **December 2025:** the community repository entered maintenance mode, with no new features or accepted pull requests.
* **2026:** the `minio/minio` GitHub repository was marked "no longer maintained" and archived (read-only). The source remains under AGPLv3.

MinIO Inc. now develops **AIStor**, offered as a free standalone edition and a commercially supported enterprise edition. Existing community deployments keep running, but they no longer receive releases or security fixes from upstream.

## MinIO in a Lakehouse Stack

| Use | Community MinIO (archived) | AIStor | Cloud object storage (S3, ADLS, GCS) |
|---|---|---|---|
| Local Iceberg development and CI | Still works with existing images; no updates | Free edition is an option | Not local |
| On-premises production lakehouse | Not advisable without a support contract | Commercially supported | Not applicable |
| Cloud production lakehouse | Not typical | Possible | The usual choice |
| Credential vending from a REST catalog | Works through S3-compatible STS settings, with configuration | Same | Native in Polaris, Glue, Unity Catalog |

For local work, the role MinIO plays is narrow: it exercises the S3 code path (path-style access, endpoints, multipart uploads, credentials) that a plain local filesystem skips. Other S3-compatible servers, such as Ceph Object Gateway, SeaweedFS, and Garage, can fill the same role. Whatever you choose, test that the engine settings that matter for Iceberg (`s3.endpoint`, `s3.path-style-access`, region) behave the same way they will in production.

## A Concrete Example

A typical local stack runs four containers: an S3-compatible store with a `warehouse` bucket, an Iceberg REST catalog (the `apache/iceberg-rest-fixture` image or [Apache Polaris](/knowledgebase/apache-polaris/)) configured with the store's endpoint, Spark or Dremio as the engine, and a one-shot client container that creates the bucket on startup. The engine creates a table through the catalog, the catalog records the metadata location, and the engine writes Parquet data files and Iceberg metadata files into the bucket. Swapping the store for AWS S3 later changes only the endpoint and credentials, not the table.

For a full walkthrough, see [Local Iceberg Development Environments: Docker, MinIO, and In-Memory Catalogs for CI](/blog/local-iceberg-development-environments/) and [Block vs. Object Storage](/blog/block-vs-object-storage-deep-dive/).

## Frequently Asked Questions

### Is MinIO still open source?
The archived community source code is still licensed under AGPLv3, but the project is no longer maintained upstream. MinIO's active product is AIStor.

### Do I need MinIO to run Apache Iceberg?
No. Iceberg needs a file system or object store the engine can reach. Locally that can be the filesystem; in the cloud it is usually S3, ADLS, or GCS. MinIO is one S3-compatible option.

### Does MinIO understand Iceberg tables?
No. MinIO stores the files. The Iceberg catalog and the engine handle snapshots, schema, and transactions.

---

### E-E-A-T & Further Reading
