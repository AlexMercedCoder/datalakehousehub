---
title: "Master Data Management (MDM) on a Data Lakehouse"
meta_title: "Master Data Management (MDM) on a Data Lakehouse"
description: "Master data management (MDM) builds one trusted golden record for entities like customers and products. See MDM styles and how to build them on Iceberg."
---

Master Data Management (MDM) is the combination of processes, governance, and tooling that produces one trusted "golden record" for a business's core entities, usually customers, products, suppliers, employees, and locations. It addresses the duplication and conflicting values that appear when many applications each keep their own copy of the same entity.

Consider one customer, John Doe, across three systems:
* In the **Salesforce** CRM he is "John Doe" (a lead).
* In the **SAP** billing system he is "Jonathan Doe" (a payer).
* In the **Zendesk** support system he is "J. Doe" (a ticket submitter).

Without MDM, marketing may email him three times, and billing may use an old address that he already corrected through a support ticket. MDM links these records and decides which values to trust.

## How a Golden Record Is Built

### 1. Matching
The MDM process collects records from each source and decides which ones refer to the same entity. Exact joins fail on "John" versus "Jonathan," so matching uses standardization (cleaning names, addresses, and phone numbers), deterministic rules, and probabilistic or ML-based fuzzy matching that produces a match score. Records above a threshold link automatically; borderline pairs go to a data steward for review.

### 2. Survivorship
Once records are linked, survivorship rules pick each attribute's value. For example: trust SAP for billing address, Salesforce for job title, and the most recently updated source for phone number. The result is the golden record, with lineage showing which source supplied each field.

### 3. Distribution
The golden record is published to consumers. Depending on the MDM style, it may also be written back to source systems so they correct their own copies.

## MDM Implementation Styles

| Style | Where the golden record lives | Writes back to sources? | Fits when |
|---|---|---|---|
| Registry | Only a cross-reference of IDs; attributes stay in sources | No | You need linkage for analytics with minimal disruption |
| Consolidation | A central hub, mainly for analytics and reporting | No | The goal is a trusted view for BI and AI |
| Coexistence | Central hub, synchronized with sources | Yes | Sources keep authoring data, but should converge |
| Centralized (transactional) | The hub is the system of record | Sources consume from the hub | You can change how data is created across the business |

## MDM on a Data Lakehouse

Traditional MDM ran on dedicated hub products. A [data lakehouse](/knowledgebase/data-lakehouse/) is a natural home for the consolidation and registry styles, and it can feed the golden record to coexistence hubs as well. A typical layout in the [medallion architecture](/knowledgebase/medallion-architecture/):

1. **Bronze:** raw CRM, ERP, and support extracts land in Apache Iceberg tables, often through CDC.
2. **Silver:** standardized names, addresses, and phone numbers; a match table assigns a shared `master_customer_id` to linked records, computed with Spark, dbt, or a dedicated matching tool.
3. **Gold:** a `dim_customer` table applies survivorship rules and keeps history as a [Type 2 slowly changing dimension](/knowledgebase/type-2-scd/).

Iceberg adds useful audit features: snapshots and time travel show what the golden record looked like when a report ran, and catalog-level access controls govern who can see sensitive attributes. MDM still depends on people: [data stewards](/knowledgebase/data-stewardship/) own the match rules and resolve exceptions. For modeling background, read [Data Modeling: Entities and Events](/blog/2024-10-data-modeling-events-entities/) and [Slowly Changing Dimensions](/blog/2026-02-data-modeling-06-slowly-changing-dimensions/).

## Summary

MDM produces trusted golden records by matching records across systems, applying survivorship rules, and distributing the result. A lakehouse provides the storage, compute, and history to run the consolidation side of MDM on open tables, so BI dashboards and AI models use the same resolved entities.

## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
