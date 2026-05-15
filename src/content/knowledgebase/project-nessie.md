---
title: "What is Project Nessie?"
meta_title: "What is Project Nessie? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Project Nessie. Learn about Git-like version control for data lakes, branch isolation, and multi-table transactions."
---

# What is Project Nessie?

Project Nessie is an open-source catalog architecture designed to bring Git-like version control directly to the data lakehouse. It allows organizations to manage their massive analytical datasets identically to how software engineering teams manage application source code. 

Before Nessie, data engineers struggling to update a massive data lake safely had to rely on complex, fragile staging environments. If an engineer wanted to test a massive ETL logic change, they had to physically copy terabytes of production data into an isolated bucket, run their test, verify the results, and then painstakingly overwrite the production tables. Nessie fundamentally resolves this by abstracting the catalog state into an immutable commit graph, enabling seamless branching, zero-copy staging, and instant atomic rollbacks across thousands of open table format datasets.

## The Git-Like Architecture

To understand how Nessie provides this immense capability, one must understand how it manages table metadata. Nessie does not store the physical data files, nor does it store the Iceberg manifest lists directly. Instead, Nessie manages a strict, centralized pointer graph that references those metadata states.

### Commits and the Reference Graph
Just like Git, every operation executed against the data lakehouse through Nessie is recorded as a discrete commit. When an engine like Apache Spark or Dremio writes new data to an Iceberg table, Nessie generates a new cryptographic hash representing the exact state of the catalog at that instant. This commit graph is entirely immutable.

### Branching and Isolation
Because Nessie understands the exact state of the catalog at any commit, it introduces the concept of Branching. An engineer can create a branch off the `main` production environment instantly. This operation is a zero-copy metadata clone; no physical data is moved or duplicated. 

The engineer can then use Apache Spark to run a massive data transformation explicitly against that branch. The changes are completely isolated. Any business analyst querying the `main` branch will continue to see the pristine, original data entirely uninterrupted. The analyst is not blocked by locks, and they do not see partial, dirty data from the ongoing pipeline run.

### Multi-Table Transactions and Merging
In a traditional data lake, atomic transactions are strictly limited to a single table. If an ETL pipeline needs to update the `Customers` table, the `Orders` table, and the `Inventory` table simultaneously, there is a severe risk of a partial failure leaving the tables completely out of sync.

Nessie eliminates this limitation through atomic branch merging. An engineer creates an ETL branch, applies updates to all three tables over the course of hours, and then executes a single `MERGE` command into the `main` branch. Nessie evaluates the commit graph and exposes the updates to all three tables simultaneously in a single, perfectly atomic transaction. If a conflict occurs during the merge, Nessie rejects the operation completely, protecting the production state.

## The Write-Audit-Publish Pattern (WAP)

The ability to branch and merge enables organizations to implement the gold standard of data engineering: the Write-Audit-Publish (WAP) pattern.

Historically, organizations wrote new data directly into production tables. If the data was corrupted, the dashboard broke, and the team scrambled to run massive deletion scripts to remove the bad records.

Using Nessie, the architecture fundamentally changes:
1. **Write:** An automated orchestrator (like Apache Airflow) creates a new branch (e.g., `etl_nightly_batch`) and executes the Spark pipeline to ingest the data into that branch.
2. **Audit:** A data quality tool (like dbt or Soda) connects specifically to the `etl_nightly_batch` branch and runs thousands of strict analytical assertions (checking for nulls, anomalous values, and uniqueness).
3. **Publish:** Only if every single quality test passes does the orchestrator merge the branch into `main`. If a test fails, the branch is discarded, and production remains completely pristine.

## Implementation in the Dremio Open Catalog

Project Nessie serves as the foundational open-source architecture underpinning advanced managed catalogs, heavily utilized within the Dremio ecosystem. The Dremio Open Catalog (and formerly Dremio Arctic) integrates Nessie natively, allowing users to execute Git-like SQL commands directly within their query engine interface.

An analyst can use standard SQL to switch contexts effortlessly:
```sql
-- Querying the live production data
SELECT * FROM sales_data AT BRANCH main;

-- Querying the isolated experimental branch
SELECT * FROM sales_data AT BRANCH q3_revenue_experiment;
```
This deep integration ensures that non-technical users can interact with complex version-control paradigms entirely through standard SQL semantics.

## Summary of Technical Value

Project Nessie revolutionized data lakehouse governance by establishing a centralized, Git-like version control system for analytical data. By enabling zero-copy branching, atomic multi-table transactions, and the strict implementation of the Write-Audit-Publish pattern, Nessie empowers organizations to manage petabyte-scale data lakes with the exact same rigor, safety, and operational agility previously reserved exclusively for software engineering.
