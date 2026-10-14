---
canonical: "https://opendatalakehouse.com/kb/dimensional-modeling/"
title: "What is Dimensional Modeling?"
meta_title: "What is Dimensional Modeling? | Expert Data Lakehouse Architecture Guide"
description: "Dimensional modeling is Ralph Kimball's method of organizing analytics data into fact and dimension tables, the star schemas common in a lakehouse gold layer."
---

# What is Dimensional Modeling?

Dimensional Modeling is a data modeling methodology, popularized by Ralph Kimball in the 1990s (notably in *The Data Warehouse Toolkit*, 1996), that structures databases for analytical queries and business intelligence. Unlike Third Normal Form (3NF) modeling, which reduces redundancy and update anomalies in operational databases (OLTP), Dimensional Modeling optimizes for fast reads and easy human comprehension within a Data Warehouse or the Gold layer of a [Data Lakehouse](/data-lakehouse/) (OLAP).

In a highly normalized operational database, answering a simple business question like "What was the total revenue of blue shoes sold in Germany last month?" can require an analyst to write a complex SQL query joining many different tables together. This hurts both analyst productivity and query performance. Dimensional Modeling addresses this by intentionally denormalizing the data, organizing it into two concepts: Facts (the measurable numbers) and Dimensions (the descriptive context).

## The Architecture of Facts and Dimensions

Dimensional Modeling restructures the web of operational data into an intuitive "Star Schema."

### 1. Fact Tables (The Measurable Events)
A Fact table sits at the center of the model. It records the granular, quantitative events of the business. 
If a customer buys a product, that transaction is a single row in the Fact table. Fact tables are narrow and deep (sometimes containing billions of rows). They contain little text; they consist mostly of numeric measures (e.g., `sale_amount_usd: 150.00`, `quantity_sold: 2`) and Foreign Keys (e.g., `store_id: 10`, `date_id: 20260514`) that link back to the Dimension tables.

### 2. Dimension Tables (The Descriptive Context)
Dimension tables provide the "Who, What, Where, When, and Why" of the raw numbers in the Fact table. 
The `store_id: 10` in the Fact table means little to a human. The Dimension table translates it. A Dimension table is usually much smaller than a Fact table but wide, containing dozens of descriptive string columns (e.g., `Store_Name: Berlin Flagship`, `Store_Manager: John Doe`, `Region: Europe`). 

## The Power of Conformed Dimensions

The true enterprise value of Dimensional Modeling is realized through Conformed Dimensions.

In a large enterprise, the Marketing department might have a Fact table tracking `Ad_Clicks`, while the Logistics department has a Fact table tracking `Shipments`. 
To ensure the company speaks the same language, data engineers build a single, shared `Date_Dimension` table and a single `Customer_Dimension` table. Both the Marketing Fact table and the Logistics Fact table link to these same Conformed Dimensions. 

If the CEO executes a query comparing ad clicks to final shipments, the data lines up because both departments use the same definition of "Customer" and the same definition of "Date," keeping numbers consistent across the executive suite.

## Summary of Technical Value

Dimensional Modeling made enterprise data far more accessible. By separating quantitative business events (Facts) from descriptive context (Dimensions) and deploying them in Star Schemas, this methodology allows business analysts to write simpler SQL queries. It helps analytical query engines run large aggregations efficiently, and it remains a common foundation for business intelligence.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
