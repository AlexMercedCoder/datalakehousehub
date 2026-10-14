---
title: "What is Analytics Engineering?"
meta_title: "What is Analytics Engineering? | Expert Data Lakehouse Architecture Guide"
description: "Analytics engineering is the work of turning raw data into tested, documented models for analysis, often with dbt, and curating the lakehouse semantic layer."
---

# What is Analytics Engineering?

Analytics Engineering is a data discipline that bridges the organizational and technical gap between data engineering and business-facing data analytics. It grew out of the rise of cloud data warehouses and the popularity of dbt (data build tool), and it focuses on the "T" (Transform) in the ELT pattern.

Historically, many organizations operated in silos. Data engineers (often writing Java, Scala, or Python) built pipelines to extract data and load it into the warehouse. Data analysts (who understood the business logic) built dashboards on top of that raw data using tools like Tableau. Without a shared, well-engineered transformation layer, dashboards were often slow and SQL logic was duplicated and inconsistent. Analytics Engineering addresses this by bringing software engineering practices to SQL-based transformation work.

## The Domain of the Analytics Engineer

An Analytics Engineer usually does not build ingestion scripts that pull data from APIs, and usually does not build the final dashboards for executives. Their work centers on the transformation layer inside the [Data Lakehouse](/data-lakehouse/) or cloud data warehouse.

### Curating the Semantic Layer
They take the raw data that data engineers have landed in the warehouse and write SQL to transform it into clean, tested business entities.

Their goal is a "Single Source of Truth." Instead of five analysts writing five different SQL scripts to calculate "Total Revenue," the Analytics Engineer builds a shared `dim_customers` table and a `fact_revenue` table and defines the revenue formula once. When downstream analysts and dashboards query these shared models, conflicting numbers in executive meetings become much less common.

## Bringing Software Engineering to SQL

The key change in Analytics Engineering is that it treats SQL like application code. With frameworks like dbt, Analytics Engineers apply engineering practices that were rare in SQL work before:

* **Version Control and CI/CD:** All SQL transformations live in Git repositories. A change to the churn logic goes through a pull request. A Continuous Integration (CI) pipeline can build the changed models in a temporary schema, run tests, and check that downstream models still work before the change is merged.
* **Modularity and DRY (Don't Repeat Yourself):** Instead of long monolithic SQL scripts, they write small, modular models that reference each other with Jinja (`{{ ref('staging_sales') }}`). The framework compiles these references and infers the Directed Acyclic Graph (DAG) that determines execution order.
* **Automated Data Quality:** Tests are declared alongside the models, for example YAML stating that `customer_id` must be `unique` and `not_null`. If the data violates these rules, the run fails and alerts the team.

## Democratizing the Data Stack

Analytics Engineering widens who can build production pipelines. It lets people whose main skill is SQL, one of the most widely used data languages, build tested, version-controlled data pipelines without first learning distributed programming in Scala or Python.

## Summary of Technical Value

Analytics Engineering has standardized how many organizations model and transform data. By applying software engineering practices (version control, automated testing, and CI/CD) to SQL, Analytics Engineers turn raw data into trusted, consistent models, so business analysts can get reliable insights faster.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
