---
title: "What is Write-Audit-Publish (WAP)?"
meta_title: "What is Write-Audit-Publish (WAP)? | Expert Data Lakehouse Architecture"
description: "A comprehensive guide to the Write-Audit-Publish (WAP) pattern. Learn how data teams use isolated branches and quality tests to prevent data corruption."
---

# What is the Write-Audit-Publish (WAP) Pattern?

The Write-Audit-Publish (WAP) pattern is a strict architectural methodology used in advanced data engineering to guarantee absolute data quality before new data is exposed to business consumers. It borrows heavily from the software engineering concept of CI/CD (Continuous Integration/Continuous Deployment), ensuring that corrupted data is proactively quarantined and destroyed before it ever reaches a production dashboard.

Historically, data engineering pipelines operated on a highly dangerous "Write-and-Pray" model. A massive ETL job would run at 2:00 AM, extracting data from a third-party API and writing it directly into the live production `Sales_Fact` table. If the API had silently changed its data format (e.g., sending revenue in cents instead of dollars), the pipeline would successfully write mathematically corrupted data directly into production. The CEO would open their dashboard at 8:00 AM, see wildly inaccurate revenue numbers, and lose all trust in the data team. 

The WAP pattern solves this by introducing an isolated staging environment directly into the production deployment flow.

## The Three Phases of WAP

The pattern dictates that data must sequentially pass through three distinct phases, enforced strictly by the pipeline orchestrator (like Apache Airflow or Dagster).

### 1. Write (The Isolated Staging Phase)
When the ingestion pipeline runs, it does NOT write data to the production table. Instead, it writes the data to a completely isolated, invisible environment. 

In a traditional database, this might involve writing to a temporary table (`staging_sales_fact`). In a modern Data Lakehouse utilizing Project Nessie (or the Dremio Open Catalog), this is achieved exponentially faster through zero-copy Branching. The orchestrator creates an isolated Git-like branch off the main catalog, and the pipeline executes its massive multi-terabyte write operations directly onto that invisible branch. The production `main` branch remains entirely untouched and perfectly stable for business users.

### 2. Audit (The Quality Gate)
Once the massive write is complete, the data sits quietly in isolation. The orchestrator triggers the Audit phase.

It deploys rigorous, automated data quality frameworks (like Great Expectations or SodaCL) explicitly against the isolated staging environment. These frameworks run thousands of programmatic assertions:
* `assert max(revenue) < 10000000` (Checking for massive outliers).
* `assert null_count(customer_id) == 0` (Checking for critical missing data).
* `assert row_count > historical_average * 0.8` (Checking for missing API payloads).

If the data fails even a single critical assertion, the orchestrator intentionally crashes the pipeline. The orchestrator alerts the data engineering team immediately. Because the data is isolated on a branch, the corrupted data simply evaporates. The production environment remains perfectly safe.

### 3. Publish (The Atomic Merge)
Only if every single mathematical assertion passes with 100% success does the orchestrator proceed to the Publish phase. 

In a legacy environment, the orchestrator executes a massive SQL `INSERT` statement to move the data from the staging table into the production table. In a modern Nessie-backed Data Lakehouse, the orchestrator simply issues a single `MERGE` command. The isolated branch is instantly and atomically merged into the `main` branch. The new data appears to the business users instantaneously, carrying an absolute, mathematical guarantee of perfect data quality.

## Implementing WAP at Scale

While the logic of WAP is simple, implementing it historically required immense storage duplication (copying terabytes of data into staging tables). 

The modern Open Data Lakehouse entirely removes this friction. Because table formats like Apache Iceberg manage data through metadata manifests rather than physical directories, writing data to an isolated branch only requires generating a few kilobytes of text files. The physical Parquet data files are written to S3 exactly once. When the branch is published, the Iceberg catalog simply points the production manifest at the new Parquet files. This zero-copy architecture allows organizations to implement the highly rigorous WAP pattern across petabyte-scale workloads without incurring any additional cloud storage or computational transfer costs.

## Summary of Technical Value

The Write-Audit-Publish (WAP) pattern is the ultimate architectural defense against data corruption. By physically isolating incoming data, running exhaustive programmatic quality assertions, and demanding perfect compliance before exposing the data to the business, WAP transitions data engineering from a reactive debugging culture into a highly robust, proactive software discipline. It is the absolute standard for ensuring enterprise trust in the data lakehouse.


## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
