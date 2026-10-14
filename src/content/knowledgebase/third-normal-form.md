---
title: "Third normal form (3NF) explained, and where it still belongs in a lakehouse"
meta_title: "Third Normal Form (3NF): Examples and Lakehouse Use"
description: "Third normal form (3NF) is a schema design rule: every non-key column depends only on the key. See 1NF to 3NF examples and where 3NF fits in a data lakehouse."
---

Third normal form (3NF) is a level of relational database normalization defined by Edgar F. Codd, who introduced the relational model. A table is in 3NF when it is in second normal form and no non-key column depends on another non-key column. The usual summary: every non-key attribute must describe "the key, the whole key, and nothing but the key."

3NF is the standard starting point for operational ([OLTP](/knowledgebase/oltp/)) databases behind applications such as order systems, ledgers, and reservation systems. Its goal is to store each fact once, so that inserts, updates, and deletes cannot leave the data contradicting itself.

## From 1NF to 3NF

### 1. First normal form (1NF): atomic values
Each column holds a single value per row. Storing `555-0100, 555-0200` in one `phone_numbers` column breaks 1NF, because you cannot reliably query or update one number. The fix is a separate row per phone number, usually in a child table.

### 2. Second normal form (2NF): no partial dependencies
This applies to tables with a composite key. In an enrollment table keyed on (`student_id`, `class_id`), a `grade` column depends on both parts of the key and belongs there. A `student_name` column depends only on `student_id`, so it moves to a `students` table.

### 3. Third normal form (3NF): no transitive dependencies
In an `employees` table keyed on `employee_id`, storing both `department_id` and `department_name` breaks 3NF: `department_name` depends on `department_id`, not on the employee. The name moves to a `departments` table.

## The anomalies 3NF prevents

1. **Insertion anomaly:** in a combined employee and department table, you cannot record a new department until it has an employee.
2. **Deletion anomaly:** removing the last employee in Accounting also removes the only record that Accounting exists.
3. **Update anomaly:** renaming "Human Resources" to "People Ops" means updating every employee row in that department. Miss some rows and the data disagrees with itself. In 3NF the name lives in one row of `departments`, so the rename is a single-row update.

## 3NF in a lakehouse: where it still belongs and where gold tables denormalize

A [data lakehouse](/knowledgebase/data-lakehouse/) is built for analytics, so most of the tables people query are deliberately not in 3NF. The useful question is which layer each model belongs to.

| Layer | Typical shape | Why |
|---|---|---|
| Source OLTP database | 3NF | Many small concurrent writes; integrity matters most |
| [Bronze](/knowledgebase/bronze-layer/) Iceberg tables | Mirrors the source, often still 3NF | Raw copies via [change data capture](/knowledgebase/change-data-capture/) keep source keys and structure |
| [Silver](/knowledgebase/silver-layer/) tables | Cleaned, conformed entities, close to 3NF | One trusted version of customers, products, orders, with keys that join cleanly |
| [Gold](/knowledgebase/gold-layer/) tables | [Star schema](/knowledgebase/star-schema/) or wide denormalized tables | Fewer joins for BI tools, dashboards, and AI agents |

Keeping silver close to 3NF gives you one place to fix a customer's region or a product's category, and gold tables rebuild from it. Denormalizing in gold is reasonable because [Apache Iceberg](/knowledgebase/apache-iceberg/) tables are columnar, append friendly, and rebuilt by pipelines rather than edited row by row by an application, so update anomalies are handled by recomputing rather than by schema design. Query engines such as Dremio, [Trino](/knowledgebase/trino/), and [Spark](/knowledgebase/apache-spark/) can join normalized silver tables at query time, and a [semantic layer](/knowledgebase/semantic-layer/) can present those joins as one business view, which sometimes removes the need for a physical wide table at all. For the modeling patterns used in gold, see [dimensional modeling](/knowledgebase/dimensional-modeling/).

## Summary

3NF removes duplicated facts so that writes cannot create contradictions. It remains the right design for operational databases and a good guide for silver-layer entities. Analytical gold tables usually trade it away for simpler, faster reads, and that trade is safe as long as they are rebuilt from a normalized source.

## Learn More
To learn more about the [Data Lakehouse](/knowledgebase/data-lakehouse/), read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
