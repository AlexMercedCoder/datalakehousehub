---
title: "HTAP vs the data lakehouse: when one database can replace a pipeline"
meta_title: "HTAP vs Lakehouse: Hybrid Transactional/Analytical DBs"
description: "HTAP (hybrid transactional/analytical processing) runs transactions and analytics in one database. See how HTAP systems work and when a lakehouse fits better."
---

HTAP stands for hybrid transactional/analytical processing. An HTAP database serves operational transactions ([OLTP](/knowledgebase/oltp/)) and analytical queries ([OLAP](/knowledgebase/olap/)) on the same data in one system, so analytics can see recent writes without a separate ETL pipeline into a warehouse. Examples include TiDB with TiFlash, SingleStore, and Google AlloyDB with its columnar engine.

The traditional setup keeps these apart: a row-oriented database such as PostgreSQL runs the application, and a column-oriented warehouse powers dashboards, connected by batch ETL or [change data capture](/knowledgebase/change-data-capture/). HTAP shortens or removes that hop for analytics on operational data.

## Row and column storage in one system

OLTP favors row storage, which is efficient for reading and writing single records. OLAP favors [columnar storage](/knowledgebase/columnar-format/), which is efficient for scanning a few columns across many rows. HTAP systems keep both representations.

TiDB is a well-documented example. Writes go to TiKV, a row store. TiFlash keeps columnar replicas of selected tables, replicated asynchronously as a Raft learner, and reads from TiFlash use the same snapshot isolation as TiKV. AlloyDB takes a different approach: its columnar engine holds selected columns in memory alongside the PostgreSQL row store.

## Query routing

The optimizer decides which representation to use. TiDB's optimizer picks TiKV, TiFlash, or both within one query based on estimated cost, so a lookup by primary key reads rows while a `SUM ... GROUP BY region` scans columns. AlloyDB's planner likewise uses the column store when the needed columns are loaded and the plan is cheaper. Running TiFlash on separate nodes is recommended when you want analytical scans isolated from transactional traffic.

## What HTAP changes, and what it does not

HTAP is a good fit for analytics on one application's data that need to be current within seconds: operational dashboards, fraud checks, inventory views. It does not replace integration work across many systems. If your analysis joins CRM, billing, product events, and ERP data, that data still has to be brought together somewhere.

## HTAP vs the lakehouse

| | HTAP database | [Data lakehouse](/knowledgebase/data-lakehouse/) |
|---|---|---|
| Primary job | Run the application and analyze its data | Analyze data from many sources |
| Storage | Vendor engine's own row and column formats | Open files ([Apache Iceberg](/knowledgebase/apache-iceberg/) over Parquet) in object storage |
| Freshness | Seconds, for data in that database | Minutes to hours for batch; seconds to minutes with streaming ingestion |
| Engines | One database | Many: Dremio, [Trino](/knowledgebase/trino/), [Spark](/knowledgebase/apache-spark/), Flink, and others through a shared [Iceberg catalog](/knowledgebase/iceberg-catalog/) |
| History and scale | Bounded by the database's storage and cost | Years of history on low-cost object storage, with time travel |
| Modeling | Operational schema, usually close to 3NF | [Medallion architecture](/knowledgebase/medallion-architecture/) and a [semantic layer](/knowledgebase/semantic-layer/) for shared metrics |

The two often coexist. The HTAP database runs the application and answers questions about the last few minutes. Change data capture streams the same data into Iceberg tables, where it joins every other source and serves long-range BI and AI workloads. A lakehouse query engine such as Dremio can also federate a live query to the operational database when a report needs both the newest rows and the history.

## Learn More
To learn more about the [Data Lakehouse](/knowledgebase/data-lakehouse/), read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
