---
title: "Row-Level Security on Iceberg Lakehouse Tables: Where It Is Enforced"
meta_title: "Row-Level Security on Iceberg Lakehouse Tables | Glossary"
description: "Row-level security filters which table rows each user can see. Learn where RLS is enforced on Iceberg tables and how vended credentials can bypass it."
---

Row-Level Security (RLS) is a fine-grained access control mechanism that limits which rows of a table a user can see. Column-level security and masking hide or obscure specific columns (like Social Security Numbers); row-level security hides specific records, so each user queries only the subset of data they are authorized for.

Large organizations rarely build a separate physical table for every division. A global company keeps one `global_sales_fact` table with transactions from the United States, Germany, Japan, and Brazil.

When the regional sales director for Germany queries that table, they should see only German sales. Historically, data teams handled this by creating many filtered views (e.g., `CREATE VIEW german_sales AS SELECT * FROM global_sales WHERE region = 'Germany'`), one per audience. Keeping hundreds of those views in sync with the base table and with the org chart is a heavy maintenance burden. RLS replaces them with a single policy evaluated at query time.

## Dynamic Filtering Architecture

Row-Level Security is enforced by the query engine (such as Dremio, Snowflake, or Trino with an access control plugin) when a query is planned, and it is invisible to the end user.

A security administrator defines a row access policy on the target table. The policy is usually a SQL function that evaluates the identity or roles of the user running the query and returns whether a row is visible.

When the Germany director's Tableau dashboard issues `SELECT SUM(revenue) FROM global_sales_fact`, the engine looks up the director's identity and group membership (for example from the identity provider), sees the `region_germany` role, and adds the equivalent of `WHERE region = 'Germany'` to the plan.

The director receives the German revenue number. They cannot see the global total and cannot remove the filter. Because the engine applies the filter at runtime, the organization maintains one physical table and one dashboard for every region.

## Multi-Tenant SaaS Architectures

RLS is a common way to isolate customers in a multi-tenant SaaS application.

Instead of a separate database per customer, many SaaS applications store every customer's data in shared tables with a `tenant_id` column. When Customer A logs in, the application passes Customer A's `tenant_id` to the database session, and the RLS policy forces every query in that session to filter by `tenant_id = 'A'`. PostgreSQL's built-in row security policies are a common example. This means a bug in application code that forgets a `WHERE` clause does not leak Customer B's data to Customer A. Teams with strict isolation requirements may still choose separate schemas or databases per tenant.

## Where RLS Is Enforced in an Iceberg Lakehouse

The [Apache Iceberg](/knowledgebase/apache-iceberg/) table format does not define row-level security. Iceberg tables are Parquet files plus metadata in object storage, and RLS is enforced by whichever layer evaluates the query:

| Layer | How row filtering works |
|---|---|
| Dremio | Row access policies defined as SQL user-defined functions and attached to tables or views |
| Trino | Access control plugins such as Open Policy Agent or Apache Ranger can return row filters |
| Databricks Unity Catalog | Row filters and column masks attached to tables |
| Snowflake | Row access policies, which can also be applied to Iceberg tables |
| Iceberg REST catalogs (Polaris, Glue) | Table and namespace level grants; row filtering is left to the engine |
| Direct file access | None. Anyone with storage credentials can read every row |

The last row is the important caveat. RLS only holds if every path to the data goes through an engine that enforces it. If a REST catalog vends storage credentials to a client, or an analyst has direct S3 access, the client can read the Parquet files and bypass the policy. A sound lakehouse design keeps sensitive tables readable only through trusted engines, or splits restricted data into separate tables or namespaces with their own grants.

For more detail, read [Securing Apache Iceberg Tables with Fine-Grained Row and Column Level Access Control](/blog/iceberg-row-column-access-control/) and [Governance-as-Code for the Lakehouse](/blog/governance-as-code-lakehouse-rest-catalog/). Related glossary entries: [column-level security](/knowledgebase/column-level-security/), [data masking](/knowledgebase/data-masking/), and [role-based access control](/knowledgebase/role-based-access-control/).

## Security and Query Performance

Because RLS adds a filter to every query, its cost depends on how well the table is laid out for that filter. If the policy filters on `region` or `tenant_id`, partitioning or sorting the Iceberg table on that column lets the engine skip files that cannot match.

When the layout matches the policy, the injected filter benefits from [predicate pushdown](/knowledgebase/predicate-pushdown/) and partition pruning: the engine reads `WHERE region = 'Germany'`, skips the files for Japan and the United States using partition values and column statistics, and the query often runs faster than an unfiltered one.

## Summary of Technical Value

Row-Level Security lets an organization keep one consolidated table and still give each user or tenant only the rows they are allowed to see. It replaces large collections of hand-maintained filtered views with a policy evaluated at query time. On a lakehouse, its guarantees depend on routing all access through engines that enforce the policy.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
