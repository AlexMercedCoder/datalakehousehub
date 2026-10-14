---
canonical: "https://opendatalakehouse.com/kb/role-based-access-control/"
title: "What is Role-Based Access Control (RBAC)?"
meta_title: "What is RBAC? | Expert Data Lakehouse Architecture Guide"
description: "Role-based access control (RBAC) grants permissions to roles, not individual users. See how a central catalog like Apache Polaris enforces RBAC across engines."
---

# What is Role-Based Access Control (RBAC)?

Role-Based Access Control (RBAC) is a security model that manages user permissions by granting them to roles rather than to individuals. In a modern [Data Lakehouse](/data-lakehouse/), RBAC is the main framework that determines which catalogs, tables, and views a user is permitted to query; finer controls such as [row-level security](/knowledgebase/row-level-security/) and column masking usually build on those roles.

Before RBAC became common, many databases relied on Discretionary Access Control (DAC) or ad-hoc, per-user permissions. If a new data analyst joined the company, the database administrator would manually execute a dozen distinct `GRANT SELECT ON table_x TO user_john` commands. When John later transferred to a different department or left the company, the administrators rarely remembered to explicitly revoke all twelve permissions. Over time, this ad-hoc approach led to "permission creep," where employees kept access to sensitive financial or healthcare data long after they needed it.

## The Architecture of Abstraction

RBAC reduces permission creep by adding a layer of abstraction between people and permissions.

In an RBAC model, security administrators assign data permissions to Roles rather than directly to individual people. A Role is an organizational entity (such as `Data_Scientist`, `Financial_Analyst_Level_1`, or `Marketing_Intern`). 

The architecture operates in two distinct steps:
1. **Role Definition:** The administrator defines what the Role can do. For example, the administrator grants the `Marketing_Intern` role `SELECT` access to the `Gold_Marketing_Campaigns` table only, so it has no access to the `Silver_Customer_PII` table.
2. **User Assignment:** The administrator then assigns individual humans to the Roles. When Jane is hired as an intern, she is added to the `Marketing_Intern` role and inherits the permissions required to do her job.

When Jane's internship ends, the administrator removes her from the role, which revokes the access that role provided. This greatly reduces permission creep and makes security audits simpler, because reviewers can check a small number of roles instead of thousands of individual grants.

## Hierarchical RBAC and Inheritance

To manage complexity, many data platforms support role hierarchies, where roles can be granted to other roles (Snowflake is a common example). 

Roles do not have to be flat; they can inherit permissions from other roles. An organization might create a foundational `Global_Employee` role that grants basic read access to the public corporate directory table. They can then create a `Sales_Representative` role that inherits the `Global_Employee` role, while adding access to regional sales tables. 

This inheritance reduces administrative overhead. If the company decides to grant access to a new public holiday calendar table, they assign it to the foundational `Global_Employee` role, and every role that inherits from it (sales representatives, executives, interns) gets the access automatically.

## RBAC in the Open Data Lakehouse

In traditional cloud data warehouses, RBAC is enforced by the warehouse's own engine, because that engine is the only way to reach the data.

The Open Data Lakehouse decouples storage from compute. If a company stores Apache Parquet files in Amazon S3, they might query those exact same files using Dremio, Apache Spark, and Trino. If they configure the RBAC permissions solely inside Dremio, a user with storage credentials could start an Apache Spark cluster, bypass Dremio, and read the raw Parquet files directly from S3, defeating the security model.

To secure the decoupled lakehouse, many organizations centralize RBAC in a shared catalog (like Apache Polaris or Unity Catalog). When Dremio, Spark, or Trino reads an Iceberg table, the engine authenticates with the catalog, which checks the caller's roles before returning table metadata and, where supported, short-lived storage credentials. If the role lacks access, the request is denied. This protection holds only if users cannot reach the underlying storage with their own long-lived credentials, so storage permissions must be locked down as well.

## Summary of Technical Value

Role-Based Access Control is a foundation for operating a compliant, secure enterprise data stack. By moving permissions away from individual users and assigning them to hierarchical organizational roles, RBAC simplifies security administration, limits permission creep, and, when enforced in a shared catalog, gives a multi-engine data lakehouse one auditable set of access rules.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
