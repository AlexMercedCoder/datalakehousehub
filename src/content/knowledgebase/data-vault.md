---
title: "What is Data Vault?"
meta_title: "What is Data Vault? | Expert Data Lakehouse Architecture Guide"
description: "Data Vault is a warehouse modeling method built from hubs, links, and satellites. See how its append-only, additive design absorbs change and keeps history."
---

# What is Data Vault?

Data Vault is a data modeling method for enterprise [data warehouses](/knowledgebase/data-warehouse/) that splits data into three kinds of tables: hubs for business keys, links for relationships, and satellites for descriptive attributes and their history. Dan Linstedt developed it in the 1990s and released it publicly in 2000; Data Vault 2.0, published in 2013, added a fuller methodology and architecture around the model.

A [star schema](/knowledgebase/star-schema/) is well suited to fast, readable BI queries, but it is harder to change at the integration stage. When a company adds a new source system or acquires another business, fitting the new data into existing fact and dimension tables can mean reworking ETL pipelines and the reports built on them. Data Vault is designed so that new sources are added as new tables rather than changes to existing ones, while every load is kept as history.

## Hubs, Links, and Satellites

### Hubs: business keys
A hub represents a core business concept such as Customer, Product, or Store. It holds no descriptive attributes, only:
* a surrogate key (in Data Vault 2.0, usually a hash of the business key),
* the business key from the source system, such as a customer ID from a CRM,
* load metadata, such as the load timestamp and the record source.

### Links: relationships
A link records a relationship between two or more hubs, for example a customer buying a product in a store. Links also carry no descriptive data, only the keys of the hubs they connect plus load metadata. Because links are separate tables, many-to-many relationships need no change to the hubs.

### Satellites: descriptive context and history
Descriptive attributes such as names, prices, and addresses go in satellites, each attached to one hub or one link. Satellites are usually split by source. If customer data comes from both a CRM and a billing system, the model has one `customer_hub` with a `crm_customer_sat` and a separate `billing_customer_sat`, rather than forcing the two sources into one table.

## Adding Sources and Keeping History

### Additive changes
When a new system arrives, such as a support ticketing tool, the team adds a new satellite to the existing customer hub. Existing tables and the pipelines that load them stay as they are.

### Insert-only history
Data Vault loads are insert-only. When a customer's address changes in the CRM, the pipeline does not run `UPDATE`; it inserts a new satellite row with the new address and its load timestamp. The vault therefore keeps a record of what each source said and when it was loaded, which helps with audits in regulated industries such as banking and healthcare.

This is similar to a [Type 2 slowly changing dimension](/knowledgebase/slowly-changing-dimensions/), which also keeps old versions as rows. The difference is where history lives: an SCD tracks history inside a business-facing dimension, while Data Vault keeps raw history per source in satellites and leaves business-facing structures to later layers.

## Data Vault in the Lakehouse

Analysts rarely query a raw vault directly, because answering a simple question can mean joining many hubs, links, and satellites. In practice the vault is an integration layer, often mapped to the silver layer of a [medallion architecture](/knowledgebase/medallion-architecture/). Tools such as [dbt](/knowledgebase/dbt/) then build query-friendly structures on top: point-in-time (PIT) and bridge tables to simplify joins, and star schemas in the gold layer for BI.

On [Apache Iceberg](/knowledgebase/apache-iceberg/) tables, insert-only satellite loads are cheap appends, and snapshots add table-level time travel on top of the row-level history the model already keeps. For a longer walkthrough, see [Data Vault Modeling: Hubs, Links, and Satellites](/blog/2026-02-data-modeling-09-data-vault-modeling/).

## Summary

Data Vault separates business keys, relationships, and descriptive attributes into hubs, links, and satellites. New sources are added as new tables, and insert-only loads keep a full history. It works best as an integration layer, with star schemas built on top for reporting.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
