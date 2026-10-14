---
title: "Census (Now Fivetran Activations): Reverse ETL From the Warehouse and Lakehouse"
meta_title: "Census Reverse ETL (Fivetran Activations) | Glossary"
description: "Census is a reverse ETL tool that syncs modeled warehouse data into apps like Salesforce, now sold as Fivetran Activations. See how it fits a lakehouse."
---

Census is a [reverse ETL](/knowledgebase/reverse-etl/) and data activation platform. It reads modeled data from a warehouse or query engine and syncs it into operational tools such as Salesforce, HubSpot, Zendesk, and marketing platforms, so sales, marketing, and support teams see warehouse-computed fields like lead scores or account health inside the tools they already use.

Fivetran announced an agreement to acquire Census in May 2025. The product now runs inside Fivetran as **Fivetran Activations**, and existing Census syncs became activation syncs under the Activations tab. Fivetran now covers both directions: ingestion into the warehouse and activation back out.

## The Composable CDP

Census helped popularize the composable customer data platform (CDP). A packaged CDP keeps its own copy of customer data and its own definitions. A composable CDP treats the warehouse as the customer data store: engineers model customers and events with tools like [dbt](/knowledgebase/dbt-data-build-tool/), and a reverse ETL tool syncs the results to destinations. One definition of "active customer" or "revenue" then serves both reporting and activation.

## How Syncs Work

* **Incremental diffs:** Census stores the previous result of each sync's query, compares it to the new result, and sends only added, changed, or removed records to the destination API.
* **Destination object models:** syncs map columns to destination objects and fields, matching records on keys like email or an external ID, and can relate records (for example a Salesforce Contact to an Account).
* **Rate limits and errors:** the platform handles destination API limits and retries, and reports rejected records so teams can fix bad data before it spreads.

## Census in a Lakehouse

Reverse ETL tools query a source with SQL, so the question for a lakehouse is which engines they can connect to. Fivetran Activations lists sources including Snowflake, BigQuery, Databricks, Redshift, Amazon Athena, Trino, ClickHouse, MotherDuck, Postgres, and S3.

| Lakehouse setup | How to activate it |
|---|---|
| Iceberg tables queried with Trino or Athena | Connect Activations to Trino or Athena and sync from a gold table or view |
| Iceberg tables managed by Snowflake, BigQuery, or Databricks | Connect to that platform directly |
| Iceberg tables in another engine (for example Dremio) | Use an alternative such as [Hightouch](/knowledgebase/hightouch/) if it supports your engine, or expose a table through a supported engine |

Whichever path you choose, sync from governed, business-ready tables or semantic layer views rather than raw data, so the numbers in Salesforce match the numbers on dashboards. See [What Is a Semantic Layer?](/blog/2026-02-semantic-layer-01-what-is-a-semantic-layer/) for how teams keep those definitions in one place.

## Summary

Census turned the warehouse into the source for operational tools and, as Fivetran Activations, is now the outbound half of Fivetran's platform. In a [data lakehouse](/knowledgebase/data-lakehouse/), it works when your Iceberg tables are reachable through one of its supported engines.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
