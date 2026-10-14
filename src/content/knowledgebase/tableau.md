---
title: "What is Tableau?"
meta_title: "What is Tableau? | Data Lakehouse Hub Knowledge Base"
description: "Tableau is a business intelligence tool for building visual dashboards. Learn how its live connections and extracts work and how it pairs with a semantic layer."
---

# What is Tableau?

## Introduction to Tableau

Before visual analytics tools spread, Business Intelligence was often slow and IT-driven. Generating a report could require an analyst to write code or wait for IT to build an OLAP cube, and the result was often a static chart. 

Founded in 2003 as a spin-off of a Stanford University research project, **Tableau** helped popularize **Visual Analytics**. 

Tableau is built on a different idea than many of its predecessors: people understand data faster when they can see it. Instead of forcing analysts to think in rows and columns, Tableau lets users explore data by interacting with charts. You drag a pill labeled "Sales" onto a canvas, and the software renders a chart of the result. Tableau was a major force behind the "Self-Service BI" movement.

## The Architecture of Tableau

Tableau's core is a proprietary technology called **VizQL (Visual Query Language)**.

When a user drags a field (like "Region") onto the Tableau canvas, VizQL translates that action into a database query (like SQL), executes the query against the database, and then translates the numerical result into a visual chart (like a Map). 
This lets users without coding experience run multi-dimensional aggregations by clicking and dragging.

### Connection Types: Live vs. Extracts

Tableau provides two distinct ways to interact with data.

1.  **Tableau Extracts (.hyper)**: If the underlying database is slow (e.g., an untuned on-premises Oracle server), Tableau can run a query on a schedule, extract the data, and store it in Tableau's compressed, columnar `.hyper` file format, which is queried by Tableau's Hyper engine. 
    *   *Pros*: The dashboard loads quickly because Hyper is optimized for this kind of analytical query and does not depend on the source database's speed.
    *   *Cons*: The data is only as fresh as the last refresh, often yesterday's data. It also creates another copy of the data to govern.
2.  **Live Connections**: Tableau connects directly to the database. When the user clicks a filter, Tableau pushes the SQL query down to the database and waits for the answer.
    *   *Pros*: The data is as current as the source database. 
    *   *Cons*: If the database is slow, the Tableau dashboard will be slow, which frustrates users.

## Tableau and the Modern Data Stack

The industry's shift toward the **[Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/)** has changed how Tableau is used.

Historically, organizations relied heavily on Tableau Extracts because their databases were too slow. Today, organizations have faster cloud data warehouses (like Snowflake) and federated Lakehouse engines (like [Dremio](https://opendatalakehouse.com/kb/dremio/)). 

Because engines like [Dremio](https://opendatalakehouse.com/kb/dremio/) accelerate queries with pre-computed Reflections, many organizations rely less on Tableau Extracts. They configure Tableau to use **Live Connections** directly to the [Semantic Layer](https://datalakehousehub.com/knowledgebase/semantic-layer/). 
In this pattern, Tableau acts mainly as the visualization layer, while the Lakehouse engine handles the business logic, security masking, and acceleration. This keeps dashboards fast and consistent with the definitions used across the company.

## Conclusion

Acquired by Salesforce in 2019 for $15.7 billion, Tableau remains one of the most widely used Business Intelligence platforms. By hiding much of the complexity of database querying and replacing it with an intuitive, drag-and-drop visual interface, Tableau helped a generation of non-technical business users analyze data on their own, changing how many organizations work with their data.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
