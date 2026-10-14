---
title: "What is a Directed Acyclic Graph (DAG)?"
meta_title: "What is a DAG? | Expert Data Lakehouse Architecture Guide"
description: "A directed acyclic graph (DAG) is a graph of tasks with one-way dependencies and no cycles. See how Airflow and dbt use DAGs to order and parallelize pipelines."
---

# What is a Directed Acyclic Graph (DAG)?

A Directed Acyclic Graph (DAG) is a concept from graph theory that underpins most data engineering orchestration. In platforms like Apache Airflow, dbt, and Dagster, a DAG is used to explicitly define, visualize, and execute complex workflows and data pipelines without falling into infinite execution loops.

Historically, data engineers orchestrated their pipelines using brittle Cron jobs (simple time-based schedules). An engineer would schedule a Python script to pull data from an API at 1:00 AM, and schedule a large SQL aggregation script to run at 2:00 AM. If the API went down and the 1:00 AM script failed, the system executed the 2:00 AM SQL script anyway, processing yesterday's stale data and putting wrong numbers on the downstream business dashboards. A DAG prevents this by linking tasks through explicit dependencies rather than fixed schedules.

## The Mathematical Structure of the DAG

To understand how orchestration works, one must break down the three distinct words comprising the term:

### 1. Graph
A Graph is simply a collection of interconnected nodes. In a data pipeline, every Node represents a distinct, actionable task. For example, Node A might be "Extract Zendesk Data," Node B might be "Clean Zendesk Data," and Node C might be "Generate Marketing Dashboard."

### 2. Directed
The Graph must be Directed. This means the connections between the nodes are not simply lines; they are arrows strictly defining the flow of execution. Node A is explicitly directed toward Node B (A → B). The orchestrator treats this as a hard dependency: Node B cannot begin execution until Node A finishes successfully. If Node A fails, the orchestrator does not run the tasks that depend on it, preventing Node B from running against corrupted or missing data.

### 3. Acyclic
The most important rule is that the Graph must be Acyclic: it must never contain a cycle. Execution can only flow forward. If Node A flows to Node B, and Node B flows to Node C, Node C cannot loop back and point to Node A. 

If a cycle existed, the orchestration engine would have no valid execution order and could loop forever (A triggers B, B triggers C, C triggers A). By enforcing an acyclic structure, the engine ensures that the data pipeline has a defined beginning and a defined end.

## Parallel Execution and Efficiency

Beyond safety, the DAG enables parallel execution. Because the orchestrator knows the dependency map, it can identify which tasks do not depend on each other.

If a DAG contains a path to process `Sales_Data` and an independent path to process `HR_Data`, the orchestrator does not need to execute them sequentially. It can trigger both paths at the same time, running them in parallel across available workers. The orchestrator only forces the pipeline to wait when the two independent paths finally converge (e.g., both must finish before the `Global_Executive_Summary` task begins).

## Automated DAG Generation

In modern tools like dbt (Data Build Tool), engineers rarely draw DAGs manually. Instead, the DAG is dynamically inferred from the codebase.

When a data engineer writes a SQL model in dbt to calculate regional revenue, they do not hardcode the table name. They use the `{{ ref('clean_sales_data') }}` function. The dbt compiler parses the entire repository of SQL files, maps every single `ref()` function, and builds the DAG from those references. If an engineer adds a new model, dbt updates the dependency graph on the next compile, so execution order stays correct without manual configuration.

## Summary of Technical Value

The Directed Acyclic Graph (DAG) moved data orchestration from fragile, time-based scripts to dependency-aware engineering. By enforcing execution order, enabling parallel processing, and stopping downstream tasks when an upstream task fails, the DAG helps complex, multi-step data pipelines run reliably.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
