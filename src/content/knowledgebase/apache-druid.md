---
title: "Apache Druid vs an Iceberg Lakehouse for Real-Time Analytics"
meta_title: "Apache Druid vs Iceberg Lakehouse Analytics | Glossary"
description: "Apache Druid is an open-source real-time analytics database for fast queries on event data. Here is how it fits next to, and ingests from, Iceberg tables."
---

## What Apache Druid Is

Apache Druid is an open-source, distributed analytics database built for low-latency queries on event and time-series data. It ingests streams from Apache Kafka or Amazon Kinesis and batch files, stores data in compressed columnar segments partitioned by time, and serves aggregation queries fast enough to back interactive dashboards. Druid is a top-level project of the Apache Software Foundation.

Its typical workloads are clickstream analytics, application and network monitoring, ad tech reporting, and IoT telemetry: many concurrent users slicing recent events by time and a handful of dimensions.

## How Druid Is Built

Druid splits work across several service types:

- **Ingestion (Overlord, Middle Manager, Peon or Indexer).** Streaming ingestion tasks read from Kafka or Kinesis, and the rows they hold in memory become queryable within seconds of arrival, before they are published as segments.
- **Deep storage.** Finished segments are written to shared storage such as Amazon S3, Google Cloud Storage, Azure Blob Storage, or HDFS. Deep storage is the durable copy of all ingested data.
- **Historical services.** They load segments from deep storage onto local disk and memory and answer queries over them.
- **Broker and Router.** The Broker receives SQL or native queries, sends pieces to the ingestion tasks and Historicals that hold the relevant time ranges, and merges the partial results.
- **Coordinator.** It manages segment placement, replication, and retention rules.

Inside a segment, string dimensions are dictionary encoded and get bitmap indexes, so a filter like `country = 'US' AND device = 'mobile'` becomes a bitwise AND over compressed bitmaps rather than a row-by-row scan. Druid can also roll up rows at ingestion time, pre-aggregating events that share a timestamp bucket and dimension values.

Druid SQL supports joins, but query-time joins add overhead, and the Druid docs recommend joining data before ingestion where possible. Druid works best on one wide, denormalized event table per use case.

## Druid and Apache Iceberg

Druid does not use [Apache Iceberg](/knowledgebase/apache-iceberg/) as its storage format. Its segments are a Druid-specific format. The two meet in two ways:

1. **Iceberg as an ingestion source.** The `druid-iceberg-extensions` community extension provides an Iceberg input source that reads a table's live data files through a Hive metastore, AWS Glue, or REST catalog and loads them into Druid segments. That is a copy, so freshness and governance now live in two places.
2. **Federation on top.** A lakehouse engine such as Dremio or Trino can query Druid alongside Iceberg tables, letting Druid serve recent event aggregates while joins against customer or finance data happen in the lakehouse engine. [Connect Apache Druid to Dremio Cloud](/blog/2026-03-connect-apache-druid-dremio/) shows that setup.

## Druid vs Other Real-Time Options

| | Apache Druid | Apache Pinot | ClickHouse | Iceberg plus a lakehouse engine |
|---|---|---|---|---|
| Storage | Druid segments in deep storage | Pinot segments in deep store | MergeTree tables | Parquet files tracked by Iceberg |
| Freshness | Seconds (streaming ingestion) | Seconds (streaming ingestion) | Seconds (inserts, Kafka engine) | Seconds to minutes, set by the commit interval |
| Strength | Time-sliced aggregations, high concurrency | User-facing analytics, upserts | Fast SQL on wide tables | Open data many engines can read |
| Data copy | Yes | Yes | Yes | No extra copy |

If your dashboards can tolerate a short commit delay, an Iceberg table with an acceleration layer may remove the need for a separate serving database. [Real-Time BI on Apache Iceberg](/blog/real-time-bi-iceberg-lakehouse/) covers that approach. See also [Apache Pinot](/knowledgebase/apache-pinot/), [ClickHouse](/knowledgebase/clickhouse/), and [real-time analytics](/knowledgebase/real-time-analytics/).

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
