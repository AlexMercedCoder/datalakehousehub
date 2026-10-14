---
title: "OLTP Explained: How Transactional Data Reaches the Lakehouse"
meta_title: "OLTP: Transactional Databases and the Lakehouse | Glossary"
description: "OLTP is the class of row-oriented databases that run live business transactions. See how OLTP data reaches Iceberg tables through CDC and federation."
---

OLTP stands for Online Transaction Processing. It describes databases built to run large numbers of small, concurrent transactions for live applications. When a customer adds an item to a cart, an ATM records a withdrawal, or a clinic updates a patient record, an OLTP database such as PostgreSQL, MySQL, SQL Server, or Oracle is usually doing the work.

OLTP systems are tuned for short reads and writes (`INSERT`, `UPDATE`, `DELETE`) on a few rows at a time, with low latency and strong correctness guarantees. They are not tuned for large analytical scans. Running a heavy aggregation such as "average lifetime value across ten million customers" against a production OLTP database competes with live traffic for CPU, memory, and I/O, and can slow the application for real users. That is the main reason analytical workloads move to a separate system such as a warehouse or a [data lakehouse](/knowledgebase/data-lakehouse/).

## Row-Oriented Storage

Most OLTP engines store data row by row. When a customer creates an account, the engine writes the name, address, email, and phone number for that record together in the same page on disk.

This layout suits transactional software. When the customer logs in later, the application looks up one profile by primary key, the engine uses an index (typically a [B-tree](/knowledgebase/b-tree-indexing/)) to find the page, and it returns the whole row in a single read.

A [columnar format](/knowledgebase/columnar-format/) such as Apache Parquet does the opposite: it groups values for each column together. That makes scans of a few columns across billions of rows efficient, but fetching one complete record means touching many column chunks, which is why columnar files are a poor fit for point lookups and frequent single-row updates.

## ACID Transactions and Concurrency

Because OLTP systems record business events such as payments and orders, they enforce [ACID](/knowledgebase/acid-transactions/) guarantees: Atomicity, Consistency, Isolation, Durability.

Consider two users trying to buy the last concert ticket at the same moment. Without isolation, both purchases could succeed. An OLTP engine prevents this with locking and multiversion concurrency control (MVCC). In PostgreSQL, for example, a transaction can take a row lock with `SELECT ... FOR UPDATE`. User A's transaction locks the ticket row, User B's transaction waits, User A commits and inventory drops to zero, and User B then sees zero and the purchase is rejected.

## Normalization (Third Normal Form)

OLTP schemas are usually normalized, often to [Third Normal Form](/knowledgebase/third-normal-form/). Each fact is stored in one place. A customer's address lives in the `users` table, and the `orders` table only holds a `user_id` that points back to it.

When the customer moves, one `UPDATE` on one row fixes the address everywhere, and there is no risk of conflicting copies. The cost appears on the analytics side: reports need many joins across normalized tables, which is one reason analysts prefer denormalized [star schemas](/knowledgebase/star-schema/) built downstream.

## OLTP and the Lakehouse

A lakehouse does not replace an OLTP database. Open table formats like [Apache Iceberg](/knowledgebase/apache-iceberg/) support ACID commits, but they are designed for analytical batches and streams, not thousands of single-row transactions per second. The usual pattern is to keep OLTP for the application and move or expose its data for analytics.

| Approach | How it works | When it fits |
|---|---|---|
| Change data capture (CDC) | A tool such as [Debezium](/knowledgebase/debezium/) reads the database log and streams inserts, updates, and deletes into Iceberg tables (often via Kafka and Flink or Kafka Connect) | Near real-time copies without extra load from repeated full extracts |
| Batch extract | Scheduled jobs export tables or incremental slices and write Parquet files into Iceberg | Simple pipelines where hourly or daily freshness is enough |
| Federation | An engine such as Dremio or Trino queries the OLTP database in place and joins it with Iceberg tables | Small lookups and fresh operational data that does not justify a pipeline |

A common medallion setup lands CDC events in a [bronze layer](/knowledgebase/bronze-layer/) table, merges them into a current-state [silver layer](/knowledgebase/silver-layer/) table with `MERGE INTO`, and builds aggregated gold tables for BI. For PostgreSQL specifically, extensions such as pg_lake and pg_duckdb now let Postgres read and write lakehouse formats directly; see [Postgres Meets the Lakehouse](/blog/postgres-meets-the-lakehouse/). For how Iceberg V3 changes CDC design, see [What Iceberg V3 Advances Mean for CDC Pipelines](/blog/2026-05-iceberg-cdc-pipelines/), and for the comparison with analytical systems see [OLAP](/knowledgebase/olap/).

## Summary

OLTP databases run the live side of a business: row-oriented storage, ACID transactions, and normalized schemas let them handle many small concurrent operations correctly. They produce the raw records that analytics depends on, and in a lakehouse architecture that data reaches Iceberg tables through CDC, batch extracts, or federated queries instead of analysts querying the production database directly.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
