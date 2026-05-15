---
title: "What are Slowly Changing Dimensions (SCD)?"
meta_title: "What are Slowly Changing Dimensions? | Expert Data Lakehouse Guide"
description: "A comprehensive guide to Slowly Changing Dimensions (SCD). Learn how data warehouses track historical changes using Type 1, Type 2, and Type 3 SCD patterns."
---

# What are Slowly Changing Dimensions (SCD)?

Slowly Changing Dimensions (SCD) are a foundational concept in dimensional data modeling used to manage how a Data Warehouse or Data Lakehouse handles updates to historical records over time.

In operational databases, if a customer gets married and changes their last name, or if an employee gets promoted from "Analyst" to "Manager", the application simply issues a SQL `UPDATE` statement, overwriting the old value. The operational database only cares about the absolute present state.

However, a Data Warehouse is fundamentally designed for historical analysis. If you simply overwrite the employee's title to "Manager", a business analyst running a report for last year’s payroll will incorrectly assume the employee was a Manager back then, severely skewing the historical financial metrics. Slowly Changing Dimensions provide the strict architectural methodologies required to track these changes accurately without corrupting historical truth.

## The Primary SCD Types

Data architects manage historical changes using different specific patterns, depending entirely on the business requirements for that specific attribute.

### SCD Type 1: Overwrite
Type 1 is the simplest approach: it completely ignores history. If a customer corrects a typo in their shipping address, the data warehouse issues a standard `UPDATE` command, completely destroying the old record and replacing it with the new one. 

**Use Case:** Type 1 is used exclusively for data where historical tracking provides absolutely zero business value. If an application fixes a misspelled username, tracking that the username used to be spelled wrong is a waste of analytical storage.

### SCD Type 2: Add New Row (Historical Preservation)
Type 2 is the absolute gold standard for historical tracking in enterprise data warehousing. When a dimension changes, the old record is NOT overwritten. Instead, the database explicitly closes out the old record and inserts a completely new row for the updated state.

To achieve this, the table architecture must include specialized metadata columns:
* **Surrogate Key:** A unique, auto-incrementing integer (e.g., `1045`) that serves as the actual primary key, completely decoupled from the operational ID.
* **Effective Start Date:** The exact timestamp the specific record became active.
* **Effective End Date:** The exact timestamp the record ceased being active (often set to `9999-12-31` for the currently active row).
* **Is_Current Flag:** A simple boolean (`TRUE`/`FALSE`) to allow analysts to filter quickly for the active state.

If employee John Doe (Operational ID `E-100`) is promoted to Manager on May 1st, 2026, the database updates his original row (setting `End Date` to May 1st and `Is_Current` to `FALSE`). It instantly inserts a brand new row for `E-100` with the title "Manager", setting the `Start Date` to May 1st and `Is_Current` to `TRUE`. 

**Use Case:** This allows an analyst to run a massive sales report and correctly attribute the sales John made in April to an "Analyst", and the sales he made in June to a "Manager".

### SCD Type 3: Add New Column (Partial History)
Type 3 tracks history, but only the absolute most recent change. Instead of adding an entirely new row, the table architecture is modified to include an `old_value` and a `current_value` column explicitly.

If a customer changes their state of residence from "New York" to "California", the pipeline updates the row: it moves "New York" into the `previous_state` column, and writes "California" into the `current_state` column. 

**Use Case:** Type 3 is used when the business explicitly only cares about comparing the current state to the immediately preceding state, without needing the full, exhaustive history of every single move the customer ever made. It is highly space-efficient but structurally limited.

## SCD Implementation in the Lakehouse

Historically, implementing SCD Type 2 in a raw Apache Hadoop data lake was virtually impossible because raw HDFS files did not support `UPDATE` statements to close out the old records. Engineers had to execute massive, complex directory rewrites to track history.

The modern Open Data Lakehouse entirely solved this. Open table formats like Apache Iceberg and Apache Hudi provide strict ACID transactions and native `MERGE INTO` SQL commands directly on cloud object storage. Data engineers now utilize tools like dbt to automatically execute massive, complex SCD Type 2 merge logic natively against Iceberg tables, preserving perfect historical lineage without moving data into a proprietary warehouse.

## Summary of Technical Value

Slowly Changing Dimensions are the architectural mechanism that guarantees the analytical integrity of a data warehouse. By explicitly defining exactly how historical modifications are tracked—whether discarding them via Type 1, preserving an exhaustive timeline via Type 2, or tracking immediate transitions via Type 3—SCDs ensure that business intelligence dashboards always reflect the precise historical reality of the organization, regardless of how often the operational data changes.
