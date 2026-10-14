---
title: "What is Continuous Aggregates?"
meta_title: "What is Continuous Aggregates? | Expert Data Lakehouse & AI Glossary"
description: "Continuous aggregates are materialized views that refresh incrementally as new data arrives, so rollups stay current. See how they relate to streaming and CDC."
---

Continuous aggregates are precomputed summaries of time-series data that a database keeps up to date automatically as new rows arrive. The term comes from TimescaleDB, the PostgreSQL extension, where a continuous aggregate is a materialized view over a hypertable that is refreshed incrementally in the background instead of being rebuilt from scratch. A dashboard that asks for hourly or daily averages reads the small rollup rather than scanning every raw reading.

## How It Works

In TimescaleDB you declare a continuous aggregate with standard materialized view syntax plus an option flag, and you group by a time bucket:

```sql
CREATE MATERIALIZED VIEW conditions_by_day
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 day', time) AS bucket,
       device_id,
       MIN(temperature), MAX(temperature), AVG(temperature)
FROM conditions
GROUP BY bucket, device_id
WITH NO DATA;
```

Behind the view, three mechanisms keep it current:

- **Materialization hypertable.** The aggregated results are stored in their own hypertable, so the rollup gets the same partitioning and query planning as the source data.
- **Invalidation tracking.** When rows are inserted, updated, or deleted in time ranges that have already been materialized, the database records those ranges. The next refresh recomputes only the affected buckets.
- **Refresh policies.** A scheduled policy refreshes a window of time (for example, from 30 days ago up to one hour ago) on a fixed interval.

TimescaleDB also offers **real-time aggregation**, which answers a query by combining the materialized buckets with an on-the-fly aggregate of raw rows that have not been materialized yet. According to the TimescaleDB docs, real-time aggregates are disabled by default starting in version 2.13, so recent data appears only after the next refresh unless you turn the option on.

## Continuous Aggregates vs Related Techniques

| Technique | Refresh model | Where it lives |
|---|---|---|
| Standard PostgreSQL materialized view | Full recompute on `REFRESH` | Single database |
| TimescaleDB continuous aggregate | Incremental, by invalidated time bucket | Hypertables in PostgreSQL |
| Streaming aggregation (Flink, Kafka Streams) | Updated per event or window as data flows | Stream processor state, often written to a table |
| Lakehouse aggregate acceleration (for example, Dremio aggregation Reflections) | Scheduled or incremental refresh managed by the engine | Files on object storage, substituted by the query planner |

## Relevance to the Lakehouse

Lakehouse tables in Apache Iceberg do not have a built-in continuous aggregate object, but the same pattern shows up in several places. A streaming job in Apache Flink or Spark Structured Streaming can maintain rolled-up tables in Iceberg. In the [medallion architecture](/knowledgebase/medallion-architecture/), those rollups usually live in the gold layer. Query engines can also manage the rollup for you: Dremio's [aggregation Reflections](/knowledgebase/aggregation-reflections/) are precomputed aggregates that Dremio stores and refreshes, and the planner rewrites matching queries to use them without users changing their SQL.

The design questions are the same in every system. Decide which grain (minute, hour, day) the consumers need, how late data is allowed to arrive and still be counted, and whether readers must see the newest few minutes. Those answers determine the refresh window, the refresh frequency, and whether you need a real-time merge of raw and summarized data.

For related concepts, see the [materialized view](/knowledgebase/materialized-view/) and [time-series database](/knowledgebase/time-series-database/) entries, and the Hub post on [autonomous Reflections in the agentic lakehouse](/blog/autonomous-reflections-agentic-lakehouse/).

## Summary

Continuous aggregates are incrementally maintained rollups of time-series data. TimescaleDB implements them as materialized views with invalidation tracking and refresh policies, and lakehouse platforms reach the same goal with streaming rollup tables or engine-managed aggregate acceleration over Iceberg.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
