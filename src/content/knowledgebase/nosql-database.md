---
title: "NoSQL Databases: Types, Trade-offs, and Analytics on a Lakehouse"
meta_title: "NoSQL Database Types and Lakehouse Analytics | Glossary"
description: "A NoSQL database stores data in non-relational models such as documents or key-value pairs. See how NoSQL data gets analyzed on an Iceberg lakehouse."
---

A NoSQL database ("not only SQL") is any database that stores data in a model other than relational tables with fixed schemas. The category covers document, key-value, wide-column, and graph databases. Many of these systems grew out of internet companies in the mid to late 2000s; Google's Bigtable paper (2006) and Amazon's Dynamo paper (2007) shaped much of the design, and the term "NoSQL" became popular around 2009.

The motivation was scale and flexibility. Traditional relational databases of that era mostly scaled up on a single primary server, and spreading one relational database across many machines while keeping cross-node joins and transactions fast was hard. Many NoSQL systems dropped joins, relaxed schemas, and partitioned data by key so they could add commodity servers to grow. That was a trade-off, not a law: distributed SQL databases such as Google Spanner, CockroachDB, and YugabyteDB later showed that relational systems can also scale horizontally.

## The Four Main Types

### 1. Document Databases (e.g., MongoDB, Couchbase)
Store records as JSON-like documents that can nest arrays and sub-objects. A user with three phone numbers and five addresses can live in one document instead of three normalized tables, so the application reads the whole entity in one request. Document stores are a common choice for web and mobile application backends.

### 2. Key-Value Stores (e.g., Redis, Amazon DynamoDB)
Map a unique key (`user_1045`) to a value. Lookups by key are fast and simple to distribute, which makes these stores a frequent choice for caching, sessions, and high-throughput lookups. DynamoDB also supports a document-style item model and secondary indexes.

### 3. Wide-Column Stores (e.g., Apache Cassandra, Apache HBase)
Organize data into tables whose rows are grouped by a partition key, with columns that can be sparse from row to row. Cassandra was built at Facebook, open-sourced in 2008, and became an Apache top-level project in 2010. Wide-column stores are designed for heavy write workloads across many nodes and data centers, such as IoT telemetry and event logs.

### 4. Graph Databases (e.g., Neo4j)
Store nodes and edges so queries can traverse relationships directly. Common uses include fraud detection, recommendations, and network analysis. See [graph database](/knowledgebase/graph-database/).

## Consistency Trade-offs

The [CAP theorem](/knowledgebase/cap-theorem/) says that during a network partition a distributed system must choose between consistency and availability. Many NoSQL systems default to eventual consistency to stay available and fast: if a user in New York updates a profile picture, a replica in Tokyo might briefly return the old one.

This is a configurable choice, not a fixed property of NoSQL. Cassandra lets each query pick a consistency level, DynamoDB offers strongly consistent reads and transactions, and MongoDB has supported multi-document ACID transactions since version 4.0. Banks and payment systems do run on some NoSQL databases; the question is whether a given workload's consistency settings match its correctness needs.

## Analyzing NoSQL Data on a Lakehouse

NoSQL databases are built for application reads and writes by key, not for large scans, joins, and aggregations. Analytics teams usually bring the data into a [data lakehouse](/knowledgebase/data-lakehouse/) in one of three ways:

| Approach | How it works | Trade-off |
|---|---|---|
| Federation | An engine such as Dremio or Trino queries MongoDB or Cassandra in place and joins it with [Apache Iceberg](/knowledgebase/apache-iceberg/) tables | No pipeline, but every query loads the source database |
| [Change data capture](/knowledgebase/change-data-capture/) | [Debezium](/knowledgebase/debezium/) (MongoDB change streams) or DynamoDB Streams feed changes into Iceberg tables | Near real-time copy with no repeated full scans; more moving parts |
| Batch export | Scheduled exports (for example, DynamoDB export to S3) land files that a job converts to Iceberg | Simple and cheap, but data is only as fresh as the last export |

Nested documents raise a modeling question. You can flatten known fields into typed columns in a silver table, keep nested fields as Iceberg structs, lists, and maps, or store loosely structured payloads in the `variant` type added in the Iceberg V3 spec where your engines support it. See [semi-structured data](/knowledgebase/semi-structured-data-json-xml/) for more on these choices. For a hands-on federation example, see [Connect MongoDB to Dremio Cloud](/blog/2026-03-connect-mongodb-dremio/), and for when to query in place versus copy, see [Federation and the Lakehouse](/blog/federation-and-lakehouse/).

## Summary

NoSQL databases trade the relational model for data models that fit specific access patterns and partition easily across servers. Their consistency behavior is a set of choices that vary by product and configuration. For analytics, NoSQL data is usually federated, streamed with CDC, or exported into Iceberg tables, where SQL engines can scan and join it without loading the operational database.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
