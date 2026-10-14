---
title: "Apache Avro in the Lakehouse: Iceberg Manifests, Kafka, and Parquet"
meta_title: "Apache Avro for Iceberg Manifests and Kafka | Glossary"
description: "Apache Avro is a row-oriented binary serialization format with schemas. In a lakehouse it carries Kafka events and stores Apache Iceberg manifest files."
---

## What Apache Avro Is

Apache Avro is an open-source, row-oriented data serialization system maintained by the Apache Software Foundation. It encodes records in a compact binary form and describes them with a schema written in JSON. Because records are written whole, Avro fits workloads that write or read one complete record at a time: event streams, RPC payloads, and log-style files.

Avro is not a query format. Analytical tables usually land in a columnar format such as [Apache Parquet](/knowledgebase/apache-parquet/), and Avro tends to show up at the edges of the [data lakehouse](/knowledgebase/data-lakehouse/): on the way in, and inside table metadata.

## How Avro Schemas Work

Avro data is always read with a schema. An Avro object container file stores the writer's schema once in the file header, followed by blocks of binary records, so any reader can decode the file without outside documentation.

Message streams work differently. A Kafka message carrying Avro usually does not embed the full schema. Instead, a [schema registry](/knowledgebase/schema-registry/) stores the schema and each message carries a small schema ID. Note that [Apache Kafka](/knowledgebase/apache-kafka/) itself treats message values as bytes; Avro is a popular choice there, alongside Protobuf and JSON Schema, not a built-in default.

### Schema Resolution and Evolution

Avro decodes data using two schemas: the writer schema the producer used and the reader schema the consumer expects. The resolution rules match fields by name. If a producer adds a field the consumer does not know, the consumer skips it. If the consumer expects a field that the writer did not include, the reader schema must supply a default value. Schema registries enforce compatibility modes (backward, forward, full) on top of these rules, so a producer cannot register a change that would break existing consumers. See [schema evolution](/knowledgebase/schema-evolution/) for how the same idea works at the table level.

## Where Avro Appears in an Iceberg Lakehouse

Avro plays two roles in an [Apache Iceberg](/knowledgebase/apache-iceberg/) lakehouse:

1. **Iceberg metadata.** In the current Iceberg spec, [manifest lists](/knowledgebase/iceberg-manifest-list/) and [manifest files](/knowledgebase/iceberg-manifest-file/) are Avro files. Each manifest entry records a data file's path, partition values, and per-column statistics that engines like Dremio, Trino, and Spark read during scan planning.
2. **Ingestion.** Events often arrive from Kafka as Avro, are decoded by Flink, Spark, or Kafka Connect, and are written into Iceberg tables as Parquet. Iceberg can also store data files in Avro, though Parquet is the usual choice for analytics.

The metadata role is changing. As tables grow wider, reading whole Avro records to get a few column statistics wastes I/O, and the Iceberg community has been discussing columnar (Parquet) manifests for the v4 spec. [Parquet-Only Manifests in Iceberg v4](/blog/parquet-manifests-iceberg-v4/) explains that debate, and [Understanding the Apache Iceberg Manifest](/blog/2024-8-understanding-apache-iceberg-manifest/) walks through what manifests contain today.

## Avro vs Parquet vs ORC

| | Apache Avro | Apache Parquet | Apache ORC |
|---|---|---|---|
| Layout | Row-oriented | Columnar | Columnar |
| Best at | Writing and reading whole records | Scanning a few columns over many rows | Scanning a few columns over many rows |
| Typical lakehouse role | Kafka payloads, Iceberg manifests | Iceberg and Delta data files | Hive-era and some Iceberg data files |
| Schema location | File header or schema registry | File footer | File footer |
| Column statistics for pruning | No | Yes, per row group and page | Yes, per stripe and row group |

A common pattern: Avro for the stream, Parquet for the table. Teams that skip that conversion and leave analytical data in Avro pay for it at query time, because every scan reads every column. For a broader comparison, see [Apache ORC](/knowledgebase/apache-orc/) and [data serialization](/knowledgebase/data-serialization/).

## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
