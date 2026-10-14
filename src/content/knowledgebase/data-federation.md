---
title: "Data Federation vs the Lakehouse: When to Query Data in Place"
meta_title: "Data Federation vs Lakehouse: When to Query in Place"
description: "Data federation lets one query engine read and join data across separate systems without copying it. Learn when to federate and when to load into Iceberg."
---

Data federation is the ability of a query engine to read and `JOIN` data from two or more separate systems in a single query, without first copying that data into one place. [Data virtualization](/knowledgebase/data-virtualization/) describes the broader approach of presenting unified views over data that stays where it is; federation is the query execution mechanism underneath it.

A traditional database such as PostgreSQL joins tables it stores itself. Without federation, joining an `orders` table in PostgreSQL with a `shipping` collection in MongoDB means writing a pipeline that extracts both into a third system and joins them there. A federated engine connects to both sources and runs the join itself.

## How Federated Queries Work

A federated engine such as Trino or Dremio coordinates queries across external systems. Trino stores no table data of its own. Dremio queries sources in place but can also keep optional [reflections](/knowledgebase/data-reflections/), precomputed copies stored as Iceberg tables, to speed up repeated queries.

### Connectors
Engines use connectors (Trino) or sources (Dremio) to reach each system. With a MySQL connector, an Iceberg catalog, and a Snowflake connector configured, an analyst can write one SQL query across all three:

```sql
SELECT c.name, o.total_amount, s.delivery_status
FROM mysql.production.customers c
JOIN iceberg.datalake.orders o ON c.id = o.customer_id
JOIN snowflake.logistics.shipping s ON o.order_id = s.order_id;
```

### Pushdown and Distributed Joins
The engine's [cost-based optimizer](/knowledgebase/cost-based-optimizer/) plans the query and [pushes down](/knowledgebase/predicate-pushdown/) what each source can handle: filters, projections, and sometimes aggregations or joins that stay within one source. Each source returns its partial results to the engine's workers.

The engine then performs the cross-source join itself, redistributing rows by join key across workers. Engines such as Dremio process this data in the [Apache Arrow](/knowledgebase/apache-arrow/) columnar format. When intermediate data exceeds available memory, engines that support [spilling to disk](/knowledgebase/spill-to-disk/) write it to local disk instead of failing, though very large joins can still hit resource limits or time out.

## Limits of Federation

Federation works best when sources can filter data down before it moves. It struggles when they cannot.

Joining a 10-billion-row Snowflake table with a 5-billion-row Oracle table on keys that neither source can pre-filter means pulling a large share of those rows across the network into the federated engine. That consumes bandwidth, can incur cloud egress charges when sources are in different regions or clouds, puts scan load on the source systems, and can take a long time. Freshness and availability also depend on every source being up when the query runs.

## Federate or Load into the Lakehouse?

Most teams use both. Federation fits exploration and small or fast-changing data; moving data into [Apache Iceberg](/knowledgebase/apache-iceberg/) tables fits heavy, repeated workloads.

| Situation | Federate in place | Load into Iceberg |
|---|---|---|
| Ad hoc exploration and prototyping | Good fit | Overkill until the use case is proven |
| Joining large lakehouse facts with a small live lookup table | Good fit | Optional |
| Dashboards that run the same heavy join many times a day | Slow and loads sources | Good fit, often with reflections or [materialized views](/knowledgebase/materialized-view/) |
| Large cross-source joins | Network-bound | Good fit |
| Data that must be current to the second | Good fit | Needs CDC to keep up |
| Protecting production OLTP systems from analytical load | Risky | Good fit |

A common pattern is to start with federated views for a new use case, then materialize the cross-source result into Iceberg (for example with `CREATE TABLE AS SELECT` or a scheduled `MERGE INTO`) once it proves its value, and point dashboards at that table. For a deeper decision guide, see [Federation and the Lakehouse: Two Roads to Unified Data Access](/blog/federation-and-lakehouse/), and for how federation underpins a semantic layer, see [Data Virtualization and the Semantic Layer](/blog/2026-02-semantic-layer-07-data-virtualization/). Related: [federated data access](/knowledgebase/federated-data-access/) and [zero-ETL](/knowledgebase/zero-etl/).

## Summary

Data federation lets one SQL query reach across databases, warehouses, and lakehouse tables by pushing work down to each source and joining the results in a distributed engine. It removes pipelines for exploration and small or fresh data, but large repeated cross-source joins are better served by materializing results into Iceberg tables in the [data lakehouse](/knowledgebase/data-lakehouse/).


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
