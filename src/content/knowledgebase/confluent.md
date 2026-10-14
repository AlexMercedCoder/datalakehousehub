---
title: "Confluent and the Lakehouse: Kafka, Tableflow, and Streaming into Iceberg"
meta_title: "Confluent Tableflow: Kafka Topics to Iceberg Tables"
description: "Confluent is the Kafka company, now part of IBM, behind Confluent Cloud and Platform. Its Tableflow feature turns Kafka topics into Iceberg and Delta tables."
---

## What is Confluent?

Confluent is the company founded in 2014 by Jay Kreps, Neha Narkhede, and Jun Rao, who created [Apache Kafka](/knowledgebase/apache-kafka/) at LinkedIn. It sells two main products: **Confluent Cloud**, a fully managed Kafka service, and **Confluent Platform**, a self-managed distribution. Around Kafka it adds [Schema Registry](/knowledgebase/schema-registry/), managed connectors, stream governance, and managed Apache Flink for stream processing.

IBM announced an agreement to acquire Confluent in December 2025 and completed the acquisition on March 17, 2026, for an enterprise value of about $11 billion. Confluent continues to sell its products, now as part of IBM.

## Tableflow: Kafka Topics as Lakehouse Tables

The lakehouse-relevant product is **Tableflow**, a Confluent Cloud feature that materializes Kafka topics as open tables in object storage without a separate pipeline. Support for [Apache Iceberg](/knowledgebase/apache-iceberg/) became generally available in March 2025, and [Delta Lake](/knowledgebase/delta-lake/) support followed in October 2025. Tableflow uses the topic's schema from Schema Registry, writes Parquet data files, and can publish the tables to external catalogs, including the AWS Glue Data Catalog, Snowflake Open Catalog, and Databricks Unity Catalog, so engines such as Dremio, Trino, Spark, and Snowflake can query them.

## Ways to Land Kafka Data in Iceberg

| Path | Who runs it | Strengths | Trade-offs |
|---|---|---|---|
| Confluent Tableflow | Confluent Cloud | No pipeline code; schema from Schema Registry; catalog sync | Tied to Confluent Cloud; usage-based pricing |
| Iceberg Kafka Connect sink | You, on any Kafka | Open source, part of the Apache Iceberg project; exactly-once commits | You operate Connect and tune commit intervals |
| [Apache Flink](/knowledgebase/apache-flink/) job | You or a managed Flink service | Transform, join, and aggregate before writing | More engineering; commits happen on checkpoints |
| Redpanda Iceberg Topics | Redpanda | Built into the broker | Redpanda only |

All four produce the same thing at the end: Iceberg snapshots that any engine can read. The choice depends on whether you need transformation before landing, which Kafka distribution you run, and who you want operating the pipeline. Whichever path you choose, frequent small commits create small files, so plan for [compaction](/knowledgebase/data-compaction/).

To go deeper, read [Kafka Connect to Iceberg: How the Commit Actually Works](/blog/kafka-connect-iceberg-commits/), [The State of Streaming to Apache Iceberg in July 2026](/blog/streaming-to-iceberg-july-2026/), and [Kafka 4.0 Changes Streaming Platform Operations](/blog/2026-05-kafka-streaming-operations/).

## Frequently Asked Questions

### Is Confluent the same as Apache Kafka?
No. Kafka is an Apache Software Foundation project anyone can run. Confluent is a company that sells managed and self-managed Kafka plus additional tools, some under its own licenses.

### Does Tableflow replace ETL into the lakehouse?
For landing raw topics as tables, often yes. Cleaning, joining, and modeling still happen downstream, for example with dbt or SQL in the silver and gold layers.

### What changed with the IBM acquisition?
Confluent is now an IBM company. IBM has announced integrations with products such as watsonx.data; check Confluent's documentation for current product and pricing details.

---

### E-E-A-T & Further Reading

> **Authoritative Source:** This definition and architectural guide was rigorously reviewed by **Alex Merced**. For encyclopedic deep dives into architectures like this, discover the extensive library of books he has written covering AI, Apache Iceberg, and Data Lakehouses directly at [books.alexmerced.com](https://books.alexmerced.com).
