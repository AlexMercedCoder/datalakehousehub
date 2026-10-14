---
title: "Dagster for lakehouse pipelines: how it compares to Airflow and Prefect"
meta_title: "Dagster vs Airflow for Lakehouse Pipelines | Glossary"
description: "Dagster is an open-source orchestrator that models pipelines as data assets instead of tasks. See how it compares to Airflow and Prefect on Iceberg lakehouses."
---

Dagster is an open-source data orchestrator for analytics, ETL, and machine learning pipelines. Task-based orchestrators answer the question "did the job run?" Dagster's core abstraction, the asset, answers a different question: "is this table, file, or model current and correct?"

That difference matters most in a [data lakehouse](/knowledgebase/data-lakehouse/), where the things you care about are tables: bronze, silver, and gold [Apache Iceberg](/knowledgebase/apache-iceberg/) tables in a [medallion architecture](/knowledgebase/medallion-architecture/), plus the views and metrics built on top of them.

## Assets instead of tasks

Classic orchestrators such as [Apache Airflow](/knowledgebase/apache-airflow/) define a DAG of tasks. A task might be "run SQL script A" followed by "run Python script B," and the scheduler does not need to know what either script writes.

In Dagster you define assets: Python functions decorated as producing a specific piece of data, such as a table, a partition, or a trained model. Dependencies between assets come from their inputs, so the graph Dagster shows you is a graph of data, not of jobs. If you need to refresh `monthly_revenue`, you can materialize that asset and its upstream dependencies without rerunning unrelated work.

## Local development and I/O managers

Dagster separates transformation logic from storage through resources and I/O managers. The same asset code can write to a local file or DuckDB during development and to a warehouse or Iceberg table in production by swapping configuration. That makes unit testing pipelines on a laptop practical.

## dbt integration

The `dagster-dbt` library reads your dbt project's manifest and represents each dbt model, seed, and snapshot as its own Dagster asset. dbt tests show up as asset checks on the models they test. You can run a single model, see per-model run history, and place Python assets (an API extract, a feature computation) upstream or downstream of specific dbt models.

## Automation and observability

Dagster supports cron schedules, sensors, and Declarative Automation, where each asset carries an automation condition (for example, run on a cron, run eagerly when upstream data changes, or run when missing). Freshness policies are a separate feature: they flag assets that have not materialized recently and can trigger alerts. Each materialization can record metadata such as row counts, and asset checks let you encode data quality rules next to the asset they protect.

## Dagster vs Airflow vs Prefect

| | Dagster | Apache Airflow | Prefect |
|---|---|---|---|
| Core unit | Asset (with ops and jobs underneath) | DAG of tasks; asset-aware scheduling added later | Flows and tasks; assets added in Prefect 3 |
| Data awareness | Lineage, checks, and freshness per asset | Assets (called datasets before Airflow 3) trigger downstream DAGs | `@materialize` records asset lineage and health |
| dbt | Each model is an asset via `dagster-dbt` | Usually via operators or the community Cosmos project | Via `prefect-dbt` |
| Local testing | I/O managers swap storage per environment | Possible, but DAG parsing and providers add setup | Flows are plain Python functions |
| Governance | Open source, Dagster Labs | Apache Software Foundation project | Open source, Prefect Technologies |

How to choose: if your team already runs Airflow at scale and mostly orchestrates jobs across many systems, its operator ecosystem and asset scheduling may be enough. If your pipeline is mainly "build these Iceberg tables in order and tell me which ones are stale," Dagster's asset model maps directly onto that job. Prefect fits teams that want to turn existing Python scripts into scheduled, observable workflows with minimal restructuring.

## Dagster on an Iceberg lakehouse

The `dagster-iceberg` library (a community integration that the Dagster docs describe as in preview) provides I/O managers built on PyIceberg, with PyArrow, pandas, Polars, Daft, and Spark variants. An asset that returns a table can be written to an Iceberg namespace through any PyIceberg-supported catalog, such as a REST catalog like [Apache Polaris](/knowledgebase/apache-polaris/). A common split is to let Dagster own ingestion and Python steps, let dbt own SQL models executed by an engine such as Dremio, [Trino](/knowledgebase/trino/), or [Spark](/knowledgebase/apache-spark/), and let a [semantic layer](/knowledgebase/semantic-layer/) sit over the gold tables for BI and AI agents.

## Learn More
To learn more about the [Data Lakehouse](/knowledgebase/data-lakehouse/), read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
