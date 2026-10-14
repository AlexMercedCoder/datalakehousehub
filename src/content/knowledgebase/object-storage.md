---
title: "What is Object Storage?"
meta_title: "What is Object Storage? | Expert Data Lakehouse Architecture Guide"
description: "Object storage keeps data as objects with keys and metadata in a flat namespace, as in Amazon S3. See how Apache Iceberg builds ACID tables on top of it."
---

# What is Object Storage?

Object storage is a way of storing data as discrete objects in a flat namespace, each addressed by a key, instead of as files in a directory tree or blocks on a disk. Amazon S3, Google Cloud Storage, and Azure Blob Storage are the best-known services, and S3-compatible systems such as MinIO and Ceph provide the same model on premises. Object storage is where the files of an open [data lakehouse](/knowledgebase/data-lakehouse/) live.

## Block, File, and Object Storage

* **[Block storage](/knowledgebase/block-storage/)** is a raw volume attached to a server, such as an EBS volume or a local SSD. It is fast and low latency, but it is tied to one machine and sized in advance.
* **[File storage](/knowledgebase/file-storage/)** organizes data into a hierarchy of directories, as on a laptop or a network file share. Directory operations get expensive when a share holds very large numbers of files.
* **Object storage** drops the hierarchy. Every object sits in a bucket under a key, and clients read and write it over an HTTP API. Capacity grows as you write, and you pay for what you store and the requests you make.

Amazon launched S3 in 2006, and its API has since become the common interface that many other object stores implement.

## The Parts of an Object

Each object has three parts:

1. **Data:** the bytes themselves, such as an [Apache Parquet](/knowledgebase/apache-parquet/) file, an image, or a JSON log.
2. **Metadata:** system metadata (size, last-modified time, content type) plus user-defined key-value metadata and tags, such as `department=marketing`.
3. **Key:** a unique name within the bucket, such as `2026/sales_log_001.parquet`, usually written with the bucket as a URI like `s3://data-lake-bucket/2026/sales_log_001.parquet`.

A query engine such as Dremio or [Trino](/knowledgebase/trino/) retrieves an object by asking the storage API for its key; it does not walk a directory tree.

## Folders Are a Naming Convention

The S3 console shows folders, but a flat bucket has none. An object named `sales/2026/january/report.pdf` is a single object whose key happens to contain slashes. The console and the list API treat the text before each `/` as a prefix and group keys by it, which looks like folders. Renaming a "folder" means copying and deleting every object under that prefix.

Azure Data Lake Storage Gen2 is an exception: with its hierarchical namespace turned on, it keeps real directories on top of Blob Storage, so directory renames are atomic. See [Azure Data Lake Storage](/knowledgebase/azure-data-lake-storage-adls/) and [Google Cloud Storage](/knowledgebase/google-cloud-storage-gcs/) for provider details.

## Objects Are Written Whole

Object stores generally do not let you change a byte range inside an existing object. To change one row in a 1 GB Parquet file, you write a new object. That made in-place `UPDATE` and `DELETE` impractical on plain data lakes.

Table formats work with this rule instead of against it. [Apache Iceberg](/knowledgebase/apache-iceberg/) never edits data files. An `UPDATE` writes new data files (or delete files), writes new metadata that lists the current set of files, and asks the [Iceberg catalog](/knowledgebase/iceberg-catalog/) to swap the table's metadata pointer in one atomic step. Readers see either the old snapshot or the new one, which is how engines get ACID transactions on top of immutable objects.

## Consistency

Early S3 offered only eventual consistency for some operations: a listing right after a write might not show a new object, which made it risky to find table files by listing directories. Since December 2020, S3 provides strong read-after-write consistency for GET, PUT, and LIST on all objects in all regions. Iceberg also avoids the issue by design, because it tracks files in metadata rather than discovering them by listing.

## Why the Lakehouse Builds on It

* **Elastic capacity:** you write data without provisioning disks, and storage cost tracks what you keep.
* **Separation of compute and storage:** any engine with credentials can read the same files over the API, so Spark, Trino, Dremio, and others can share one copy of the data.
* **Durability:** the major cloud services replicate objects across devices and facilities.

For a closer comparison, see [Block vs. Object Storage: A Deep Dive](/blog/block-vs-object-storage-deep-dive/).

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
