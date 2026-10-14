---
title: "Great Expectations (GX): Data Quality Testing and How It Compares to Soda and dbt Tests"
meta_title: "Great Expectations vs Soda and dbt Tests for Lakehouses"
description: "Great Expectations (GX Core) is an open-source Python framework for data quality tests. See how it compares to Soda and dbt tests on an Iceberg lakehouse."
---

## What is Great Expectations?

Great Expectations, now branded GX, is an open-source Python framework for testing data quality. The open-source library is called GX Core, and the company behind it also sells a hosted product, GX Cloud. It answers a simple question for each batch of data: does this data look the way I expect it to?

Pipelines often fail without any code being wrong. If an upstream system starts sending `NULL` in `customer_id`, the SQL transformation still runs, and dashboards quietly show wrong numbers. GX catches that by running declared assertions against the data itself.

## Core Concepts

**Expectations** are verifiable assertions about data. In GX Core 1.x they are Python classes:

```python
import great_expectations as gx

not_null = gx.expectations.ExpectColumnValuesToNotBeNull(column="customer_id")
age_range = gx.expectations.ExpectColumnValuesToBeBetween(
    column="user_age", min_value=18, max_value=120
)
```

Code written for releases before 1.0 often uses the older `expect_column_values_to_not_be_null(...)` method style, which 1.0 replaced.

The other building blocks:
* **Expectation Suites** group Expectations that are applied together.
* **Data Sources, Data Assets, and Batch Definitions** describe where data lives and how to slice it into batches (pandas, Spark DataFrames, SQL databases, and files in object storage).
* **Validation Definitions** pair a batch with a suite.
* **Checkpoints** run one or more validations in production and trigger **Actions** such as Slack, email, or Microsoft Teams alerts.
* **Data Docs** are generated HTML pages showing suites and validation results, so analysts can see what is tested and what failed.

For SQL sources, GX translates Expectations into queries that run in the database, so the data does not need to be pulled into Python.

A note on profiling: older releases (0.x) included Profilers and Data Assistants that generated suites by scanning a table. Those APIs were removed in GX Core 1.0, so current suites are written by hand or generated with your own tooling.

## GX in the Lakehouse and WAP

GX fits the audit step of [Write-Audit-Publish](/knowledgebase/write-audit-publish/). A pipeline writes new data to an [Apache Iceberg](/knowledgebase/apache-iceberg/) branch or staging table, an orchestrator such as [Apache Airflow](/knowledgebase/apache-airflow/) or [Dagster](/knowledgebase/dagster/) runs a Checkpoint against that data (through Spark, or through SQL against an engine that can read the branch), and the branch is published only if validation passes. A failed Checkpoint stops the task and leaves production tables untouched.

## Great Expectations vs Soda vs dbt Tests

| | Great Expectations (GX Core) | Soda Core | dbt data tests |
|---|---|---|---|
| How checks are written | Python classes (also JSON) | YAML (data contracts in v4) | YAML plus SQL |
| Runs where | pandas, Spark, or pushed to SQL databases | Pushed to the data source as SQL, plus Spark DataFrames | As SQL in the warehouse or lakehouse engine dbt targets |
| Best fit | Python-heavy pipelines, Spark jobs, rich assertion library | Teams that want declarative contracts close to the data | Teams already modeling with [dbt](/knowledgebase/dbt/) |
| Reporting | Data Docs HTML, Actions | CLI results, Soda Cloud (commercial) | dbt run results, docs site |
| Hosted option | GX Cloud | Soda Cloud | dbt platform |

Many lakehouse teams combine them: dbt tests for model-level rules, plus GX or [Soda](/knowledgebase/soda/) for ingestion checks and cross-source validation. A longer comparison, including anomaly detection tools, is in [Data Quality Tooling Compared](/blog/data-quality-tooling-compared/). See also [Data Quality Is a Pipeline Problem, Not a Dashboard Problem](/blog/2026-02-de-best-practices-03-data-quality-first/) and [Write-Audit-Publish with Apache Iceberg Branches](/blog/write-audit-publish-iceberg-branches/).

## Summary

Great Expectations brings unit-testing habits to data: declare what good data looks like, run those checks on every batch, and stop bad data before it reaches consumers. On an Iceberg lakehouse, pairing it with branch-based WAP gives you a quality gate that costs little extra storage.


## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
