---
title: "Apache Airflow for Lakehouse Pipelines: DAGs, Airflow 3, and Iceberg"
meta_title: "Apache Airflow for Lakehouse Pipelines | Glossary"
description: "Apache Airflow is an open-source platform for authoring, scheduling, and monitoring workflows in Python. See how Airflow 3 orchestrates Iceberg pipelines."
---

Apache Airflow is an open-source platform for authoring, scheduling, and monitoring workflows as Python code. Maxime Beauchemin started it at Airbnb in 2014, it entered the Apache Incubator in 2016, and it became an Apache Software Foundation top-level project in January 2019. Airflow 3.0 shipped in April 2025, and it is one of the most widely deployed orchestrators in data engineering.

In a [data lakehouse](/knowledgebase/data-lakehouse/), data is extracted from source systems, transformed by engines such as Apache Spark, dbt, or Dremio, tested, and written to [Apache Iceberg](/knowledgebase/apache-iceberg/) tables. Airflow coordinates those steps. It does not process the data itself; it triggers, sequences, and monitors the systems that do.

## Workflows as Directed Acyclic Graphs

Airflow workflows are defined in Python rather than in a drag-and-drop tool or a set of cron entries. Each workflow is a [Directed Acyclic Graph](/knowledgebase/directed-acyclic-graph/) (DAG):

* **Directed:** tasks have an order (Task A must finish before Task B starts).
* **Acyclic:** the workflow cannot loop back on itself.
* **Graph:** tasks and their dependencies form a graph that the UI can display.

Because DAGs are code, teams can keep them in Git, review changes in pull requests, and test task logic before deploying.

## Core Components (Airflow 3)

* **Scheduler:** evaluates schedules and dependencies and decides which tasks are ready. The executor runs inside the scheduler process and hands tasks off for execution.
* **DAG processor:** parses DAG files from DAG bundles (by default a local folder) and stores serialized DAGs in the metadata database. In Airflow 3 it runs as its own component.
* **API server:** serves the web UI and REST API, and is the interface tasks use to report state.
* **Executor and workers:** the LocalExecutor runs tasks on the scheduler host; the CeleryExecutor and KubernetesExecutor distribute them to workers or pods.
* **Triggerer:** runs deferred tasks, so a task waiting on an external event does not occupy a worker slot.
* **Metadata database:** usually PostgreSQL or MySQL, storing DAG runs, task states, and connection definitions. In Airflow 3, task code does not connect to this database directly; it talks to the API server.

If a task fails, the scheduler can retry it according to its retry settings, using the state recorded in the metadata database.

## Operators and Providers

Tasks are usually built from operators, which are reusable templates for a type of work. `BashOperator` runs a shell command, `PythonOperator` (or the `@task` decorator) runs a Python function, and `SQLExecuteQueryOperator` runs SQL against any database with a supported connection. Sensors wait for a condition, such as `S3KeySensor` waiting for a file to land in S3.

Provider packages add operators for specific tools. A DAG can wait for a file with `S3KeySensor`, start a Databricks job with `DatabricksSubmitRunOperator`, and post to Slack with a Slack provider operator when the run finishes.

## Failure Handling and Idempotency

Networks time out, APIs return errors, and databases lock. Airflow lets each task define retries and delays, and the UI shows which task failed and why. Retries are only safe if tasks are [idempotent](/knowledgebase/idempotency/): running the same task twice for the same interval must give the same result. For Iceberg tables, that usually means writing with `MERGE INTO` or overwriting a specific partition for the run's date instead of blindly appending.

## Airflow in an Iceberg Lakehouse

A typical lakehouse DAG looks like this:

1. Wait for new source files or a finished ingestion job.
2. Load raw data into a [bronze layer](/knowledgebase/bronze-layer/) Iceberg table.
3. Run dbt or Spark SQL to build [silver](/knowledgebase/silver-layer/) and [gold](/knowledgebase/gold-layer/) tables.
4. Run data quality checks, and only publish if they pass (a [write-audit-publish](/knowledgebase/write-audit-publish/) pattern, often with Iceberg branches).
5. Run table maintenance on a separate schedule: compaction with `rewrite_data_files`, snapshot cleanup with `expire_snapshots`, and orphan file removal.

Since Airflow 2.4, DAGs can also be scheduled by data rather than time; Airflow 3 calls these Assets, so a downstream DAG can run when an upstream DAG updates a table. Alternatives such as [Dagster](/knowledgebase/dagster/) and [Prefect](/knowledgebase/prefect/) take a more asset-centric or Python-native approach. For a current comparison, see [Orchestration in 2026: Airflow 3 vs Dagster vs Prefect vs Event-Driven](/blog/orchestration-in-2026/), and for a worked multi-engine example, see [Orchestrating Airflow DAGs with GitHub Actions](/blog/2024-10-github-actions-dbt-airflow-data/).

## Summary

Apache Airflow brought software engineering practices to data pipelines by expressing workflows as Python DAGs. Its scheduler, DAG processor, API server, executors, and large provider ecosystem let it coordinate everything from ingestion to dbt runs to Iceberg table maintenance. It remains a common orchestration choice for lakehouse teams, alongside newer tools such as Dagster and Prefect.


## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
