---
title: "What is a Business Glossary?"
meta_title: "What is a Business Glossary? | Expert Data Lakehouse Architecture Guide"
description: "A business glossary is a shared set of agreed definitions for business terms like revenue. Learn how it links to lakehouse tables and to the semantic layer."
---

# What is a Business Glossary?

A Business Glossary is a curated, central reference that records a single, agreed-upon definition for each important business concept in an organization. A Data Dictionary is a technical document that helps engineers understand columns and data types (for example, `VARCHAR(50)`). A Business Glossary is written for executives and business analysts, so the whole company uses the same terms and metric definitions.

The lack of a shared Business Glossary is a common cause of conflicting analytics in large enterprises.

Imagine a Monday morning executive meeting. The VP of Sales presents a dashboard showing 10,000 "Active Customers." The VP of Marketing presents a different dashboard showing 50,000 "Active Customers." The meeting turns into an argument over whose data is broken.
The data is not broken; the definitions differ. Sales defines an "Active Customer" as someone who made a purchase in the last 30 days. Marketing defines an "Active Customer" as someone who opened a promotional email in the last 6 months. A Business Glossary resolves this by making the definition explicit and shared.

## The Anatomy of the Glossary

A well-maintained Business Glossary does not live in a static PDF; it is typically housed in an Enterprise Data Catalog (like Collibra or DataGalaxy) and connected to the [Data Lakehouse](/data-lakehouse/) analytics workflow.

### Clear Semantic Definitions
For each important term (for example, `Net Revenue`, `Churn Rate`, `Active User`), the Glossary records:
* **The Official Definition:** A clear, unambiguous plain-language explanation of the concept.
* **The Formula:** The exact calculation used to produce the metric (for example, `Gross_Revenue - (Taxes + Refunds + Chargebacks) = Net_Revenue`).
* **The Domain Owner:** The person or department accountable for maintaining the definition. If Marketing disagrees with the definition of "Active Customer," it raises the change with the Domain Owner, who updates the shared glossary.

### Linkage to Physical Assets
A modern Business Glossary is mapped to the underlying data.
When an analyst looks up `Net_Revenue` in the Glossary, the catalog can link directly to the curated, Gold-tier [Apache Iceberg](/apache-iceberg/) table in the Data Lakehouse (and the specific column) that holds that metric. Analysts then know which tables to query when building executive dashboards instead of guessing.

## Governance and The Semantic Layer

The definitions in a Business Glossary are increasingly implemented in the Data Lakehouse through a Semantic Layer (or Metrics Layer).

Using tools like dbt or Cube, data engineers take the formula for `Net_Revenue` from the Business Glossary and encode it in the semantic layer. Then, whichever tool a user connects to the Lakehouse (Tableau, Power BI, or an AI assistant), queries that go through the semantic layer use the approved formula, which makes it much harder for two dashboards to report different numbers for the same metric.

## Summary of Technical Value

A Business Glossary is the reference point for what business terms mean within an organization. By documenting agreed definitions and formulas for core business concepts, it reduces reporting discrepancies, builds executive trust in analytical dashboards, and narrows the communication gap between data engineering teams and business leaders.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
