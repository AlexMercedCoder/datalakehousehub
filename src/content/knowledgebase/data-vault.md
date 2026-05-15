---
title: "What is Data Vault?"
meta_title: "What is Data Vault? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Data Vault modeling. Learn about Hubs, Links, and Satellites, and why massive enterprises use it for agile data integration."
---

# What is Data Vault?

Data Vault is an advanced, highly agile data modeling methodology designed explicitly for massive, enterprise-scale data warehouses. Invented by Dan Linstedt in the early 2000s, Data Vault provides a structural architecture that completely solves the rigidity and integration failures inherent in traditional dimensional modeling (Star Schemas) when applied at an enormous, global scale.

While a Star Schema is exceptional for building fast, intuitive business intelligence dashboards, it is incredibly brittle during the ingestion phase. If an enterprise acquires a new company, attempting to forcefully merge the new company’s disparate operational data into an existing, highly rigid Star Schema often requires months of rewriting core ETL pipelines, breaking downstream reports in the process. 

Data Vault abandons this rigidity. It provides a highly decoupled, append-only architecture designed specifically to absorb massive structural changes, ingest data from hundreds of completely different source systems seamlessly, and maintain a perfect, auditable historical record of the enterprise.

## The Architecture: Hubs, Links, and Satellites

To achieve ultimate flexibility, Data Vault completely dismantles traditional database tables, breaking them down into their absolute most fundamental atomic components: Hubs, Links, and Satellites.

### 1. Hubs (The Core Business Keys)
A Hub table represents a core business entity, such as a Customer, a Product, or a Store. Crucially, a Hub contains absolutely no descriptive data (no names, no addresses). It contains strictly three things:
* A mathematically generated Hash Key (the primary key for the Vault).
* The original Business Key from the source system (e.g., the specific Customer ID from Salesforce).
* Record metadata (the timestamp the key was first loaded, and the source system it came from).

### 2. Links (The Relationships)
A Link table represents the transactional relationships between Hubs. If a Customer purchases a Product in a specific Store, the Link table records that exact transaction. Like Hubs, Link tables contain no descriptive data. They consist entirely of the Hash Keys linking the specific Hubs together, establishing the mathematical skeleton of the enterprise architecture.

### 3. Satellites (The Descriptive Context)
All the descriptive attributes (names, prices, addresses, demographic data) are stripped out and placed into Satellite tables. A Satellite table attaches directly to a single Hub or a single Link. 

This is where the true power of the Data Vault lies. If a company tracks customer data in Salesforce and billing data in SAP, they do not attempt to merge them. They create one `Customer_Hub`. They attach a `Salesforce_Customer_Satellite` (containing the CRM data) and a completely separate `SAP_Customer_Satellite` (containing the billing data) to that single Hub. 

## Extreme Agility and Historical Auditing

The strict separation of Hubs, Links, and Satellites provides enterprises with unparalleled data engineering agility.

### Additive Schema Evolution
If the business suddenly deploys a new Zendesk support system, the data engineering team does not need to alter existing tables or rewrite massive ETL pipelines. They simply create a new `Zendesk_Customer_Satellite` and attach it to the existing `Customer_Hub`. The architecture is purely additive. The existing pipelines running the Salesforce and SAP data continue to operate perfectly without any interruption or refactoring.

### Append-Only Historical Auditing
Data Vault operates on a strict append-only methodology. Data is never updated, and data is never deleted. When a customer changes their address in Salesforce, the ETL pipeline does not issue a SQL `UPDATE` command. It simply inserts a brand new row into the `Salesforce_Customer_Satellite` containing the new address and a new timestamp. This guarantees a perfect, 100% mathematically verifiable audit trail of exactly what the source systems looked like at any given microsecond in history, a critical requirement for heavily regulated industries like banking and healthcare.

## Data Vault in the Modern Data Stack

While Data Vault is an exceptional ingestion architecture, business analysts fundamentally cannot write SQL queries against a chaotic web of hundreds of atomic Hubs and Satellites.

In a modern architecture, Data Vault serves strictly as the foundational integration layer (often mapping to the Silver layer in a Medallion Architecture). Once the data is securely integrated into the Vault, data engineers use powerful transformation tools (like dbt) to dynamically compile the Hubs, Links, and Satellites back together, projecting them into clean, highly optimized Star Schemas (the Gold layer) for the BI dashboards to query.

## Summary of Technical Value

Data Vault is the definitive architectural methodology for enterprise scale. By dismantling rigid schemas into highly decoupled, append-only Hubs, Links, and Satellites, it allows massive organizations to ingest data from hundreds of disparate systems with absolute agility. It prevents schema changes from destroying ETL pipelines and guarantees a perfect historical audit trail, serving as the ultimate integration foundation before data is transformed into business-facing Star Schemas.


## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
