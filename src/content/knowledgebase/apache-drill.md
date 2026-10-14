---
title: "What is Apache Drill?"
meta_title: "What is Apache Drill? | Expert Data Lakehouse Architecture Guide"
description: "Apache Drill is an open-source distributed SQL engine that queries JSON, CSV, and Parquet files without a predefined schema, and its influence on the lakehouse."
---

# What is Apache Drill?

Apache Drill is an open-source, distributed SQL query engine built to reduce a common bottleneck in data engineering: the need to define a schema (a table structure) *before* data can be queried. Inspired by Google's Dremel paper, Apache Drill lets analysts point standard SQL directly at folders of nested JSON logs, CSVs, or Parquet files and get results without first writing ETL code or creating a relational table.

In a traditional relational database or data warehouse, the architecture uses "Schema-on-Write." Before a data engineer can load a JSON log file into PostgreSQL, they must write Data Definition Language (DDL) to create a table, choose data types, and write code to parse the JSON into the right columns. If the JSON structure changes later, the loading pipeline has to be updated or it will fail.

Apache Drill is built around "Schema-on-Read," and extends it with schema discovery at query time.

## The Architecture of Schema-Free Discovery

Apache Drill assumes that much enterprise data is semi-structured, varied, and nested.

### The Dynamic Record Reader
When an analyst runs a query like `SELECT t.user_id, t.device.os FROM s3.logs.raw_events t` (where `s3` is a configured storage plugin and `raw_events` is a folder of JSON files), Drill does not need a central catalog (such as a Hive Metastore) to describe the data first, although it can use one.

Instead, Drill's distributed worker nodes (Drillbits) read the raw JSON files directly and infer the schema as they read. Drill recognizes that `device` is a nested object and extracts the `os` field from it. It processes the data in an in-memory columnar format, runs the SQL aggregation, and returns the result to the analyst.

The analyst can query raw files in an S3 bucket much as they would query a structured database table, skipping the wait for an ETL pipeline.

## The Foundation of the Modern Data Lakehouse

Apache Drill is useful for ad-hoc data discovery and log analysis, and it was an important influence on the federated engines used in the modern [Data Lakehouse](/data-lakehouse/).

Drill showed that a distributed query engine could be decoupled from storage. A single engine could query a MongoDB database, files in Amazon S3, and a relational database, joining them in one SQL statement.

This schema-flexible, federated approach was carried forward by platforms like **Dremio**, which was founded by people who had led work on Drill and was influenced by its design. Drill remains a capable tool for exploring raw files, while Dremio applies a similar flexible query model with additional features such as Reflections, a semantic layer, and acceleration for BI dashboards.

## Summary of Technical Value

Apache Drill showed that rigid, upfront schemas are not a prerequisite for big data analytics. By building its engine around schema-on-read and schema discovery, Drill lets analysts run SQL directly against nested files in the data lake, speeding up data discovery and reducing dependence on ETL pipelines for exploratory work.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
