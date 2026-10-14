---
title: "What is Looker?"
meta_title: "What is Looker? | Data Lakehouse Hub Knowledge Base"
description: "Looker is a Google Cloud BI platform that defines metrics once in LookML code and runs queries in the database, an early model for the headless semantic layer."
---

# What is Looker?

## Introduction to Looker

In the mid-2010s, self-service BI tools like [Tableau](https://datalakehousehub.com/knowledgebase/tableau/) and [Power BI](https://datalakehousehub.com/knowledgebase/power-bi/) empowered business analysts to build dashboards rapidly. However, this freedom led to a common enterprise problem known as **Metrics Chaos**. 

Because every analyst could download their own data and write their own math inside their own dashboard, the company lost its single source of truth. The Marketing dashboard said revenue was $10M, while the Finance dashboard said revenue was $8M. 

**Looker** (founded in 2012; Google announced its acquisition in 2019 and completed it in 2020) was designed to solve Metrics Chaos. 
Looker is a cloud-based enterprise BI platform that operates on a different architectural philosophy than many competitors: it separates the *definition* of the metrics from the *visualization* of the metrics.

## The Architecture: The Semantic Layer (LookML)

Looker's defining feature is its proprietary modeling language: **LookML**.

Instead of analysts writing SQL directly inside a dashboard, Looker has the organization define its business logic centrally using code. A data engineer uses LookML (which looks like a simplified version of YAML/SQL) to define the relationships between tables and the formula for every metric.

*   **LookML Definition**: `measure: total_revenue { type: sum, sql: ${TABLE}.price * ${TABLE}.quantity ;; }`

Once this metric is defined in LookML, dashboard users cannot change it. The code is committed to Git, version-controlled, and reviewed. 

When a non-technical business user opens the Looker UI to build a dashboard, they simply drag the `total_revenue` field onto the canvas. They cannot change the math. Every dashboard in the company using the `total_revenue` field runs the same formula.

## The In-Database Philosophy

Looker was an early major BI tool to drop the concept of an "Extract" or a proprietary in-memory engine. Looker does not store your data (apart from query result caching).

Looker operates as a SQL generator. 
When a user clicks a filter on a Looker dashboard, Looker reads the LookML definitions, generates a SQL query, and pushes it down to the underlying Data Warehouse (like Google BigQuery, Snowflake, or an Iceberg Lakehouse powered by [Dremio](https://opendatalakehouse.com/kb/dremio/)).

This architecture has two main advantages:
1.  **No [Data Silos](https://datalakehousehub.com/knowledgebase/data-silos/)**: Because Looker never extracts data, the organization's data remains centralized and governed in the main Data Warehouse.
2.  **Scalability**: Looker's speed depends on the underlying database. If you connect Looker to a serverless warehouse like BigQuery, Looker can query very large datasets that would not fit in the local memory of an extract-based tool.

## The Headless BI Movement

Looker's architectural philosophy helped pave the way for what is now known as **Headless BI** or the **Universal [Semantic Layer](https://datalakehousehub.com/knowledgebase/semantic-layer/)**. 

Because the metrics are defined in code (LookML), they don't just have to be viewed in Looker dashboards. An engineer can use Looker's API to retrieve the governed `total_revenue` number and embed it directly into a custom React web application, or feed it into a Python machine learning script. The "Head" (the visualization) is decoupled from the "Body" (the metric logic).

## Conclusion

Looker is less a visualization tool than a governance platform with a visualization front end. By having organizations define their business logic in version-controlled code (LookML) and running its queries directly against the cloud data warehouse, Looker greatly reduces Metrics Chaos. It remains a strong choice for organizations that prioritize data governance and a single, consistent source of truth across the enterprise.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
