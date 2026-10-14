---
title: "What is a Data Lake?"
meta_title: "What is a Data Lake? | Expert Data Lakehouse Architecture Guide"
description: "A data lake is a central repository that stores raw structured and unstructured data in its native format, from Hadoop HDFS to cloud object storage today."
---

# What is a Data Lake?

A Data Lake is a centralized storage repository that holds large amounts of raw, unstructured, semi-structured, and structured data in its native format. Conceived to address the limitations and costs of traditional relational data warehouses, the Data Lake allows organizations to store nearly any kind of data, from transactional database extracts to messy JSON web logs, large Parquet files, and even raw audio and video, without forcing the data into a strict schema before saving it.

The foundational premise of the Data Lake is "Schema-on-Read." In a traditional warehouse, an engineer had to define the database columns (Schema-on-Write) and clean the data *before* it could be loaded. If an analyst later realized they needed a data point that was filtered out during the cleaning process, it was often lost. The Data Lake captures data as it was generated. It pushes the burden of cleaning and structuring to the end user (the data scientist or analyst) at the moment they query the data.

## The Evolution of Data Lake Infrastructure

The architectural implementation of the Data Lake has changed a great deal over the last fifteen years.

### Generation 1: The Hadoop Era (HDFS)
The first data lakes were built mostly on Apache Hadoop. Organizations purchased hundreds of physical servers and linked them together using the Hadoop Distributed File System (HDFS). While this was a big step compared to monolithic databases, it was hard to operate. Storage and compute were physically bound together. If a company needed more storage space but required no additional computational power, they were still forced to buy physical servers containing expensive CPUs, resulting in wasted capital expenditure.

### Generation 2: Cloud Object Storage
The arrival of Public Cloud infrastructure largely replaced the on-premises Hadoop data lake model. Modern data lakes are usually built on Cloud Object Storage (such as Amazon S3, Azure Data Lake Storage, or Google Cloud Storage). 

Cloud object storage decouples storage from compute. It provides highly scalable, highly durable storage at a low price per gigabyte. An organization can store petabytes of raw JSON logs in Amazon S3 without managing servers. When a data scientist needs to analyze those logs, they spin up a temporary Apache Spark cluster, run the analysis directly against the S3 bucket, and shut the cluster down afterward. This decoupling reduced costs and removed the burden of physical server maintenance.

## The Chaos of the Data Swamp

While Cloud Object Storage provided nearly unlimited capacity, it lacked database management features. The Data Lake possessed no concept of ACID transactions, no schema enforcement, and no ability to efficiently execute row-level modifications (like `UPDATE` or `DELETE` statements). 

If two data engineering pipelines wrote to the same table directory at the same time, readers could see partial or conflicting results, and one job's output could silently overwrite the other's. If an organization needed to delete a specific user’s record to comply with GDPR data privacy laws, they had to write a complex Spark job to rewrite large numbers of raw data files. Because it was so hard to manage, the Data Lake often devolved into a "Data Swamp," a dumping ground of disjointed files that business analysts could not trust.

## The Rise of the Data Lakehouse

The industry addressed the limitations of the raw Data Lake with the Open [Data Lakehouse](/data-lakehouse/).

The Lakehouse architecture does not replace the Data Lake; it enhances it. It adds a transactional metadata layer (utilizing open table formats like [Apache Iceberg](/apache-iceberg/), Apache Hudi, or Delta Lake) on top of the raw Parquet files resting in the cloud object storage bucket. This brings back key features of traditional data warehouses, such as atomic transactions, schema evolution without rewriting data, and row-level deletes, while keeping the scalable, low-cost foundations of the Data Lake.

## Summary of Technical Value

The Data Lake changed enterprise storage by prioritizing raw data retention and scalability over rigid, upfront schema design. By moving from large Hadoop clusters to decoupled cloud object storage, it reduced enterprise storage costs. While raw data lakes struggle with governance and transactional reliability, they remain the storage foundation of the modern Data Lakehouse.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
