---
title: "What is Power BI?"
meta_title: "What is Power BI? | Data Lakehouse Hub Knowledge Base"
description: "Power BI is Microsoft's business intelligence and visualization tool. Learn how Power Query, DAX, DirectQuery, and semantic models connect it to a lakehouse."
---

# What is Power BI?

## Introduction to Power BI

[Tableau](https://datalakehousehub.com/knowledgebase/tableau/) helped popularize self-service BI, and Microsoft's **Power BI** became one of the most widely used tools in the category.

Launched in 2015, Power BI is an interactive data visualization and business intelligence tool designed for both self-service and enterprise analytics. Because Microsoft includes Power BI Pro in some Microsoft 365 enterprise plans (such as E5) and Power BI Desktop is free, it spread quickly in companies already using Microsoft products, and it is approachable for users familiar with Excel.

## The Architecture: Power Query and DAX

While tools like [Tableau](https://datalakehousehub.com/knowledgebase/tableau/) are known for visual exploration, Power BI puts a lot of weight on data modeling, with roots in Excel's Power Pivot and Power Query features.

A Power BI implementation relies on two Microsoft languages:

### 1. Power Query (M Language)
Before a user can visualize data in Power BI, they must shape it. Power Query (which uses the 'M' formula language) is an embedded ETL tool. If a user connects Power BI to a messy CSV file, they use Power Query to write rules (e.g., "Remove the first 3 rows, split the 'Name' column by the space character, and convert the 'Date' to a standard format"). Power Query cleans the data as it enters the Power BI engine.

### 2. DAX (Data Analysis Expressions)
Once the data is loaded, analysts use **DAX** to create analytical calculations. 
Unlike standard SQL, DAX is a formula language designed to work with tabular data models (often star schemas). It lets analysts calculate things like "Year-over-Year Revenue Growth" that recalculate based on whatever filters the user has selected on the report. DAX is expressive, but its filter context rules take time to learn.

## Data Storage: Import vs. DirectQuery

Similar to other enterprise BI tools, Power BI must manage how it interacts with underlying databases.

1.  **Import Mode (The VertiPaq Engine)**: The analyst imports data into Power BI, where Microsoft's **VertiPaq** in-memory columnar engine compresses and stores it. Reports respond quickly, but the data is a copy that must be refreshed on a schedule, and model size is limited by memory and by the capacity or license tier.
2.  **DirectQuery Mode**: The analyst leaves the data in the underlying database (e.g., Snowflake or an Iceberg Lakehouse powered by [Dremio](https://opendatalakehouse.com/kb/dremio/)). When a user opens the dashboard, Power BI translates the DAX logic into SQL and pushes the query down to the database.

## The Semantic Model Architecture

Power BI encourages organizations to build a centralized **Semantic Model** (previously called a Power BI Dataset).

Instead of every analyst connecting directly to the raw database and writing their own DAX logic, a data modeler connects Power BI Desktop to the database, imports the tables, establishes the relationships (the [Star Schema](https://datalakehousehub.com/knowledgebase/star-schema/)), writes the shared DAX measures, and publishes this "Semantic Model" to the Power BI service.

Business users can then connect Excel or Power BI to that shared, certified Semantic Model to build their own reports, so they use the same calculations.

## Conclusion

Power BI is widely adopted in enterprise analytics because it combines a familiar Microsoft interface, integration with Azure and Microsoft Fabric, and strong data modeling through DAX. Its languages take time to learn, but it scales from a single Excel user to a centrally governed enterprise deployment.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
