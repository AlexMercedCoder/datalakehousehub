---
title: "What is Soda?"
meta_title: "What is Soda? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Soda. Learn about data observability, declarative YAML testing, and continuous data quality monitoring."
---

# What is Soda?

Soda is an open-source data quality and observability framework designed to detect data issues incredibly early in the pipeline lifecycle. Much like Great Expectations, Soda focuses entirely on ensuring data reliability. However, while Great Expectations relies heavily on programmatic Python configurations and Pandas/Spark execution, Soda differentiates itself by utilizing a highly declarative, YAML-based syntax known as SodaCL (Soda Checks Language) and aggressively optimizing for direct execution against massive cloud data warehouses.

As organizations scale their Data Lakehouses, the sheer volume of data makes it impossible for data engineers to manually monitor tables for silent corruption (like sudden spikes in NULL values, drifting schema distributions, or missing foreign key relationships). Soda automates this monitoring, allowing data engineers, analysts, and even business users to collaboratively write simple checks that execute continuously.

## Soda Checks Language (SodaCL)

The core architectural innovation of Soda is the Soda Checks Language. It is explicitly designed to be human-readable, entirely lowering the barrier to entry for defining data quality constraints.

Instead of writing complex Python unit tests, a user defines their assertions in a simple YAML configuration file. For example:
```yaml
checks for sales_data:
  - row_count > 0
  - missing_count(customer_id) = 0
  - max(purchase_amount) < 50000
  - schema:
      fail: when required column missing [transaction_date]
```

When a pipeline orchestrator (like Apache Airflow) triggers a Soda scan, the Soda engine reads the YAML file. It automatically translates those simple human-readable rules into highly optimized, dialect-specific SQL (e.g., Snowflake SQL or Trino SQL). It pushes the heavy computational execution directly down into the database where the data resides, instantly retrieving the pass/fail results.

## Anomaly Detection and Automated Baselines

Defining static thresholds (e.g., `row_count > 1000`) is effective for simple tables, but fails completely on highly dynamic operational data. A table might ingest 50,000 rows on a Tuesday, but only 2,000 rows on a Sunday. If an engineer sets a static threshold of 10,000 rows, the pipeline will falsely alert every weekend.

Soda resolves this through built-in Anomaly Detection. Rather than requiring hardcoded limits, Soda continuously profiles the database tables and utilizes machine learning algorithms to establish historical baselines. An engineer can simply write `- anomaly score for row_count < 1`. Soda will evaluate the current row count against the specific day-of-the-week historical trend, generating alerts only when the data volume deviates statistically from its normal operational pattern.

## Data Contracts and CI/CD Integration

In massive, decentralized architectures (like a Data Mesh), data pipelines frequently break because an upstream software engineer alters a database schema without notifying the downstream data engineering team.

Soda introduces the concept of strict Data Contracts. A Data Contract is a definitive agreement between the software engineering team (the data producers) and the analytical team (the data consumers) regarding exactly what the data schema and quality must look like.

Soda natively integrates into the software deployment CI/CD pipeline (like GitHub Actions). If a software engineer submits a Pull Request altering a PostgreSQL schema, Soda automatically executes its checks. If the proposed change breaks the agreed-upon Data Contract (for instance, dropping a critical `revenue` column), Soda immediately blocks the software deployment. This architecture aggressively shifts data quality testing "to the left," preventing corrupting changes from ever reaching production environments.

## Summary of Technical Value

Soda significantly streamlined the implementation of enterprise data quality. By introducing a highly accessible YAML syntax, powerful anomaly detection, and deep integration into software CI/CD pipelines, Soda empowers both technical and non-technical users to collaboratively guarantee data reliability. It is a fundamental framework for maintaining strict data contracts and ensuring absolute trust in the modern Open [Data Lakehouse](/data-lakehouse).


## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
