---
title: "Time-Series Database vs Apache Iceberg for Time-Series Data"
meta_title: "Time-Series Database vs Iceberg for Time-Series Data"
description: "A time-series database stores and queries timestamped data such as metrics and sensor readings. Learn when a TSDB fits and when Iceberg tables are better."
---

A Time-Series Database (TSDB) is a database built to ingest, compress, and query data indexed by time: server metrics, IoT sensor readings, market ticks, and application telemetry. Relational databases track the current state of entities, and warehouses track business facts. A TSDB is tuned for a steady stream of small, timestamped measurements and for queries over time windows.

Examples include InfluxDB, Prometheus (a monitoring system with its own time-series storage), TimescaleDB (a PostgreSQL extension from the company now called Tiger Data, formerly Timescale), QuestDB, and VictoriaMetrics. A wind farm with hundreds of sensors per turbine reporting every second is a typical use case.

## How TSDBs Are Optimized

### 1. Append-Heavy Ingestion
Most time-series data is written once and rarely changed. TSDBs organize storage around appends in time order, which keeps writes cheap and lets them sustain very high ingest rates. Most still support deletes and late-arriving data, but those paths are slower than plain appends.

### 2. Specialized Compression
Consecutive readings tend to be close to each other. Facebook's Gorilla paper (2015) encodes timestamps with delta-of-delta encoding and floating point values by XOR against the previous value, and reported an average of about 1.37 bytes per data point instead of 16 bytes uncompressed. Many TSDBs use Gorilla-style or similar encodings, and columnar engines get comparable gains with run-length and dictionary encoding.

### 3. Retention and Downsampling
Raw high-frequency data is expensive to keep forever. TSDBs let you define retention policies and rollups: for example, keep raw readings for 30 days and one-minute averages for five years. TimescaleDB calls these [continuous aggregates](/knowledgebase/continuous-aggregates/). Dashboards that span years read the rollups instead of raw points.

### 4. Time-Oriented Query Functions
Standard SQL already has window functions, but TSDBs add helpers that make time queries shorter: bucketing by interval (`time_bucket` in TimescaleDB), gap filling, interpolation, last-value-per-series, and rate calculations over counters.

## TSDB vs Iceberg Tables for Time-Series Data

The line between a TSDB and a lakehouse is getting thinner. InfluxDB 3 is built on Apache Arrow, Apache DataFusion, and Apache Parquet, and persists data as Parquet on object storage, which is the same file format lakehouse tables use.

| | Time-series database | [Apache Iceberg](/knowledgebase/apache-iceberg/) tables |
|---|---|---|
| Best at | Recent data, low-latency dashboards and alerts | Long retention, joins with business data, many engines |
| Ingest | Native line protocols and agents | Batch or streaming via Spark, Flink, Kafka Connect |
| Time layout | Built in | [Partitioning](/knowledgebase/partitioning/) by day or hour, plus sort order; [hidden partitioning](/knowledgebase/hidden-partitioning/) handles timestamp transforms |
| Retention | Retention policies and rollups | Snapshot expiry, deletes, and rollup tables you schedule |
| Query language | SQL, InfluxQL, PromQL, depending on product | SQL in Dremio, Trino, Spark, DuckDB |
| Cost of long history | Grows with the TSDB's storage | Object storage pricing |

A common split is hot and cold: keep the last days or weeks in the TSDB for alerting and live dashboards, and land the full history in Iceberg for analysis alongside customer, asset, and financial tables. For a worked design, read [Logs, Traces, and Metrics as Tables: Building an OpenTelemetry Data Lake on Iceberg](/blog/opentelemetry-data-lake-on-iceberg/) and [The Real-Time Lakehouse with Streaming and Iceberg](/blog/real-time-lakehouse-streaming-sql-cold-iceberg-storage/).

## Summary

A time-series database trades general-purpose features for fast appends, tight compression, retention policies, and time-window queries. It is the right tool for monitoring and recent operational data. When you need years of history, joins with the rest of the business, or access from several engines, Iceberg tables on object storage are often the better long-term home.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
