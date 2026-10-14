---
title: "What is CCPA?"
meta_title: "What is CCPA? | Expert Data Lakehouse Architecture Guide"
description: "The CCPA is a California privacy law giving consumers the right to know, delete, and opt out of the sale of their data. See what it demands of a lakehouse."
---

# What is CCPA (California Consumer Privacy Act)?

The California Consumer Privacy Act (CCPA) is a broad state privacy law enacted in 2018 that took effect in 2020, with additional protections added by the California Privacy Rights Act (CPRA) that began on January 1, 2023. It was the first comprehensive consumer privacy law in the United States and has influenced the state privacy laws that followed. While often compared to Europe's GDPR, CCPA takes a different legal approach.

GDPR requires a lawful basis (such as consent) before a company processes personal data. CCPA works mainly on an "Opt-Out" model: covered businesses can collect personal information as long as they give notice, but California residents have the right to see what personal information has been collected about them and to tell the business to stop selling or sharing it with third parties.

## The Architectural Challenge of "Do Not Sell or Share"

A defining feature of CCPA is the right to opt out, usually presented as a "Do Not Sell or Share My Personal Information" link. Under the CPRA, "sharing" refers to sharing data for cross-context behavioral advertising.

In the modern digital economy, a consumer's data rarely stays in a single database. When a user creates an account, data pipelines may sync their email address to a marketing platform, their browsing behavior to an advertising network, and their purchase history to other third parties.

If a user opts out, the business must stop selling or sharing that user's data as soon as feasible, and no later than 15 business days under the regulations. Browsers can also send the opt-out automatically through a global privacy control signal. This creates a real engineering challenge.

### Data Lineage and Orchestration
To comply with CCPA, an organization's [Data Lakehouse](/data-lakehouse/) needs accurate Data Lineage.

The data engineering team must know which pipelines send personal data to outside parties. When an opt-out event is recorded, it should flow into an orchestration platform (like Apache Airflow) that suppresses that user in each outbound feed and, where required, notifies the receiving platforms through their APIs so the user's data stops flowing to them.

## The Right to Know (Data Mapping)

CCPA grants consumers the "Right to Know." A consumer can request the categories and specific pieces of personal information a business has collected about them, along with sources, purposes, and the third parties that received it. Businesses generally must respond within 45 calendar days, with one possible 45-day extension.

If an enterprise's data is scattered across an unmanaged Data Swamp, producing this report is very difficult. The user's name might be in a PostgreSQL database, their clickstream logs in an S3 bucket, and their support tickets in a Zendesk instance.

To comply efficiently, data engineers build centralized Data Catalogs and Master Data Management (MDM) systems. The MDM system links a person's identities across systems to a single Golden Record. When a CCPA request arrives, an automated job can use the Golden Record to query the unified Data Lakehouse, gather the relevant records, and generate most of the report without hours of manual engineering work.

## Summary of Technical Value

CCPA is generally considered less restrictive than Europe's GDPR, but it still pushed American businesses to restructure their data operations. By requiring companies to honor opt-outs of data sales and sharing and to provide consumer data reports on request, CCPA made data lineage tracking, automated downstream suppression, and centralized Master Data Management practical necessities in the modern data ecosystem.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
