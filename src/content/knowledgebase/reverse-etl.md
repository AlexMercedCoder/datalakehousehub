---
title: "What is Reverse ETL?"
meta_title: "What is Reverse ETL? | Expert Data Lakehouse Architecture Guide"
description: "Reverse ETL copies modeled data from a warehouse or lakehouse back into operational tools like CRMs and ad platforms, so teams act on metrics analysts built."
---

# What is Reverse ETL?

Reverse ETL is a data pipeline pattern for "Data Activation." It reverses the traditional data flow by reading refined analytical data from the central cloud data warehouse (or [Data Lakehouse](/knowledgebase/data-lakehouse/)) and writing it back into operational SaaS applications (like Salesforce, Zendesk, Marketo, or HubSpot).

Historically, the data warehouse was often a dead end. Organizations built pipelines to extract raw data from Salesforce and Zendesk, load it into Snowflake, and use dbt to calculate a predictive "Customer Churn Risk" score. That score then sat on a Tableau dashboard. A customer success representative working in Zendesk had no way of knowing the client was a churn risk, because the data stayed in the warehouse. Reverse ETL addresses this disconnect.

## The Architecture of Data Activation

Reverse ETL is not simply "ETL in reverse." Traditional ETL pipelines pull raw data from sources. Reverse ETL pipelines must sync specific calculated fields through third-party APIs while respecting rate limits and avoiding overwriting values people entered by hand.

### The Sync Mechanism
A Reverse ETL platform (like Hightouch, or Census, which Fivetran agreed to acquire in 2025) connects to the central data warehouse. A data engineer or a marketing analyst writes a standard SQL query (e.g., `SELECT customer_email, churn_risk_score, lifetime_value FROM gold_customer_metrics`). 

The platform runs this query and translates the results into the API payloads the destination expects (for example, calls to the Salesforce Bulk API). It maps the warehouse `customer_email` to the Salesforce `Contact.Email` field so records line up correctly.

### Change Data Capture (CDC) and Micro-Batching
Pushing a million rows to the HubSpot API every hour would quickly hit API rate limits and could interfere with other integrations that share them. 

Reverse ETL tools use state management and differential syncing. When a sync runs, the tool compares the current query results with the results of the previous run and calculates the difference. If only 50 customers experienced a change in their `churn_risk_score` over the last hour, the Reverse ETL platform sends updates for only those 50 records to HubSpot, rather than updating all million records.

## Supporting Operational Analytics

Reverse ETL is the main infrastructure behind Operational Analytics. By syncing calculated metrics into frontline tools, it turns analytical data from a reporting resource into an input to daily operations.

* **Marketing:** A data scientist runs a machine learning model in Apache Spark to identify customers likely to buy winter boots. The Reverse ETL pipeline syncs that audience list to Facebook Ads and Google Ads on a schedule, so campaigns target it without manual exports.
* **Sales:** The pipeline syncs "Product Usage Spikes" (calculated in the data lakehouse) directly into the Salesforce CRM, so account executives can see which customers are using the software heavily and may be ready for an upsell.
* **Support:** The pipeline syncs "Customer Lifetime Value" directly into Zendesk, so Zendesk routing rules can send tickets from high-value clients to a priority queue.

## Summary of Technical Value

Reverse ETL connects the analytical data stack with operational teams. By treating the cloud data warehouse or lakehouse as a source for business applications rather than a final destination, it puts governed, calculated data in the tools that marketing, sales, and support teams already use.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
