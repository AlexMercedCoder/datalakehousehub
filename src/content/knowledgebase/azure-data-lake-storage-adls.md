---
title: "What is Azure Data Lake Storage (ADLS)?"
meta_title: "What is Azure Data Lake Storage (ADLS)? | Data Lakehouse Hub Knowledge Base"
description: "Azure Data Lake Storage (ADLS) Gen2 is Microsoft's analytics storage that adds a hierarchical namespace to Blob Storage for fast directory operations."
---

# What is Azure Data Lake Storage (ADLS)?

## Introduction to ADLS

When enterprises began moving their Hadoop clusters to the cloud, they ran into a performance problem with standard cloud object storage (like [Amazon S3](https://datalakehousehub.com/knowledgebase/amazon-s3/) or basic Azure Blob Storage).

Standard object storage uses a "Flat Namespace." Folder paths are just prefixes in object names, not real directories.
If an [Apache Spark](https://datalakehousehub.com/knowledgebase/apache-spark/) job wants to delete or rename a "folder" named `/sales_2024/` containing 10,000 files, a flat object store cannot act on the folder as a unit. Each object must be copied or deleted individually, which is slow and not atomic. This created bottlenecks for large-scale data engineering pipelines.

To address this, Microsoft built **Azure Data Lake Storage Gen2 (ADLS Gen2)**.

ADLS Gen2 is Microsoft's data lake storage offering, built on Azure Blob Storage. It combines the scalability and low cost of cloud object storage with file system semantics that analytics engines rely on.

## The Key Feature: Hierarchical Namespace (HNS)

The defining feature of ADLS Gen2, and what separates it from standard Azure Blob Storage, is the **Hierarchical Namespace (HNS)**.

With HNS enabled, ADLS organizes objects into a real directory hierarchy, similar to the file system on your laptop.

This brings important performance benefits for analytical engines like [Apache Spark](https://datalakehousehub.com/knowledgebase/apache-spark/) or [Databricks](https://opendatalakehouse.com/kb/databricks/):
1.  **Atomic Directory Operations**: In ADLS, if Spark renames or deletes the `/sales_2024/` directory containing 10,000 files, it performs a single atomic metadata operation on the directory. This is much faster than processing each file individually on a flat object store.
2.  **POSIX-Like Permissions**: Because it uses real directories, administrators can apply Access Control Lists (ACLs) at the directory and file level. They can restrict the `/HR/` directory using a permission model similar to the one used on Linux file systems, which helps meet enterprise compliance requirements.

## ADLS in the Modern Data Architecture

ADLS Gen2 is integrated into the broader Microsoft Azure analytics ecosystem.

*   **Multi-Protocol Access**: ADLS lets developers work with the same data through two APIs. A web application can upload a file using the Blob REST API. A data engineer can then read that same file through the Hadoop-compatible ABFS driver, without moving or copying the data.
*   **Microsoft Fabric**: OneLake, the storage layer of Microsoft's Fabric analytics platform, is built on ADLS Gen2 and supports the same APIs.

## The Cost of the Hierarchy

The Hierarchical Namespace brings real benefits for big data workloads, but pricing differs from flat Blob Storage, and some operations cost more on accounts with HNS enabled. For this reason, companies often use standard Blob Storage for general-purpose storage such as backups and media, and reserve ADLS Gen2 for analytical and [Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/) workloads.

## Conclusion

Azure Data Lake Storage Gen2 adapts cloud object storage to the needs of analytics. By recognizing that big data engines (like Spark) benefit from file system semantics, Microsoft built a storage layer that combines the low-cost scalability of an object store with fast, atomic directory operations, making it a primary choice for analytical workloads on Azure.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
