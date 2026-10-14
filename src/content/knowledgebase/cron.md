---
title: "Cron: Time-Based Scheduling and When Lakehouse Pipelines Need an Orchestrator"
meta_title: "Cron Jobs vs Orchestrators for Lakehouse Pipelines"
description: "Cron is the Unix scheduler that runs commands at set times using five-field expressions. Learn where cron works for lakehouse jobs and where an orchestrator wins."
---

## What is Cron?

Cron is the time-based job scheduler found on Unix-like systems such as Linux and BSD (macOS still ships it, though Apple prefers launchd). A background daemon wakes up every minute, checks its schedule tables, and runs any command whose time has come. For decades it has been the default way to automate backups, log cleanup, report generation, and simple ETL scripts.

Schedules live in crontab files. Each user can edit their own with `crontab -e`, and system-wide jobs live in `/etc/crontab` and `/etc/cron.d/`. A user crontab line has five time fields (minute, hour, day of month, month, day of week) followed by the command:

```
0 2 * * * python3 /scripts/extract_sales.py
```

That line runs the script at 2:00 AM every day. Many implementations also accept shortcuts such as `@daily` and `@hourly`.

## Where Cron Falls Short for Data Pipelines

Cron is reliable and lightweight. The trouble starts when several jobs depend on each other.

### 1. No dependency awareness
Cron only knows about time. If extraction is scheduled at 2:00 AM and transformation at 3:00 AM, cron assumes extraction finishes within an hour. On a day it takes 90 minutes, the transformation runs anyway, processes partial data, and writes wrong results downstream. Orchestrators such as [Apache Airflow](/knowledgebase/apache-airflow/) model jobs as a DAG, so transformation starts only after extraction reports success.

### 2. Limited visibility and alerting
Cron has no UI or run history. By default it can email a job's output through the `MAILTO` setting, but that depends on a working mail setup and does not tell you about jobs that hang or never start. Failures can go unnoticed until someone spots a stale dashboard.

### 3. No retries or backfills
A job that fails on a network timeout simply fails; there is no built-in "retry in five minutes." Rerunning a missed date means editing or invoking the script by hand with the right parameters, whereas orchestrators track runs by logical date and can backfill a range.

### 4. Single machine
Cron runs on one host. If that machine is down at 2:00 AM, the job does not run, and nothing catches it up later (tools like anacron address this for some cases).

## Cron vs Orchestrators for Lakehouse Jobs

| Job type | Cron is fine | Use an orchestrator |
|---|---|---|
| Single self-contained script | Yes | Optional |
| Iceberg table maintenance (compaction, snapshot expiration) on a few tables | Often fine, with alerting added | When many tables or engines are involved |
| Multi-step ingestion and transformation | No | Yes: dependencies, retries |
| [Write-Audit-Publish](/knowledgebase/write-audit-publish/) with quality gates | No | Yes: branching logic on test results |
| Backfilling historical dates | No | Yes |
| Jobs that must run across a cluster or on Kubernetes | No | Yes (or Kubernetes CronJobs for single containers) |

Cron syntax outlived cron's limitations. Airflow accepts cron expressions for a DAG's `schedule`, Dagster schedules take a `cron_schedule`, and Prefect, [Mage](/knowledgebase/mage/), and Kubernetes CronJobs use the same five-field format. Learning cron expressions is still useful even if you never edit a crontab.

For more, see [Introduction to Data Engineering Concepts: Scheduling and Workflow Orchestration](/blog/2025-05-intro-to-data-engineering-concepts-12/), [Orchestration in 2026: Airflow 3 vs Dagster vs Prefect vs Event-Driven](/blog/orchestration-in-2026/), and [Designing the Ideal Cadence for Compaction and Snapshot Expiration](/blog/iceberg-optimization-cadence/).

## Summary

Cron is a dependable way to run a command at a fixed time, and it remains a good fit for isolated system tasks and simple maintenance jobs. Once a [data lakehouse](/knowledgebase/data-lakehouse/) pipeline has dependencies, quality gates, retries, or backfills, a dedicated [orchestration](/knowledgebase/orchestration/) tool is the better choice, usually still scheduled with a cron expression.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
