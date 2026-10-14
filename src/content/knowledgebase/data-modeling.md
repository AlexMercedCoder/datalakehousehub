---
title: "What is Data Modeling?"
meta_title: "What is Data Modeling? | Expert Data Lakehouse Architecture Guide"
description: "Data modeling defines the entities, attributes, and relationships in a dataset. Learn the conceptual, logical, and physical phases and OLTP vs OLAP design."
---

# What is Data Modeling?

Data Modeling is the discipline of visualizing, defining, and structuring the relationships between different data entities within an enterprise. It is the foundational blueprint of data engineering. Just as a civil engineer would not build a skyscraper without a detailed schematic, a data engineer should not build a [Data Lakehouse](/knowledgebase/data-lakehouse/) without a clear, validated Data Model.

Raw data extracted from operational systems (like a large dump of JSON logs from a web server) is loosely structured and hard for a business executive to use. Data Modeling is the process of translating that raw data into organized, business-readable entities. It explicitly defines exactly what a "Customer" is, exactly how a "Customer" relates to a "Purchase", and exactly what data types (e.g., String, Integer, Timestamp) are permitted to represent those interactions. 

## The Three Phases of Data Modeling

Data Modeling moves in stages, from high-level business concepts down to concrete database design.

### 1. The Conceptual Model (The Business View)
The Conceptual Model is built for business stakeholders. It avoids technical database jargon. It is a simple, high-level visual diagram establishing the core entities of the business and their relationships. 
* Example: `[Customer] -> places -> [Order] -> contains -> [Product]`. 
It establishes the highest level of organizational consensus, so the marketing executives and the data engineers agree on how the business operates.

### 2. The Logical Model (The Engineering Blueprint)
The Logical Model takes the Conceptual Model and adds structural rules. It defines the specific attributes (columns) that belong to each entity, without explicitly dictating the underlying database technology.
* Example: The `Customer` entity explicitly contains `first_name`, `last_name`, and `email_address`. The Logical Model defines that an `Order` must contain a `customer_id` to establish a relational link. It resolves many-to-many relationships (like a single order containing multiple different products) by introducing intermediate bridge tables.

### 3. The Physical Model (The Bare-Metal Implementation)
The Physical Model is the final blueprint deployed to a specific database (e.g., PostgreSQL or Snowflake). It translates the Logical Model into SQL Data Definition Language (DDL). It defines the physical constraints: `first_name` is a `VARCHAR(50)`, `revenue` is a `DECIMAL(10,2)`, and it establishes the Primary Keys, Foreign Keys, and indexing or clustering strategies that make the database fast.

## Modeling Approaches: OLTP vs OLAP

The structure of the Physical Data Model changes significantly depending on the goal of the database.

* **For Operational Systems (OLTP):** Data engineers utilize Third Normal Form (3NF). They split the data across many tables to minimize data duplication, which helps high-volume transactional writes avoid update anomalies.
* **For Analytical Systems (OLAP):** Highly normalized schemas slow analytical reads because queries need many joins. Data engineers use Dimensional Modeling (Star Schemas) or Data Vault architectures. Dimensional models denormalize data on purpose to favor fast aggregations and simple SQL queries for business analysts.

## Summary of Technical Value

Data Modeling is the translation layer between business operations and technical infrastructure. By defining the structural entities, relationships, and constraints of enterprise data, it helps large databases stay organized, logically consistent, and performant. It is the discipline that keeps a scalable Data Lake from turning into an unmanageable Data Swamp.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
