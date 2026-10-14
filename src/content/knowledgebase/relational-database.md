---
title: "Relational Databases (RDBMS) and How They Feed the Lakehouse"
meta_title: "Relational Database (RDBMS) vs Iceberg Lakehouse Tables"
description: "A relational database stores data in tables of rows and columns linked by keys and changed by ACID transactions. See how RDBMS tables compare to Iceberg tables."
---

A Relational Database Management System (RDBMS) stores data in tables made of rows (records) and columns (attributes), and expresses the connections between tables through shared keys. The relational model comes from Edgar F. Codd's 1970 paper at IBM, and SQL became the standard language for working with it.

PostgreSQL, MySQL, Oracle Database, and Microsoft SQL Server are the best known examples. They run most operational (OLTP) systems: order entry, billing, reservations, inventory, and the back ends of most web applications. In a lakehouse architecture, these databases are usually the source systems whose data flows into analytical tables.

## Core Ideas of the Relational Model

### 1. Declared Schemas
Before you write data, you define tables, columns, and types with Data Definition Language (DDL). If an application tries to insert the string "Twenty-Five" into an integer `age` column, the database rejects the statement and returns an error to the client. Some document databases accept loosely shaped records by default, although many (MongoDB included) offer optional schema validation.

### 2. Primary Keys and Foreign Keys
Normalization splits data into tables so each fact is stored once.
* The `customers` table has a `customer_id` primary key, which must be unique.
* The `orders` table stores that `customer_id` as a foreign key.

With referential integrity enforced, the database refuses to delete a customer who still has orders (or cascades the delete, if you configure it to). That prevents orphaned rows.

## ACID Transactions

An RDBMS groups changes into transactions that are Atomic, Consistent, Isolated, and Durable. Take a $500 transfer: the debit from account A and the credit to account B either both commit or neither does. If the server crashes between the two steps, recovery replays the write-ahead log and rolls back the unfinished transaction, so the money is not lost. Isolation levels (read committed, repeatable read, serializable) control what concurrent transactions can see of each other.

## Scaling

A single-node RDBMS usually scales vertically first: more CPU, memory, and faster disks. Beyond that, teams add read replicas, shard data across nodes (for example with the Citus extension for PostgreSQL), or move to distributed SQL databases such as CockroachDB, YugabyteDB, or Google Spanner, which keep relational semantics across many nodes with added coordination cost. The bigger limit for analytics is the row-oriented storage layout, which is tuned for small reads and writes, not for scanning billions of rows. That is why analytical copies of operational data usually live in a warehouse or a [data lakehouse](/knowledgebase/data-lakehouse/).

## RDBMS Tables vs Iceberg Lakehouse Tables

[Apache Iceberg](/knowledgebase/apache-iceberg/) brings table semantics (schemas, ACID commits, snapshots) to files in object storage, but it is not a drop-in replacement for an operational database.

| | Relational database (OLTP) | Iceberg table in a lakehouse |
|---|---|---|
| Typical workload | Many small reads and writes per second | Large scans and aggregations, batch or streaming writes |
| Storage | Row pages on local or block storage | Columnar Parquet files on object storage |
| Transactions | Multi-statement, multi-table, row-level locking or MVCC | Atomic snapshot commit per table, optimistic concurrency |
| Constraints | Enforced primary keys, foreign keys, checks | Schema and types enforced; keys not enforced |
| Who queries it | The application that owns it | Many engines: Dremio, Spark, Trino, Flink, DuckDB |
| History | Current state, plus logs and backups | Snapshots with time travel |

The common pattern is to keep the RDBMS as the system of record and copy its changes into Iceberg with [change data capture](/knowledgebase/change-data-capture/), often through Debezium and Kafka. The data lands in Bronze tables and is cleaned into Silver and Gold layers for BI and AI workloads. For when Postgres alone is enough and how extensions such as pg_lake and pg_duckdb reach Iceberg, read [Postgres Meets the Lakehouse](/blog/postgres-meets-the-lakehouse/). For CDC design on newer Iceberg versions, see [What Iceberg V3 Advances Mean for CDC Pipelines](/blog/2026-05-iceberg-cdc-pipelines/).

## Summary

A relational database enforces declared schemas, keys, and ACID transactions, which makes it the right home for operational records. A lakehouse table format such as Iceberg borrows the transactional ideas but optimizes for shared, large-scale analytics across many engines. Most data platforms use both, connected by CDC.

## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
