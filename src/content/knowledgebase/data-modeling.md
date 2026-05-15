---
title: "What is Data Modeling?"
meta_title: "What is Data Modeling? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Data Modeling. Learn how conceptual, logical, and physical data models structure enterprise information for maximum analytical value."
---

# What is Data Modeling?

Data Modeling is the highly rigorous architectural discipline of visualizing, defining, and structuring the complex mathematical relationships between different entities of data within an enterprise. It is the absolute foundational blueprint of data engineering. Just as a civil engineer would never attempt to build a skyscraper by blindly pouring concrete without a detailed architectural schematic, a data engineer must never attempt to build a [Data Lakehouse](/data-lakehouse) without a strict, highly validated Data Model.

Raw data extracted from operational systems (like a massive dump of JSON logs from a web server) is structurally chaotic and completely useless to a business executive. Data Modeling is the process of translating that chaos into organized, business-readable entities. It explicitly defines exactly what a "Customer" is, exactly how a "Customer" relates to a "Purchase", and exactly what data types (e.g., String, Integer, Timestamp) are permitted to represent those interactions. 

## The Three Phases of Data Modeling

Data Modeling is a progressive discipline, moving from high-level human business concepts down to highly complex, bare-metal database architecture.

### 1. The Conceptual Model (The Business View)
The Conceptual Model is built entirely for business stakeholders. It contains absolutely zero technical database jargon. It is a simple, high-level visual diagram establishing the core entities of the business and their relationships. 
* Example: `[Customer] -> places -> [Order] -> contains -> [Product]`. 
It establishes the absolute highest level of organizational consensus, ensuring the marketing executives and the data engineers agree fundamentally on how the business operates.

### 2. The Logical Model (The Engineering Blueprint)
The Logical Model takes the Conceptual Model and injects strict structural rules. It defines the specific attributes (columns) that belong to each entity, without explicitly dictating the underlying database technology.
* Example: The `Customer` entity explicitly contains `first_name`, `last_name`, and `email_address`. The Logical Model defines that an `Order` must contain a `customer_id` to establish a relational link. It resolves complex many-to-many relationships (like a single order containing multiple different products) by introducing intermediate bridge tables.

### 3. The Physical Model (The Bare-Metal Implementation)
The Physical Model is the exact, final blueprint deployed to the specific database (e.g., PostgreSQL or Snowflake). It translates the Logical Model into highly specific SQL Data Definition Language (DDL). It defines the exact physical constraints: `first_name` is an `VARCHAR(50)`, `revenue` is a `DECIMAL(10,2)`, and it establishes the explicit Primary Keys, Foreign Keys, and exact indexing strategies required to make the database fast.

## Modeling Paradigms: OLTP vs OLAP

The exact structure of the Physical Data Model changes violently depending on the goal of the database.

* **For Operational Systems (OLTP):** Data engineers utilize Third Normal Form (3NF). They heavily fragment the data across dozens of tables to completely eliminate data duplication, ensuring that high-speed transactional writes execute flawlessly without data corruption.
* **For Analytical Systems (OLAP):** Normalization destroys analytical read performance. Data engineers utilize Dimensional Modeling (Star Schemas) or Data Vault architectures. They heavily denormalize and duplicate the data to prioritize massively fast aggregations and simple, intuitive SQL queries for business analysts.

## Summary of Technical Value

Data Modeling is the translation layer between business operations and technical infrastructure. By rigorously defining the structural entities, relationships, and constraints of enterprise data, it guarantees that massive databases remain highly organized, logically consistent, and optimally performant. It is the exact architectural discipline that prevents a massively scalable Data Lake from devolving into an unmanageable Data Swamp.

## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
