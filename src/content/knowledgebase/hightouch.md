---
title: "Hightouch and the Lakehouse: Reverse ETL vs a Traditional CDP"
meta_title: "Hightouch Reverse ETL on a Data Lakehouse | Glossary"
description: "Hightouch is a Reverse ETL and data activation platform that syncs warehouse data into SaaS tools. See how it reads lakehouse data and how it compares to CDPs."
---

Hightouch is a Reverse ETL and data activation platform. It lets data teams sync modeled, calculated data from a cloud data warehouse or [data lakehouse](/knowledgebase/data-lakehouse/) into downstream operational tools such as Salesforce, HubSpot, Marketo, and ad platforms like Google Ads and Meta.

Many organizations centralized their data in platforms like Snowflake, BigQuery, Databricks, or Dremio and used tools like [dbt](/knowledgebase/dbt/) to calculate metrics such as Product Qualified Leads, churn risk, and lifetime value. Sales, support, and marketing teams do not log into the warehouse to do their jobs; they work in SaaS applications. Hightouch moves those calculated values into the tools where those teams work.

## Warehouse-Native Syncing

Hightouch does not ask you to copy your customer data into a separate proprietary database, which is how traditional Customer Data Platforms (CDPs) worked. The warehouse or lakehouse stays the source of truth.

A user defines a model with a SQL query, a dbt model, or a visual builder. Hightouch runs the query against the source, maps the columns to fields in the destination (for example, a row to a Salesforce Contact), and calls the destination API.

Hightouch does keep some data at rest. Per its storage documentation, the standard sync engine stores query results and diff files from each run to support change data capture, plus row-level logs for its sync debugger. On Hightouch-managed buckets that data expires after 30 days, and Business tier customers can point it at their own S3, GCS, or Azure Blob bucket. The Lightning engine computes and stores most diff state inside your own warehouse instead.

## Sync Logic and API Handling

Writing a script to push a dozen records to the Salesforce API is easy. Pushing millions of records across many rate-limited SaaS APIs is not.

* **Diffing:** Hightouch compares the current query results to the previous run and sends only new, changed, and removed rows, which reduces API calls.
* **Rate limits and retries:** Hightouch batches payloads per destination and retries failed requests, so teams do not have to write their own throttling and retry code for each API.

## Visual Audiences

Hightouch also offers Customer Studio, an audience builder for marketers. The data team configures a schema of models (for example `Users`, `Subscriptions`, `Events`) once, and marketers then build audiences such as "users who canceled in the last 30 days but logged in three times this week" without writing SQL. Hightouch generates the query, runs it against the warehouse, and syncs the audience to destinations like Google Ads.

## Hightouch on a Data Lakehouse

Hightouch reads from query engines, not directly from files. Its source list includes Databricks, Trino, Amazon Athena, Snowflake, and BigQuery, along with Snowflake- and BigQuery-managed [Apache Iceberg](/knowledgebase/apache-iceberg/) tables. On an open lakehouse, the usual pattern is to keep curated gold tables in Iceberg and expose them through an engine Hightouch can query, such as Trino, Athena, or Databricks. Dremio is not in Hightouch's published source list, so check current support before planning around it.

| | Hightouch (Reverse ETL) | Traditional CDP |
|---|---|---|
| Where customer data lives | Your warehouse or lakehouse | The CDP's own database |
| Modeling | SQL, dbt, or visual models over warehouse tables | Vendor-defined profiles and events |
| Data at rest in the tool | Sync state and logs (30-day expiry on managed buckets) | Full customer profiles |
| Freshness | Scheduled or triggered syncs | Often real-time event collection |
| Who owns identity logic | Data team, in SQL | CDP vendor features |

For related tools, see the [Reverse ETL](/knowledgebase/reverse-etl/), [Census](/knowledgebase/census/), and [Customer Data Platform](/knowledgebase/customer-data-platform-cdp/) glossary entries. To see how activation fits a wider move from dashboards to action, read [Building Closed-Loop Decision Agents](/blog/closed-loop-decision-agents-passive-bi-active-workflows/), and for how modeled metrics stay consistent across tools, read [What Is a Semantic Layer?](/blog/2026-02-semantic-layer-01-what-is-a-semantic-layer/).

## Summary of Technical Value

Hightouch turns warehouse and lakehouse tables into inputs for operational systems. It keeps the model logic in SQL next to the data, handles diffing and API rate limits, and gives marketers an audience builder on top of data-team models. On an open lakehouse, it works best when curated Iceberg tables are exposed through a supported SQL engine.

## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
