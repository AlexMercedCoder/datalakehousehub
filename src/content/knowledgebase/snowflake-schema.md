---
title: "What is a Snowflake Schema?"
meta_title: "What is a Snowflake Schema? | Expert Data Lakehouse Architecture Guide"
description: "A snowflake schema is a dimensional model whose dimension tables are normalized into sub-tables. Compare it with a star schema and when the extra joins pay."
---

# What is a Snowflake Schema?

A Snowflake Schema is a variation of the [Star Schema](/knowledgebase/star-schema/) used in dimensional data modeling. Like the Star Schema, it places a quantitative Fact table at the center, surrounded by descriptive Dimension tables. However, where a Star Schema keeps each dimension in a single denormalized table, the Snowflake Schema normalizes the dimensions into multiple smaller related tables.

Visually, when plotted on an architectural diagram, the central Fact table surrounded by branching sub-dimension tables loosely resembles a snowflake, hence the name.

## Denormalization vs. Normalization

The main difference between the two models is how they handle descriptive hierarchies (like Geography or Product Categories).

### The Star Schema Approach (Denormalized)
In a pure Star Schema, data engineers build a single `Store_Dimension` table. This single table contains the `Store_Name`, the `City`, the `State`, and the `Country`. This repeats the word "Germany" once for every store located in Germany. The duplication uses more storage, but queries are simpler and usually faster because the engine needs only one `JOIN` to connect `Sales_Fact` to the geography.

### The Snowflake Schema Approach (Normalized)
The Snowflake Schema avoids this duplication. 
Instead of a single table, the engineer creates a chain of tables. The `Store_Dimension` contains the `Store_Name` and a `city_id`. The `city_id` links out to a separate `City_Dimension` table. The `City_Dimension` contains the city name and a `state_id`, linking out to a `State_Dimension` table, and so on. The word "Germany" is stored once, in the `Country_Dimension` table.

## Performance Trade-Offs

While the Snowflake Schema reduces redundancy, it adds work for analytical (OLAP) queries.

Because the descriptive context is split across tables, answering a simple question like "What were the total sales in Germany?" requires a chain of joins. It must `JOIN` the Fact table to the Store table, `JOIN` the Store to the City, `JOIN` the City to the State, and `JOIN` the State to the Country. 

Each extra `JOIN` adds work to the query. In cloud data warehouses and the [Data Lakehouse](/knowledgebase/data-lakehouse/), object storage (like Amazon S3) is inexpensive and columnar formats compress repeated values well, so saving storage is rarely worth extra joins. Compute time usually costs more than the storage saved.

## When to Use the Snowflake Schema

Despite its read-performance trade-offs, the Snowflake Schema is still useful in some scenarios:

1. **Frequent Dimension Updates:** If an organization often updates hierarchical dimension data, a Snowflake schema is easier to update. Renaming a country in a Snowflake schema changes one row. In a Star Schema it means updating every store row that repeats that country.
2. **Storage Constraints:** In on-premises data warehouses where storage is limited and expensive, snowflaking reduces the space dimensions use.
3. **Shared Hierarchies:** When several dimensions share a hierarchy (for example, a geography table used by both stores and customers), normalizing it into its own table keeps one copy to maintain.

## Summary of Technical Value

The Snowflake Schema balances the analytical layout of dimensional modeling with the storage efficiency of normalization. With inexpensive cloud storage, the denormalized Star Schema is the more common choice for query performance, but the Snowflake Schema remains a useful pattern for complex, frequently changing dimensional hierarchies.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
