---
title: "What is a Cost-Based Optimizer (CBO)?"
meta_title: "What is a Cost-Based Optimizer? | Expert Data Lakehouse Architecture Guide"
description: "A cost-based optimizer is the query planner that uses table statistics to estimate the cost of each execution plan and picks the cheapest, via catalog metadata."
---

# What is a Cost-Based Optimizer (CBO)?

The Cost-Based Optimizer (CBO) is a core component of many modern query engines (such as Snowflake, Trino, Dremio, and Apache Spark’s Catalyst). When a user writes a SQL query, they are writing declarative code: they are stating *what* data they want. They are not defining *how* the engine should physically retrieve that data from the hard drives. 

The CBO is responsible for taking that abstract SQL query and choosing the physical execution plan with the lowest estimated cost. If an analyst executes a query joining five large tables, there are many different ways the engine could physically execute those joins. Choosing the wrong execution path can make a query run for hours; a good path can let the same query finish in seconds. The CBO aims for the latter.

## Statistical Evaluation

A Rule-Based Optimizer (an older approach) follows static rules (e.g., "Always filter before joining"). A Cost-Based Optimizer can make better choices because it evaluates statistics about the data.

To function, the CBO needs access to table statistics, for example from the Hive Metastore or from [Apache Iceberg](/knowledgebase/apache-iceberg/) table metadata. Before executing the query, the CBO evaluates the metadata statistics for every table involved:
* The total row count of the table.
* The total file size in bytes.
* The cardinality (number of distinct values) of specific columns.
* The Min/Max values stored in Parquet file footers or table metadata.

### Calculating the "Cost"
Using these statistics, the CBO considers many potential execution plans. It assigns an estimated "Cost" to each operation within those plans, approximating how much CPU time, memory, network, and Disk I/O each operation will consume.

If the query joins a 10-billion row `Sales` table to a 500-row `Stores` table:
* **Plan A:** Execute a Sort-Merge Join. The CBO estimates the cost of shuffling 10 billion rows across the network and sorting them. The cost score is very high.
* **Plan B:** Execute a Broadcast Hash Join. The CBO looks at the metadata, verifies the `Stores` table is only 5 Megabytes, and calculates the cost of broadcasting it into RAM. The cost score is low.

The CBO selects Plan B and hands the optimized execution plan to the physical execution engine.

## Advanced Optimization Techniques

The CBO makes structural changes to the query that the user never sees.

* **Join Reordering:** If an analyst writes SQL joining `A`, `B`, and `C` in that order, the CBO might reorder it. If the statistics indicate that joining `B` and `C` first filters out most of the data, the CBO will execute `B JOIN C`, and *then* join the small result to `A`, saving compute.
* **Dynamic Partition Pruning:** In a Star Schema, the Fact table is large and the Dimension table is small. If a user filters the Dimension table (`WHERE Region = 'Europe'`), the engine derives the matching keys at runtime and applies them as a filter on the Fact table's partition column, so it skips partitions that cannot match.

## The Necessity of Catalog Maintenance

The main weakness of the CBO is that its choices depend on the accuracy of the underlying metadata statistics. 

If the statistics are stale (e.g., the catalog claims the table has 500 rows, but the pipeline inserted a billion rows yesterday), the CBO can choose a poor execution plan. It may attempt a Broadcast Hash Join, run out of memory, and fail the query. Keeping statistics accurate and current, for example through table formats like Apache Iceberg, is a prerequisite for a well-functioning CBO.

## Summary of Technical Value

The Cost-Based Optimizer is the translation layer between human intent and bare-metal performance. By evaluating metadata statistics and estimating the I/O and CPU costs of many potential execution paths, the CBO helps complex, distributed analytical queries run efficiently, and it shields business analysts from much of the complexity of Big Data tuning.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
