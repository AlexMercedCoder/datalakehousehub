---
title: "What is Query Planner?"
meta_title: "What is Query Planner? | Data Lakehouse Hub Knowledge Base"
description: "A query planner is the part of a database or engine that turns SQL into an execution plan. See the plan lifecycle and how lakehouse engines like Trino use metadata."
---

# What is Query Planner?

## Introduction to the Query Planner

Structured Query Language (SQL) is a declarative language. When a business analyst writes a SQL query (e.g., `SELECT * FROM sales JOIN customers ON sales.id = customers.id`), they are declaring *what* they want the final result to look like. They do not specify *how* the computer should retrieve that data. 

Should the database read the `sales` table first, or the `customers` table first? Should it load the data into memory and perform a Hash Join, or sort the data and perform a Merge Join? Should it scan every file, or utilize a specific index?

The component responsible for making these decisions is the **Query Planner** (often used interchangeably with Query Optimizer). 

The Query Planner is a central component of any database, data warehouse, or compute engine (like Trino, Spark, or Snowflake). It translates the human-readable SQL text into an optimized, executable set of instructions.

## The Lifecycle of a Query Plan

When a SQL string is submitted to an engine, the Query Planner passes it through a multi-stage compilation pipeline.

### 1. Parsing and Syntax Analysis
The engine first checks the SQL string for basic grammatical correctness. Did the user misspell `SELECT` as `SLCT`? Are the parentheses balanced? The parser takes the raw string and converts it into a structured programming object known as an Abstract Syntax Tree (AST).

### 2. Semantic Analysis and Binding
Next, the engine validates the *meaning* of the query against the actual database metadata (the Catalog). 
Does the table `sales` actually exist? Does the user have the RBAC permissions to read it? Does the column `id` exist, and is its type compatible with `customers.id` for a join?

### 3. The Logical Plan (Rule-Based Optimization)
Once validated, the planner constructs an initial **Logical Plan**. This is a tree of relational algebra operators (Filter, Project, Join).
At this stage, the planner applies **Rule-Based Optimization (RBO)**. It uses heuristic rules to rewrite the logical plan into an equivalent plan that is usually faster, regardless of the underlying data.
*   **[Predicate Pushdown](https://iceberglakehouse.com/iceberg/iceberg-predicate-pushdown/)**: If the query filters `WHERE year = 2026` *after* the join, the RBO rewrites the plan to filter the data *before* the join, so less data reaches the join.
*   **Constant Folding**: If a query has `WHERE price > 10 * 5`, the planner rewrites it to `WHERE price > 50` so the expression is not recalculated for every row during execution.

### 4. The Physical Plan (Cost-Based Optimization)
The logical plan dictates *what* operations to perform, but the **Physical Plan** dictates *how* to physically execute them on the hardware.
A single logical plan can have many valid physical execution paths. Should the engine use a Broadcast Join or a Shuffle Hash Join? 

To decide, the planner hands the options over to the **Cost-Based Optimizer (CBO)**. The CBO looks at the actual statistical metadata of the tables (e.g., "The sales table has 1 billion rows, the customers table has 1,000 rows"). It estimates a "cost" for candidate physical plans based on estimated CPU, memory, and network I/O usage. It selects the physical plan with the lowest overall cost.

### 5. Execution
The chosen Physical Plan is turned into executable tasks (some engines generate code at runtime, for example Spark's whole-stage code generation or Dremio's LLVM-based Gandiva). The engine distributes this code to the worker nodes, reads the storage layer (like S3/Iceberg), and returns the results to the user.

## The Evolution in the Lakehouse

In a traditional database (like Oracle), the Query Planner is tightly coupled to its own storage engine and has detailed knowledge of how data is laid out.

In a decoupled [Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/), the Query Planner (living inside an engine like [Dremio](https://opendatalakehouse.com/kb/dremio/) or Trino) does not own the storage. The data sits as raw Parquet files on [Amazon S3](https://datalakehousehub.com/knowledgebase/amazon-s3/). 

To plan queries effectively, lakehouse planners rely on open table formats like **[Apache Iceberg](https://iceberglakehouse.com/iceberg/iceberg-catalog/)**. Iceberg acts as the metadata layer, providing the Query Planner with file locations, partition information, and min/max column statistics that it uses to prune files and estimate costs for distributed execution plans.

## Conclusion

The Query Planner is one of the most complex parts of any data engine. It hides much of the complexity of distributed computing from users. By automatically transforming declarative SQL into optimized algebraic execution paths, the Query Planner allows analysts to query very large datasets without needing to manage distributed networking or memory themselves.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
