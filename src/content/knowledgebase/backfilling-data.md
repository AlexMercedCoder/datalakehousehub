---
title: "What is Backfilling Data?"
meta_title: "What is Backfilling Data? | Data Lakehouse Hub Knowledge Base"
description: "Backfilling data means reprocessing historical periods so a new metric covers the past. See how orchestrators and Iceberg partitions handle it."
---

# What is Backfilling Data?

## Introduction to Backfilling Data

Data engineering is fundamentally about moving data from the present into the future. A pipeline runs every night, processes yesterday's raw data, and appends it to a Data Warehouse. 

However, business logic is not static. Imagine your company releases a new feature on its website. The data team creates a new metric called "Feature Engagement Score." The pipeline is updated, and starting today, it calculates the score and appends it to the database. 

The immediate next question from the CEO will be: *"What was our Feature Engagement Score for the last 12 months?"*

**Backfilling** is the process of processing historical data retroactively. It involves taking a newly created transformation rule (or a bug fix) and explicitly running it against data from the past, filling in the "blanks" so the historical record matches the new logic.

## Why Backfilling is Difficult

Running a pipeline to process 1 day of data is easy. Running that same pipeline 365 times at once to process an entire year of historical data can overload your infrastructure.

### 1. State and Dependencies
If a pipeline calculates "Total Lifetime Value," today's calculation depends on yesterday's calculation. You cannot backfill December 31st if you haven't successfully backfilled December 30th. This forces the backfill to run sequentially rather than in parallel, which can take days to complete.

### 2. Time-Travel vs. Current State
If you are backfilling an algorithm that determines if an email bounced, you must check the user's email address. If you run the backfill for an event that happened in 2021, and the code checks the user's *current* (2026) email address, the calculation is wrong. Backfilling requires discipline in Point-in-Time correctness; the code must only look at the data exactly as it existed on the specific historical day being processed.

### 3. Rate Limits
If your data pipeline enriches internal data by hitting an external API (e.g., Salesforce), running a 3-year backfill can send a burst of millions of API requests to Salesforce. Salesforce enforces API request limits per organization, so the backfill can exhaust the shared allowance and cause other live integrations that use the same org to fail.

## How to Execute a Backfill

Modern Data Orchestrators (like [Apache Airflow](https://datalakehousehub.com/knowledgebase/apache-airflow/), [Dagster](https://datalakehousehub.com/knowledgebase/dagster/), or [Prefect](https://datalakehousehub.com/knowledgebase/prefect/)) include features designed to handle backfills.

1.  **Idempotency**: The key prerequisite for backfilling is that the pipeline must be idempotent. If the backfill accidentally processes July 4th twice, it must not duplicate the data. 
2.  **Partitioning Strategy**: In an [Apache Iceberg](https://iceberglakehouse.com/iceberg/iceberg-catalog/) lakehouse, backfills rely heavily on partitions. The data engineer instructs Airflow to trigger the backfill. Airflow launches several parallel [Apache Spark](https://datalakehousehub.com/knowledgebase/apache-spark/) jobs. Each job is assigned one specific day. Spark executes the logic and uses an `INSERT OVERWRITE` for that day's partition. Instead of updating rows one-by-one, Iceberg commits a new snapshot that replaces the data files for that partition with the newly calculated data.
3.  **Shadow Deployment**: Because backfills are dangerous, data teams often write the backfilled data to a temporary "Shadow Table." They then run [Data Quality](https://datalakehousehub.com/knowledgebase/data-quality/) checks (e.g., [Great Expectations](https://datalakehousehub.com/knowledgebase/great-expectations/)) comparing the shadow table to the production table. Only when the checks show the backfill is correct do they execute a metadata swap to push the backfill into production.

## Conclusion

Backfilling is a routine part of running an agile business. Because metrics evolve, algorithms improve, and bugs occur, data teams regularly rewrite history. Building data pipelines that are designed to be run retroactively (through strict idempotency, partition overwrites, and state-aware orchestration) is an important sign of maturity for any enterprise data platform.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
