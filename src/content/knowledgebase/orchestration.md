---
title: "What is Data Orchestration?"
meta_title: "What is Data Orchestration? | Expert Data Lakehouse Architecture Guide"
description: "Data orchestration schedules and monitors interdependent pipelines in dependency order. Learn how tools like Apache Airflow use DAGs, retries, and backfills."
---

# What is Data Orchestration?

Data orchestration is the control layer that schedules, monitors, and manages the execution order of interdependent data pipelines across an organization's infrastructure. It acts as the "air traffic controller" of the modern [Data Lakehouse](/data-lakehouse/).

In the early days of data engineering, teams used Linux `cron` jobs to schedule scripts. They would schedule the Salesforce extraction script to run at 2:00 AM and the Tableau dashboard refresh to run at 3:00 AM, hoping the extraction finished before the refresh began.

As data teams grew, this time-based scheduling caused cascading failures. If the Salesforce API went down and the extraction failed, the 3:00 AM refresh still ran, pulling incomplete data and presenting it to executives as if it were correct. Data orchestration platforms (like Apache Airflow, Dagster, and Prefect) were built to prevent this by making the dependencies between pipeline steps explicit.

## The Architecture of the DAG

Modern orchestration platforms combine schedules with dependency-based execution, modeled as a Directed Acyclic Graph (DAG).

A data engineer writes Python code to define the sequence of tasks:
1. **Task A:** Extract the Salesforce data.
2. **Task B:** Extract the Stripe financial data.
3. **Task C:** Run the dbt SQL transformation that joins them.

In a DAG, the orchestrator knows the relationships between tasks. It knows that Task C depends on both Task A and Task B completing successfully.

### Parallel Execution and Dependency Management
At 2:00 AM, the orchestrator starts the run. It executes Task A and Task B in parallel on its workers, since neither depends on the other.

It holds Task C until both upstream tasks succeed. If Task A fails due to a network timeout, the orchestrator does not run Task C, so the downstream lakehouse tables are not updated with incomplete data. It can alert the engineering team through tools like PagerDuty or Slack.

## Retry Logic and Backfilling

Orchestration platforms also add operational resilience.

If Task A fails because of a brief network glitch, paging an engineer at 2:00 AM is wasteful. The orchestrator can be configured with retry logic. It waits a few minutes, tries Task A again, and if it succeeds, the rest of the pipeline continues without human intervention.

Orchestrators also manage historical backfills. If an engineer fixes a bug that has existed for three months, they may need to rerun the pipeline for each of the last 90 days. Doing this by hand is tedious and error-prone. With an orchestrator, the engineer can trigger a backfill, and the system runs the DAG once per day in the range, passing the correct date parameter into each run, in parallel up to the concurrency limits they set.

## Summary of Technical Value

Data orchestration turned data engineering from a set of loosely connected scripts into managed, observable systems. By declaring dependencies in DAGs, stopping downstream steps when upstream steps fail, and automating retries and backfills, orchestration platforms serve as the control plane for keeping the open data lakehouse healthy and reliable.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
