---
title: "What is Apache Presto?"
meta_title: "What is Apache Presto? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Apache Presto. Learn how Facebook invented the distributed SQL engine that pioneered interactive data lake analytics."
---

# What is Apache Presto?

Apache Presto is a massive, open-source, distributed SQL query engine initially developed by Facebook in 2012 to solve a critical architectural crisis: their internal data analysts could no longer execute interactive queries. At the time, Facebook possessed a 300-Petabyte data lake running on Apache Hive and MapReduce. Executing a simple SQL query to discover how many users clicked a button took hours to complete because MapReduce constantly wrote intermediate data to slow physical hard drives.

Presto was explicitly invented to replace Hive for interactive analytics. It abandoned the slow disk-writing mechanisms of MapReduce and executed the entire SQL query exclusively in active Random Access Memory (RAM) distributed across thousands of massive servers. Presto reduced query times from 14 hours down to 3 seconds, entirely redefining the speed limit of Big Data and laying the absolute foundation for the modern Open Data Lakehouse.

## The Architectural Split: Presto vs. Trino

In the modern data engineering ecosystem, there is frequent confusion regarding Presto and Trino. 

They are essentially the same underlying architectural invention, but they represent a massive organizational fork. In 2018, the original creators of Presto (Martin Traverso, Dain Sundstrom, and David Phillips) left Facebook due to deep disagreements over the open-source governance of the project. 

* **Presto (PrestoDB):** This is the original codebase, which remains heavily governed by the Linux Foundation and heavily utilized internally by massive web-scale companies like Facebook (Meta) and Uber. 
* **Trino (Formerly PrestoSQL):** This is the fork created by the original inventors. It has become the dominant, community-driven standard for the broader enterprise market and the Open Data Lakehouse ecosystem, boasting massive integrations with Apache Iceberg and cloud-native architectures.

## In-Memory Processing and Pipelined Execution

Both Presto and Trino utilize a deeply similar architectural philosophy to achieve their blazing speed: Pipelined Execution.

In legacy engines, a database would extract 10 million rows, calculate the `JOIN`, write the massive result to the hard drive, read it back off the hard drive, and then calculate the `SUM`. 

Presto completely abandons this. It streams the data continuously through active memory. As the Worker node finishes joining the first 1,000 rows, it instantly passes those 1,000 rows to the `SUM` calculation in active memory while it simultaneously joins the next 1,000 rows. The data flows through the mathematical operations like a continuous waterfall, entirely eliminating the catastrophic latency of intermediate disk I/O.

## Limitations and Trade-Offs

The massive speed of Presto's in-memory pipelined execution comes with a severe architectural vulnerability: Memory Exhaustion (Out-of-Memory Errors).

Because Presto executes massively complex joins entirely in RAM, if an analyst writes a poorly optimized query that attempts to join two 5-Billion row tables together, the mathematical explosion of the Cartesian product will physically exceed the available RAM of the Worker nodes. Unlike Apache Spark, which can gracefully "spill" overflowing data to the hard drive and survive the query (albeit slowly), Presto will often violently crash and immediately terminate the query to protect the cluster. It is optimized for speed, not massive batch resilience.

## Summary of Technical Value

Apache Presto is a landmark achievement in distributed computing. By proving that petabyte-scale data lakes could be queried interactively in sub-seconds using purely in-memory, pipelined SQL execution, Presto destroyed the reliance on slow MapReduce architectures and fundamentally enabled the high-speed analytics that power the modern Open Data Lakehouse.

## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
