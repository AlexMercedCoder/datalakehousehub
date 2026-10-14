---
title: "What is Presto?"
meta_title: "Presto vs Trino: Lakehouse SQL Engines | Glossary"
description: "Presto is an open-source distributed SQL engine built at Facebook for interactive data lake queries. Learn how it relates to Trino and how its pipelines run."
---

# What is Presto?

Presto (also called PrestoDB) is an open-source, distributed SQL query engine for interactive analytics over large datasets. It is not an Apache Software Foundation project, so "Apache Presto" is a misnomer. Presto is hosted by the Presto Foundation, part of the Linux Foundation, and the name is a trademark of LF Projects, LLC.

Facebook started Presto in 2012 to give its analysts interactive SQL over the company's Hive data warehouse. At the time, queries ran through Hive on MapReduce, which writes intermediate results to disk between stages and was too slow for exploratory work. Presto was deployed internally in 2012 and open-sourced in November 2013. It reads data where it already lives, through connectors for Hive tables, object storage, relational databases, and other systems, which made it an early building block of the [data lakehouse](/knowledgebase/data-lakehouse/) pattern.

## Presto and Trino

Presto and [Trino](/knowledgebase/trino/) share a common origin, which causes frequent confusion.

* **Presto (PrestoDB):** The original project. Facebook donated it to the Linux Foundation in September 2019, which formed the Presto Foundation to govern it. Facebook (now Meta) and Uber were among the founding members.
* **Trino (formerly PrestoSQL):** Presto's original creators, Martin Traverso, Dain Sundstrom, and David Phillips, left Facebook and in January 2019 started a separate fork called PrestoSQL, governed by what became the Trino Software Foundation. PrestoSQL was renamed Trino in December 2020. Trino has a large community and vendor ecosystem, including Starburst.

The two projects have diverged over the years in features, connectors, and internals. Both support [Apache Iceberg](/knowledgebase/apache-iceberg/) tables. Presto has also invested in a native C++ execution engine (Prestissimo, built on the Velox library) as an alternative to its Java workers.

## Architecture and Pipelined Execution

A Presto cluster has a coordinator, which parses and plans queries, and workers, which execute them. The coordinator splits a query plan into stages and tasks, and workers process data in batches (pages) that stream between operators and between workers over the network.

Instead of materializing every intermediate result to disk as MapReduce does, Presto pipelines execution: as one operator produces a batch of rows, the next operator can start consuming it while more rows are read. This keeps intermediate data in memory where possible and reduces latency for interactive queries.

## Limitations and Trade-Offs

Because Presto is designed to keep intermediate data in memory, memory is its main constraint. Queries with large joins or aggregations can exceed per-query or per-node memory limits. By default Presto terminates such queries to protect the cluster and other users.

Presto does support [spilling to disk](/knowledgebase/spill-to-disk/) for some memory-heavy operations, such as joins and aggregations, when spilling is enabled in configuration. Spilling lets larger queries finish at the cost of speed, and it needs fast local disks. Very large, long-running batch transformations are often run on engines such as Apache Spark, which was designed around fault-tolerant batch execution.

## Summary of Technical Value

Presto showed that SQL queries over data lake files could be interactive rather than batch, by streaming data through a distributed, pipelined engine instead of writing every stage to disk. It remains in production use and active development under the Presto Foundation, alongside its fork Trino, as one of the query engines used on open lakehouses.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
