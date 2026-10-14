---
title: "Debezium CDC to Apache Iceberg: How Log-Based Capture Feeds a Lakehouse"
meta_title: "Debezium CDC to Apache Iceberg Tables | Glossary"
description: "Debezium is an open source change data capture platform that streams row changes from database logs. Learn how its events land in Iceberg tables and tradeoffs."
---

Debezium is an open source platform for log-based [change data capture](/knowledgebase/change-data-capture/) (CDC). It reads a database's transaction log and emits an event for every row-level insert, update, and delete. It is most often deployed as a set of [Kafka Connect](/knowledgebase/kafka-connect/) source connectors, and it can also run as Debezium Server (no Kafka required) or as an embedded engine inside a Java application. Debezium is licensed under Apache 2.0 and is hosted by the Commonhaus Foundation.

The older alternative is query-based extraction: a job runs `SELECT * FROM t WHERE updated_at > :last_run` on a schedule. That adds load to the source database, misses intermediate changes between runs, and cannot see hard deletes. Debezium reads the log the database already writes, so it captures every committed change, including deletes.

## How Log-Based CDC Works

Relational databases record each change in a sequential log before applying it: the write-ahead log (WAL) in PostgreSQL, the binlog in MySQL, the redo log in Oracle, and so on. The database uses that log for crash recovery and replication.

A Debezium connector attaches to the database's replication interface (for example a PostgreSQL logical replication slot or a MySQL binlog client) and reads changes as they are committed. It does not poll the tables, so the extra load on the source is small compared with repeated queries.

### Change Events
Each event describes one row change. For updates it includes both the `before` and `after` state of the row (when the database is configured to log full row images), plus source metadata such as the transaction position and timestamp, and an `op` field (`c`, `u`, `d`, or `r` for snapshot reads). Events are serialized as JSON, Avro, or Protobuf and written to a topic per table. End-to-end latency is typically low, often sub-second, but depends on the database, network, and sink.

## Deletes

Query-based extraction cannot see a deleted row because it is no longer there to select, which leaves stale records downstream. Debezium emits an explicit delete event. When using Kafka, it can also emit a tombstone message so that log-compacted topics drop the key. Downstream, an upsert-capable sink such as Apache Flink or a Spark `MERGE INTO` job turns delete events into deletes on the target table.

## Reliability and Snapshots

Debezium records the log position it has processed. After a restart, it resumes from the last committed offset. Its documented guarantee is at-least-once delivery: after a crash, consumers may see some events again, so downstream writes should be idempotent, for example a `MERGE` keyed on the primary key.

When a connector starts on a table for the first time, the log does not contain the table's full history. Debezium takes an initial snapshot, emitting each existing row as a read event, then switches to streaming changes from the log. Incremental snapshots can also be triggered later without stopping the stream.

## Debezium into Apache Iceberg

A common lakehouse pipeline looks like this: Debezium captures changes into Kafka topics, and a sink writes them to [Apache Iceberg](/knowledgebase/apache-iceberg/) tables. Typical sinks are the Apache Iceberg Kafka Connect sink (which appends records, a good fit for a raw change log), Apache Flink with upsert mode keyed on identifier fields, or a Spark Structured Streaming job that runs `MERGE INTO` per micro-batch. Check your sink's docs for whether it applies updates and deletes or only appends.

| Design choice | Option A | Option B |
|---|---|---|
| Table shape | Append-only change log (bronze) | Current-state mirror via upserts (silver) |
| Delete handling | Keep delete events as rows | Apply deletes with equality deletes or `MERGE` |
| Write cost | Cheap appends | More delete files; needs regular compaction |
| Query cost | Readers must reconstruct latest state | Readers see current state directly |

Many teams keep both: a raw change log for audit and replay, and a merged table for analytics. Upserts on Iceberg create delete files that must be compacted regularly to keep reads fast. For more, read [What Iceberg V3 Advances Mean for CDC Pipelines](/blog/2026-05-iceberg-cdc-pipelines/), [Kafka Connect to Iceberg: How the Commit Actually Works](/blog/kafka-connect-iceberg-commits/), and [The Lakehouse Ingestion Tool Landscape](/blog/lakehouse-ingestion-tools/).

## Summary of Technical Value

Debezium replaces scheduled extraction queries with log-based change capture, so every insert, update, and delete reaches the [data lakehouse](/knowledgebase/data-lakehouse/) with low latency and low source impact. Pair it with an idempotent Iceberg sink and a compaction plan, since delivery is at-least-once and upserts generate delete files.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
