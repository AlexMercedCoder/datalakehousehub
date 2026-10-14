---
title: "Gold Layer in a Medallion Architecture: Design and Iceberg Examples"
meta_title: "Gold Layer in Medallion Architecture: Iceberg Examples"
description: "The gold layer is the business-ready tier of a medallion architecture. Learn how to model gold tables on Apache Iceberg and when a semantic layer replaces them."
---

## What is the Gold Layer?

The gold layer is the final tier of a [medallion architecture](/knowledgebase/medallion-architecture/). It holds business-ready tables: aggregates, dimensional models, and metric tables shaped for dashboards, reports, data products, and AI agents. Data flows from [bronze](/knowledgebase/bronze-layer/) (raw, as ingested) to [silver](/knowledgebase/silver-layer/) (cleaned, deduplicated, conformed) to gold (modeled for a specific use).

Bronze and silver are organized around sources. Gold is organized around questions: revenue by region by day, customer lifetime value, active users by product.

## Bronze vs Silver vs Gold

| | Bronze | Silver | Gold |
|---|---|---|---|
| Content | Raw records as ingested | Cleaned, typed, deduplicated, joined | Aggregates, star schemas, metric tables |
| Main users | Data engineers | Engineers, analysts, data scientists | Analysts, BI tools, executives, agents |
| Schema | Close to the source | Conformed across sources | Shaped for consumption |
| Typical history | Append-only, full history | Current state plus SCD where needed | Snapshots or rollups at the grain the business uses |
| Access control | Tightly restricted | Restricted by domain | Broadest read access, often with row and column policies |

## Building Gold Tables on Apache Iceberg

In a lakehouse, gold tables are usually [Apache Iceberg](/knowledgebase/apache-iceberg/) tables written by Spark, Flink, dbt, or Dremio SQL. A typical gold table is a daily rollup (Spark SQL shown):

```sql
CREATE TABLE gold.daily_revenue_by_region
USING iceberg
PARTITIONED BY (months(order_date)) AS
SELECT o.order_date, c.region, SUM(o.amount) AS revenue, COUNT(*) AS orders
FROM silver.orders o
JOIN silver.customers c ON o.customer_id = c.customer_id
GROUP BY o.order_date, c.region;
```

Iceberg features map well to gold-layer needs:

* **Snapshots and time travel** let you reproduce what a dashboard showed last quarter.
* **Atomic overwrites and MERGE** let a pipeline refresh a gold table without readers seeing half-written data.
* **Branches and tags** (in Iceberg and catalogs like [Project Nessie](/knowledgebase/project-nessie/)) support write-audit-publish, so gold data is validated before it becomes visible.
* **Catalog access controls** in [Apache Polaris](/knowledgebase/apache-polaris/) or other catalogs restrict who reads which gold tables.

Dimensional techniques still apply. Gold tables often follow a [star schema](/knowledgebase/star-schema/) and use [slowly changing dimensions](/knowledgebase/slowly-changing-dimensions/) where history matters.

## Physical Gold Tables vs a Semantic Layer

Every physical gold table is another pipeline to schedule and another copy to keep in sync. Many teams now keep bronze and silver as physical Iceberg tables and define much of gold as views in a [semantic layer](/knowledgebase/semantic-layer/), materializing only the views that need it for speed (for example with Dremio Reflections). That keeps metric definitions in one place for BI tools and AI agents alike. For the pattern in practice, read [What is Three-Tier Data (Bronze, Silver, Gold)](/blog/2024-10-bronze-silver-gold-data/), [Data Modeling for the Lakehouse: What Changes](/blog/2026-02-data-modeling-04-data-modeling-lakehouse/), and [What Is a Semantic Layer?](/blog/2026-02-semantic-layer-01-what-is-a-semantic-layer/).

## Frequently Asked Questions

### Is the gold layer the same as a data mart?
Close. A data mart is a subject-specific slice of a warehouse; gold tables play the same role in a lakehouse, but they sit on open table formats and can be read by any engine that speaks the catalog.

### Should gold tables be aggregated?
Not always. Some gold tables are wide, denormalized fact tables at full grain. Aggregate when the consumers only need the rollup and the savings in query cost are worth the extra pipeline.

### Do I need a physical gold layer if I have a semantic layer?
Often only partly. Views in a semantic layer can replace many gold tables; keep physical tables for heavy, frequently used rollups or for data you share outside the platform.

---

### E-E-A-T & Further Reading

> **Authoritative Source:** This definition and architectural guide was rigorously reviewed by **Alex Merced**. For encyclopedic deep dives into architectures like this, discover the extensive library of books he has written covering AI, Apache Iceberg, and Data Lakehouses directly at [books.alexmerced.com](https://books.alexmerced.com).
