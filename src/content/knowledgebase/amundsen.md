---
title: "What is Amundsen?"
meta_title: "What is Amundsen? | Expert Data Architecture Guide"
description: "A comprehensive guide to Amundsen. Learn how Lyft's open-source data discovery platform pioneered the modern architectural concept of the Data Catalog."
---

# What is Amundsen?

Amundsen is a highly influential, open-source data discovery and metadata engine originally engineered by Lyft in 2019 to solve the massive, crippling internal chaos of navigating a hyper-growth data lake. At its core, Amundsen serves as a massive, centralized search engine for data. When an organization scales to thousands of tables and petabytes of data, data analysts spend 30% of their time simply trying to find the correct table or figure out who owns the data. Amundsen was explicitly designed to eradicate this inefficiency by providing a highly intuitive, Google-like search interface sitting directly on top of the complex data infrastructure.

While commercial Enterprise Data Catalogs (like Alation and Collibra) dominate massive Fortune 500 companies with heavy compliance requirements, Amundsen became the absolute de facto standard for the open-source engineering community. It pioneered the highly modular, microservice-based architecture for metadata, allowing data engineers to spin up a powerful, highly customized data catalog completely free of restrictive vendor licensing.

## The Microservice Architecture

Amundsen achieves its massive scalability by utilizing a highly decoupled, modern microservice architecture consisting of three primary, distinct components.

### 1. The Frontend Service (The Search Interface)
This is the physical web application utilized by the human data analysts. Built to mimic a standard web search engine, an analyst simply types "User Revenue," and the Frontend instantly returns a highly ranked list of tables. Crucially, the interface exposes critical contextual metadata: when the table was last updated, who the lead data engineer (the Owner) is, and exactly what columns exist within the table, allowing the analyst to verify the table's value without ever executing a SQL query.

### 2. The Search Service (Elasticsearch)
To guarantee sub-second search performance across millions of metadata tags, Amundsen physically offloads the raw search execution to a highly optimized search engine, typically Elasticsearch. The Search Service maintains a massive, inverted index of all table names, column descriptions, and user-generated tags, ensuring that even the most complex, fuzzy search queries return instantaneous, highly relevant results.

### 3. The Metadata Service (Neo4j / Apache Atlas)
The absolute architectural brain of Amundsen. The Metadata Service physically stores the complex web of relationships between tables, dashboards, and human users. By default, Amundsen originally utilized Neo4j (a highly advanced Graph Database) to explicitly map these relationships as Nodes and Edges. This Graph Architecture is critical; it allows the system to instantly traverse complex Data Lineage, mathematically showing an analyst exactly which downstream Tableau dashboard will physically break if they alter a specific column in the raw Data Lakehouse table.

## Automated Extraction (The Databuilder)

A data catalog is completely useless if it is empty. Amundsen populates its Graph Database using a massive, automated ingestion framework called the Databuilder. The Databuilder executes daily batch jobs, physically connecting to the Hive Metastore, Snowflake, Apache Airflow, and Tableau, extracting the latest metadata and pushing it into the Neo4j graph, ensuring the search engine is constantly synchronized with the absolute physical reality of the data architecture.

## Summary of Technical Value

Amundsen is a monumental achievement in open-source data engineering. By decoupling metadata management into a highly scalable microservice architecture and utilizing powerful Graph Databases and Elasticsearch for instant discoverability, Amundsen established the blueprint for the modern Data Catalog. It dramatically accelerates data democratization by empowering analysts to instantly discover, trust, and trace massive enterprise datasets without requiring manual IT intervention.

## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
