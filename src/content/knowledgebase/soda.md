---
title: "What is Soda?"
meta_title: "What is Soda? | Expert Data Lakehouse Architecture Guide"
description: "Soda is a data quality tool that runs checks written in the YAML-based SodaCL language. Learn how it handles anomaly detection, data contracts and CI/CD checks."
---

# What is Soda?

Soda is a data quality and observability platform, with an open-source core (Soda Core) and a commercial Soda Cloud service, designed to catch data issues early in the pipeline. Like Great Expectations, Soda focuses on data reliability. Where Great Expectations is centered on Python-defined expectations, Soda is known for its declarative, YAML-based syntax, SodaCL (Soda Checks Language), and for running checks as SQL directly in the data warehouse or lakehouse engine.

As organizations scale their Data Lakehouses, there is too much data for engineers to monitor tables by hand for silent problems (like sudden spikes in NULL values, schema changes, or missing foreign key relationships). Soda automates this monitoring, letting data engineers, analysts, and business users write simple checks that run on a schedule or in pipelines.

## Soda Checks Language (SodaCL)

A central feature of Soda is the Soda Checks Language. It is designed to be human-readable, which lowers the barrier to defining data quality rules.

Instead of writing Python tests, a user defines assertions in a YAML file. For example:
```yaml
checks for sales_data:
  - row_count > 0
  - missing_count(customer_id) = 0
  - max(purchase_amount) < 50000
  - schema:
      fail: when required column missing [transaction_date]
```

When a pipeline orchestrator (like Apache Airflow) triggers a Soda scan, the Soda engine reads the YAML file. It translates those rules into dialect-specific SQL (e.g., Snowflake SQL or Trino SQL) and runs the queries in the database where the data resides, then reports pass, warn, or fail results.

## Anomaly Detection and Automated Baselines

Static thresholds (e.g., `row_count > 1000`) work for simple tables, but they fit poorly on data whose volume varies a lot. A table might ingest 50,000 rows on a Tuesday, but only 2,000 rows on a Sunday. If an engineer sets a static threshold of 10,000 rows, the pipeline will falsely alert every weekend.

Soda addresses this with anomaly detection. Rather than requiring hardcoded limits, Soda records metric values over time and uses statistical models to learn each metric's normal range. In SodaCL this was written as a check such as `- anomaly detection for row_count`, and current Soda releases offer it as metric monitoring in Soda Cloud. Soda compares new values with the learned pattern and alerts when a value falls outside it.

## Data Contracts and CI/CD Integration

In decentralized architectures (like a Data Mesh), data pipelines often break because an upstream software engineer changes a database schema without telling the downstream data engineering team.

Soda supports Data Contracts. A Data Contract is an agreement between the software engineering team (the data producers) and the analytical team (the data consumers) about what the data schema and quality must look like.

Soda scans can run inside CI/CD pipelines (like GitHub Actions). When a pull request changes a pipeline or schema, the CI job can run Soda checks against a test or staging dataset. If the change breaks the agreed Data Contract (for instance, dropping a required `revenue` column), the failed check fails the build. This shifts data quality testing "to the left," so many breaking changes are caught before they reach production.

## Summary of Technical Value

Soda makes enterprise data quality checks easier to adopt. With a readable YAML syntax, anomaly detection, and support for running in CI/CD pipelines, Soda lets technical and non-technical users work together on data reliability. It is a practical tool for enforcing data contracts and building trust in data in the open [Data Lakehouse](/knowledgebase/data-lakehouse/).


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
