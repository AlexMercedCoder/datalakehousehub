---
title: "What is a Taxonomy?"
meta_title: "What is a Taxonomy? | Expert Data Lakehouse Architecture Guide"
description: "A data taxonomy is a hierarchical classification scheme for organizing data assets. Learn how data stewards use it to tag catalog tables and drive access rules."
---

# What is a Taxonomy?

A Taxonomy is a hierarchical classification system that organizes data, content, or metadata into parent-child categories. While an Ontology is a web of relationships that maps how different concepts interact (e.g., "A Customer buys a Product"), a Taxonomy is a top-down tree designed to classify what a thing *is* (e.g., "A Laptop is a type of Computer, which is a type of Electronics").

In Data Lakehouses and enterprise data catalogs, a shared Taxonomy makes data much easier for people to find. If a company loads millions of PDF reports, JSON logs, and Parquet files into an Amazon S3 bucket without classifying them, the data is hard to search. The lake becomes a swamp because employees have no consistent way to drill down and filter the data.

## The Architecture of the Tree

A Taxonomy is built on "Is-A" (Parent-Child) relationships. Each node in the tree is a more specific sub-category of the node directly above it.

Consider an e-commerce company structuring its product data. 
The Taxonomy defines the hierarchy:
1. `Root: All Products`
2. `Level 1: Electronics`
3. `Level 2: Computing`
4. `Level 3: Laptops`
5. `Level 4: Gaming Laptops`

Many taxonomies aim for Mutually Exclusive and Collectively Exhaustive (MECE) categories. A specific product (e.g., a gaming laptop) belongs under `Gaming Laptops`, not `Kitchen Appliances`. Some taxonomies allow an item to appear under more than one parent (a polyhierarchy), but each category still has a clear place in the tree.

## Taxonomies in Data Governance

Taxonomies are one of the main tools Data Stewards use to organize an enterprise data catalog (like Alation or Collibra).

When a new [Apache Iceberg](/knowledgebase/apache-iceberg/) table is created in the [Data Lakehouse](/knowledgebase/data-lakehouse/), the Data Steward does not just type free-form keywords into the description. They tag the table using terms from the shared taxonomy. 

### Security and Access Control
Because the Taxonomy is hierarchical, platforms that support tag-based policies can use it to simplify access control. 
The security architect writes a single rule: "The Marketing team cannot access any data tagged under the `Human Resources -> Payroll` branch." 
When tables and columns are tagged against the Taxonomy, the policy applies to everything under that branch. A new table tagged as `Payroll` is blocked for the marketing team as soon as the tag is applied, without a new rule.

## Summary of Technical Value

A Taxonomy is a core organizing framework for enterprise data. By setting a standard, top-down hierarchy to classify assets, it reduces inconsistent categorization. It gives people a clear structure for discovering data and gives tag-based security and governance policies a consistent set of categories to act on across the Open Data Lakehouse.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
